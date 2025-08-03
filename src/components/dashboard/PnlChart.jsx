import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns' // Import format from date-fns

const PnlChart = ({ cumulativePnlData }) => {
  return (
    <div className="w-full lg:w-3/4 bg-slate-800 p-6 rounded-lg shadow-md min-h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">
        Cumulative P&L
      </h3>
      {cumulativePnlData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={cumulativePnlData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis
                dataKey="name"
                stroke="#cbd5e0"
                angle={-30}
                textAnchor="end"
                height={60}
                interval="preserveStartEnd"
                // Format X-axis labels to "2 Aug"
                tickFormatter={(tick) => format(new Date(tick), 'd MMM')}
              />
              <YAxis stroke="#cbd5e0" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#2d3748',
                  border: '1px solid #4a5568',
                  borderRadius: '4px',
                }}
                itemStyle={{ color: '#cbd5e0' }}
                // Format tooltip label to "2 Aug, 03:30 PM"
                labelFormatter={(label) =>
                  format(new Date(label), 'd MMM, hh:mm a')
                }
                formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
              />
              <Line
                type="monotone"
                dataKey="pnl"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 8,
                  fill: '#8884d8',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xl font-bold mt-4 text-center">
            Current Total:{' '}
            <span
              className={
                cumulativePnlData[cumulativePnlData.length - 1].pnl >= 0
                  ? 'text-green-400'
                  : 'text-red-400'
              }
            >
              ₹
              {cumulativePnlData[
                cumulativePnlData.length - 1
              ].pnl.toLocaleString('en-IN')}
            </span>
          </p>
        </>
      ) : (
        <div className="flex-grow flex items-center justify-center text-gray-500">
          <p>No trade data available to generate cumulative P&L chart.</p>
        </div>
      )}
    </div>
  )
}

export default PnlChart
