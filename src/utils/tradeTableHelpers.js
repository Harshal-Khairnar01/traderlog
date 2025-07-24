

export const getSlTargetColorClass = (trade, type) => {
  const { direction, entryPrice, exitPrice, stopLoss, target, exitType } = trade;

  const entry = parseFloat(entryPrice);
  const exit = parseFloat(exitPrice);
  const sl = parseFloat(stopLoss);
  const tg = parseFloat(target);

  switch (exitType) {
    case "Manual_Exit":
      return "text-yellow-400";
    case "Time_Based_Exit":
      return "text-blue-400";
    case "SL_Hit":
      return type === "SL" ? "text-red-500" : "text-gray-200";
    case "Target_Hit":
      return type === "Target" ? "text-green-500" : "text-gray-200";
    default:
      if (!isNaN(entry) && !isNaN(exit) && !isNaN(sl) && !isNaN(tg)) {
        if (type === "SL") {
          if (direction === "Long") {
            return exit <= sl ? "text-red-500" : "text-gray-200";
          } else if (direction === "Short") {
            return exit >= sl ? "text-red-500" : "text-gray-200";
          }
        } else if (type === "Target") {
          if (direction === "Long") {
            return exit >= tg ? "text-green-500" : "text-gray-200";
          } else if (direction === "Short") {
            return exit <= tg ? "text-green-500" : "text-gray-200";
          }
        }
      }
      return "text-gray-200";
  }
};

export const getRowClass = (index) => {
  return index % 2 === 0 ? "bg-zinc-800" : "bg-zinc-700";
};