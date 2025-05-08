import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useCrypto } from '../contexts/CryptoContext';
import { Ticker } from '../services/types';
import { useTheme, Surface } from 'react-native-paper';

// Inline component implementation since the file doesn't exist
const CoinItem = ({ coin }: { coin: Ticker }) => {
  const priceChangeColor = parseFloat(coin.percent_change_24h) >= 0 ? '#22c55e' : '#ef4444';

  return (
    <Surface style={styles.coinContainer}>
      <View style={styles.leftSection}>
        <Text style={styles.rank}>#{coin.rank}</Text>
        <View style={styles.nameSection}>
          <Text style={styles.symbol}>{coin.symbol}</Text>
          <Text style={styles.name}>{coin.name}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.price}>
          ${parseFloat(coin.price_usd).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
          })}
        </Text>
        <Text style={[styles.change, { color: priceChangeColor }]}>
          {parseFloat(coin.percent_change_24h) >= 0 ? '+' : ''}
          {coin.percent_change_24h}%
        </Text>
      </View>
    </Surface>
  );
};

// Inline component for global stats
const GlobalStats = ({ data }: { data: any }) => {
  return (
    <Surface style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Market Overview</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Market Cap</Text>
          <Text style={styles.statValue}>${Number(data?.total_mcap || 0).toLocaleString()}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>24h Volume</Text>
          <Text style={styles.statValue}>${Number(data?.total_volume || 0).toLocaleString()}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>BTC Dominance</Text>
          <Text style={styles.statValue}>{data?.btc_d || 0}%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Coins</Text>
          <Text style={styles.statValue}>{data?.coins_count || 0}</Text>
        </View>
      </View>
    </Surface>
  );
};

const MarketOverview: React.FC = () => {
  const { 
    tickers, 
    globalData, 
    isLoading, 
    error, 
    refreshData 
  } = useCrypto();

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <View style={styles.centerContainer}>
        <Text>No data available</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {globalData && <GlobalStats data={globalData} />}
      
      <FlatList
        data={tickers}
        renderItem={({ item }) => <CoinItem coin={item} />}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rank: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  nameSection: {},
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 14,
    color: '#666',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  change: {
    fontSize: 14,
  },
  statsContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MarketOverview;