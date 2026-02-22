import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const LoginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required")
});

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = LoginSchema.safeParse({ username, password });
        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result.data)
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(data.error || 'Authentication rejected. Status: ' + res.status);
                setLoading(false);
                return;
            }

            if (data.user?.must_change_password) {
                navigate('/account', { replace: true });
            } else {
                navigate('/campaigns', { replace: true });
            }
        } catch (err) {
            setError('System error establishing connection.');
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
                        <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest">Username</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-accent/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] outline-none font-mono"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest">Passphrase</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-accent/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] outline-none"
                        />
                    </div>

                    <button disabled={loading} type="submit" className="w-full py-4 mt-2 bg-white text-black hover:bg-[#e2e2e2] active:scale-[0.99] text-[12px] font-bold uppercase tracking-[0.05em] transition-all duration-300 rounded-[2px] disabled:opacity-50">
                        {loading ? 'Authenticating...' : 'Establish Session'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
