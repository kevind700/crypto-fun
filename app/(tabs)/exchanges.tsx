import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Linking } from 'react-native';
import { Surface, Text, Searchbar, useTheme, Button, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import CoinloreApiService from '../../services/CoinloreApiService';
import { Exchange } from '../../services/types';

type SortField = 'rank' | 'volume_usd' | 'active_pairs' | 'confidence_score';

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
      setExchanges(data);
    } catch (error) {
      console.error('Failed to load exchanges:', error);
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
    const confidence = parseFloat(item.confidence_score);
    const confidenceColor = confidence >= 8 ? '#22c55e' :
      confidence >= 6 ? '#f59e0b' : '#ef4444';

    return (
      <Surface style={[styles.exchangeCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.exchangeHeader}>
          <View style={styles.exchangeInfo}>
            <Text variant="titleMedium" style={styles.name}>{item.name}</Text>
            <Text variant="bodySmall" style={styles.country}>{item.country || 'Unknown location'}</Text>
          </View>
          <Chip icon="shield-check" style={{ backgroundColor: confidenceColor }}>
            <Text style={{ color: theme.colors.surface }}>{item.confidence_score}%</Text>
          </Chip>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text variant="bodySmall" style={styles.statLabel}>Volume (24h)</Text>
            <Text variant="bodyMedium" style={styles.statValue}>
              ${parseFloat(item.volume_usd).toLocaleString()}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text variant="bodySmall" style={styles.statLabel}>Active Pairs</Text>
            <Text variant="bodyMedium" style={styles.statValue}>
              {item.active_pairs}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text variant="bodySmall" style={styles.statLabel}>Rank</Text>
            <Text variant="bodyMedium" style={styles.statValue}>#{item.rank}</Text>
          </View>
        </View>

        <Button
          mode="outlined"
          icon="open-in-new"
          onPress={() => Linking.openURL(item.url)}
          style={styles.button}>
          Visit Exchange
        </Button>
      </Surface>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Search exchanges..."
        onChangeText={setSearchQuery}
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
            selected={sortField === 'volume_usd'}
            onPress={() => handleSort('volume_usd')}
            style={styles.chip}>
            Volume {sortField === 'volume_usd' && (sortAsc ? '↑' : '↓')}
          </Chip>
          <Chip
            selected={sortField === 'active_pairs'}
            onPress={() => handleSort('active_pairs')}
            style={styles.chip}>
            Pairs {sortField === 'active_pairs' && (sortAsc ? '↑' : '↓')}
          </Chip>
          <Chip
            selected={sortField === 'confidence_score'}
            onPress={() => handleSort('confidence_score')}
            style={styles.chip}>
            Confidence {sortField === 'confidence_score' && (sortAsc ? '↑' : '↓')}
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
              color={theme.colors.secondary}
            />
            <Text variant="bodyLarge" style={styles.emptyText}>
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
  exchangeCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  exchangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  exchangeInfo: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  country: {
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingVertical: 12,
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
  button: {
    marginTop: 8,
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

export default Exchanges;