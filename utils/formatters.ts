import { COLORS } from '../constants';

export const formatPrice = (priceUsd: string): string => {
  return parseFloat(priceUsd).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
};

export const formatLargeNumber = (value: number | string): string => {
  const num = typeof value === 'string' ? Number(value) : value;
  return num.toLocaleString();
};

export const formatPercentChange = (percentChange: string): string => {
  const isPositive = parseFloat(percentChange) >= 0;
  return `${isPositive ? '+' : ''}${percentChange}%`;
};

export const getChangeColor = (percentChange: string): string => {
  return parseFloat(percentChange) >= 0 ? COLORS.POSITIVE : COLORS.NEGATIVE;
};