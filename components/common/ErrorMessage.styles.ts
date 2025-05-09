/**
 * ErrorMessage Component Styles
 *
 * This module defines the styles for the ErrorMessage component.
 * It uses constants from the app's design system for consistency.
 */

import { StyleSheet } from "react-native";
import { COLORS, LAYOUT, TYPOGRAPHY } from "../../constants";

/**
 * StyleSheet for the ErrorMessage component
 */
export const styles = StyleSheet.create({
  /**
   * Container for the error message
   * Centers content both horizontally and vertically
   */
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: LAYOUT.SPACING_XL,
  },

  /**
   * Text style for the error message
   * Uses negative/error color for emphasis
   */
  errorText: {
    color: COLORS.NEGATIVE,
    textAlign: "center",
    fontSize: TYPOGRAPHY.FONT_SIZE_MD,
  },
});
