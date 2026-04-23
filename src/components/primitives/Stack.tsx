import * as React from 'react';
import { cn } from '../../lib/utils';

type StackSpace = '1' | '2' | '3' | '4' | '6' | '8' | '12' | '16';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  space?: StackSpace;
}

const gapClasses = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
  12: 'gap-12',
  16: 'gap-16',
};

export function Stack({ className, space = '4', ...props }: StackProps) {
  return <div className={cn('flex flex-col', gapClasses[space], className)} data-primitive="stack" {...props} />;
}
