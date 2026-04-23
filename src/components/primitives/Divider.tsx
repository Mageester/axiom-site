import * as React from 'react';
import { cn } from '../../lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  tone?: 'hairline' | 'rule';
}

export function Divider({ className, tone = 'hairline', ...props }: DividerProps) {
  return (
    <hr
      className={cn('w-full border-0', tone === 'rule' ? 'h-px bg-brass-muted' : 'h-px bg-hairline', className)}
      data-primitive="divider"
      {...props}
    />
  );
}
