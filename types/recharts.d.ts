// Minimal safe typings for Recharts (fixes TS errors without breaking build)

declare module 'recharts' {
  import * as React from 'react';

  export const ResponsiveContainer: React.FC<any>;
  export const Tooltip: React.FC<any>;
  export const Legend: React.FC<any>;

  export interface TooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string | number;
  }

  export interface LegendProps {
    payload?: any[];
    verticalAlign?: 'top' | 'bottom';
  }
}