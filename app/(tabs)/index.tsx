/**
 * Overview Screen Module
 *
 * This is the main home/overview tab of the application that displays:
 * - Market overview with key global metrics
 * - Top movers in the cryptocurrency market
 * - Additional statistics about the market
 *
 * The components in this module are optimized for performance with memoization.
 * The UI uses react-native-paper components and follows the application's theme.
 */

import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCrypto } from "../../contexts/CryptoContext";
import { GlobalData, Ticker } from "../../models/types/crypto";
import {
    formatPercentChange,
    formatValue,
    getChangeBackgroundColor,
    getChangeColor,
} from "../../utils";
import { styles } from "./styles/index.styles";

/**
 * Component props for TopMoversCard
 * @interface TopMoversCardProps
 * @property {Ticker[] | null} tickers - List of cryptocurrency tickers
 */
interface TopMoversCardProps {
  tickers: Ticker[] | null;
}

/**
 * Component to display cryptocurrencies with the biggest price movements
 * Shows the top cryptocurrencies with significant price changes in a horizontal display
 *
 * @param {TopMoversCardProps} props - Component props
 * @returns {JSX.Element | null} Rendered component or null if no data
 */
const TopMoversCard: React.FC<TopMoversCardProps> = memo(({ tickers }) => {
  const theme = useTheme();

  // Early return if no data is available
  if (!tickers || tickers.length === 0) return null;

  return (
    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      {/* Card title */}
      <Text variant="titleMedium" style={styles.cardTitle}>
        Top Movers
      </Text>

      {/* Container for the top moving cryptocurrencies */}
      <View style={styles.moversContainer}>
        {/* Display up to 5 top movers */}
        {tickers.slice(0, 5).map((ticker: Ticker) => {
          const changeColor = getChangeColor(ticker.percent_change_24h);
          return (
            <View key={ticker.id} style={styles.moverItem}>
              {/* Coin symbol and percentage change */}
              <View style={styles.moverHeader}>
                <Text style={styles.moverSymbol}>{ticker.symbol}</Text>
                <Text style={[styles.moverChange, { color: changeColor }]}>
                  {formatPercentChange(ticker.percent_change_24h)}
                </Text>
              </View>
              {/* Coin name with ellipsis for long names */}
              <Text style={styles.moverName} numberOfLines={1}>
                {ticker.name}
              </Text>
            </View>
          );
        })}
      </View>
    </Surface>
  );
});

/**
 * Component props for MarketOverview
 * @interface MarketOverviewProps
 * @property {GlobalData | null} globalData - Global market data
 */
interface MarketOverviewProps {
  globalData: GlobalData | null;
}

/**
 * Component to display general market overview data
 * Shows key metrics like market cap, volume, and dominance statistics
 *
 * @param {MarketOverviewProps} props - Component props
 * @returns {JSX.Element | null} Rendered component or null if no data
 */
const MarketOverview: React.FC<MarketOverviewProps> = memo(({ globalData }) => {
  const theme = useTheme();

  // Early return if no data is available
  if (!globalData) return null;

  // Calculate derived values for display
  const isMarketCapPositive = parseFloat(globalData.mcap_change) >= 0;
  const isVolumePositive = parseFloat(globalData.volume_change) >= 0;
  const otherPercentage = (
    100 -
    parseFloat(globalData.btc_d || "0") -
    parseFloat(globalData.eth_d || "0")
  ).toFixed(2);

  return (
    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      {/* Card title */}
      <Text variant="titleMedium" style={styles.cardTitle}>
        Market Overview
      </Text>

      {/* Main metrics section - Market Cap and Volume */}
      <View style={styles.metricsContainer}>
        {/* Market Cap section */}
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
                backgroundColor: getChangeBackgroundColor(
                  globalData.mcap_change,
                ),
              },
            ]}
          >
            <MaterialCommunityIcons
              name={isMarketCapPositive ? "trending-up" : "trending-down"}
              size={16}
              color={getChangeColor(globalData.mcap_change)}
            />
            <Text
              style={[
                styles.changeText,
                { color: getChangeColor(globalData.mcap_change) },
              ]}
            >
              {formatPercentChange(globalData.mcap_change)}
            </Text>
          </View>
        </View>

        {/* 24h Trading Volume section */}
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
                backgroundColor: getChangeBackgroundColor(
                  globalData.volume_change,
                ),
              },
            ]}
          >
            <MaterialCommunityIcons
              name={isVolumePositive ? "trending-up" : "trending-down"}
              size={16}
              color={getChangeColor(globalData.volume_change)}
            />
            <Text
              style={[
                styles.changeText,
                { color: getChangeColor(globalData.volume_change) },
              ]}
            >
              {formatPercentChange(globalData.volume_change)}
            </Text>
          </View>
        </View>
      </View>

      {/* Market Dominance section - Shows BTC, ETH and others percentages */}
      <View style={styles.dominanceContainer}>
        <Text variant="titleMedium" style={styles.dominanceTitle}>
          Market Dominance
        </Text>
        <View style={styles.dominanceMetrics}>
          {/* Bitcoin dominance */}
          <View style={styles.dominanceItem}>
            <MaterialCommunityIcons name="bitcoin" size={24} color="#F7931A" />
            <Text style={styles.dominanceValue}>{globalData.btc_d}%</Text>
            <Text style={styles.dominanceLabel}>Bitcoin</Text>
          </View>

          {/* Ethereum dominance */}
          <View style={styles.dominanceItem}>
            <MaterialCommunityIcons name="ethereum" size={24} color="#627EEA" />
            <Text style={styles.dominanceValue}>{globalData.eth_d}%</Text>
            <Text style={styles.dominanceLabel}>Ethereum</Text>
          </View>

          {/* All other cryptocurrencies */}
          <View style={styles.dominanceItem}>
            <MaterialCommunityIcons
              name="star-outline"
              size={24}
              color="#60a5fa"
            />
            <Text style={styles.dominanceValue}>{otherPercentage}%</Text>
            <Text style={styles.dominanceLabel}>Others</Text>
          </View>
        </View>
      </View>

      {/* Additional market statistics - Active markets and total coins */}
      <View style={styles.statsContainer}>
        {/* Active Markets count */}
        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name="chart-box-outline"
            size={20}
            color="#60a5fa"
          />
          <Text style={styles.statValue}>
            {globalData.active_markets?.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Active Markets</Text>
        </View>

        {/* Visual divider */}
        <View style={styles.statDivider} />

        {/* Total Coins count */}
        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name="currency-usd"
            size={20}
            color="#60a5fa"
          />
          <Text style={styles.statValue}>
            {globalData.coins_count?.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Coins</Text>
        </View>
      </View>
    </Surface>
  );
});

/**
 * Main screen component for the home/overview tab
 * Combines the MarketOverview and TopMoversCard components
 * Supports pull-to-refresh functionality
 *
 * @returns {JSX.Element} Rendered component
 */
const OverviewScreen = () => {
  const theme = useTheme();

  // Get cryptocurrency data from context
  const { globalData, tickers, isLoading, refreshData } = useCrypto();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      {/* Scrollable content with pull-to-refresh */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Market overview card */}
        <MarketOverview globalData={globalData} />

        {/* Top movers card */}
        <TopMoversCard tickers={tickers} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Export the screen component with memoization for performance
export default memo(OverviewScreen);
