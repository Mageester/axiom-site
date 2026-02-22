import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const ChangePassSchema = z.object({
    oldPassword: z.string().min(1, "Current passphrase is required"),
    newPassword: z.string().min(10, "New passphrase must be at least 10 characters long"),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New passphrases do not match",
    path: ["confirmPassword"]
});

const Account: React.FC = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Status
    const [mustChange, setMustChange] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                setUsername(data.user?.username || '');
                setMustChange(data.user?.must_change_password || false);
            })
            .catch(() => { });
    }, []);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const result = ChangePassSchema.safeParse({ oldPassword, newPassword, confirmPassword });
        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword
                })
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(data.error || 'Update rejected. Verify current passphrase.');
                setLoading(false);
                return;
            }

            setSuccess('Cryptographic protocol updated successfully. Session rotated.');
            setMustChange(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setLoading(false);

            // Optional auto-redirect if this was a mandatory change
            if (mustChange) {
                setTimeout(() => navigate('/campaigns', { replace: true }), 2000);
            }

        } catch (err) {
            setError('System error establishing connection.');
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        navigate('/login', { replace: true });
    };

    return (
        <div className="pt-32 pb-24 flex flex-col items-center justify-center relative min-h-[70vh]">
            <div className="max-w-[500px] w-full mx-auto relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-semibold mb-2 text-primary tracking-tight">Operator Authorization Settings</h1>
                    {mustChange ? (
                        <p className="text-[12px] text-red-400 font-mono uppercase tracking-widest mt-4 p-2 bg-red-500/10 border border-red-500/30">
                            Immediate Passphrase Rotation Required
                        </p>
                    ) : (
                        <p className="text-[14px] text-secondary font-mono uppercase tracking-widest">Active Identity: {username}</p>
                    )}
                </div>

                <form onSubmit={handleChangePassword} className="surface-panel p-8 flex flex-col gap-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-500/90 text-[12px] p-3 rounded-sm font-mono text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[12px] p-3 rounded-sm font-mono text-center">
                            {success}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest">Current Passphrase</label>
                        <input
                            type="password"
                            required
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
                            className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-accent/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] outline-none font-mono"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest">New Passphrase <span className="text-secondary/50 lowercase">(Min 10 chars)</span></label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-accent/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] outline-none font-mono"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest">Confirm New Passphrase</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-accent/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] outline-none font-mono"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                        <button disabled={loading} type="submit" className="flex-1 py-4 bg-white text-black hover:bg-[#e2e2e2] active:scale-[0.99] text-[12px] font-bold uppercase tracking-[0.05em] transition-all duration-300 rounded-[2px] disabled:opacity-50">
                            {loading ? 'Processing...' : 'Write Configuration'}
                        </button>
                    </div>
                </form>

                {!mustChange && (
                    <div className="mt-8 flex justify-center">
                        <button onClick={handleLogout} className="text-[10px] font-mono text-secondary hover:text-red-400 uppercase tracking-widest transition-colors py-2 px-4 border border-transparent hover:border-red-500/30 rounded-sm">
                            Terminate Session
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Account;
