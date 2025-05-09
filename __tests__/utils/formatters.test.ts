import { COLORS } from '@/constants';
import { formatLargeNumber, formatPercentChange, formatPrice, getChangeColor } from '@/utils/formatters';

describe('Formatters', () => {
  describe('formatPrice', () => {
    it('should format small prices with appropriate decimals', () => {
      expect(formatPrice('0.00012345')).toBe('0.00012345');
    });

    it('should format large prices with thousands separators', () => {
      expect(formatPrice('12345.67')).toBe('12,345.67');
    });
  });

  describe('formatLargeNumber', () => {
    it('should format large numbers as strings', () => {
      expect(formatLargeNumber('1000000')).toBe('1,000,000');
    });
    
    it('should format large numbers as number type', () => {
      expect(formatLargeNumber(1000000)).toBe('1,000,000');
    });
  });
  
  describe('formatPercentChange', () => {
    it('should add + sign to positive values', () => {
      expect(formatPercentChange('5.2')).toBe('+5.2%');
    });
    
    it('should keep - sign on negative values', () => {
      expect(formatPercentChange('-3.7')).toBe('-3.7%');
    });
    
    it('should add + sign to zero value', () => {
      expect(formatPercentChange('0')).toBe('+0%');
    });
  });
  
  describe('getChangeColor', () => {
    it('should return positive color for positive changes', () => {
      expect(getChangeColor('2.5')).toBe(COLORS.POSITIVE);
    });
    
    it('should return positive color for zero change', () => {
      expect(getChangeColor('0')).toBe(COLORS.POSITIVE);
    });
    
    it('should return negative color for negative changes', () => {
      expect(getChangeColor('-1.8')).toBe(COLORS.NEGATIVE);
    });
  });
}); 