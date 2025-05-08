import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Searchbar, Surface, Text, useTheme } from 'react-native-paper';
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
    
    // Calcular cambios porcentuales
    const change1h = parseFloat(item.percent_change_1h);
    const change7d = parseFloat(item.percent_change_7d);
    const isPositive1h = change1h >= 0;
    const isPositive7d = change7d >= 0;
    
    // Calcular supply y circulating supply
    const currentSupply = parseFloat(item.csupply);
    const totalSupply = item.tsupply ? parseFloat(item.tsupply) : 0;
    const maxSupply = item.msupply ? parseFloat(item.msupply) : 0;
    
    // Calcular porcentaje de suministro en circulación
    const supplyPercentage = totalSupply > 0 ? (currentSupply / totalSupply) * 100 : 0;

    const handleCoinPress = () => {
      router.push({
        pathname: "/coin-detail",
        params: { id: item.id }
      });
    };

    return (
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

          <View style={styles.timeframeContainer}>
            <View style={styles.timeframe}>
              <Text variant="bodySmall" style={styles.timeframeLabel}>1h</Text>
              <View style={[styles.timeframeValue, { backgroundColor: isPositive1h ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                <Text style={[styles.timeframeText, { color: isPositive1h ? '#22c55e' : '#ef4444' }]}>
                  {isPositive1h ? '+' : ''}{item.percent_change_1h}%
                </Text>
              </View>
            </View>
            <View style={styles.timeframe}>
              <Text variant="bodySmall" style={styles.timeframeLabel}>24h</Text>
              <View style={[styles.timeframeValue, { backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                <Text style={[styles.timeframeText, { color: isPositive ? '#22c55e' : '#ef4444' }]}>
                  {isPositive ? '+' : ''}{item.percent_change_24h}%
                </Text>
              </View>
            </View>
            <View style={styles.timeframe}>
              <Text variant="bodySmall" style={styles.timeframeLabel}>7d</Text>
              <View style={[styles.timeframeValue, { backgroundColor: isPositive7d ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                <Text style={[styles.timeframeText, { color: isPositive7d ? '#22c55e' : '#ef4444' }]}>
                  {isPositive7d ? '+' : ''}{item.percent_change_7d}%
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

          {totalSupply > 0 && (
            <View style={styles.supplyContainer}>
              <View style={styles.supplyInfo}>
                <Text variant="bodySmall" style={styles.supplyLabel}>
                  Supply: {formatValue(currentSupply)} {item.symbol}
                </Text>
                {maxSupply > 0 && (
                  <Text variant="bodySmall" style={styles.supplyMax}>
                    Max: {formatValue(maxSupply)}
                  </Text>
                )}
              </View>
              <View style={styles.supplyBarContainer}>
                <View style={[styles.supplyBar, { width: `${supplyPercentage}%` }]} />
              </View>
              <Text variant="bodySmall" style={styles.supplyPercentage}>
                {supplyPercentage.toFixed(1)}%
              </Text>
            </View>
          )}

          <View style={styles.priceConversion}>
            <View style={styles.priceConverted}>
              <MaterialCommunityIcons 
                name="bitcoin" 
                size={14} 
                color="#F7931A" 
                style={{ marginRight: 4 }}
              />
              <Text variant="bodySmall" style={styles.btcPrice}>
                {parseFloat(item.price_btc).toFixed(8)} BTC
              </Text>
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
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
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  timeframe: {
    alignItems: 'center',
    flex: 1,
  },
  timeframeLabel: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 4,
  },
  timeframeValue: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 65,
    alignItems: 'center',
  },
  timeframeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  supplyContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  supplyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  supplyLabel: {
    color: '#94A3B8',
    fontSize: 11,
  },
  supplyMax: {
    color: '#94A3B8',
    fontSize: 11,
  },
  supplyBarContainer: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 4,
  },
  supplyBar: {
    height: '100%',
    backgroundColor: '#60A5FA',
    borderRadius: 3,
  },
  supplyPercentage: {
    color: '#94A3B8',
    fontSize: 10,
    textAlign: 'right',
  },
  priceConversion: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  priceConverted: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btcPrice: {
    color: '#94A3B8',
    fontSize: 11,
  },
});

export default Markets;