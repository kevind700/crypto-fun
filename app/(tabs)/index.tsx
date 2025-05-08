import React from 'react';
import { ScrollView, RefreshControl, StyleSheet, View, Dimensions } from 'react-native';
import { useTheme, Surface, Text } from 'react-native-paper';
import { useCrypto } from '../../contexts/CryptoContext';
import MarketChart from '../../components/charts/MarketChart';
import DonutChart from '../../components/charts/DonutChart';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Component implementations inline since files don't exist yet
const MarketMetricsCard = ({ mcap, volume, mcapChange }: any) => {
  const theme = useTheme();
  const isPositive = parseFloat(mcapChange || '0') >= 0;
  
  // Format large numbers
  const formatNumber = (num: number | undefined) => {
    if (!num) return '$0';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };
  
  return (
    <Surface style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium" style={styles.cardTitle}>Market Metrics</Text>
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <MaterialCommunityIcons name="chart-line" size={20} color={theme.colors.primary} />
          <Text style={styles.metricLabel}>Market Cap</Text>
          <Text style={styles.metricValue}>{formatNumber(mcap)}</Text>
        </View>
        
        <View style={styles.metricItem}>
          <MaterialCommunityIcons name="chart-bar" size={20} color={theme.colors.primary} />
          <Text style={styles.metricLabel}>Volume (24h)</Text>
          <Text style={styles.metricValue}>{formatNumber(volume)}</Text>
        </View>
        
        <View style={styles.metricItem}>
          <MaterialCommunityIcons 
            name={isPositive ? "trending-up" : "trending-down"} 
            size={20} 
            color={isPositive ? '#22c55e' : '#ef4444'} 
          />
          <Text style={styles.metricLabel}>Change</Text>
          <Text style={[styles.metricValue, { color: isPositive ? '#22c55e' : '#ef4444' }]}>
            {isPositive ? '+' : ''}{mcapChange}%
          </Text>
        </View>
      </View>
    </Surface>
  );
};

const TopMoversCard = ({ tickers }: any) => {
  const theme = useTheme();
  return (
    <Surface style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium" style={styles.cardTitle}>Top Movers</Text>
      <View style={styles.moversContainer}>
        {tickers?.slice(0, 5).map((ticker: any) => {
          const isPositive = parseFloat(ticker.percent_change_24h) >= 0;
          return (
            <View key={ticker.id} style={styles.moverItem}>
              <View style={styles.moverHeader}>
                <Text style={styles.moverSymbol}>{ticker.symbol}</Text>
                <Text 
                  style={[
                    styles.moverChange, 
                    {color: isPositive ? '#22c55e' : '#ef4444'}
                  ]}
                >
                  {isPositive ? '+' : ''}{ticker.percent_change_24h}%
                </Text>
              </View>
              <Text style={styles.moverName} numberOfLines={1}>{ticker.name}</Text>
            </View>
          );
        })}
      </View>
    </Surface>
  );
};

const GlobalStatsCard = ({ globalData }: any) => {
  const theme = useTheme();
  return (
    <Surface style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium" style={styles.cardTitle}>Global Stats</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="bitcoin" size={20} color="#F7931A" />
          <Text style={styles.statLabel}>BTC Dominance</Text>
          <Text style={styles.statValue}>{globalData?.btc_d}%</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="ethereum" size={20} color="#627EEA" />
          <Text style={styles.statLabel}>ETH Dominance</Text>
          <Text style={styles.statValue}>{globalData?.eth_d}%</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="trending-up" size={20} color={theme.colors.primary} />
          <Text style={styles.statLabel}>Active Markets</Text>
          <Text style={styles.statValue}>{globalData?.active_markets}</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="currency-usd" size={20} color={theme.colors.primary} />
          <Text style={styles.statLabel}>Total Coins</Text>
          <Text style={styles.statValue}>{globalData?.coins_count}</Text>
        </View>
      </View>
    </Surface>
  );
};

export default function OverviewScreen() {
  const theme = useTheme();
  const {
    globalData,
    tickers,
    isLoading,
    refreshData,
  } = useCrypto();

  const dominanceData = [
    { value: parseFloat(globalData?.btc_d || '0'), color: '#F7931A', label: 'BTC' },
    { value: parseFloat(globalData?.eth_d || '0'), color: '#627EEA', label: 'ETH' },
    {
      value: 100 - parseFloat(globalData?.btc_d || '0') - parseFloat(globalData?.eth_d || '0'),
      color: theme.colors.primary.toString(),
      label: 'Others',
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <GlobalStatsCard globalData={globalData} />
      
      <MarketMetricsCard
        mcap={globalData?.total_mcap}
        volume={globalData?.total_volume}
        mcapChange={globalData?.mcap_change}
      />
      
      <Surface style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
        <Text variant="titleMedium" style={styles.cardTitle}>Market Dominance</Text>
        <DonutChart 
          data={dominanceData} 
          height={180}
          width={Dimensions.get('window').width - 32}
        />
      </Surface>

      <TopMoversCard tickers={tickers} />

      <Surface style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
        <Text variant="titleMedium" style={styles.cardTitle}>Market Overview</Text>
        <MarketChart
          data={{
            labels: ['1D', '7D', '1M', '3M', '6M', '1Y'],
            datasets: [{
              data: [
                Number(parseFloat(String(globalData?.total_mcap || '0'))),
                Number(parseFloat(String(globalData?.total_volume || '0'))),
              ],
            }],
          }}
          height={180}
        />
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  chartCard: {
    margin: 8,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
    fontSize: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  metricItem: {
    flexBasis: '30%',
    alignItems: 'center',
    padding: 8,
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  moversContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moverItem: {
    width: '48%',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  moverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  moverSymbol: {
    fontWeight: 'bold',
  },
  moverName: {
    fontSize: 12,
    opacity: 0.7,
  },
  moverChange: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});