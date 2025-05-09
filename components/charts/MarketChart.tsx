import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { GlobalData } from "../../models/types/crypto";

interface MarketChartProps {
  globalData?: GlobalData;
  height?: number;
  width?: number;
}

const formatValue = (value: number): string => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
};

const MarketChart: React.FC<MarketChartProps> = ({
  globalData,
  height = 220,
  width = Dimensions.get("window").width - 32,
}) => {
  const theme = useTheme();

  if (!globalData) return null;

  const isMarketCapPositive = parseFloat(globalData.mcap_change) >= 0;
  const isVolumePositive = parseFloat(globalData.volume_change) >= 0;

  return (
    <View style={styles.container}>
      <View style={styles.metricsContainer}>
        <View style={styles.metricBox}>
          <Text variant="titleMedium" style={styles.metricTitle}>
            Market Cap
          </Text>
          <Text variant="headlineSmall" style={styles.metricValue}>
            {formatValue(globalData.total_mcap)}
          </Text>
          <View
            style={[
              styles.changeBadge,
              {
                backgroundColor: isMarketCapPositive
                  ? "rgba(34, 197, 94, 0.1)"
                  : "rgba(239, 68, 68, 0.1)",
              },
            ]}
          >
            <MaterialCommunityIcons
              name={isMarketCapPositive ? "trending-up" : "trending-down"}
              size={16}
              color={isMarketCapPositive ? "#22c55e" : "#ef4444"}
            />
            <Text
              style={[
                styles.changeText,
                { color: isMarketCapPositive ? "#22c55e" : "#ef4444" },
              ]}
            >
              {isMarketCapPositive ? "+" : ""}
              {globalData.mcap_change}%
            </Text>
          </View>
        </View>

        <View style={styles.metricBox}>
          <Text variant="titleMedium" style={styles.metricTitle}>
            Volume 24h
          </Text>
          <Text variant="headlineSmall" style={styles.metricValue}>
            {formatValue(globalData.total_volume)}
          </Text>
          <View
            style={[
              styles.changeBadge,
              {
                backgroundColor: isVolumePositive
                  ? "rgba(34, 197, 94, 0.1)"
                  : "rgba(239, 68, 68, 0.1)",
              },
            ]}
          >
            <MaterialCommunityIcons
              name={isVolumePositive ? "trending-up" : "trending-down"}
              size={16}
              color={isVolumePositive ? "#22c55e" : "#ef4444"}
            />
            <Text
              style={[
                styles.changeText,
                { color: isVolumePositive ? "#22c55e" : "#ef4444" },
              ]}
            >
              {isVolumePositive ? "+" : ""}
              {globalData.volume_change}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.dominanceContainer}>
        <Text variant="titleMedium" style={styles.dominanceTitle}>
          Market Dominance
        </Text>
        <View style={styles.dominanceMetrics}>
          <View style={styles.dominanceItem}>
            <MaterialCommunityIcons name="bitcoin" size={24} color="#F7931A" />
            <Text style={styles.dominanceValue}>{globalData.btc_d}%</Text>
            <Text style={styles.dominanceLabel}>Bitcoin</Text>
          </View>
          <View style={styles.dominanceItem}>
            <MaterialCommunityIcons name="ethereum" size={24} color="#627EEA" />
            <Text style={styles.dominanceValue}>{globalData.eth_d}%</Text>
            <Text style={styles.dominanceLabel}>Ethereum</Text>
          </View>
          <View style={styles.dominanceItem}>
            <MaterialCommunityIcons
              name="star-outline"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.dominanceValue}>
              {(
                100 -
                parseFloat(globalData.btc_d) -
                parseFloat(globalData.eth_d)
              ).toFixed(2)}
              %
            </Text>
            <Text style={styles.dominanceLabel}>Others</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name="chart-box-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.statValue}>
            {globalData.active_markets.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Active Markets</Text>
        </View>
        <View
          style={[
            styles.statDivider,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        />
        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name="currency-usd"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.statValue}>
            {globalData.coins_count.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Coins</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  metricBox: {
    flex: 1,
    marginHorizontal: 8,
  },
  metricTitle: {
    opacity: 0.7,
    marginBottom: 4,
  },
  metricValue: {
    fontWeight: "600",
    marginBottom: 8,
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  changeText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  dominanceContainer: {
    marginBottom: 24,
  },
  dominanceTitle: {
    marginBottom: 16,
    opacity: 0.7,
  },
  dominanceMetrics: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dominanceItem: {
    alignItems: "center",
  },
  dominanceValue: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  dominanceLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    opacity: 0.1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
});

export default MarketChart;
