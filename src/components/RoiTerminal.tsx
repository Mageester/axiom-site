import React, { useMemo, useState } from 'react';

const RoiTerminal: React.FC = () => {
  const [traffic, setTraffic] = useState(1500);
  const [ticketSize, setTicketSize] = useState(7500);
  const [lift, setLift] = useState(15);

  const metrics = useMemo(() => {
    const annualizedGain = traffic * 0.006 * ticketSize * (lift / 100) * 12;
    const monthlyGain = annualizedGain / 12;
    const paybackWeeks = 7500 / (annualizedGain / 52);

    return {
      annualizedGain,
      monthlyGain,
      paybackWeeks,
    };
  }, [traffic, ticketSize, lift]);

  const formatMoney = (value: number) => `$${Math.round(value).toLocaleString()}`;

  return (
    <section className="py-32 px-6 md:px-10 xl:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#13171B] border border-[#31363B] rounded-3xl p-1 shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="bg-[#090A0B] rounded-[22px] border border-[#31363B]/50 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{
              backgroundImage:
                'linear-gradient(to right, rgba(167,179,188,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(167,179,188,0.14) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }} />

            <div className="relative z-10 space-y-8">
              <div className="space-y-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#A7B3BC]">Profit Instrument</p>
                <h3 className="text-3xl md:text-4xl tracking-[-0.02em] font-black text-[#F5F7FA]">Projected Capital Capture</h3>
                <p className="text-[15px] leading-[1.65] text-[#A7B3BC] max-w-lg">
                  Dial in your operating inputs. The terminal computes the revenue currently leaking from your pipeline.
                </p>
              </div>

              <div className="space-y-7">
                <label className="block">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#A7B3BC]">Current Monthly Traffic</span>
                    <span className="font-mono text-[#F5F7FA] text-sm">{traffic.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={10000}
                    step={100}
                    value={traffic}
                    onChange={(e) => setTraffic(Number(e.target.value))}
                    className="w-full accent-[#E4572E] h-2 cursor-pointer"
                  />
                </label>

                <label className="block">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#A7B3BC]">Average Ticket Size</span>
                    <span className="font-mono text-[#F5F7FA] text-sm">{formatMoney(ticketSize)}</span>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={25000}
                    step={500}
                    value={ticketSize}
                    onChange={(e) => setTicketSize(Number(e.target.value))}
                    className="w-full accent-[#E4572E] h-2 cursor-pointer"
                  />
                </label>

                <label className="block">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#A7B3BC]">Conversion Lift Potential</span>
                    <span className="font-mono text-[#F5F7FA] text-sm">{lift}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={35}
                    step={1}
                    value={lift}
                    onChange={(e) => setLift(Number(e.target.value))}
                    className="w-full accent-[#E4572E] h-2 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="relative z-10 flex flex-col justify-between bg-[#13171B]/65 border border-[#31363B] rounded-2xl p-7 md:p-9 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E4572E]/65 to-transparent" />

              <div className="space-y-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#A7B3BC]">Annualized Gain</p>
                <p className="font-mono text-6xl md:text-8xl text-[#E4572E] tracking-tighter leading-none drop-shadow-[0_0_25px_rgba(228,87,46,0.4)]">
                  {formatMoney(metrics.annualizedGain)}+
                </p>
                <p className="text-sm text-[#A7B3BC] leading-relaxed max-w-sm">
                  Quantified upside from tighter qualification and conversion geometry.
                </p>
              </div>

              <div className="space-y-3 mt-8 font-mono text-sm">
                <div className="flex items-center justify-between border-b border-[#31363B] pb-2">
                  <span className="text-[#A7B3BC] uppercase tracking-[0.14em] text-[11px]">Monthly Delta</span>
                  <span className="text-[#F5F7FA]">{formatMoney(metrics.monthlyGain)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#31363B] pb-2">
                  <span className="text-[#A7B3BC] uppercase tracking-[0.14em] text-[11px]">Payback Window</span>
                  <span className="text-[#F5F7FA]">{metrics.paybackWeeks.toFixed(1)} weeks</span>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[#A7B3BC] uppercase tracking-[0.14em] text-[11px]">Capital Status</span>
                  <span className="text-[#E4572E]">Leak Active</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary btn-lg mt-8 w-full justify-center whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_14px_34px_rgba(228,87,46,0.28)]"
              >
                Deploy Infrastructure
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoiTerminal;
