import React from 'react';

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
  const applyOffset = (element: HTMLDivElement, dx: number, dy: number) => {
    element.style.setProperty('--mx', `${dx.toFixed(2)}px`);
    element.style.setProperty('--my', `${dy.toFixed(2)}px`);
    element.style.setProperty('--ms', '1.05');
    element.classList.add('is-magnetic-active');
  };

  const resetOffset = (element: HTMLDivElement) => {
    element.style.setProperty('--mx', '0px');
    element.style.setProperty('--my', '0px');
    element.style.setProperty('--ms', '1');
    element.classList.remove('is-magnetic-active');
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (event.pointerType !== 'mouse') return;

    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    const distance = Math.hypot(dx, dy);

    if (distance > radius) {
      resetOffset(node);
      return;
    }

    const force = ((radius - distance) / radius) * strength;
    const mx = distance > 0 ? (dx / distance) * force : 0;
    const my = distance > 0 ? (dy / distance) * force : 0;
    applyOffset(node, mx, my);
  };

  const handlePointerLeave: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (event.pointerType !== 'mouse') return;
    resetOffset(event.currentTarget);
  };

  return (
    <div
      className={`magnetic-btn ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  );
};

export default MagneticWrapper;
