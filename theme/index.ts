/**
 * Theme Configuration
 *
 * This module defines the application's theme using React Native Paper's theming system.
 * It extends the default Material Design 3 dark theme with custom colors and styles
 * tailored to the cryptocurrency application.
 *
 * Following Expo and React Native best practices, we create a consistent theme
 * that can be applied throughout the application.
 */

import type { MD3Theme } from "react-native-paper";
import { MD3DarkTheme } from "react-native-paper";

/**
 * Custom dark theme extending MD3DarkTheme
 *
 * This theme uses a dark color palette with blue accent colors
 * and appropriate contrast ratios for readability and accessibility.
 *
 * The color system follows Material Design 3 guidelines with:
 * - Primary colors for main actions and branding
 * - Surface colors for backgrounds and cards
 * - On-colors for text and icons that appear on top of other colors
 */
export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Primary color palette
    primary: "#60a5fa", // Primary color for buttons, active elements
    primaryContainer: "#1d4ed8", // Container color for primary elements

    // Secondary color palette
    secondary: "#94a3b8", // Secondary color for less prominent elements
    secondaryContainer: "#475569", // Container color for secondary elements

    // Background and surface colors
    background: "#000000", // Main app background
    surface: "#111827", // Card/element surface color
    surfaceVariant: "#1e293b", // Alternative surface color
    surfaceDisabled: "#374151", // Disabled surface color

    // Error/warning colors
    error: "#ef4444", // Error color
    errorContainer: "#991b1b", // Container color for error elements

    // Text and icon colors (on top of other colors)
    onPrimary: "#000000", // Text/icons on primary color
    onPrimaryContainer: "#ffffff", // Text/icons on primary container
    onSecondary: "#000000", // Text/icons on secondary color
    onSecondaryContainer: "#ffffff", // Text/icons on secondary container
    onBackground: "#ffffff", // Text/icons on background
    onSurface: "#ffffff", // Text/icons on surface
    onSurfaceVariant: "#cbd5e1", // Text/icons on surface variant
    onSurfaceDisabled: "#6b7280", // Text/icons on disabled surfaces
    onError: "#ffffff", // Text/icons on error color
    onErrorContainer: "#ffffff", // Text/icons on error container

    // Border and outline colors
    outline: "#374151", // Standard outline color
    outlineVariant: "#1f2937", // Variant outline color

    // Inverse colors (for contrast/accessibility)
    inverseSurface: "#f8fafc", // Inverse of surface color
    inverseOnSurface: "#000000", // Text/icons on inverse surface
    inversePrimary: "#2563eb", // Inverse of primary color

    // Special UI element colors
    scrim: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
    backdrop: "rgba(0, 0, 0, 0.5)", // Background overlay for modals

    // Elevation levels (shadows/depth)
    elevation: {
      level0: "transparent", // No elevation
      level1: "#111827", // Low elevation
      level2: "#1e293b", // Medium-low elevation
      level3: "#1e293b", // Medium elevation
      level4: "#1e293b", // Medium-high elevation
      level5: "#334155", // High elevation
    },
  },
  roundness: 1, // Corner roundness multiplier
};
