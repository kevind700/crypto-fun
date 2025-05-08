import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { useCrypto } from '../../contexts/CryptoContext';
import { GlobalData, Ticker } from '../../services/types';
import { styles } from './styles/index.styles';
import {
  formatPercentChange,
  formatValue,
  getChangeBackgroundColor,
  getChangeColor
} from './utils/formatters';

// Componente para mostrar las criptomonedas con mayor movimiento
interface TopMoversCardProps {
  tickers: Ticker[] | null;
}

const TopMoversCard: React.FC<TopMoversCardProps> = memo(({ tickers }) => {
  const theme = useTheme();
  
  if (!tickers || tickers.length === 0) return null;
  
  return (
    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium" style={styles.cardTitle}>Top Movers</Text>
      <View style={styles.moversContainer}>
        {tickers.slice(0, 5).map((ticker: Ticker) => {
          const changeColor = getChangeColor(ticker.percent_change_24h);
          return (
            <View key={ticker.id} style={styles.moverItem}>
              <View style={styles.moverHeader}>
                <Text style={styles.moverSymbol}>{ticker.symbol}</Text>
                <Text 
                  style={[
                    styles.moverChange, 
                    { color: changeColor }
                  ]}
                >
                  {formatPercentChange(ticker.percent_change_24h)}
                </Text>
              </View>
              <Text style={styles.moverName} numberOfLines={1}>{ticker.name}</Text>
            </View>
          );
        })}
      </View>
    </Surface>
  );
});

// Componente para mostrar el resumen general del mercado
interface MarketOverviewProps {
  globalData: GlobalData | null;
}

const MarketOverview: React.FC<MarketOverviewProps> = memo(({ globalData }) => {
  const theme = useTheme();
  
  if (!globalData) return null;
  
  const isMarketCapPositive = parseFloat(globalData.mcap_change) >= 0;
  const isVolumePositive = parseFloat(globalData.volume_change) >= 0;
  const otherPercentage = (100 - parseFloat(globalData.btc_d || '0') - parseFloat(globalData.eth_d || '0')).toFixed(2);
  
  return (
    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium" style={styles.cardTitle}>Market Overview</Text>
      
      {/* Sección de métricas principales */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricBox}>
          <Text variant="titleMedium" style={styles.metricTitle}>Market Cap</Text>
          <Text variant="headlineSmall" style={styles.metricValue}>
            {formatValue(globalData.total_mcap)}
          </Text>
          <View style={[
            styles.changeBadge,
            { backgroundColor: getChangeBackgroundColor(globalData.mcap_change) }
          ]}>
            <MaterialCommunityIcons 
              name={isMarketCapPositive ? "trending-up" : "trending-down"}
              size={16}
              color={getChangeColor(globalData.mcap_change)}
            />
            <Text style={[
              styles.changeText,
              { color: getChangeColor(globalData.mcap_change) }
            ]}>
              {formatPercentChange(globalData.mcap_change)}
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
            { backgroundColor: getChangeBackgroundColor(globalData.volume_change) }
          ]}>
            <MaterialCommunityIcons 
              name={isVolumePositive ? "trending-up" : "trending-down"}
              size={16}
              color={getChangeColor(globalData.volume_change)}
            />
            <Text style={[
              styles.changeText,
              { color: getChangeColor(globalData.volume_change) }
            ]}>
              {formatPercentChange(globalData.volume_change)}
            </Text>
          </View>
        </View>
      </View>

      {/* Sección de dominancia del mercado */}
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
            <Text style={styles.dominanceValue}>{otherPercentage}%</Text>
            <Text style={styles.dominanceLabel}>Others</Text>
          </View>
        </View>
      </View>

      {/* Estadísticas adicionales */}
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
});

// Componente principal de la pantalla de inicio
const OverviewScreen = () => {
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
      <MarketOverview globalData={globalData} />
      <TopMoversCard tickers={tickers} />
    </ScrollView>
  );
};

export default memo(OverviewScreen);