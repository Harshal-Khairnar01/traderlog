
export const formatCurrency = (amount, currency = '₹') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${currency}0`;
  }
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${currency}${formattedAmount}`;
};

export const formatRR = (value) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'N/A';
  }
  return `1:${value.toFixed(2)}R`;
};