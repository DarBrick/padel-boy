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
  backgroundColor: '#1e293b',
  border: '1px solid #475569',
  borderRadius: '0.5rem',
  color: '#f1f5f9',
}

const TOOLTIP_LABEL_STYLE = { color: '#cbd5e1' }

const AXIS_STROKE = '#94a3b8'
const AXIS_TICK_FILL = { fill: '#94a3b8' }
const GRID_STROKE = '#334155'

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
    <div className={`bg-slate-800/50 rounded-lg p-4 ${className}`}>
      {title && (
        <h4 className="text-sm font-medium text-slate-300 mb-3">{title}</h4>
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
