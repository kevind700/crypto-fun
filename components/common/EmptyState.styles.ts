/**
 * EmptyState Component Styles
 * 
 * This module defines the styles for the EmptyState component.
 * It uses constants from the app's design system for consistency.
 */

import { StyleSheet } from 'react-native';
import { COLORS, LAYOUT, TYPOGRAPHY } from '../../constants';

/**
 * StyleSheet for the EmptyState component
 */
export const styles = StyleSheet.create({
  /**
   * Container for the empty state message
   * Centers content both horizontally and vertically
   */
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: LAYOUT.SPACING_XL,
  },
  
  /**
   * Text style for the empty state message
   * Uses secondary text color for less emphasis
   */
  message: {
    textAlign: 'center',
    fontSize: TYPOGRAPHY.FONT_SIZE_MD,
    color: COLORS.TEXT_SECONDARY,
  },
}); 