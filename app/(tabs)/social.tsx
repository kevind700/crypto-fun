import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Surface, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CoinloreApiService from '../../services/CoinloreApiService';
import { SocialStats } from '../../services/types';
import { useCrypto } from '../../contexts/CryptoContext';

const SocialScreen = () => {
  const theme = useTheme();
  const { selectedCoin } = useCrypto();
  const [socialStats, setSocialStats] = useState<SocialStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCoin?.nameid) {
      loadSocialStats(selectedCoin.nameid);
    }
  }, [selectedCoin]);

  const loadSocialStats = async (coinName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const service = CoinloreApiService.getInstance();
      const stats = await service.getCoinSocialStats(coinName);
      setSocialStats(stats);
    } catch (err) {
      setError('Failed to load social statistics');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSocialMetric = (icon: string, title: string, value: number | string) => (
    <Surface style={[styles.metricCard, { backgroundColor: theme.colors.surface }]}>
      <MaterialCommunityIcons name={icon as any} size={24} color={theme.colors.primary} />
      <Text variant="titleSmall" style={styles.metricTitle}>{title}</Text>
      <Text variant="headlineSmall" style={styles.metricValue}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Text>
    </Surface>
  );

  if (!selectedCoin) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialCommunityIcons
          name="currency-btc"
          size={48}
          color={theme.colors.secondary}
          style={styles.placeholderIcon}
        />
        <Text variant="bodyLarge" style={styles.placeholderText}>
          Select a coin to view its social statistics
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={48}
          color={theme.colors.error}
        />
        <Text variant="bodyLarge" style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text variant="headlineMedium" style={styles.coinName}>
          {selectedCoin.name}
        </Text>
        <Text variant="titleMedium" style={styles.coinSymbol}>
          {selectedCoin.symbol}
        </Text>
      </Surface>

      {socialStats?.reddit && (
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Reddit Statistics</Text>
          <View style={styles.grid}>
            {renderSocialMetric('reddit', 'Subscribers', socialStats.reddit.subscribers)}
            {renderSocialMetric('account-group', 'Active Users', socialStats.reddit.active_users)}
            {renderSocialMetric('post', 'Posts/Day', socialStats.reddit.posts_per_day)}
            {renderSocialMetric('comment-text', 'Comments/Day', socialStats.reddit.comments_per_day)}
          </View>
        </View>
      )}

      {socialStats?.twitter && (
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Twitter Statistics</Text>
          <View style={styles.grid}>
            {renderSocialMetric('twitter', 'Followers', socialStats.twitter.followers)}
            {renderSocialMetric('post-outline', 'Tweets', socialStats.twitter.status_count)}
            {renderSocialMetric('star', 'Favorites', socialStats.twitter.favorites)}
            {renderSocialMetric('account-group', 'Following', socialStats.twitter.following)}
          </View>
        </View>
      )}

      {socialStats?.github && (
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>GitHub Statistics</Text>
          <View style={styles.grid}>
            {renderSocialMetric('source-fork', 'Forks', socialStats.github.forks)}
            {renderSocialMetric('star', 'Stars', socialStats.github.stars)}
            {renderSocialMetric('bug', 'Open Issues', socialStats.github.open_issues)}
            {renderSocialMetric('source-pull', 'Pull Requests', socialStats.github.open_pull_issues)}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
  },
  coinName: {
    fontWeight: 'bold',
  },
  coinSymbol: {
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -8,
  },
  metricCard: {
    padding: 16,
    margin: 8,
    borderRadius: 12,
    elevation: 2,
    alignItems: 'center',
    width: (Dimensions.get('window').width - 64) / 2,
  },
  metricTitle: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  metricValue: {
    marginTop: 4,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placeholderIcon: {
    marginBottom: 16,
  },
  placeholderText: {
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: 32,
  },
  errorText: {
    marginTop: 16,
    textAlign: 'center',
  },
});

export default SocialScreen;