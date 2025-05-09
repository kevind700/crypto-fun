/**
 * MarketOverview Component
 *
 * This component serves as the main market overview screen that displays:
 * - Global cryptocurrency market statistics via GlobalStatsCard
 * - Top gaining and losing cryptocurrencies via TopMoversCard
 * - A complete list of cryptocurrencies with their key metrics
 *
 * It supports pull-to-refresh functionality and handles loading states,
 * empty states, and error states appropriately.
 *
 * The component is memoized to prevent unnecessary re-renders.
 */

import React, { memo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { COLORS } from "../constants";
import { useCrypto } from "../contexts/CryptoContext";
import CoinItem from "./CoinItem";
import EmptyState from "./common/EmptyState";
import ErrorMessage from "./common/ErrorMessage";
import GlobalStatsCard from "./GlobalStatsCard";
import { styles } from "./MarketOverview.styles";
import TopMoversCard from "./TopMoversCard";

/**
 * MarketOverview component displays cryptocurrency market data and listings
 * @returns {JSX.Element} Rendered component
 */
const MarketOverview: React.FC = () => {
  // Get data and functions from the CryptoContext
  const {
    tickers,
    globalData,
    isLoading,
    error,
    refreshData,
    setSelectedCoin,
    topGainers,
    topLosers,
  } = useCrypto();

  // Handle error state - show error message if API request failed
  if (error) {
    return <ErrorMessage message={error} />;
  }

  /**
   * Renders the footer loading indicator when loading more data
   * This appears at the bottom of the list when loading additional cryptocurrencies
   * @returns {JSX.Element | null} Footer component or null if not loading
   */
  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={COLORS.LOADING} />
      </View>
    );
  };

  /**
   * Renders empty state message when no data is available
   * Only shows when not in loading state and there are no cryptocurrencies to display
   * @returns {JSX.Element | null} Empty state component or null if loading
   */
  const renderEmptyComponent = () => {
    if (isLoading) return null;
    return <EmptyState message="No data available" />;
  };

  /**
   * Renders the header components including global stats and top movers
   * This appears at the top of the FlatList before the cryptocurrency list
   * @returns {JSX.Element} Header component
   */
  const renderHeader = () => (
    <>
      {/* Global market statistics card - only shown if data is available */}
      {globalData && <GlobalStatsCard data={globalData} />}

      {/* Top gainers card - only shown if there are gainers to display */}
      {topGainers.length > 0 && (
        <TopMoversCard
          title="Top Gainers (24h)"
          data={topGainers}
          onSelectCoin={setSelectedCoin}
        />
      )}

      {/* Top losers card - only shown if there are losers to display */}
      {topLosers.length > 0 && (
        <TopMoversCard
          title="Top Losers (24h)"
          data={topLosers}
          onSelectCoin={setSelectedCoin}
        />
      )}

      {/* Section title for the full cryptocurrency list */}
      <Text style={styles.sectionTitle}>All Cryptocurrencies</Text>
    </>
  );

  // Render the main component with FlatList for efficient list rendering
  return (
    <View style={styles.container}>
      <FlatList
        data={tickers}
        renderItem={({ item }) => (
          <CoinItem coin={item} onSelect={setSelectedCoin} />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
        }
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(MarketOverview);
