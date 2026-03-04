import React, { useEffect, useRef } from 'react';

type MagneticWrapperProps = {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  strength?: number;
};

const MagneticWrapper: React.FC<MagneticWrapperProps> = ({
  children,
  className = '',
  radius = 140,
  strength = 8,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    const handleMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.hypot(dx, dy);

      if (distance > radius) {
        node.style.setProperty('--mx', '0px');
        node.style.setProperty('--my', '0px');
        node.style.setProperty('--ms', '1');
        return;
      }

      const force = ((radius - distance) / radius) * strength;
      const mx = distance > 0 ? (dx / distance) * force : 0;
      const my = distance > 0 ? (dy / distance) * force : 0;

      node.style.setProperty('--mx', `${mx.toFixed(2)}px`);
      node.style.setProperty('--my', `${my.toFixed(2)}px`);
      node.style.setProperty('--ms', '1.05');
    };

    const reset = () => {
      node.style.setProperty('--mx', '0px');
      node.style.setProperty('--my', '0px');
      node.style.setProperty('--ms', '1');
    };

    window.addEventListener('mousemove', handleMove);
    node.addEventListener('mouseleave', reset);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      node.removeEventListener('mouseleave', reset);
    };
  }, [radius, strength]);

  return (
    <div
      ref={wrapperRef}
      className={`transform-gpu [transform:translateX(var(--mx,0px))_translateY(var(--my,0px))_scale(var(--ms,1))] ${className}`}
      style={{ transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.4, 1)' }}
    >
      {children}
    </div>
  );
};

export default MagneticWrapper;
