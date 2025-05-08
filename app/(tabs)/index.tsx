import React from 'react';
import { ScrollView, RefreshControl, StyleSheet, View } from 'react-native';
import { useTheme, Surface, Text } from 'react-native-paper';
import { useCrypto } from '../../contexts/CryptoContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ticker, GlobalData } from '../../services/types';

interface TopMoversCardProps {
  tickers: Ticker[] | null;
}

const TopMoversCard: React.FC<TopMoversCardProps> = ({ tickers }) => {
  const theme = useTheme();
  return (
    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium" style={styles.cardTitle}>Top Movers</Text>
      <View style={styles.moversContainer}>
        {tickers?.slice(0, 5).map((ticker: Ticker) => {
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

interface MarketOverviewProps {
  globalData: GlobalData | null;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ globalData }) => {
  const theme = useTheme();
  
  if (!globalData) return null;
  
  const isMarketCapPositive = parseFloat(globalData.mcap_change) >= 0;
  const isVolumePositive = parseFloat(globalData.volume_change) >= 0;
  
  const formatValue = (value: number | undefined): string => {
    if (!value) return '$0';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };
  
  return (
    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium" style={styles.cardTitle}>Market Overview</Text>
      <View style={styles.metricsContainer}>
        <View style={styles.metricBox}>
          <Text variant="titleMedium" style={styles.metricTitle}>Market Cap</Text>
          <Text variant="headlineSmall" style={styles.metricValue}>
            {formatValue(globalData.total_mcap)}
          </Text>
          <View style={[
            styles.changeBadge,
            { backgroundColor: isMarketCapPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }
          ]}>
            <MaterialCommunityIcons 
              name={isMarketCapPositive ? "trending-up" : "trending-down"}
              size={16}
              color={isMarketCapPositive ? '#22c55e' : '#ef4444'}
            />
            <Text style={[
              styles.changeText,
              { color: isMarketCapPositive ? '#22c55e' : '#ef4444' }
            ]}>
              {isMarketCapPositive ? '+' : ''}{globalData.mcap_change}%
            </Text>
          </View>
        </View>

        <View style={styles.metricBox}>
          <Text variant="titleMedium" style={styles.metricTitle}>Volume 24h</Text>
          <Text variant="headlineSmall" style={styles.metricValue}>
            {formatValue(globalData.total_volume)}
          </Text>
          <View style={[
            styles.changeBadge,
            { backgroundColor: isVolumePositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }
          ]}>
            <MaterialCommunityIcons 
              name={isVolumePositive ? "trending-up" : "trending-down"}
              size={16}
              color={isVolumePositive ? '#22c55e' : '#ef4444'}
            />
            <Text style={[
              styles.changeText,
              { color: isVolumePositive ? '#22c55e' : '#ef4444' }
            ]}>
              {isVolumePositive ? '+' : ''}{globalData.volume_change}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.dominanceContainer}>
        <Text variant="titleMedium" style={styles.dominanceTitle}>Market Dominance</Text>
        <View style={styles.dominanceMetrics}>
          <View style={styles.dominanceItem}>
            <MaterialCommunityIcons name="bitcoin" size={24} color="#F7931A" />
            <Text style={styles.dominanceValue}>{globalData.btc_d}%</Text>
            <Text style={styles.dominanceLabel}>Bitcoin</Text>
          </View>
          <View style={styles.dominanceItem}>
            <MaterialCommunityIcons name="ethereum" size={24} color="#627EEA" />
            <Text style={styles.dominanceValue}>{globalData.eth_d}%</Text>
            <Text style={styles.dominanceLabel}>Ethereum</Text>
          </View>
          <View style={styles.dominanceItem}>
            <MaterialCommunityIcons name="star-outline" size={24} color="#60a5fa" />
            <Text style={styles.dominanceValue}>
              {(100 - parseFloat(globalData.btc_d || '0') - parseFloat(globalData.eth_d || '0')).toFixed(2)}%
            </Text>
            <Text style={styles.dominanceLabel}>Others</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="chart-box-outline" size={20} color="#60a5fa" />
          <Text style={styles.statValue}>{globalData.active_markets?.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Active Markets</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="currency-usd" size={20} color="#60a5fa" />
          <Text style={styles.statValue}>{globalData.coins_count?.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Coins</Text>
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Market Overview Card */}
      <MarketOverview globalData={globalData} />

      {/* Top Movers Card */}
      <TopMoversCard tickers={tickers} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  cardTitle: {
    padding: 16,
    paddingBottom: 8,
    fontWeight: '600',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  metricBox: {
    flex: 1,
    marginHorizontal: 8,
  },
  metricTitle: {
    opacity: 0.7,
    marginBottom: 4,
    fontSize: 14,
  },
  metricValue: {
    fontWeight: '600',
    marginBottom: 8,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  dominanceContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  dominanceTitle: {
    marginBottom: 16,
    opacity: 0.7,
    fontSize: 14,
  },
  dominanceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dominanceItem: {
    alignItems: 'center',
  },
  dominanceValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  dominanceLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    opacity: 0.1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  moversContainer: {
    padding: 16,
  },
  moverItem: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  moverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  moverSymbol: {
    fontWeight: '600',
    fontSize: 16,
  },
  moverChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  moverName: {
    fontSize: 12,
    opacity: 0.7,
  },
});