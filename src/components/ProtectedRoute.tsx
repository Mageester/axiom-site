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
        return `/login?next=${encodeURIComponent(target)}`;
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
        return <div className="pt-32 pb-24 px-6 text-center text-secondary font-mono text-[12px]">Checking session...</div>;
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
