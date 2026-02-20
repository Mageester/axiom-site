import React, { useState } from 'react';

interface BrandLockupProps {
    className?: string;
    logoSize?: string;
    textSize?: string;
    showText?: boolean;
    opacity?: string;
}

export const BrandLockup: React.FC<BrandLockupProps> = ({
    className = "",
    logoSize = "h-5 w-auto",
    textSize = "text-[13px]",
    showText = true,
    opacity = "opacity-100"
}) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className={`flex items-center gap-3 ${opacity} ${className}`}>
            {!imgError ? (
                <img
                    src="/logo.png"
                    alt="Axiom Infrastructure Logo"
                    className={logoSize}
                    onError={() => setImgError(true)}
                />
            ) : (
                <svg className={logoSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                    <path d="M12 2L2 22h20L12 2z" />
                    <path d="M12 2v20" strokeOpacity="0.3" />
                    <path d="M6 14h12" strokeOpacity="0.3" />
                </svg>
            )}
            {showText && (
                <span className={`font-grotesk font-semibold tracking-widest uppercase ${textSize}`}>
                    Axiom Infrastructure
                </span>
            )}
        </div>
    );
};
