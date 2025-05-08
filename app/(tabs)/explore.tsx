import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import CoinloreApiService from '../../services/CoinloreApiService';
import { Exchange } from '../../services/types';

export default function ExploreScreen() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExchanges();
  }, []);

  const loadExchanges = async () => {
    try {
      const service = CoinloreApiService.getInstance();
      const data = await service.getExchanges();
      setExchanges(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exchanges');
    } finally {
      setIsLoading(false);
    }
  };

  const renderExchange = ({ item }: { item: Exchange }) => (
    <View style={styles.exchangeCard}>
      <View style={styles.header}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.rank}>Rank #{item.rank}</Text>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Volume (24h)</Text>
          <Text style={styles.statValue}>
            ${parseFloat(item.volume_usd).toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Pairs</Text>
          <Text style={styles.statValue}>{item.pairs}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.confidence}>
          Confidence Score: {item.confidence_score}%
        </Text>
        <Text style={styles.country}>{item.country || 'Unknown'}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={exchanges}
        renderItem={renderExchange}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  exchangeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  rank: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  confidence: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  country: {
    fontSize: 14,
    color: '#6b7280',
  },
  error: {
    color: '#dc2626',
    fontSize: 16,
    textAlign: 'center',
  },
});