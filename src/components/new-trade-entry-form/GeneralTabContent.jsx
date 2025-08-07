import React from 'react'
import FormField from '../FormField'

export default function GeneralTabContent({ formData, handleChange }) {
  const popularSymbols = [
    'NIFTY 50',
    'BANKNIFTY',
    'FINNIFTY',
    'SENSEX',
    'RELIANCE',
    'TCS',
    'HDFC BANK',
    'ICICI BANK',
    'INFY',
    'WIPRO',
    'Other',
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FormField
        label="Market Type"
        id="marketType"
        type="select"
        options={['Indian', 'US', 'Crypto', 'Forex']}
        value={formData.marketType}
        onChange={handleChange}
        required
      />

      <FormField
        label="Symbol"
        id="symbol"
        type="select"
        options={popularSymbols}
        value={formData.symbol}
        onChange={handleChange}
        required
      />

      <FormField
        label="Date"
        id="date"
        type="date"
        placeholder="dd-mm-yyyy"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <FormField
        label="Time"
        id="time"
        type="time"
        placeholder="HH:MM"
        value={formData.time}
        onChange={handleChange}
        required
      />

      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-2">
          <div className="w-full">
            <FormField
              label="Trade Type"
              id="tradeType"
              type="select"
              options={[
                'Select Trade Type',
                'Intraday - Equity',
                'Intraday - F&O',
                'Swing - Equity',
                'Swing - F&O',
                'Positional - Equity',
                'Positional - F&O',
                'Options',
                'Futures',
                'Cash',
                'Commodity',
                'Currency',
              ]}
              value={formData.tradeType}
              onChange={handleChange}
              required
            />
          </div>
          {formData.tradeType === 'Options' && (
            <div className="flex gap-1 items-center w-full mt-2 md:mt-0">
              <button
                type="button"
                className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200 w-1/2 ${
                  formData.optionType === 'Call'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
                }`}
                onClick={() =>
                  handleChange({
                    target: {
                      id: 'optionType',
                      value: 'Call',
                      type: 'radio',
                      name: 'optionType',
                    },
                  })
                }
              >
                Call
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md font-semibold text-sm w-1/2 transition-colors duration-200 ${
                  formData.optionType === 'Put'
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
                }`}
                onClick={() =>
                  handleChange({
                    target: {
                      id: 'optionType',
                      value: 'Put',
                      type: 'radio',
                      name: 'optionType',
                    },
                  })
                }
              >
                Put
              </button>
            </div>
          )}
        </div>
        <div className=" flex gap-3">
          <FormField
            label="Entry Price"
            id="entryPrice"
            type="number"
            step="0.01"
            placeholder="Entry Price"
            value={formData.entryPrice}
            onChange={handleChange}
            required
          />
          <FormField
            label="Exit Price"
            id="exitPrice"
            type="number"
            step="0.01"
            placeholder="Exit Price"
            value={formData.exitPrice}
            onChange={handleChange}
            required
          />
        </div>

        <FormField
          label="Quantity"
          id="quantity"
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-span-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Direction<span className="text-red-500 ml-1">*</span>{' '}
          </label>
          <div className="flex gap-2 items-center w-full">
            <button
              type="button"
              className={`px-1 py-2 rounded-md font-semibold text-sm transition-colors duration-200 w-1/2 ${
                formData.direction === 'Long'
                  ? 'bg-green-600 text-white'
                  : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
              }`}
              onClick={() =>
                handleChange({
                  target: {
                    id: 'direction',
                    value: 'Long',
                    type: 'radio',
                    name: 'direction',
                  },
                })
              }
            >
              <span className="">↑</span> Long
            </button>
            <button
              type="button"
              className={`px-1 py-2 rounded-md font-semibold text-sm w-1/2 transition-colors duration-200 ${
                formData.direction === 'Short'
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
              }`}
              onClick={() =>
                handleChange({
                  target: {
                    id: 'direction',
                    value: 'Short',
                    type: 'radio',
                    name: 'direction',
                  },
                })
              }
            >
              <span className="">↓</span> Short
            </button>
          </div>
        </div>
        <FormField
          label="Total Amount"
          id="totalAmount"
          type="text"
          placeholder="Amount"
          value={formData.totalAmount}
          readOnly
        />
        <div className="flex gap-2">
          <FormField
            label="P&L (Net)"
            id="netPnl"
            type="text"
            step="0.01"
            placeholder="Net P&L"
            value={formData.netPnl}
            readOnly
          />
          <FormField
            label="P&L (%) (Net)"
            id="pnlPercentage"
            type="text"
            placeholder="% Change"
            value={formData.pnlPercentage}
            readOnly
          />
        </div>
      </div>
      <FormField
        label="Stop Loss"
        id="stopLoss"
        type="number"
        step="0.01"
        placeholder="Stop Loss"
        value={formData.stopLoss}
        onChange={handleChange}
      />
      <FormField
        label="Target"
        id="target"
        type="number"
        step="0.01"
        placeholder="Target"
        value={formData.target}
        onChange={handleChange}
      />

      <FormField
        label="R:R Ratio"
        id="riskReward"
        type="text"
        placeholder="R:R"
        value={formData.riskReward}
        readOnly
      />
      <FormField
        label="Charges/Brokerage"
        id="charges"
        type="number"
        step="0.01"
        placeholder="e.g., 25.50"
        value={formData.charges}
        onChange={handleChange}
      />

      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Strategy Used"
          id="strategyUsed"
          type="select"
          options={[
            'Select Strategy',
            'Breakout',
            'Reversal',
            'Moving Average',
            'Price Action',
            'Gap Up/Down',
            'Trendline',
            'Self Setup',
            'Support',
            'Resistance',
            'Other',
          ]}
          value={formData.strategyUsed}
          onChange={handleChange}
        />
        <FormField
          label="Outcome Summary"
          id="outcomeSummary"
          type="select"
          options={[
            'Select Outcome Summary',
            'Target Hit',
            'SL Hit',
            'Manual Exit',
            'Time-based Exit',
            'Other',
          ]}
          value={formData.outcomeSummary}
          onChange={handleChange}
        />
      </div>

      <div className="col-span-full">
        <FormField
          label="Trade Analysis"
          id="tradeAnalysis"
          type="textarea"
          rows="4"
          placeholder="Why did you take this trade? What was your analysis?"
          value={formData.tradeAnalysis}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}
