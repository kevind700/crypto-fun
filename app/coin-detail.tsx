import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Button, Surface, Text, useTheme } from 'react-native-paper';
import CoinloreApiService from '../services/CoinloreApiService';
import { CoinMarket, Ticker } from '../services/types';

const CoinDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const [coin, setCoin] = useState<Ticker | null>(null);
  const [markets, setMarkets] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoinDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const coinloreService = CoinloreApiService.getInstance();
        const [coinData, marketsData] = await Promise.all([
          coinloreService.getTicker(id),
          coinloreService.getCoinMarkets(id)
        ]);
        
        if (coinData && coinData.length > 0) {
          setCoin(coinData[0]);
        }
        setMarkets(marketsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los datos');
        console.error('Error fetching coin details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCoinDetails();
    }
  }, [id]);

  const formatValue = (value: number): string => {
    if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
    if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K';
    return value.toFixed(2);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Cargando información...</Text>
      </View>
    );
  }

  if (error || !coin) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={{ marginTop: 16, color: theme.colors.error }}>{error || 'No se pudo cargar la información'}</Text>
        <Button mode="contained" style={{ marginTop: 16 }} onPress={() => {}}>
          Intentar de nuevo
        </Button>
      </View>
    );
  }

  const priceChange = parseFloat(coin.percent_change_24h);
  const isPositive = priceChange >= 0;
  const change1h = parseFloat(coin.percent_change_1h);
  const change7d = parseFloat(coin.percent_change_7d);
  const isPositive1h = change1h >= 0;
  const isPositive7d = change7d >= 0;
  
  // Calcular supply y circulating supply
  const currentSupply = parseFloat(coin.csupply);
  const totalSupply = coin.tsupply ? parseFloat(coin.tsupply) : 0;
  const maxSupply = coin.msupply ? parseFloat(coin.msupply) : 0;
  
  // Calcular porcentaje de suministro en circulación
  const supplyPercentage = totalSupply > 0 ? (currentSupply / totalSupply) * 100 : 0;

  // Datos para la gráfica (simulados, ya que la API no proporciona datos históricos)
  const chartData = {
    labels: ['', '1H', '', '24H', '', '7D', ''],
    datasets: [
      {
        data: [
          parseFloat(coin.price_usd) - parseFloat(coin.price_usd) * parseFloat(coin.percent_change_1h) / 100 * 1.5,
          parseFloat(coin.price_usd) - parseFloat(coin.price_usd) * parseFloat(coin.percent_change_1h) / 100,
          parseFloat(coin.price_usd) - parseFloat(coin.price_usd) * parseFloat(coin.percent_change_24h) / 200,
          parseFloat(coin.price_usd),
          parseFloat(coin.price_usd) + parseFloat(coin.price_usd) * parseFloat(coin.percent_change_24h) / 200,
          parseFloat(coin.price_usd) + parseFloat(coin.price_usd) * parseFloat(coin.percent_change_7d) / 100,
          parseFloat(coin.price_usd) + parseFloat(coin.price_usd) * parseFloat(coin.percent_change_7d) / 100 * 1.2,
        ],
        color: (opacity = 1) => isPositive ? `rgba(34, 197, 94, ${opacity})` : `rgba(239, 68, 68, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: `${coin.symbol} - ${coin.name}`,
          headerStyle: {
            backgroundColor: '#1E293B',
          },
          headerTintColor: '#FFFFFF',
        }}
      />
      <ScrollView style={styles.container}>
        <Surface style={styles.headerCard}>
          <View style={styles.coinBasicInfo}>
            <View style={styles.coinIdentity}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{coin.rank}</Text>
              </View>
              <View>
                <Text variant="headlineSmall" style={styles.symbolText}>{coin.symbol}</Text>
                <Text variant="bodyMedium" style={styles.nameText}>{coin.name}</Text>
              </View>
            </View>
            <View style={styles.priceSection}>
              <Text variant="headlineMedium" style={styles.priceText}>
                ${Number(parseFloat(coin.price_usd)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6
                })}
              </Text>
              <View style={[styles.changeContainer, { backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)' }]}>
                <MaterialCommunityIcons 
                  name={isPositive ? "trending-up" : "trending-down"} 
                  size={16} 
                  color={isPositive ? '#22c55e' : '#ef4444'} 
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.changeText,
                    { color: isPositive ? '#22c55e' : '#ef4444' },
                  ]}>
                  {isPositive ? '+' : ''}{coin.percent_change_24h}%
                </Text>
              </View>
            </View>
          </View>

          {/* Gráfico de precio */}
          <View style={styles.chartContainer}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Gráfico de Precio</Text>
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 50}
              height={220}
              chartConfig={{
                backgroundGradientFrom: '#1E293B',
                backgroundGradientTo: '#1E293B',
                decimalPlaces: 2,
                color: (opacity = 1) => isPositive ? `rgba(34, 197, 94, ${opacity})` : `rgba(239, 68, 68, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: isPositive ? '#22c55e' : '#ef4444'
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>
        </Surface>

        {/* Sección de información de cambios de precio */}
        <Surface style={styles.card}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Rendimiento</Text>
          
          <View style={styles.timeframeContainer}>
            <View style={styles.timeframe}>
              <Text style={styles.timeframeLabel}>1h</Text>
              <View style={[styles.timeframeValue, { backgroundColor: isPositive1h ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                <Text style={[styles.timeframeText, { color: isPositive1h ? '#22c55e' : '#ef4444' }]}>
                  {isPositive1h ? '+' : ''}{coin.percent_change_1h}%
                </Text>
              </View>
            </View>
            <View style={styles.timeframe}>
              <Text style={styles.timeframeLabel}>24h</Text>
              <View style={[styles.timeframeValue, { backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                <Text style={[styles.timeframeText, { color: isPositive ? '#22c55e' : '#ef4444' }]}>
                  {isPositive ? '+' : ''}{coin.percent_change_24h}%
                </Text>
              </View>
            </View>
            <View style={styles.timeframe}>
              <Text style={styles.timeframeLabel}>7d</Text>
              <View style={[styles.timeframeValue, { backgroundColor: isPositive7d ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                <Text style={[styles.timeframeText, { color: isPositive7d ? '#22c55e' : '#ef4444' }]}>
                  {isPositive7d ? '+' : ''}{coin.percent_change_7d}%
                </Text>
              </View>
            </View>
          </View>
        </Surface>

        {/* Sección de estadísticas */}
        <Surface style={styles.card}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Estadísticas de Mercado</Text>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Precio en BTC</Text>
            <Text style={styles.statValue}>{parseFloat(coin.price_btc).toFixed(8)}</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Capitalización de Mercado</Text>
            <Text style={styles.statValue}>${formatValue(parseFloat(coin.market_cap_usd))}</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Volumen (24h)</Text>
            <Text style={styles.statValue}>${formatValue(parseFloat(coin.volume24))}</Text>
          </View>
        </Surface>

        {/* Sección de supply */}
        {totalSupply > 0 && (
          <Surface style={styles.card}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Información de Supply</Text>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Supply en Circulación</Text>
              <Text style={styles.statValue}>{formatValue(currentSupply)} {coin.symbol}</Text>
            </View>
            
            {totalSupply > 0 && (
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Supply Total</Text>
                <Text style={styles.statValue}>{formatValue(totalSupply)} {coin.symbol}</Text>
              </View>
            )}
            
            {maxSupply > 0 && (
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Supply Máximo</Text>
                <Text style={styles.statValue}>{formatValue(maxSupply)} {coin.symbol}</Text>
              </View>
            )}
            
            <View style={styles.progressContainer}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Porcentaje en Circulación</Text>
                <Text style={styles.progressValue}>{supplyPercentage.toFixed(2)}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${supplyPercentage}%` }]} />
              </View>
            </View>
          </Surface>
        )}

        {/* Sección de mercados */}
        {markets.length > 0 && (
          <Surface style={styles.card}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Mercados</Text>
            
            {markets.slice(0, 5).map((market, index) => (
              <View key={index} style={styles.marketItem}>
                <Text style={styles.marketName}>{market.name}</Text>
                <View style={styles.marketDetails}>
                  <Text style={styles.marketPair}>{market.base}/{market.quote}</Text>
                  <Text style={styles.marketPrice}>${Number(parseFloat(market.price_usd)).toLocaleString()}</Text>
                  <Text style={styles.marketVolume}>Vol: ${formatValue(parseFloat(market.volume_usd))}</Text>
                </View>
              </View>
            ))}
            
            {markets.length > 5 && (
              <Text style={styles.moreMarketsText}>+ {markets.length - 5} más mercados</Text>
            )}
          </Surface>
        )}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    elevation: 2,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    elevation: 2,
  },
  coinBasicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  coinIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankBadge: {
    backgroundColor: '#60A5FA',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
  },
  rankText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  symbolText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  nameText: {
    color: '#94A3B8',
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  priceText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  changeText: {
    fontWeight: '500',
    fontSize: 14,
  },
  chartContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#FFFFFF',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeframe: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  timeframeLabel: {
    color: '#94A3B8',
    marginBottom: 8,
  },
  timeframeValue: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  timeframeText: {
    fontWeight: '500',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  statLabel: {
    color: '#94A3B8',
  },
  statValue: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#94A3B8',
  },
  progressValue: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#2D3748',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#60A5FA',
    borderRadius: 4,
  },
  marketItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  marketName: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  marketDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  marketPair: {
    color: '#94A3B8',
    fontSize: 12,
  },
  marketPrice: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  marketVolume: {
    color: '#94A3B8',
    fontSize: 12,
  },
  moreMarketsText: {
    color: '#60A5FA',
    textAlign: 'center',
    marginTop: 12,
  },
  backButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#60A5FA',
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default CoinDetail; 