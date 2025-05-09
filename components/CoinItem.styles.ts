/**
 * CoinItem Component Styles
 *
 * This module defines the styles for the CoinItem component,
 * which displays a cryptocurrency in list form.
 * It uses constants from the app's design system for consistency.
 */

import { StyleSheet } from "react-native";
import { COLORS, LAYOUT, TYPOGRAPHY } from "../constants";

/**
 * StyleSheet for the CoinItem component
 */
export const styles = StyleSheet.create({
  /**
   * Main container for the coin item
   * Horizontal layout with space between rank/name and price/change
   */
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: LAYOUT.SPACING_LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    backgroundColor: COLORS.SURFACE,
  },

  /**
   * Left section containing rank and name
   * Uses flex to allow the name to take remaining space
   */
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  /**
   * Cryptocurrency rank number style
   * Has a fixed minimum width to keep alignment consistent
   */
  rank: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginRight: LAYOUT.SPACING_MD,
    minWidth: 30,
  },

  /**
   * Container for symbol and name
   * Uses flex to take available space and prevent long names from pushing price off screen
   */
  nameSection: {
    flex: 1,
  },

  /**
   * Cryptocurrency symbol style (e.g., BTC, ETH)
   * Bold and primary text color for emphasis
   */
  symbol: {
    fontSize: TYPOGRAPHY.FONT_SIZE_MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_PRIMARY,
  },

  /**
   * Cryptocurrency name style (e.g., Bitcoin, Ethereum)
   * Secondary text color and smaller size for less emphasis
   */
  name: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: LAYOUT.SPACING_XS,
  },

  /**
   * Right section containing price and percent change
   * Right-aligned text for consistent number formatting
   */
  rightSection: {
    alignItems: "flex-end",
  },

  /**
   * Price text style
   * Bold and primary text color for emphasis
   */
  price: {
    fontSize: TYPOGRAPHY.FONT_SIZE_MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_PRIMARY,
  },

  /**
   * Percent change text style
   * Color is applied dynamically based on positive/negative change
   */
  change: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    marginTop: LAYOUT.SPACING_XS,
  },
});
