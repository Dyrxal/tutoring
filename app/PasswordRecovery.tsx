"use client";
import { useEffect, useRef, useState } from 'react';
import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { canRecover, recoveryIdentity, resetRedirectUrl, type RecoveryEntry } from './password-recovery';
type Props = {
    client: SupabaseClient;
    backendUrl: string;
    publicKey: string;
    mode: 'request' | 'reset';
    entry: RecoveryEntry;
    eventKey: string | null;
    actorKey: string | null;
    storageKey: string;
    initialEmail: string;
    onClose: (message?: string) => void;
    onRequestNew: () => void;
};
export default function PasswordRecovery({ client, backendUrl, publicKey, mode, entry, eventKey, actorKey, storageKey, initialEmail, onClose, onRequestNew }: Props) {
    const [email, setEmail] = useState(initialEmail), [password, setPassword] = useState(''), [confirm, setConfirm] = useState(''), [error, setError] = useState(''), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false), [status, setStatus] = useState<'checking' | 'ready' | 'invalid' | 'verify-error' | 'saved' | 'exit-error'>('checking'), [retry, setRetry] = useState(0);
    const alive = useRef(false), generation = useRef(0), lock = useRef(false), owner = useRef<string | null>(null), finishing = useRef(false), exitLock = useRef(false), passwordChanged = useRef(false), previousActor = useRef(actorKey);
    const clearProof = () => { try {
        sessionStorage.removeItem(storageKey);
    }
    catch { } };
    const proof = () => { try {
        return sessionStorage.getItem(storageKey);
    }
    catch {
        return null;
    } };
    useEffect(() => { alive.current = true; return () => { alive.current = false; generation.current++; }; }, []);
    async function verifiedSession() { const { data, error } = await client.auth.getSession(); if (error)
        throw error; if (!data.session)
        return null; const verified = await client.auth.getUser(data.session.access_token); if (verified.error)
        throw verified.error; return { session: data.session, user: verified.data.user }; }
    useEffect(() => {
        const ticket = ++generation.current, sameOwner = owner.current && owner.current === actorKey, changedActor = previousActor.current !== actorKey;
        previousActor.current = actorKey;
        if (finishing.current && actorKey === null)
            return;
        if (!sameOwner) {
            setPassword('');
            setConfirm('');
            passwordChanged.current = false;
            if (actorKey)
                finishing.current = false;
        }
        setError('');
        owner.current = null;
        if (mode === 'request') {
            if (changedActor && actorKey)
                onClose();
            return;
        }
        if (finishing.current)
            return;
        setStatus('checking');
        void verifiedSession().then(value => {
            if (!alive.current || generation.current !== ticket)
                return;
            if (!value || !canRecover(value.session, value.user, entry, eventKey, proof())) {
                clearProof();
                setStatus('invalid');
                return;
            }
            const key = recoveryIdentity(value.session)!;
            owner.current = key;
            try {
                sessionStorage.setItem(storageKey, JSON.stringify({ key, expiresAt: value.session.expires_at! * 1000 }));
                entry.token = undefined;
            }
            catch { }
            setStatus('ready');
        }).catch((e: {
            status?: number;
        }) => { if (alive.current && generation.current === ticket) {
            if (e.status === 401 || e.status === 403) {
                clearProof();
                setStatus('invalid');
            }
            else
                setStatus('verify-error');
        } });
        return () => { generation.current++; };
        // onClose and entry are stable for this recovery flow; account/session keys invalidate asynchronous work.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, mode, eventKey, actorKey, retry]);
    async function requestReset(e: React.FormEvent) {
        e.preventDefault();
        if (lock.current)
            return;
        lock.current = true;
        setBusy(true);
        setError('');
        setNotice('');
        const ticket = generation.current;
        try {
            const { error } = await client.auth.resetPasswordForEmail(email.trim(), { redirectTo: resetRedirectUrl(window.location.origin) });
            if (!alive.current || ticket !== generation.current)
                return;
            if (error && error.code !== 'user_not_found') {
                setError(error.status === 429 ? 'Too many requests. Please wait before trying again.' : "We couldn't send the reset link right now. Please try again.");
                return;
            }
            setNotice("If an account exists for that email, you'll receive a password reset link.");
        }
        catch {
            if (alive.current && ticket === generation.current)
                setError("We couldn't send the reset link right now. Please try again.");
        }
        finally {
            lock.current = false;
            if (alive.current)
                setBusy(false);
        }
    }
    async function exit(message?: string) {
        if (exitLock.current)
            return;
        exitLock.current = true;
        const expectedOwner = owner.current, ticket = generation.current, didUpdate = passwordChanged.current;
        try {
            const current = await client.auth.getSession();
            if (!alive.current || ticket !== generation.current || owner.current !== expectedOwner)
                return;
            if (current.data.session && expectedOwner && recoveryIdentity(current.data.session) !== expectedOwner) {
                clearProof();
                onClose();
                return;
            }
            finishing.current = true;
            setBusy(true);
            setPassword('');
            setConfirm('');
            const { error } = await client.auth.signOut({ scope: 'local' });
            if (!alive.current)
                return;
            if (error) {
                const latest = await client.auth.getSession();
                if (!alive.current || latest.data.session && recoveryIdentity(latest.data.session) !== expectedOwner)
                    return;
                if (!latest.data.session) {
                    clearProof();
                    onClose(didUpdate ? message : undefined);
                    return;
                }
                finishing.current = false;
                setBusy(false);
                setStatus(didUpdate ? 'saved' : 'exit-error');
                setError(didUpdate ? 'Your password was updated. Please try signing out again to finish.' : "We couldn't sign out. Please try again.");
                return;
            }
            const remaining = await client.auth.getSession();
            if (!alive.current || remaining.data.session && recoveryIdentity(remaining.data.session) !== expectedOwner)
                return;
            clearProof();
            onClose(remaining.data.session ? undefined : didUpdate ? message : undefined);
        }
        catch {
            if (alive.current && ticket === generation.current && owner.current === expectedOwner) {
                finishing.current = false;
                setBusy(false);
                setStatus(passwordChanged.current ? 'saved' : 'exit-error');
                setError(passwordChanged.current ? 'Your password was updated. Please try signing out again to finish.' : "We couldn't sign out. Please try again.");
            }
        }
        finally {
            exitLock.current = false;
        }
    }
    async function updateBoundSession(session: Session, value: string, ticket: number, key: string | null) {
        // A private, nonpersistent client cannot pick up another tab's account between verification and PUT.
        const scoped = createClient(backendUrl, publicKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'notation-recovery-' + crypto.randomUUID() } });
        try {
            const setup = await scoped.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });
            if (setup.error)
                throw setup.error;
            if (!alive.current || ticket !== generation.current)
                return null;
            const current = await client.auth.getSession();
            if (!alive.current || ticket !== generation.current)
                return null;
            if (recoveryIdentity(current.data.session) !== key || setup.data.user?.id !== session.user.id) {
                clearProof();
                setPassword('');
                setConfirm('');
                setStatus('invalid');
                return null;
            }
            return await scoped.auth.updateUser({ password: value });
        }
        finally {
            await scoped.auth.dispose();
        }
    }
    async function updatePassword(e: React.FormEvent) {
        e.preventDefault();
        if (lock.current || status !== 'ready' || owner.current !== actorKey)
            return;
        setError('');
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Use at least 6 characters.');
            return;
        }
        lock.current = true;
        setBusy(true);
        const ticket = generation.current, key = owner.current;
        try {
            const value = await verifiedSession();
            if (!alive.current || ticket !== generation.current)
                return;
            if (!value || recoveryIdentity(value.session) !== key) {
                clearProof();
                setPassword('');
                setConfirm('');
                setStatus('invalid');
                return;
            }
            const updated = await updateBoundSession(value.session, password, ticket, key);
            if (!updated || !alive.current || ticket !== generation.current)
                return;
            if (updated.error) {
                setError(updated.error.message);
                return;
            }
            passwordChanged.current = true;
            setPassword('');
            setConfirm('');
            setStatus('saved');
            await exit('Password updated. Sign in with your new password.');
        }
        catch {
            if (alive.current && ticket === generation.current)
                setError("We couldn't update your password. Please try again.");
        }
        finally {
            lock.current = false;
            if (alive.current && !finishing.current)
                setBusy(false);
        }
    }
    if (mode === 'request')
        return <form className="auth-card" onSubmit={requestReset}><span className="eyebrow">ACCOUNT ACCESS</span><h1>Reset your password</h1><p>Enter your email and we’ll send a link to choose a new password.</p><label>Email<input type="email" autoComplete="email" required value={email} disabled={busy} onChange={e => setEmail(e.target.value)}/></label><Button className="w-full" disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</Button>{notice && <p role="status">{notice}</p>}{error && <p role="alert" className="notice">{error}</p>}<button type="button" className="text-button" disabled={busy} onClick={() => onClose()}>Back to sign in</button></form>;
    return <form className="auth-card" onSubmit={updatePassword}><span className="eyebrow">ACCOUNT ACCESS</span><h1>Choose a new password</h1>{status === 'checking' ? <p role="status">Checking your reset link…</p> : status === 'ready' && owner.current === actorKey ? <><p>Choose a password for your account.</p><label>New password<input type="password" autoComplete="new-password" required minLength={6} value={password} disabled={busy} onChange={e => setPassword(e.target.value)}/></label><label>Confirm new password<input type="password" autoComplete="new-password" required minLength={6} value={confirm} disabled={busy} onChange={e => setConfirm(e.target.value)}/></label><Button className="w-full" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</Button></> : status === 'verify-error' ? <><p role="alert">We couldn’t verify your reset link. Check your connection and try again.</p><Button type="button" onClick={() => setRetry(v => v + 1)}>Try verifying again</Button></> : (status === 'saved' || status === 'exit-error') ? <Button type="button" disabled={busy} onClick={() => void exit(passwordChanged.current ? 'Password updated. Sign in with your new password.' : undefined)}>Finish signing out</Button> : <><p role="alert">This password reset link is invalid or has expired. Request a new link.</p><Button type="button" onClick={() => { clearProof(); onRequestNew(); }}>Request a new link</Button></>}{error && <p role="alert" className="notice">{error}</p>}{status !== 'saved' && status !== 'exit-error' && <button type="button" className="text-button" disabled={busy || status === 'checking'} onClick={() => { clearProof(); if (owner.current)
        void exit();
    else
        onClose(); }}>Back to sign in</button>}</form>;
}
