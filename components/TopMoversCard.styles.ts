/**
 * TopMoversCard Component Styles
 * 
 * This module defines the styles for the TopMoversCard component,
 * which displays a horizontal scrollable list of cryptocurrencies
 * with significant price movements.
 * 
 * It uses constants from the app's design system for consistency.
 */

import { StyleSheet } from 'react-native';
import { COLORS, LAYOUT, TYPOGRAPHY } from '../constants';

/**
 * StyleSheet for the TopMoversCard component
 */
export const styles = StyleSheet.create({
  /**
   * Main container for the top movers card
   * Includes margin and padding for spacing and rounded corners
   */
  container: {
    margin: LAYOUT.SPACING_LG,
    padding: LAYOUT.SPACING_LG,
    borderRadius: LAYOUT.BORDER_RADIUS_MD,
  },
  
  /**
   * Title style for the card header
   * Bold and larger text with bottom margin for separation
   */
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    marginBottom: LAYOUT.SPACING_LG,
  },
  
  /**
   * Content container style for the horizontal list
   * Adds right padding to ensure last item doesn't appear cut off
   */
  listContent: {
    paddingRight: LAYOUT.SPACING_SM,
  },
  
  /**
   * Individual mover item card style
   * Each cryptocurrency is displayed in its own card with consistent sizing
   */
  moverItem: {
    padding: LAYOUT.SPACING_MD,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: LAYOUT.BORDER_RADIUS_MD,
    marginRight: LAYOUT.SPACING_SM,
    minWidth: 120,
    alignItems: 'center',
  },
  
  /**
   * Cryptocurrency symbol text style
   * Bold and larger text for emphasis as the primary identifier
   */
  symbol: {
    fontSize: TYPOGRAPHY.FONT_SIZE_MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    marginBottom: LAYOUT.SPACING_XS,
  },
  
  /**
   * Price text style
   * Medium-sized text with spacing below
   */
  price: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    marginBottom: LAYOUT.SPACING_XS,
  },
  
  /**
   * Percentage change text style
   * Bold text to emphasize the movement amount
   * Color is applied dynamically based on positive/negative change
   */
  change: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },
}); 