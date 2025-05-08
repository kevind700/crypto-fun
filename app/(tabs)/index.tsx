import React from 'react';
import { ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useTheme, Surface, Text } from 'react-native-paper';
import { useCrypto } from '../../contexts/CryptoContext';
import MarketChart from '../../components/charts/MarketChart';
import DonutChart from '../../components/charts/DonutChart';
// Component implementations inline since files don't exist yet
const MarketMetricsCard = ({ mcap, volume, mcapChange }: any) => {
  const theme = useTheme();
  return (
    <Surface style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium" style={styles.cardTitle}>Market Metrics</Text>
      <Text>Market Cap: ${mcap?.toLocaleString()}</Text>
      <Text>Volume: ${volume?.toLocaleString()}</Text>
      <Text>Change: {mcapChange}%</Text>
    </Surface>
  );
};

const TopMoversCard = ({ tickers }: any) => {
  const theme = useTheme();
  return (
    <Surface style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium" style={styles.cardTitle}>Top Movers</Text>
      {tickers?.slice(0, 5).map((ticker: any) => (
        <Text key={ticker.id}>{ticker.name}: {ticker.percent_change_24h}%</Text>
      ))}
    </Surface>
  );
};

const GlobalStatsCard = ({ globalData }: any) => {
  const theme = useTheme();
  return (
    <Surface style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium" style={styles.cardTitle}>Global Stats</Text>
      <Text>BTC Dominance: {globalData?.btc_d}%</Text>
      <Text>ETH Dominance: {globalData?.eth_d}%</Text>
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
    >
      <GlobalStatsCard globalData={globalData} />
      
      <Surface style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
        <Text variant="titleMedium" style={styles.cardTitle}>Market Dominance</Text>
        <DonutChart data={dominanceData} />
      </Surface>

      <TopMoversCard tickers={tickers} />
      
      <MarketMetricsCard
        mcap={globalData?.total_mcap}
        volume={globalData?.total_volume}
        mcapChange={globalData?.mcap_change}
      />

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
        />
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chartCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
});