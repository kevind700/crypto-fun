import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ticker } from '../services/types';

interface TopMoversCardProps {
  tickers?: Ticker[];
}

const TopMoversCard: React.FC<TopMoversCardProps> = ({ tickers = [] }) => {
  const theme = useTheme();

  const topGainers = [...tickers]
    .sort((a, b) => parseFloat(b.percent_change_24h) - parseFloat(a.percent_change_24h))
    .slice(0, 5);

  const topLosers = [...tickers]
    .sort((a, b) => parseFloat(a.percent_change_24h) - parseFloat(b.percent_change_24h))
    .slice(0, 5);

  const renderCoin = (coin: Ticker) => {
    const isPositive = parseFloat(coin.percent_change_24h) >= 0;
    return (
      <Surface
        key={coin.id}
        style={[styles.coinCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.coinHeader}>
          <Text variant="titleSmall" style={styles.symbol}>{coin.symbol}</Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.change,
              { color: isPositive ? '#22c55e' : '#ef4444' },
            ]}>
            {isPositive ? '+' : ''}{coin.percent_change_24h}%
          </Text>
        </View>
        <Text variant="bodySmall" style={styles.price}>
          ${parseFloat(coin.price_usd).toLocaleString()}
        </Text>
      </Surface>
    );
  };

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium" style={styles.title}>Top Movers (24h)</Text>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="trending-up"
            size={20}
            color="#22c55e"
          />
          <Text variant="bodyMedium" style={[styles.sectionTitle, { color: '#22c55e' }]}>
            Top Gainers
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topGainers.map(renderCoin)}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="trending-down"
            size={20}
            color="#ef4444"
          />
          <Text variant="bodyMedium" style={[styles.sectionTitle, { color: '#ef4444' }]}>
            Top Losers
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topLosers.map(renderCoin)}
        </ScrollView>
      </View>
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
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    marginLeft: 8,
    fontWeight: '500',
  },
  coinCard: {
    padding: 12,
    marginRight: 12,
    borderRadius: 8,
    elevation: 2,
    minWidth: 120,
  },
  coinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  symbol: {
    fontWeight: 'bold',
  },
  change: {
    fontWeight: '500',
  },
  price: {
    opacity: 0.7,
  },
});

export default TopMoversCard;