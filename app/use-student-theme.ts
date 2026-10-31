'use client';

import { useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { normalizeStudentTheme, type Theme } from './student-theme';

interface Snapshot { theme: Theme; loading: boolean; saving: boolean; error: string }
interface Scope {
 client: SupabaseClient | null;
 studentId: string | null;
 enabled: boolean;
 active: boolean;
 generation: number;
 request: number;
 confirmed: Theme;
 snapshot: Snapshot;
 notify: (() => void) | null;
}
// Serialize an actor’s writes even when the authenticated client instance is replaced.
// Settled tails are removed so signing into many accounts does not retain account IDs.
const writes = new Map<string, Promise<void>>();
const loadError = 'Could not load your appearance. Your last confirmed theme is shown. Try again.';
const saveError = 'Could not save your appearance. Your last confirmed theme has been restored. Try again.';

function publish(scope: Scope, values: Partial<Snapshot>) {
 scope.snapshot = { ...scope.snapshot, ...values };
 scope.notify?.();
}
function invalidate(scope: Scope) {
 scope.active = false;
 scope.generation++;
 scope.request++;
 scope.confirmed = 'light';
 publish(scope, { theme: 'light', loading: false, saving: false, error: '' });
}
function legacyTheme(studentId: string): Theme | null {
 try {
  const value = window.localStorage.getItem(`notation-theme:${studentId}`);
  return value === 'light-version' ? 'light' : normalizeStudentTheme(value);
 } catch { return null; }
}
function cacheConfirmed(studentId: string, theme: Theme) {
 try { window.localStorage.setItem(`notation-theme:${studentId}`, theme); } catch { /* Server is authoritative. */ }
}
async function isOwner(scope: Scope): Promise<boolean> {
 if (!scope.client || !scope.studentId) return false;
 const { data, error } = await scope.client.auth.getSession();
 if (error) throw new Error('Session lookup unavailable');
 return data.session?.user.id === scope.studentId;
}

async function changeThemeForScope(scope: Scope, value: Theme): Promise<void> {
  if (!scope.active || !scope.enabled || !normalizeStudentTheme(value)) return;
  if (!scope.client) {
   scope.confirmed = value;
   publish(scope, { theme: value, loading: false, saving: false, error: '' });
   return;
  }
  if (!scope.studentId) return;
  const db = scope.client, actor = scope.studentId;
  const generation = scope.generation, request = ++scope.request;
  const valid = () => scope.active && scope.generation === generation;
  const latest = () => valid() && scope.request === request;
  publish(scope, { theme: value, loading: false, saving: true, error: '' });
  const operation = (writes.get(actor) ?? Promise.resolve()).then(async () => {
   if (!valid()) return;
   try {
    if (!await isOwner(scope)) { if (valid()) invalidate(scope); return; }
    if (!valid()) return;
    const { data, error } = await db.rpc('save_student_theme', { p_theme: value });
    if (!valid()) return;
    const saved = normalizeStudentTheme(data?.theme);
    if (error || saved !== value) throw new Error('Unconfirmed save');
    scope.confirmed = saved;
    cacheConfirmed(actor, saved);
    if (latest()) publish(scope, { theme: saved, saving: false, error: '' });
   } catch {
    if (latest()) publish(scope, { theme: scope.confirmed, saving: false, error: saveError });
   }
  });
  // Every operation handles its own failure; this tail stays usable for retry.
  writes.set(actor, operation);
  void operation.then(() => {
   if (writes.get(actor) === operation) writes.delete(actor);
  });
  await operation;
 }

async function reloadScope(scope: Scope): Promise<void> {
  if (!scope.active || !scope.enabled || !scope.client || !scope.studentId) return;
  const db = scope.client, actor = scope.studentId;
  const generation = scope.generation, request = ++scope.request;
  const valid = () => scope.active && scope.generation === generation && scope.request === request;
  publish(scope, { loading: true, error: '' });
  try {
   await (writes.get(actor) ?? Promise.resolve());
   if (!valid()) return;
   if (!await isOwner(scope)) { if (valid()) invalidate(scope); return; }
   if (!valid()) return;
   const { data, error } = await db.rpc('get_student_theme');
   if (!valid()) return;
   if (error || !data || !Object.prototype.hasOwnProperty.call(data, 'theme')) throw new Error('Unavailable preference');
   const theme = normalizeStudentTheme(data.theme);
   if (data.theme !== null && !theme) throw new Error('Invalid preference');
   scope.confirmed = theme ?? 'light';
   if (data.theme === null) {
    const legacy = legacyTheme(scope.studentId);
    if (legacy) { await changeThemeForScope(scope, legacy); return; }
   }
   publish(scope, { theme: scope.confirmed, loading: false, saving: false, error: '' });
  } catch {
   if (valid()) publish(scope, { theme: scope.confirmed, loading: false, saving: false, error: loadError });
  }
 }


function createScope(client: SupabaseClient | null, studentId: string | null, enabled: boolean): Scope {
 return {
  client, studentId, enabled, active: true, generation: 0, request: 0, confirmed: 'light', notify: null,
  snapshot: { theme: 'light', loading: Boolean(enabled && client && studentId), saving: false, error: '' },
 };
}
function replaceScope(previous: Scope, client: SupabaseClient | null, studentId: string | null, enabled: boolean): Scope {
 previous.notify = null;
 invalidate(previous);
 return createScope(client, studentId, enabled);
}

function mountScope(scope: Scope, notify: () => void) {
 scope.active = true;
 scope.notify = notify;
 const subscription = scope.client?.auth.onAuthStateChange((_event, session) => {
  if (session?.user.id !== scope.studentId) invalidate(scope);
  else if (!scope.active) {
   // React may batch A → B → A session changes into one render. Never reuse its old generation.
   scope.active = true;
   scope.generation++;
   publish(scope, { loading: Boolean(scope.enabled), error: '' });
   // Supabase auth callbacks must finish before making further client requests.
   void Promise.resolve().then(() => reloadScope(scope));
  }
 }).data.subscription;
 if (scope.enabled) void reloadScope(scope);
 return () => {
  scope.notify = null;
  invalidate(scope);
  subscription?.unsubscribe();
 };
}

/** Preview choices stay in memory. Real choices are confirmed only by the authenticated RPC. */
export function useStudentTheme(client: SupabaseClient | null, studentId: string | null, enabled: boolean) {
 const [storedScope, setScope] = useState<Scope>(() => createScope(client, studentId, enabled));
 const [, redraw] = useState(0);
 const scope = storedScope.client !== client || storedScope.studentId !== studentId || storedScope.enabled !== enabled
  ? replaceScope(storedScope, client, studentId, enabled) : storedScope;
 if (scope !== storedScope) setScope(scope);

 useEffect(() => mountScope(scope, () => redraw(n => n + 1)), [scope]);

 return { ...scope.snapshot, changeTheme: (value: Theme) => changeThemeForScope(scope, value), reload: () => reloadScope(scope) };
}
