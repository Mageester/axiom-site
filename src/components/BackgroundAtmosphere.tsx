import React from 'react';

export const BackgroundAtmosphere: React.FC = () => {
    return (
        <>
            {/* Global Viewport-Fixed Wrapper (Strictly NO mask-image here) */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
                <div className="absolute inset-0 hw-accelerate opacity-[0.04] bg-atmosphere-grid animate-grid-drift" style={{ backgroundSize: '80px 80px' }}></div>
                <div className="absolute inset-0 hw-accelerate opacity-[0.02] bg-atmosphere-scan animate-scan-sweep"></div>
                <div className="absolute inset-0 hw-accelerate bg-atmosphere-noise opacity-[0.03]"></div>
            </div>

            {/* Hero-Only Absolute Decorator (Scrolls with document, allows safe mask-image rendering) */}
            <div className="absolute top-0 left-0 right-0 h-[100vh] min-h-[900px] pointer-events-none z-0 overflow-hidden mask-bottom-fade" aria-hidden="true">
                <div className="absolute inset-0 hw-accelerate opacity-[0.05] bg-atmosphere-grid animate-grid-drift" style={{ backgroundSize: '80px 80px' }}></div>
                <div className="absolute inset-0 hw-accelerate opacity-[0.03] bg-atmosphere-scan animate-scan-sweep"></div>
                <div className="absolute inset-0 hw-accelerate hero-vignette opacity-70"></div>
            </div>
        </>
    );
};
