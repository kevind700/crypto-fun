export const formatValue = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  
  return `$${num.toLocaleString()}`;
};

export const formatVolume = (volume: string): string => {
  return formatValue(parseFloat(volume));
};

export const getChangeBackgroundColor = (percentChange: string | number): string => {
  const change = typeof percentChange === 'string' ? parseFloat(percentChange) : percentChange;
  return change >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
};

export const getChangeBorderColor = (percentChange: string | number): string => {
  const change = typeof percentChange === 'string' ? parseFloat(percentChange) : percentChange;
  return change >= 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';
};

export const getChangeColor = (percentChange: string | number): string => {
  const change = typeof percentChange === 'string' ? parseFloat(percentChange) : percentChange;
  return change >= 0 ? '#22c55e' : '#ef4444';
};

export const formatPercentChange = (percentChange: string | number): string => {
  const change = typeof percentChange === 'string' ? parseFloat(percentChange) : percentChange;
  return `${change >= 0 ? '+' : ''}${change}%`;
}; 