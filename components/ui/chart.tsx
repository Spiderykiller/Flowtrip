'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '@/lib/utils';

/* ----------------------- THEMES ----------------------- */

const THEMES = {
  light: '',
  dark: '.dark',
} as const;

/* ----------------------- TYPES ----------------------- */

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme?: Record<keyof typeof THEMES, string> }
  )
>;

type ChartContextType = {
  config: ChartConfig;
};

type TooltipItem = {
  dataKey?: string;
  name?: string;
  value?: number | string;
  color?: string;
  payload?: Record<string, unknown>;
};

/* ----------------------- CONTEXT ----------------------- */

const ChartContext = React.createContext<ChartContextType | null>(null);

function useChart(): ChartContextType {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error('useChart must be used within ChartContainer');
  return ctx;
}

/* ----------------------- CONTAINER ----------------------- */

export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ReactNode;
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          'flex aspect-video justify-center text-xs [&_.recharts-layer]:outline-none',
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />

        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/* ----------------------- STYLE ENGINE ----------------------- */

function ChartStyle({
  id,
  config,
}: {
  id: string;
  config: ChartConfig;
}) {
  const entries = Object.entries(config).filter(
    ([, cfg]) => cfg.color || cfg.theme
  );

  if (!entries.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => {
            const vars = entries
              .map(([key, cfg]) => {
                const color =
                  cfg.theme?.[theme as keyof typeof THEMES] || cfg.color;

                return color ? `--color-${key}: ${color};` : '';
              })
              .filter(Boolean)
              .join('\n');

            return `${prefix} [data-chart=${id}] { ${vars} }`;
          })
          .join('\n'),
      }}
    />
  );
}

/* ----------------------- TOOLTIP ----------------------- */

export const ChartTooltip = RechartsPrimitive.Tooltip;

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  {
    active?: boolean;
    payload?: TooltipItem[];
    label?: string | number;
    labelFormatter?: (value: unknown, payload: TooltipItem[]) => React.ReactNode;
    formatter?: (
      value: unknown,
      name: string | undefined,
      item: TooltipItem,
      index: number
    ) => React.ReactNode;
    className?: string;
    hideLabel?: boolean;
    indicator?: 'dot' | 'line' | 'dashed';
  }
>(
  (
    {
      active,
      payload = [],
      label,
      labelFormatter,
      formatter,
      className,
      hideLabel,
    },
    ref
  ) => {
    const { config } = useChart();

    if (!active || payload.length === 0) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md border bg-background p-2 text-xs shadow',
          className
        )}
      >
        {!hideLabel && (
          <div className="mb-1 font-medium">
            {labelFormatter ? labelFormatter(label, payload) : String(label)}
          </div>
        )}

        <div className="space-y-1">
          {payload.map((item, index) => {
            const key = item.dataKey || item.name || 'value';
            const cfg = config[key];

            return (
              <div
                key={`${key}-${index}`}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-muted-foreground">
                  {cfg?.label || item.name}
                </span>

                <span className="font-mono">
                  {formatter
                    ? formatter(item.value, item.name, item, index)
                    : String(item.value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

ChartTooltipContent.displayName = 'ChartTooltipContent';

/* ----------------------- LEGEND ----------------------- */

export const ChartLegend = RechartsPrimitive.Legend;

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  {
    payload?: Array<{ value?: string; color?: string; dataKey?: string }>;
    className?: string;
    hideIcon?: boolean;
  }
>(({ payload = [], className, hideIcon }, ref) => {
  const { config } = useChart();

  if (!payload.length) return null;

  return (
    <div ref={ref} className={cn('flex flex-wrap gap-4', className)}>
      {payload.map((item, i) => {
        const key = item.dataKey || item.value || '';
        const cfg = config[key];

        return (
          <div key={i} className="flex items-center gap-2">
            {!hideIcon && (
              <div
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span>{cfg?.label || item.value}</span>
          </div>
        );
      })}
    </div>
  );
});

ChartLegendContent.displayName = 'ChartLegendContent';

/* ----------------------- EXPORT ----------------------- */

export {
  useChart,
};