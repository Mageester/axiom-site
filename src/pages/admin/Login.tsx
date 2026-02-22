import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ApiRequestError, apiJson, errorMessage } from '../../lib/api';

const LoginSchema = z.object({
    email: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required")
});

const DEFAULT_ADMIN_ROUTE = '/campaigns';

function getSafeNext(nextValue: string | null) {
    if (!nextValue) return DEFAULT_ADMIN_ROUTE;
    if (!nextValue.startsWith('/')) return DEFAULT_ADMIN_ROUTE;
    if (nextValue.startsWith('//')) return DEFAULT_ADMIN_ROUTE;
    if (nextValue.startsWith('/login')) return DEFAULT_ADMIN_ROUTE;
    if (nextValue === '/admin') return DEFAULT_ADMIN_ROUTE;
    if (nextValue.startsWith('/admin/')) return nextValue.slice('/admin'.length) || DEFAULT_ADMIN_ROUTE;
    return nextValue;
}

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const nextTarget = getSafeNext(new URLSearchParams(location.search).get('next'));

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = LoginSchema.safeParse({ email, password });
        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        setLoading(true);
        try {
            await apiJson<{ user?: { must_change_password?: boolean } }>('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    username: result.data.email,
                    password: result.data.password
                }),
                timeoutMs: 15000
            });

            const me = await apiJson<{ user?: { must_change_password?: boolean } }>('/api/auth/me', {
                credentials: 'include',
                timeoutMs: 10000
            });

            if (me.user?.must_change_password) {
                navigate('/account', { replace: true });
            } else {
                navigate(nextTarget || DEFAULT_ADMIN_ROUTE, { replace: true });
            }
        } catch (err) {
            if (err instanceof ApiRequestError) {
                if (err.status === 401) setError('Invalid credentials. Check your email/username and password.');
                else if (err.status === 429) setError('Too many login attempts. Wait 15 minutes and retry.');
                else if (err.status >= 500) setError('Login service error. Please retry in a moment.');
                else setError(err.message || 'Authentication request failed.');
            } else {
                setError(errorMessage(err, 'System error establishing connection.'));
            }
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-24 flex items-center justify-center relative min-h-[70vh]">
            <div className="max-w-[400px] w-full mx-auto relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-semibold mb-2 text-primary tracking-tight">System Access</h1>
                    <p className="text-[14px] text-secondary font-mono uppercase tracking-widest">Operator Authorization Required</p>
                </div>

                <form onSubmit={handleLogin} className="surface-panel p-8 flex flex-col gap-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-500/90 text-[12px] p-3 rounded-sm font-mono text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label htmlFor="login-email" className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest">Email</label>
                        <input
                            id="login-email"
                            type="text"
                            autoComplete="username"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="operator email (or username)"
                            className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-accent/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] outline-none font-mono"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="login-password" className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-accent/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] outline-none"
                        />
                    </div>

                    <button disabled={loading} type="submit" className="w-full py-4 mt-2 bg-white text-black hover:bg-[#e2e2e2] active:scale-[0.99] text-[12px] font-bold uppercase tracking-[0.05em] transition-all duration-300 rounded-[2px] disabled:opacity-50">
                        {loading ? 'Authenticating...' : 'Establish Session'}
                    </button>
                    {nextTarget !== DEFAULT_ADMIN_ROUTE ? (
                        <p className="text-[10px] font-mono text-secondary/70 text-center uppercase tracking-widest">
                            Redirecting to requested admin page after login
                        </p>
                    ) : null}
                </form>
            </div>
        </div>
    );
};

export default Login;
