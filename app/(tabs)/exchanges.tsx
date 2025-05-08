import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Linking } from 'react-native';
import { Surface, Text, Searchbar, useTheme, TouchableRipple, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CoinloreApiService from '../../services/CoinloreApiService';
import { Exchange } from '../../services/types';
import SortModal, { SortOption } from '../../components/common/SortModal';

type SortField = 'rank' | 'volume_usd' | 'active_pairs';

const sortOptions: SortOption<SortField>[] = [
  { field: 'volume_usd', label: 'Volume' },
  { field: 'active_pairs', label: 'Pairs' },
];

const formatVolume = (volume: string) => {
  const value = parseFloat(volume);
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

const Exchanges = () => {
  const theme = useTheme();
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('volume_usd');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    loadExchanges();
  }, []);

  const loadExchanges = async () => {
    try {
      const service = CoinloreApiService.getInstance();
      const data = await service.getExchanges();
      const exchangesArray = Object.values(data || {});
      setExchanges(exchangesArray);
    } catch (error) {
      console.error('Failed to load exchanges:', error);
      setExchanges([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (field !== sortField) {
      setSortField(field);
    }
  };

  const handleDirectionChange = () => {
    setSortAsc(!sortAsc);
  };

  const filteredExchanges = exchanges.filter(exchange =>
    exchange.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedExchanges = [...filteredExchanges].sort((a, b) => {
    const multiplier = sortAsc ? 1 : -1;
    const aValue = parseFloat(a[sortField] as string) || 0;
    const bValue = parseFloat(b[sortField] as string) || 0;
    return (aValue - bValue) * multiplier;
  });

  const renderExchange = ({ item }: { item: Exchange }) => {
    const volume = formatVolume(item.volume_usd);
    const pairs = `${item.active_pairs}`;

    return (
      <TouchableRipple onPress={() => Linking.openURL(item.url)}>
        <Surface style={styles.exchangeCard}>
          <View style={styles.exchangeHeader}>
            <View style={styles.exchangeInfo}>
              <Text variant="titleLarge" style={styles.name}>
                {item.name}
              </Text>
              <View style={styles.locationContainer}>
                <MaterialCommunityIcons 
                  name="map-marker" 
                  size={14} 
                  color="#94A3B8" 
                  style={styles.locationIcon}
                />
                <Text variant="labelMedium" style={styles.locationText}>
                  {item.country || 'Unknown location'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <MaterialCommunityIcons 
                name="chart-line" 
                size={20} 
                color="#60A5FA"
              />
              <Text variant="titleMedium" style={styles.statValue}>
                {volume}
              </Text>
              <Text variant="labelSmall" style={styles.statLabel}>Volume (24h)</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <MaterialCommunityIcons 
                name="swap-horizontal" 
                size={20} 
                color="#60A5FA"
              />
              <Text variant="titleMedium" style={styles.statValue}>
                {Number(pairs).toLocaleString()}
              </Text>
              <Text variant="labelSmall" style={styles.statLabel}>Active Pairs</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <MaterialCommunityIcons 
              name="open-in-new" 
              size={16} 
              color="#60A5FA"
            />
            <Text variant="labelMedium" style={styles.visitText}>
              Visit Exchange
            </Text>
          </View>
        </Surface>
      </TouchableRipple>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Search exchanges..."
        onChangeText={setSearchQuery}
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
        data={sortedExchanges}
        renderItem={renderExchange}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={loadExchanges}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={48}
              color={theme.colors.error}
            />
            <Text variant="titleMedium" style={[styles.emptyText, { color: theme.colors.error }]}>
              No exchanges found
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
    padding: 16,
  },
  exchangeCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
  },
  exchangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  exchangeInfo: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    color: '#60A5FA',
    fontSize: 18,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    color: '#94A3B8',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#161E2E',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#374151',
  },
  statLabel: {
    color: '#94A3B8',
    marginTop: 4,
  },
  statValue: {
    fontWeight: '600',
    marginTop: 4,
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 12,
    gap: 6,
  },
  visitText: {
    color: '#60A5FA',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    marginTop: 12,
  },
});

export default Exchanges;