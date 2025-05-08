import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Linking } from 'react-native';
import { Surface, Text, Searchbar, useTheme, TouchableRipple, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import CoinloreApiService from '../../services/CoinloreApiService';
import { Exchange } from '../../services/types';

type SortField = 'rank' | 'volume_usd' | 'active_pairs';

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
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortAsc, setSortAsc] = useState(true);

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
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
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
        <Surface style={[styles.exchangeCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View style={styles.exchangeHeader}>
            <View style={styles.exchangeInfo}>
              <Text variant="titleLarge" style={[styles.name, { color: theme.colors.primary }]}>
                {item.name}
              </Text>
              <View style={styles.locationContainer}>
                <MaterialCommunityIcons 
                  name="map-marker" 
                  size={14} 
                  color={theme.colors.onSurface} 
                  style={styles.locationIcon}
                />
                <Text variant="labelMedium" style={{ color: theme.colors.onSurface }}>
                  {item.country || 'Unknown location'}
                </Text>
              </View>
            </View>
            <Chip 
              mode="flat"
              style={styles.rankChip}
              textStyle={{ color: theme.colors.background }}>
              #{item.rank}
            </Chip>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <MaterialCommunityIcons 
                name="chart-line" 
                size={20} 
                color={theme.colors.primary}
              />
              <Text variant="titleMedium" style={[styles.statValue, { color: theme.colors.primary }]}>
                {volume}
              </Text>
              <Text variant="labelSmall" style={styles.statLabel}>Volume (24h)</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.surfaceVariant }]} />
            <View style={styles.stat}>
              <MaterialCommunityIcons 
                name="swap-horizontal" 
                size={20} 
                color={theme.colors.primary}
              />
              <Text variant="titleMedium" style={[styles.statValue, { color: theme.colors.primary }]}>
                {Number(pairs).toLocaleString()}
              </Text>
              <Text variant="labelSmall" style={styles.statLabel}>Active Pairs</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <MaterialCommunityIcons 
              name="arrow-right" 
              size={20} 
              color={theme.colors.primary}
            />
            <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
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
        style={[styles.searchBar, { backgroundColor: theme.colors.surfaceVariant }]}
        iconColor={theme.colors.primary}
        placeholderTextColor={theme.colors.onSurface}
      />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={sortField === 'rank'}
            onPress={() => handleSort('rank')}
            style={styles.chip}
            textStyle={{ color: sortField === 'rank' ? theme.colors.background : theme.colors.onSurface }}>
            Rank {sortField === 'rank' && (sortAsc ? '↑' : '↓')}
          </Chip>
          <Chip
            selected={sortField === 'volume_usd'}
            onPress={() => handleSort('volume_usd')}
            style={styles.chip}
            textStyle={{ color: sortField === 'volume_usd' ? theme.colors.background : theme.colors.onSurface }}>
            Volume {sortField === 'volume_usd' && (sortAsc ? '↑' : '↓')}
          </Chip>
          <Chip
            selected={sortField === 'active_pairs'}
            onPress={() => handleSort('active_pairs')}
            style={styles.chip}
            textStyle={{ color: sortField === 'active_pairs' ? theme.colors.background : theme.colors.onSurface }}>
            Pairs {sortField === 'active_pairs' && (sortAsc ? '↑' : '↓')}
          </Chip>
        </ScrollView>
      </View>

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
    elevation: 4,
    borderRadius: 12,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
    borderRadius: 8,
  },
  list: {
    padding: 16,
  },
  exchangeCard: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
    overflow: 'hidden',
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
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationIcon: {
    marginRight: 4,
  },
  rankChip: {
    backgroundColor: '#60a5fa',
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
    opacity: 0.1,
  },
  statLabel: {
    opacity: 0.7,
    marginTop: 4,
  },
  statValue: {
    fontWeight: '600',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 12,
    gap: 8,
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