import React from "react";
import { StyleSheet } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface MarketMetricsCardProps {
  mcap?: number;
  volume?: number;
  mcapChange?: string;
}

const formatNumber = (num?: number) => {
  if (!num) return "$0";
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

const MarketMetricsCard: React.FC<MarketMetricsCardProps> = ({
  mcap,
  volume,
  mcapChange,
}) => {
  const theme = useTheme();
  const isPositiveChange = parseFloat(mcapChange || "0") >= 0;

  return (
    <Surface
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
    >
      <Text variant="titleMedium" style={styles.title}>
        Market Metrics
      </Text>

      <Surface
        style={[styles.metricCard, { backgroundColor: theme.colors.surface }]}
      >
        <MaterialCommunityIcons
          name="chart-line"
          size={24}
          color={theme.colors.primary}
        />
        <Text variant="bodyMedium" style={styles.label}>
          Total Market Cap
        </Text>
        <Text variant="titleMedium" style={styles.value}>
          {formatNumber(mcap)}
        </Text>
        {mcapChange && (
          <Text
            variant="bodySmall"
            style={[
              styles.change,
              { color: isPositiveChange ? "#22c55e" : "#ef4444" },
            ]}
          >
            {isPositiveChange ? "+" : ""}
            {mcapChange}%
          </Text>
        )}
      </Surface>

      <Surface
        style={[styles.metricCard, { backgroundColor: theme.colors.surface }]}
      >
        <MaterialCommunityIcons
          name="chart-bar"
          size={24}
          color={theme.colors.secondary}
        />
        <Text variant="bodyMedium" style={styles.label}>
          24h Volume
        </Text>
        <Text variant="titleMedium" style={styles.value}>
          {formatNumber(volume)}
        </Text>
      </Surface>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  metricCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  label: {
    marginTop: 8,
    opacity: 0.7,
  },
  value: {
    marginTop: 4,
    fontWeight: "bold",
  },
  change: {
    marginTop: 4,
    fontWeight: "500",
  },
});

export default MarketMetricsCard;
