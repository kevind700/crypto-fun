import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Searchbar, Surface, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import SortModal, { SortOption } from '../../components/common/SortModal';
import { useCrypto } from '../../contexts/CryptoContext';
import { Ticker } from '../../services/types';

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
    
    const handleCoinPress = () => {
      router.push({
        pathname: "/coin-detail",
        params: { id: item.id }
      });
    };

    return (
      <Animated.View entering={FadeInDown.duration(400).delay(Number(item.rank) * 20).springify()}>
        <TouchableOpacity onPress={handleCoinPress}>
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
                <View style={[styles.changeContainer, { 
                  backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  borderWidth: 1,
                  borderColor: isPositive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                }]}>
                  <MaterialCommunityIcons 
                    name={isPositive ? "trending-up" : "trending-down"} 
                    size={14} 
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
                <View style={styles.statTextContainer}>
                  <Text style={styles.statLabel}>Mkt Cap</Text>
                  <Text variant="bodySmall" style={styles.statValue}>
                    ${formatValue(parseFloat(item.market_cap_usd))}
                  </Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <MaterialCommunityIcons 
                  name="chart-bar" 
                  size={16} 
                  color="#60A5FA" 
                  style={styles.statIcon}
                />
                <View style={styles.statTextContainer}>
                  <Text style={styles.statLabel}>Vol 24h</Text>
                  <Text variant="bodySmall" style={styles.statValue}>
                    ${formatValue(parseFloat(item.volume24))}
                  </Text>
                </View>
              </View>
            </View>
          </Surface>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerContainer}>
        <View style={styles.headerControls}>
          <Searchbar
            placeholder="Search coins..."
            onChangeText={handleSearch}
            value={searchQuery}
            style={[styles.searchBar, { 
              backgroundColor: '#1E293B',
              borderRadius: 18,
            }]}
            icon="magnify"
            iconColor="#60A5FA"
            inputStyle={{ color: '#FFFFFF', fontSize: 15 }}
            placeholderTextColor="rgba(148, 163, 184, 0.8)"
          />
          
          <SortModal
            sortOptions={sortOptions}
            currentSortField={sortField}
            isAscending={sortAsc}
            onSortChange={handleSort}
            onDirectionChange={handleDirectionChange}
          />
        </View>
        
        {sortedTickers.length > 0 && (
          <View style={styles.sortInfoContainer}>
            <Text style={styles.sortInfoText}>
              Sorting by: {sortOptions.find(option => option.field === sortField)?.label || 'Rank'} 
              {sortAsc ? ' (Ascending)' : ' (Descending)'}
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={sortedTickers}
        renderItem={renderCoin}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={15}
        windowSize={5}
        removeClippedSubviews={true}
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
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    marginRight: 10,
    height: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.15)',
  },
  list: {
    padding: 8,
    paddingBottom: 24,
    paddingHorizontal: 10,
  },
  coinCard: {
    padding: 14,
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 18,
    elevation: 2,
    backgroundColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.1)',
  },
  coinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  coinInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankContainer: {
    backgroundColor: 'rgba(96, 165, 250, 0.15)',
    borderRadius: 10,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.25)',
  },
  rank: {
    fontSize: 12,
    color: '#60A5FA',
    fontWeight: 'bold',
  },
  symbol: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 17,
  },
  name: {
    color: '#94A3B8',
    maxWidth: 150,
    marginTop: 3,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 17,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 5,
  },
  change: {
    fontWeight: '600',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(55, 65, 81, 0.3)',
    backgroundColor: 'transparent',
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    marginRight: 6,
  },
  statTextContainer: {
    alignItems: 'flex-start',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 10,
    marginBottom: 2,
  },
  statValue: {
    fontWeight: '600',
    color: '#FFFFFF',
    fontSize: 13,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    alignSelf: 'center',
    marginHorizontal: 8,
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
  sortInfoContainer: {
    marginTop: 8,
    marginBottom: 2,
  },
  sortInfoText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Markets;