import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Surface, Text, Searchbar, useTheme } from 'react-native-paper';
import { useCrypto } from '../../contexts/CryptoContext';
import { Ticker } from '../../services/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SortModal, { SortOption } from '../../components/common/SortModal';

type SortField = 'rank' | 'price_usd' | 'percent_change_24h' | 'volume24' | 'market_cap_usd';

const sortOptions: SortOption<SortField>[] = [
  { field: 'rank', label: 'Rank' },
  { field: 'price_usd', label: 'Price' },
  { field: 'percent_change_24h', label: 'Change' },
  { field: 'volume24', label: 'Volume' },
  { field: 'market_cap_usd', label: 'Mkt Cap' },
];

const formatValue = (value: number): string => {
  if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
  if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
  if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K';
  return value.toFixed(2);
};

const Markets = () => {
  const theme = useTheme();
  const { tickers } = useCrypto();
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortAsc, setSortAsc] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTickers, setFilteredTickers] = useState<Ticker[]>([]);

  useEffect(() => {
    if (tickers) {
      setFilteredTickers(tickers);
    }
  }, [tickers]);

  const handleSort = (field: SortField) => {
    if (field !== sortField) {
      setSortField(field);
    }
  };

  const handleDirectionChange = () => {
    setSortAsc(!sortAsc);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredTickers(tickers || []);
    } else {
      const lowercaseQuery = query.toLowerCase();
      const filtered = (tickers || []).filter(
        (coin) =>
          coin.name.toLowerCase().includes(lowercaseQuery) ||
          coin.symbol.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredTickers(filtered);
    }
  };

  const sortedTickers = [...filteredTickers].sort((a, b) => {
    const multiplier = sortAsc ? 1 : -1;
    const aValue = parseFloat(a[sortField] as string) || 0;
    const bValue = parseFloat(b[sortField] as string) || 0;
    return (aValue - bValue) * multiplier;
  });

  const renderCoin = ({ item }: { item: Ticker }) => {
    const priceChange = parseFloat(item.percent_change_24h);
    const isPositive = priceChange >= 0;

    return (
      <Surface style={styles.coinCard}>
        <View style={styles.coinHeader}>
          <View style={styles.coinInfo}>
            <View style={styles.rankContainer}>
              <Text style={styles.rank}>{item.rank}</Text>
            </View>
            <View>
              <Text variant="titleMedium" style={styles.symbol}>{item.symbol}</Text>
                <Text variant="bodySmall" style={styles.name} numberOfLines={1}>{item.name}</Text>
            </View>
          </View>
          <View style={styles.priceInfo}>
            <Text variant="titleMedium" style={styles.price}>
              ${Number(parseFloat(item.price_usd)).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6
              })}
            </Text>
            <View style={[styles.changeContainer, { backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)' }]}>
              <MaterialCommunityIcons 
                name={isPositive ? "trending-up" : "trending-down"} 
                size={12} 
                color={isPositive ? '#22c55e' : '#ef4444'} 
                style={{ marginRight: 4 }}
              />
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
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <MaterialCommunityIcons 
              name="chart-pie" 
              size={16} 
              color="#60A5FA" 
              style={styles.statIcon}
            />
            <Text variant="bodySmall" style={styles.statLabel}>Mkt Cap</Text>
            <Text variant="bodySmall" style={styles.statValue}>
              ${formatValue(parseFloat(item.market_cap_usd))}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <MaterialCommunityIcons 
              name="chart-bar" 
              size={16} 
              color="#60A5FA" 
              style={styles.statIcon}
            />
            <Text variant="bodySmall" style={styles.statLabel}>Volume (24h)</Text>
            <Text variant="bodySmall" style={styles.statValue}>
              ${formatValue(parseFloat(item.volume24))}
            </Text>
          </View>
        </View>
      </Surface>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Search coins..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={[styles.searchBar, { 
          backgroundColor: '#1E293B',
          borderRadius: 12,
        }]}
        icon="magnify"
        iconColor={theme.colors.primary}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />

      <SortModal
        sortOptions={sortOptions}
        currentSortField={sortField}
        isAscending={sortAsc}
        onSortChange={handleSort}
        onDirectionChange={handleDirectionChange}
      />

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
    marginBottom: 8,
    elevation: 3,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  list: {
    padding: 8,
  },
  coinCard: {
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 16,
    elevation: 0,
    backgroundColor: '#1E293B',
  },
  coinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  coinInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankContainer: {
    backgroundColor: '#60A5FA',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  rank: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  symbol: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  name: {
    color: '#94A3B8',
    maxWidth: 120,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  change: {
    fontWeight: '500',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 12,
    marginTop: 12,
    backgroundColor: 'transparent',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 4,
  },
  statLabel: {
    color: '#94A3B8',
    marginBottom: 4,
    fontSize: 11,
  },
  statValue: {
    fontWeight: '500',
    color: '#FFFFFF',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#374151',
    alignSelf: 'center',
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