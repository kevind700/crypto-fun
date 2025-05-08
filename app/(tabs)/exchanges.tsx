import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo, useEffect, useState } from 'react';
import { FlatList, Linking, View } from 'react-native';
import { Searchbar, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import SortModal, { SortOption } from '../../components/common/SortModal';
import CoinloreApiService from '../../services/CoinloreApiService';
import { Exchange } from '../../services/types';
import { styles } from './styles/exchanges.styles';
import { formatVolume } from './utils/formatters';

type SortField = 'rank' | 'volume_usd' | 'active_pairs';

const sortOptions: SortOption<SortField>[] = [
  { field: 'volume_usd', label: 'Volume' },
  { field: 'active_pairs', label: 'Pairs' },
];

const ExchangeItem = memo(({ item }: { item: Exchange }) => {
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
});

const EmptyListComponent = memo(() => {
  const theme = useTheme();
  return (
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
  );
});

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

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <View style={styles.headerContainer}>
        <View style={styles.headerControls}>
          <Searchbar
            placeholder="Search exchanges..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchBar, { 
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              borderRadius: 20,
              elevation: 0,
              height: 44,
              borderWidth: 1,
              borderColor: 'rgba(96, 165, 250, 0.2)',
            }]}
            icon="magnify"
            iconColor="#60A5FA"
            inputStyle={{ 
              color: '#FFFFFF', 
              fontSize: 14,
              alignSelf: 'center',
              marginLeft: -5
            }}
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
        renderItem={({ item }) => <ExchangeItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadExchanges}
        ListEmptyComponent={<EmptyListComponent />}
      />
    </SafeAreaView>
  );
};

export default memo(Exchanges);