import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface User {
    username: string;
    role: string;
    must_change_password: boolean;
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => {
                if (!res.ok) throw new Error('Unauthorized');
                return res.json();
            })
            .then(data => {
                setUser(data.user);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    }, [location.pathname]);

    if (loading) {
        return <div className="pt-32 pb-24 px-6 text-center text-secondary font-mono text-[12px]">Establishing secure connection...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.must_change_password && location.pathname !== '/account') {
        return <Navigate to="/account" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
