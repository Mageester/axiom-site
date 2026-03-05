import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

type MagneticWrapperProps = {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  strength?: number;
};

const MagneticWrapper: React.FC<MagneticWrapperProps> = ({
  children,
  className = '',
  radius = 20,
  strength = 6,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const handleMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.hypot(dx, dy);

      if (distance > radius) {
        gsap.to(node, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.38,
          ease: 'elastic.out(1,0.5)',
          overwrite: true,
        });
        return;
      }

      const force = ((radius - distance) / radius) * strength;
      const mx = distance > 0 ? (dx / distance) * force : 0;
      const my = distance > 0 ? (dy / distance) * force : 0;

      gsap.to(node, {
        x: Number(mx.toFixed(2)),
        y: Number(my.toFixed(2)),
        scale: 1.05,
        duration: 0.26,
        ease: 'power3.out',
        overwrite: true,
      });
    };

    const reset = () => {
      gsap.to(node, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.38,
        ease: 'elastic.out(1,0.5)',
        overwrite: true,
      });
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
      className={`transform-gpu ${className}`}
    >
      {children}
    </div>
  );
};

export default MagneticWrapper;
