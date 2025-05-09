/**
 * Chart Data Types
 *
 * This module contains type definitions for data and configurations
 * of charts used in the application.
 */

/**
 * Data structure for charts
 */
export interface ChartData {
  labels: string[]; // X-axis labels
  datasets: {
    // Chart datasets
    data: number[]; // Y-axis data points
    color?: (opacity?: number) => string; // Color function
    strokeWidth?: number; // Line width
  }[];
}

/**
 * Style configuration for charts
 */
export interface ChartStyle {
  backgroundColor: string; // Background color
  backgroundGradientFrom: string; // Starting color of background gradient
  backgroundGradientTo: string; // Ending color of background gradient
  decimalPlaces: number; // Number of decimal places to display
  color: (opacity?: number) => string; // Text color function
  labelColor: (opacity?: number) => string; // Label color function
  style: {
    // Additional styles
    borderRadius: number; // Border radius
    padding: number; // Padding
  };
  propsForDots: {
    // Properties for data points
    r: string; // Point radius
    strokeWidth: string; // Point border width
  };
}

/**
 * Time period for historical data
 */
export type TimeFrame = "1d" | "7d" | "30d" | "90d" | "1y" | "all";

/**
 * Chart display options
 */
export interface ChartOptions {
  timeFrame: TimeFrame; // Time period to display
  showLabels?: boolean; // Whether to show labels
  showLegend?: boolean; // Whether to show legend
  showGrid?: boolean; // Whether to show grid
  showAxis?: boolean; // Whether to show axes
  animation?: boolean; // Whether to enable animations
  fillBetweenLine?: boolean; // Whether to fill area under line
}

/**
 * Data for price charts
 */
export interface PriceChartData {
  timestamp: number; // Data point timestamp
  price: number; // Price at the data point
  volume?: number; // Volume at the data point (optional)
}

/**
 * Data for comparison charts
 */
export interface ComparisonChartData {
  timestamp: number; // Data point timestamp
  values: Record<string, number>; // Values by asset
}
