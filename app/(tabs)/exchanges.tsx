import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, Linking, StyleSheet, View } from 'react-native';
import { Searchbar, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import SortModal, { SortOption } from '../../components/common/SortModal';
import CoinloreApiService from '../../services/CoinloreApiService';
import { Exchange } from '../../services/types';

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
      <View style={styles.headerContainer}>
        <View style={styles.headerControls}>
          <Searchbar
            placeholder="Search exchanges..."
            onChangeText={setSearchQuery}
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
        
        {sortedExchanges.length > 0 && (
          <View style={styles.sortInfoContainer}>
            <Text style={styles.sortInfoText}>
              Sorting by: {sortOptions.find(option => option.field === sortField)?.label || 'Volume'} 
              {sortAsc ? ' (Ascending)' : ' (Descending)'}
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={sortedExchanges}
        renderItem={renderExchange}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
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
    padding: 16,
    paddingBottom: 24,
  },
  exchangeCard: {
    marginBottom: 12,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.1)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
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
    backgroundColor: 'rgba(22, 30, 46, 0.7)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(55, 65, 81, 0.3)',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(55, 65, 81, 0.4)',
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
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(55, 65, 81, 0.2)',
  },
  visitText: {
    color: '#60A5FA',
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
  },
});

export default Exchanges;