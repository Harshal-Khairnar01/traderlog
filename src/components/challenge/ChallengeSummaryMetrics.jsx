import React from "react";

const ChallengeSummaryMetrics = ({ summary }) => {
  const {
    startingCapital,
    currentCapital,
    targetCapital,
    dailyTarget,
    dailyActual,
    daysRemaining,
    projectedDate,
    winRate,
    progressToTarget,
  } = summary;

  const safeNumber = (value, fallback = 0) =>
    typeof value === "number" && !isNaN(value) ? value : fallback;

  const displayStartingCapital = safeNumber(startingCapital);
  const displayCurrentCapital = safeNumber(currentCapital);
  const displayTargetCapital = safeNumber(targetCapital);
  const displayDailyTarget = safeNumber(dailyTarget);
  const displayDailyActual = safeNumber(dailyActual);
  const displayDaysRemaining = safeNumber(daysRemaining);
  const displayWinRate = (safeNumber(winRate) * 100).toFixed(0);
  const displayProgressToTarget = (safeNumber(progressToTarget) * 100).toFixed(2);

  const capitalDifference = displayTargetCapital - displayStartingCapital;
  let capitalProgressBarWidth = 0;
  if (capitalDifference > 0) {
    capitalProgressBarWidth = Math.min(
      100,
      Math.max(
        0,
        ((displayCurrentCapital - displayStartingCapital) / capitalDifference) * 100
      )
    );
  }

  let dailyTargetProgressBarWidth = 0;
  if (displayDailyTarget > 0) {
    dailyTargetProgressBarWidth = Math.min(
      100,
      Math.max(0, (displayDailyActual / displayDailyTarget) * 100)
    );
  } else if (displayDailyActual > 0) {
    dailyTargetProgressBarWidth = 100;
  }

  const dailyTargetBarColor =
    displayDailyActual >= 0 ? "bg-purple-400" : "bg-red-500";

  const winRateProgressBarWidth = Math.min(
    100,
    Math.max(0, parseFloat(displayWinRate))
  );

  const pnlColorClass = displayDailyActual >= 0 ? "text-green-500" : "text-red-500";
  const pnlSign = displayDailyActual >= 0 ? "+" : "";

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col  items-center justify-between space-y-6 xl:space-y-0 xl:space-x-8 w-full">
      <div className="w-full  flex flex-col md:flex-row justify-between items-center gap-4 py-4 px-4 md:px-10">
        <div className="w-full md:w-3/5">
          <h3 className="font-bold text-2xl md:text-3xl mb-2">Capital Growth Challenge</h3>
          <p className="text-sm text-gray-400">
            Track your progress towards your trading goals with real-time analytics and performance metrics.
          </p>
        </div>
        <div className="flex gap-4 bg-gray-700 p-3 rounded-md w-full md:w-auto justify-between md:justify-center">
          <div className="text-xs flex flex-col items-center">
            <span>Days Remaining</span>
            <span className="text-lg font-semibold text-yellow-300">{displayDaysRemaining}</span>
          </div>
          <div className="text-xs flex flex-col items-center">
            <span>Projected Date</span>
            <span className="text-base font-semibold">{projectedDate || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className=" md:mt-3 w-full flex flex-col lg:flex-row gap-6 items-center  px-4 md:px-10">
        <div className="lg:w-1/5  p-2 flex flex-col gap-3">
          <svg className=" w-full h-full lg:w-10/12 lg:h-10/12" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#22C55E"
              strokeWidth="8"
              strokeDasharray={`${
                2 * Math.PI * 45 * safeNumber(progressToTarget, 0)
              } ${2 * Math.PI * 45 * (1 - safeNumber(progressToTarget, 0))}`}
              strokeDashoffset={`${2 * Math.PI * 45 * 0.25}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xl font-bold fill-current text-white"
            >
              {displayProgressToTarget}%
            </text>
          </svg>
          <span className=" text-sm text-gray-400 w-full text-center">
            Progress to target
          </span>
        </div>

        <div className="flex flex-col w-4/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center md:text-left">
              <span className="text-gray-400 text-sm">Starting Capital</span>
              <p className="text-xl font-semibold">₹{displayStartingCapital.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <span className="text-gray-400 text-sm">Current Capital</span>
              <p className="text-xl font-semibold">₹{displayCurrentCapital.toLocaleString()}</p>
            </div>
            <div className="text-center md:text-right">
              <span className="text-gray-400 text-sm">Target Capital</span>
              <p className="text-xl font-semibold">₹{displayTargetCapital.toLocaleString()}</p>
            </div>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${capitalProgressBarWidth}%` }}
            ></div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-400">Daily Target</span>
              <span className="text-purple-400 font-semibold">
                ₹
                {displayDailyTarget.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
                /day
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2 mb-2">
              <div
                className={`${dailyTargetBarColor} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${dailyTargetProgressBarWidth}%` }}
              ></div>
            </div>
            <div className="text-sm">
              <span className={`${pnlColorClass} font-semibold`}>
                {pnlSign}₹
                {Math.abs(displayDailyActual).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                today
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Win Rate</span>
              <span className="font-semibold text-white">{displayWinRate}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${winRateProgressBarWidth}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeSummaryMetrics;
