import React, { useState, useEffect } from 'react';

const EVENT_TEMPLATES = [
    "Inbound captured: \"Emergency service\" (Kitchener, ON)",
    "Qualified: Commercial / Priority A",
    "Routed to: Operations queue",
    "Slot proposed: Tomorrow 09:30",
    "Confirmation sent: SMS + Email",
    "Inbound captured: \"Routine maintenance\" (Waterloo, ON)",
    "Qualified: Residential / Standard",
    "Routed to: Standard queue",
    "Slot proposed: Thursday 14:00",
    "Confirmation sent: Email",
];

interface LogEntry {
    id: number;
    time: string;
    message: string;
}

export const LiveConsole: React.FC = () => {
    const [events, setEvents] = useState<LogEntry[]>([]);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        // Initial population
        const now = new Date();
        const initial = Array.from({ length: 6 }).map((_, i) => {
            const t = new Date(now.getTime() - (6 - i) * 1500);
            return {
                id: i,
                time: t.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                message: EVENT_TEMPLATES[i]
            };
        });
        setEvents(initial);
        setCounter(6);
    }, []);

    useEffect(() => {
        if (counter === 0) return; // Wait for initial population

        let timeoutId: ReturnType<typeof setTimeout>;

        const tick = () => {
            const now = new Date();
            const newMessage = EVENT_TEMPLATES[counter % EVENT_TEMPLATES.length];
            const newEvent = {
                id: counter,
                time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                message: newMessage
            };

            setEvents(prev => {
                const next = [...prev, newEvent];
                if (next.length > 7) next.shift(); // Keep 7 events to fill space nicely
                return next;
            });
            setCounter(c => c + 1);

            // Schedule next tick with variable timing (1.2s to 2.8s) for genuine live feel
            timeoutId = setTimeout(tick, 1200 + Math.random() * 1600);
        };

        timeoutId = setTimeout(tick, 1500);

        return () => clearTimeout(timeoutId);
    }, [counter]);

    return (
        <div className="w-full lg:w-[420px] xl:w-[460px] border border-subtle bg-[#15171A] rounded-sm overflow-hidden flex flex-col shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02),0_4px_20px_-8px_rgba(0,0,0,0.5)] text-left shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-subtle bg-white/[0.01]">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-secondary uppercase tracking-widest">System Console</span>
                </div>
                <div className="flex items-center gap-2 border border-[#34d399]/20 bg-[#34d399]/5 px-2 py-0.5 rounded-sm">
                    <span className="relative flex h-1.5 w-1.5 items-center justify-center">
                        <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-40"></span>
                        <span className="relative inline-flex rounded-full h-[3px] w-[3px] bg-[#34d399] opacity-90"></span>
                    </span>
                    <span className="text-[9px] font-mono text-[#34d399]/90 tracking-widest uppercase">Active</span>
                </div>
            </div>

            {/* Event Feed */}
            <div className="p-5 flex-1 h-[260px] overflow-hidden flex flex-col justify-end font-mono text-[11px] sm:text-[12px] leading-relaxed relative bg-[#0B0B0C]/30">
                {/* Gradient mask to gracefully fade events as they scroll up */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#131518]/90 to-transparent z-10 pointer-events-none"></div>

                <div className="flex flex-col gap-3 relative z-0">
                    {events.map((ev) => (
                        <div
                            key={ev.id}
                            className="flex items-start gap-4 animate-console-reveal"
                        >
                            <span className="text-accent/80 shrink-0">{ev.time}</span>
                            <span className="text-primary/80">{ev.message}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-3 divide-x divide-subtle border-t border-subtle bg-white/[0.02]">
                <div className="px-5 py-4 flex flex-col gap-1.5">
                    <span className="text-[9px] uppercase tracking-wider text-secondary font-mono">Capture</span>
                    <span className="text-[13px] tracking-tight font-semibold text-primary font-mono drop-shadow-sm">24/7</span>
                </div>
                <div className="px-5 py-4 flex flex-col gap-1.5">
                    <span className="text-[9px] uppercase tracking-wider text-secondary font-mono">Routing</span>
                    <span className="text-[13px] tracking-tight font-semibold text-primary font-mono drop-shadow-sm">Structured</span>
                </div>
                <div className="px-5 py-4 flex flex-col gap-1.5">
                    <span className="text-[9px] uppercase tracking-wider text-secondary font-mono">Speed</span>
                    <span className="text-[13px] tracking-tight font-semibold text-primary font-mono drop-shadow-sm">&lt;30s</span>
                </div>
            </div>
        </div>
    );
};
