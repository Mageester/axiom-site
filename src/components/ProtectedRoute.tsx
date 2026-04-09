import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiJson } from '../lib/api';

interface User {
    username: string;
    role: string;
    must_change_password: boolean;
}

let meRequestInFlight: Promise<User | null> | null = null;

async function fetchCurrentUser(): Promise<User | null> {
    if (!meRequestInFlight) {
        meRequestInFlight = apiJson<{ user: User }>('/api/auth/me', {
            timeoutMs: 10000,
            credentials: 'include'
        })
            .then(data => data.user || null)
            .catch(() => null)
            .finally(() => {
                meRequestInFlight = null;
            });
    }

    return meRequestInFlight;
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const lastCheckedRef = useRef<string>('');
    const routeKey = `${location.pathname}${location.search}`;
    const loginNext = useMemo(() => {
        const target = `${location.pathname}${location.search}`;
        return `/admin/login?next=${encodeURIComponent(target)}`;
    }, [location.pathname, location.search]);

    useEffect(() => {
        if (lastCheckedRef.current === routeKey) return;
        lastCheckedRef.current = routeKey;
        setLoading(true);

        fetchCurrentUser()
            .then(currentUser => {
                setUser(currentUser);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
  }, [routeKey]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--axiom-base)] px-6">
        <div
          role="status"
          aria-live="polite"
          className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center shadow-[0_16px_36px_rgba(0,0,0,0.26)]"
        >
          <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Secure area</p>
          <div className="mx-auto mt-4 h-10 w-40 animate-pulse rounded bg-white/8" />
          <p className="mt-4 text-sm text-slate-300">Checking access.</p>
        </div>
      </div>
    );
  }

    if (!user) {
        return <Navigate to={loginNext} replace />;
    }

    if (user.must_change_password && location.pathname !== '/account') {
        return <Navigate to="/account" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
