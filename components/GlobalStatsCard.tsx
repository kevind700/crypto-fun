import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlobalData } from '../services/types';

interface GlobalStatsCardProps {
  globalData: GlobalData | null;
}

const formatNumber = (num?: number) => {
  if (!num) return '0';
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  return num.toLocaleString();
};

const GlobalStatsCard: React.FC<GlobalStatsCardProps> = ({ globalData }) => {
  const theme = useTheme();

  const stats = [
    {
      icon: 'bitcoin',
      label: 'BTC Dominance',
      value: `${globalData?.btc_d}%`,
      color: '#F7931A',
    },
    {
      icon: 'ethereum',
      label: 'ETH Dominance',
      value: `${globalData?.eth_d}%`,
      color: '#627EEA',
    },
    {
      icon: 'chart-box',
      label: 'Active Markets',
      value: formatNumber(globalData?.active_markets),
      color: theme.colors.primary,
    },
    {
      icon: 'coin',
      label: 'Total Coins',
      value: formatNumber(globalData?.coins_count),
      color: theme.colors.secondary,
    },
  ];

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium" style={styles.title}>Global Statistics</Text>
      
      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <Surface
            key={index}
            style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <MaterialCommunityIcons
              name={stat.icon as any}
              size={24}
              color={stat.color}
              style={styles.icon}
            />
            <Text variant="bodyMedium" style={styles.label}>
              {stat.label}
            </Text>
            <Text variant="titleMedium" style={styles.value}>
              {stat.value}
            </Text>
          </Surface>
        ))}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    margin: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  icon: {
    marginBottom: 8,
  },
  label: {
    opacity: 0.7,
    marginBottom: 4,
  },
  value: {
    fontWeight: 'bold',
  },
});

export default GlobalStatsCard;