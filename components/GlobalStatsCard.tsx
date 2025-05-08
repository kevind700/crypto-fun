/**
 * GlobalStatsCard Component
 * 
 * This component displays a summary of global cryptocurrency market statistics.
 * It shows key metrics like total market capitalization, 24-hour trading volume,
 * Bitcoin dominance, and the total number of cryptocurrencies in the market.
 * 
 * The component is memoized to prevent unnecessary re-renders when parent
 * components update but the data hasn't changed.
 */

import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { Surface } from 'react-native-paper';
import { GlobalData } from '../services/types';
import { formatLargeNumber } from '../utils/formatters';
import { styles } from './GlobalStatsCard.styles';

/**
 * GlobalStatsCard component props
 * @interface GlobalStatsCardProps
 * @property {GlobalData} data - Global market data object containing market stats
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
      {/* Title for the market overview card */}
      <Text style={styles.title}>Market Overview</Text>
      
      {/* Grid layout for the market statistics */}
      <View style={styles.statsGrid}>
        {/* Market capitalization statistic */}
        <StatItem 
          label="Market Cap"
          value={`$${formatLargeNumber(data.total_mcap)}`}
        />
        
        {/* 24-hour trading volume */}
        <StatItem 
          label="24h Volume"
          value={`$${formatLargeNumber(data.total_volume)}`}
        />
        
        {/* Bitcoin dominance percentage */}
        <StatItem 
          label="BTC Dominance"
          value={`${data.btc_d}%`}
        />
        
        {/* Total number of cryptocurrencies */}
        <StatItem 
          label="Coins"
          value={formatLargeNumber(data.coins_count)}
        />
      </View>
    </Surface>
  );
};

/**
 * StatItem component props - used for individual statistic items
 * @interface StatItemProps
 * @property {string} label - Stat item label (display name)
 * @property {string} value - Stat item formatted value
 */
interface StatItemProps {
  label: string;
  value: string;
}

/**
 * StatItem component displays a single market stat with label and value
 * This is an internal component used only within GlobalStatsCard
 * @param {StatItemProps} props - Component props  
 * @returns {JSX.Element} Rendered component
 */
const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <View style={styles.statItem}>
    {/* Label for the statistic (smaller, secondary text) */}
    <Text style={styles.statLabel}>{label}</Text>
    
    {/* Value of the statistic (larger, primary text) */}
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

// Memoize the component to prevent unnecessary re-renders
export default memo(GlobalStatsCard);