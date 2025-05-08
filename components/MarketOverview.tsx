import React, { memo } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { COLORS } from '../constants';
import { useCrypto } from '../contexts/CryptoContext';
import CoinItem from './CoinItem';
import EmptyState from './common/EmptyState';
import ErrorMessage from './common/ErrorMessage';
import GlobalStatsCard from './GlobalStatsCard';
import { styles } from './MarketOverview.styles';
import TopMoversCard from './TopMoversCard';

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
    topLosers
  } = useCrypto();

  // Handle error state
  if (error) {
    return <ErrorMessage message={error} />;
  }

  /**
   * Renders the footer loading indicator when loading more data
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
   * @returns {JSX.Element | null} Empty state component or null if loading
   */
  const renderEmptyComponent = () => {
    if (isLoading) return null;
    return <EmptyState message="No data available" />;
  };

  /**
   * Renders the header components including global stats and top movers
   * @returns {JSX.Element} Header component
   */
  const renderHeader = () => (
    <>
      {globalData && <GlobalStatsCard data={globalData} />}
      
      {topGainers.length > 0 && (
        <TopMoversCard 
          title="Top Gainers (24h)" 
          data={topGainers}
          onSelectCoin={setSelectedCoin}
        />
      )}
      
      {topLosers.length > 0 && (
        <TopMoversCard 
          title="Top Losers (24h)" 
          data={topLosers}
          onSelectCoin={setSelectedCoin}
        />
      )}
      
      <Text style={styles.sectionTitle}>All Cryptocurrencies</Text>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tickers}
        renderItem={({ item }) => (
          <CoinItem 
            coin={item} 
            onSelect={setSelectedCoin}
          />
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

export default memo(MarketOverview);