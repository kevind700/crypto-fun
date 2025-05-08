import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { Surface } from 'react-native-paper';
import { GlobalData } from '../services/types';
import { formatLargeNumber } from '../utils/formatters';
import { styles } from './GlobalStatsCard.styles';

/**
 * GlobalStatsCard component props
 * @interface GlobalStatsCardProps
 * @property {GlobalData} data - Global market data object
 */
interface GlobalStatsCardProps {
  data: GlobalData;
}

/**
 * GlobalStatsCard component displays a summary of global cryptocurrency market data
 * @param {GlobalStatsCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const GlobalStatsCard: React.FC<GlobalStatsCardProps> = ({ data }) => {
  return (
    <Surface style={styles.container}>
      <Text style={styles.title}>Market Overview</Text>
      <View style={styles.statsGrid}>
        <StatItem 
          label="Market Cap"
          value={`$${formatLargeNumber(data.total_mcap)}`}
        />
        <StatItem 
          label="24h Volume"
          value={`$${formatLargeNumber(data.total_volume)}`}
        />
        <StatItem 
          label="BTC Dominance"
          value={`${data.btc_d}%`}
        />
        <StatItem 
          label="Coins"
          value={formatLargeNumber(data.coins_count)}
        />
      </View>
    </Surface>
  );
};

/**
 * StatItem component props
 * @interface StatItemProps
 * @property {string} label - Stat item label
 * @property {string} value - Stat item value
 */
interface StatItemProps {
  label: string;
  value: string;
}

/**
 * StatItem component displays a single market stat with label and value
 * @param {StatItemProps} props - Component props  
 * @returns {JSX.Element} Rendered component
 */
const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

export default memo(GlobalStatsCard);