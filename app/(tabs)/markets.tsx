import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Surface, Text, Searchbar, useTheme, Chip } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useCrypto } from '../../contexts/CryptoContext';
import { Ticker } from '../../services/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type SortField = 'rank' | 'price_usd' | 'percent_change_24h' | 'volume24' | 'market_cap_usd';

const Markets = () => {
  const theme = useTheme();
  const { tickers, searchCoins } = useCrypto();
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortAsc, setSortAsc] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedTickers = [...(tickers || [])].sort((a, b) => {
    const multiplier = sortAsc ? 1 : -1;
    const aValue = parseFloat(a[sortField] as string) || 0;
    const bValue = parseFloat(b[sortField] as string) || 0;
    return (aValue - bValue) * multiplier;
  });

  const renderCoin = ({ item }: { item: Ticker }) => {
    const priceChange = parseFloat(item.percent_change_24h);
    const isPositive = priceChange >= 0;

    return (
      <Surface style={[styles.coinCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.coinHeader}>
          <View style={styles.coinInfo}>
            <Text variant="titleMedium" style={styles.symbol}>{item.symbol}</Text>
            <Text variant="bodySmall" style={styles.name}>{item.name}</Text>
          </View>
          <View style={styles.priceInfo}>
            <Text variant="titleMedium" style={styles.price}>
              ${parseFloat(item.price_usd).toLocaleString()}
            </Text>
            <Text
              variant="bodySmall"
              style={[
                styles.change,
                { color: isPositive ? '#22c55e' : '#ef4444' },
              ]}>
              {isPositive ? '+' : ''}{item.percent_change_24h}%
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text variant="bodySmall" style={styles.statLabel}>Market Cap</Text>
            <Text variant="bodyMedium" style={styles.statValue}>
              ${parseFloat(item.market_cap_usd).toLocaleString()}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text variant="bodySmall" style={styles.statLabel}>Volume (24h)</Text>
            <Text variant="bodyMedium" style={styles.statValue}>
              ${parseFloat(item.volume24).toLocaleString()}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text variant="bodySmall" style={styles.statLabel}>Rank</Text>
            <Text variant="bodyMedium" style={styles.statValue}>#{item.rank}</Text>
          </View>
        </View>
      </Surface>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Search coins..."
        onChangeText={query => {
          setSearchQuery(query);
          searchCoins(query);
        }}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={sortField === 'rank'}
            onPress={() => handleSort('rank')}
            style={styles.chip}>
            Rank {sortField === 'rank' && (sortAsc ? '↑' : '↓')}
          </Chip>
          <Chip
            selected={sortField === 'price_usd'}
            onPress={() => handleSort('price_usd')}
            style={styles.chip}>
            Price {sortField === 'price_usd' && (sortAsc ? '↑' : '↓')}
          </Chip>
          <Chip
            selected={sortField === 'percent_change_24h'}
            onPress={() => handleSort('percent_change_24h')}
            style={styles.chip}>
            Change {sortField === 'percent_change_24h' && (sortAsc ? '↑' : '↓')}
          </Chip>
          <Chip
            selected={sortField === 'volume24'}
            onPress={() => handleSort('volume24')}
            style={styles.chip}>
            Volume {sortField === 'volume24' && (sortAsc ? '↑' : '↓')}
          </Chip>
          <Chip
            selected={sortField === 'market_cap_usd'}
            onPress={() => handleSort('market_cap_usd')}
            style={styles.chip}>
            Market Cap {sortField === 'market_cap_usd' && (sortAsc ? '↑' : '↓')}
          </Chip>
        </ScrollView>
      </View>

      <FlatList
        data={sortedTickers}
        renderItem={renderCoin}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={48}
              color={theme.colors.secondary}
            />
            <Text variant="bodyLarge" style={styles.emptyText}>
              No coins found
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
    elevation: 4,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
  },
  list: {
    padding: 16,
  },
  coinCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  coinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  coinInfo: {
    flex: 1,
  },
  symbol: {
    fontWeight: 'bold',
  },
  name: {
    opacity: 0.7,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontWeight: 'bold',
  },
  change: {
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    marginTop: 12,
    opacity: 0.7,
  },
});

export default Markets;