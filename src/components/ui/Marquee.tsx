import * as React from 'react';
import { cn } from '../../lib/utils';

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = ({
  speed = 24,
  reverse = false,
  pauseOnHover = false,
  className,
  children,
  ...props
}) => {
  const items = React.Children.toArray(children);

  return (
    <div
      data-marquee
      className={cn('relative', pauseOnHover && 'group', className)}
      style={{ '--marquee-duration': `${speed}s` } as React.CSSProperties}
      {...props}
    >
      <div
        data-marquee-track={reverse ? 'reverse' : 'forward'}
        className={cn('items-center gap-10', pauseOnHover && 'group-hover:[animation-play-state:paused]')}
      >
        <div className="flex items-center gap-10 pr-10">{items}</div>
        <div aria-hidden="true" className="flex items-center gap-10 pr-10">
          {items}
        </div>
      </div>
    </div>
  );
};
