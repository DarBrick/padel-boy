import { ReactNode } from 'react'
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  BarChart,
} from 'recharts'

// Chart-specific props (excluding data, which is passed separately)
interface ChartSpecificProps {
  margin?: { top?: number; right?: number; bottom?: number; left?: number }
  onClick?: (data: any) => void
  style?: React.CSSProperties
  barCategoryGap?: string | number
}

interface ChartContainerProps {
  // Chart configuration
  chartType: 'line' | 'bar'
  data: any[]
  height?: number
  
  // Title and container
  title?: string
  className?: string
  
  // Axis configuration
  xAxisDataKey?: string
  xAxisLabel?: string
  xAxisConfig?: Record<string, any>
  
  yAxisLabel?: string
  yAxisConfig?: Record<string, any>
  hideTicks?: boolean
  yAxisReversed?: boolean
  yAxisWidth?: number
  yAxisDomain?: [number, number]
  
  // Tooltip configuration
  tooltipActive?: boolean
  tooltipFormatter?: (value: any, name?: string) => [string, string]
  
  // Legend
  showLegend?: boolean
  
  // Chart-specific props
  chartProps?: ChartSpecificProps
  
  // Chart content (Line, Bar, etc. components)
  children: ReactNode
}

const TOOLTIP_CONTENT_STYLE = {
  backgroundColor: 'var(--color-background-elevated)',
  border: '1px solid var(--color-border)',
  borderRadius: '0.5rem',
  color: 'var(--color-foreground)',
}

const TOOLTIP_LABEL_STYLE = { color: 'var(--color-foreground-muted)' }

const AXIS_STROKE = 'var(--color-foreground-muted)'
const AXIS_TICK_FILL = { fill: 'var(--color-foreground-muted)' }
const GRID_STROKE = 'var(--color-border)'

export function ChartContainer({
  chartType,
  data,
  height = 220,
  title,
  className = '',
  xAxisDataKey = 'round',
  xAxisLabel,
  xAxisConfig = {},
  yAxisLabel,
  yAxisConfig = {},
  hideTicks = false,
  yAxisReversed = false,
  yAxisWidth = 0,
  yAxisDomain,
  tooltipActive,
  tooltipFormatter,
  showLegend = false,
  chartProps = {},
  children,
}: ChartContainerProps) {
  const ChartComponent = chartType === 'line' ? LineChart : BarChart

  const defaultChartProps = {
    data,
    margin: { top: 20, right: 5, bottom: 5, left: 5 },
    ...chartProps,
  }

  const xAxisProps = {
    dataKey: xAxisDataKey,
    stroke: AXIS_STROKE,
    tick: AXIS_TICK_FILL,
    label: xAxisLabel
      ? {
          value: xAxisLabel,
          position: 'insideBottom' as const,
          offset: -5,
          fill: AXIS_STROKE,
        }
      : undefined,
    ...xAxisConfig,
  }

  const yAxisProps = {
    stroke: AXIS_STROKE,
    tick: hideTicks ? false : AXIS_TICK_FILL,
    axisLine: hideTicks ? false : undefined,
    width: yAxisWidth,
    reversed: yAxisReversed,
    domain: yAxisDomain,
    type: yAxisDomain ? ('number' as const) : undefined,
    scale: yAxisDomain ? ('linear' as const) : undefined,
    allowDataOverflow: yAxisDomain ? false : undefined,
    label: yAxisLabel
      ? {
          value: yAxisLabel,
          angle: -90,
          position: 'insideLeft' as const,
          fill: AXIS_STROKE,
        }
      : undefined,
    ...yAxisConfig,
  }

  const tooltipProps = {
    active: tooltipActive,
    cursor: tooltipActive !== undefined ? false : undefined,
    contentStyle: TOOLTIP_CONTENT_STYLE,
    labelStyle: TOOLTIP_LABEL_STYLE,
    formatter: tooltipFormatter,
  }

  return (
    <div className={`rounded-lg border border-border/70 bg-surface/60 p-4 sm:p-5 md:p-6 ${className}`}>
      {title && (
        <h4 className="text-sm font-medium text-foreground-muted mb-3">{title}</h4>
      )}
      <div className="[&_*]:!outline-none">
        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent {...defaultChartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip {...tooltipProps} />
            {showLegend && <Legend wrapperStyle={{ paddingTop: '20px' }} />}
            {children}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
