/**
 * MarketOverview Component Styles
 *
 * This module defines the styles for the MarketOverview component,
 * which is the main screen displaying cryptocurrency market data.
 * It uses constants from the app's design system for consistency.
 */

import { StyleSheet } from "react-native";
import { COLORS, LAYOUT, TYPOGRAPHY } from "../constants";

/**
 * StyleSheet for the MarketOverview component
 */
export const styles = StyleSheet.create({
  /**
   * Main container for the market overview screen
   * Takes full available space with a consistent background color
   */
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  /**
   * Footer container for loading indicator
   * Shown at the bottom of the list when loading more data
   */
  footer: {
    padding: LAYOUT.SPACING_SM,
    justifyContent: "center",
    alignItems: "center",
  },

  /**
   * Section title style for list headers
   * Used for "All Cryptocurrencies" and other section headers
   */
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    marginHorizontal: LAYOUT.SPACING_LG,
    marginTop: LAYOUT.SPACING_SM,
    marginBottom: LAYOUT.SPACING_SM,
  },
});
