import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { Surface } from 'react-native-paper';
import { GlobalData } from '../services/types';
import { formatLargeNumber } from '../utils/formatters';
import { styles } from './GlobalStatsCard.styles';

interface GlobalStatsCardProps {
  data: GlobalData;
}

const GlobalStatsCard: React.FC<GlobalStatsCardProps> = ({ data }) => {
  return (
    <Surface style={styles.container}>
      <Text style={styles.title}>Resumen del Mercado</Text>
      <View style={styles.statsGrid}>
        <StatItem 
          label="Capitalización"
          value={`$${formatLargeNumber(data.total_mcap)}`}
        />
        <StatItem 
          label="Volumen 24h"
          value={`$${formatLargeNumber(data.total_volume)}`}
        />
        <StatItem 
          label="Dominancia BTC"
          value={`${data.btc_d}%`}
        />
        <StatItem 
          label="Monedas"
          value={formatLargeNumber(data.coins_count)}
        />
      </View>
    </Surface>
  );
};

interface StatItemProps {
  label: string;
  value: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

export default memo(GlobalStatsCard);