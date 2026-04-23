import * as React from 'react';
import { cn } from '../../lib/utils';

type ClusterSpace = '1' | '2' | '3' | '4' | '6' | '8';

export interface ClusterProps extends React.HTMLAttributes<HTMLDivElement> {
  space?: ClusterSpace;
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'between' | 'center' | 'end';
}

const gapClasses = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
};

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
};

const justifyClasses = {
  start: 'justify-start',
  between: 'justify-between',
  center: 'justify-center',
  end: 'justify-end',
};

export function Cluster({
  className,
  space = '3',
  align = 'center',
  justify = 'start',
  ...props
}: ClusterProps) {
  return (
    <div
      className={cn('flex flex-wrap', gapClasses[space], alignClasses[align], justifyClasses[justify], className)}
      data-primitive="cluster"
      {...props}
    />
  );
}
