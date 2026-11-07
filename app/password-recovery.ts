import type { Session, User } from '@supabase/supabase-js';
export type RecoveryEntry = {
    requested: boolean;
    linkError: boolean;
    token?: string;
};
export function readRecoveryEntry(location: Pick<Location, 'search' | 'hash'>): RecoveryEntry {
    const query = new URLSearchParams(location.search), hash = new URLSearchParams(location.hash.slice(1));
    const requested = query.get('auth') === 'recovery' || hash.get('type') === 'recovery';
    return { requested, linkError: requested && hash.has('error'), ...(hash.get('type') === 'recovery' && hash.get('access_token') ? { token: hash.get('access_token')! } : {}) };
}
export function resetRedirectUrl(origin: string) { const url = new URL(origin); if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)))
    throw new Error('Use a secure reset origin.'); return url.origin + '/?auth=recovery'; }
// This identity only binds recovery intent; getUser must verify the session first.
export function recoveryIdentity(session: Session | null): string | null {
    if (!session)
        return null;
    try {
        const part = session.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const claims = JSON.parse(atob(part));
        return typeof claims.session_id === 'string' && claims.sub === session.user.id ? session.user.id + ':' + claims.session_id : null;
    }
    catch {
        return null;
    }
}
export function canRecover(session: Session | null, user: Pick<User, 'id'> | null, entry: RecoveryEntry, eventKey: string | null, proofText: string | null, now = Date.now()) {
    const key = recoveryIdentity(session);
    if (!session || !user || user.id !== session.user.id || !key || entry.linkError || (session.expires_at || 0) * 1000 <= now)
        return false;
    if (entry.requested && entry.token === session.access_token || eventKey === key)
        return true;
    try {
        const proof = JSON.parse(proofText || 'null');
        return proof?.key === key && typeof proof.expiresAt === 'number' && proof.expiresAt > now;
    }
    catch {
        return false;
    }
}

// Callback URLs are untrusted input; show fixed guidance, never provider descriptions.
export function readAuthCallbackError(location: Pick<Location, 'search' | 'hash'>): string {
    const query = new URLSearchParams(location.search), hash = new URLSearchParams(location.hash.slice(1));
    if (readRecoveryEntry(location).requested || !(hash.has('error') || query.has('error'))) return '';
    const code = hash.get('error_code') || query.get('error_code');
    return code === 'otp_expired'
        ? 'This email link is invalid, expired, or already used. If you have already confirmed your account, sign in below.'
        : 'We could not complete email sign-in. Sign in below or use a new email link.';
}
