import React from 'react'
import {
  TrendingUp,
  Trophy,
  Scale,
  BarChart2,
  DollarSign,
  Banknote,
  MinusCircle,
  TrendingDown,
} from 'lucide-react'

const DashboardCard = ({ title, value, valueColor }) => {
  return (
    <div className="bg-slate-800 p-5 rounded-lg shadow-xl flex flex-col items-start justify-between relative overflow-hidden">
      <div className=" w-full flex gap-2 justify-between items-center">
        <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
        <div className="">
          {title === 'Highest P&L' && (
            <TrendingUp className="text-green-500 text-2xl" size={24} />
          )}
          {title === 'Win Rate' && (
            <Trophy className="text-blue-500 text-2xl" size={24} />
          )}
          {title === 'Avg. Risk/Reward' && (
            <Scale className="text-yellow-500 text-2xl" size={24} />
          )}
          {title.includes('Trades') && (
            <BarChart2 className="text-purple-500 text-2xl" size={24} />
          )}
          {title === 'Initial Capital' && (
            <Banknote className="text-cyan-500 text-2xl" size={24} />
          )}
          {title === 'Current Capital' && (
            <DollarSign className="text-cyan-500 text-2xl" size={24} />
          )}
          {title === 'Total Charges' && (
            <MinusCircle className="text-gray-500 text-2xl" size={24} />
          )}
          {title === 'Max Drawdown' && (
            <TrendingDown className="text-orange-500 text-2xl" size={24} />
          )}
        </div>
      </div>
      <p className={` text-xl md:text-3xl font-bold ${valueColor}`}>{value}</p>
    </div>
  )
}

export default DashboardCard
