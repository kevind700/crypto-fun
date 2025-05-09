import { COLORS } from '@/constants';
import { formatValue, formatVolume, getChangeBackgroundColor, getChangeBorderColor } from '@/utils';

describe('Additional Utils', () => {
  describe('formatValue', () => {
    it('should format trillion values correctly', () => {
      expect(formatValue(1200000000000)).toBe('$1.20T');
    });
    
    it('should format billion values correctly', () => {
      expect(formatValue('5500000000')).toBe('$5.50B');
    });
    
    it('should format million values correctly', () => {
      expect(formatValue(7800000)).toBe('$7.80M');
    });
    
    it('should format thousand values correctly', () => {
      expect(formatValue('8500')).toBe('$8.50K');
    });
    
    it('should format small values correctly', () => {
      expect(formatValue(750)).toBe('$750');
    });
  });
  
  describe('formatVolume', () => {
    it('should format volume correctly', () => {
      expect(formatVolume('1500000')).toBe('$1.50M');
    });
  });
  
  describe('getChangeBackgroundColor', () => {
    it('should return green background for positive values', () => {
      expect(getChangeBackgroundColor('2.5')).toBe(COLORS.POSITIVE_BACKGROUND);
    });
    
    it('should return green background for zero value', () => {
      expect(getChangeBackgroundColor(0)).toBe(COLORS.POSITIVE_BACKGROUND);
    });
    
    it('should return red background for negative values', () => {
      expect(getChangeBackgroundColor(-3.7)).toBe(COLORS.NEGATIVE_BACKGROUND);
    });
  });
  
  describe('getChangeBorderColor', () => {
    it('should return green border for positive values', () => {
      expect(getChangeBorderColor('2.5')).toBe(COLORS.POSITIVE_BORDER);
    });
    
    it('should return green border for zero value', () => {
      expect(getChangeBorderColor(0)).toBe(COLORS.POSITIVE_BORDER);
    });
    
    it('should return red border for negative values', () => {
      expect(getChangeBorderColor(-3.7)).toBe(COLORS.NEGATIVE_BORDER);
    });
  });
}); 