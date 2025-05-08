/**
 * Coin Detail Screen
 * 
 * This component displays detailed information about a specific cryptocurrency.
 * It fetches data from the CoinloreApiService and displays price information,
 * charts, market statistics, supply information, and markets where the coin is traded.
 * 
 * The UI is organized into several card sections for better readability and user experience.
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Button, Surface, Text, useTheme } from 'react-native-paper';
import { CoinMarket, Ticker } from '../models/types/crypto';
import CoinloreApiService from '../services/CoinloreApiService';

/**
 * CoinDetail component displays comprehensive information about a cryptocurrency
 * @returns {JSX.Element} The rendered component
 */
const CoinDetail = () => {
  // Get the coin ID from URL params
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  
  // State management
  const [coin, setCoin] = useState<Ticker | null>(null);
  const [markets, setMarkets] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch coin details and markets data when component mounts or ID changes
   */
  useEffect(() => {
    const fetchCoinDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get the API service instance
        const coinloreService = CoinloreApiService.getInstance();
        
        // Fetch coin data and markets data in parallel
        const [coinData, marketsData] = await Promise.all([
          coinloreService.getTicker(id),
          coinloreService.getCoinMarkets(id)
        ]);
        
        // Set coin data if available
        if (coinData && coinData.length > 0) {
          setCoin(coinData[0]);
        }
        
        // Set markets data
        setMarkets(marketsData);
      } catch (err) {
        // Handle errors
        setError(err instanceof Error ? err.message : 'Error loading data');
        console.error('Error fetching coin details:', err);
      } finally {
        // Always set loading to false when done
        setLoading(false);
      }
    };

    // Only fetch if ID is available
    if (id) {
      fetchCoinDetails();
    }
  }, [id]);

  /**
   * Format large numbers with appropriate suffixes (T, B, M, K)
   * @param {number} value - The number to format
   * @returns {string} Formatted string with appropriate suffix
   */
  const formatValue = (value: number): string => {
    if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
    if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K';
    return value.toFixed(2);
  };

  // Show loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading information...</Text>
      </View>
    );
  }

  // Show error state
  if (error || !coin) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={{ marginTop: 16, color: theme.colors.error }}>{error || 'Could not load information'}</Text>
        <Button mode="contained" style={{ marginTop: 16 }} onPress={() => {}}>
          Try again
        </Button>
      </View>
    );
  }

  // Process coin data for display
  const priceChange = parseFloat(coin.percent_change_24h);
  const isPositive = priceChange >= 0;
  const change1h = parseFloat(coin.percent_change_1h);
  const change7d = parseFloat(coin.percent_change_7d);
  const isPositive1h = change1h >= 0;
  const isPositive7d = change7d >= 0;
  
  // Calculate supply and circulating supply
  const currentSupply = parseFloat(coin.csupply);
  const totalSupply = coin.tsupply ? parseFloat(coin.tsupply) : 0;
  const maxSupply = coin.msupply ? parseFloat(coin.msupply) : 0;
  
  // Calculate circulation supply percentage
  const supplyPercentage = totalSupply > 0 ? (currentSupply / totalSupply) * 100 : 0;

  // Data for the chart (simulated, as the API doesn't provide historical data)
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

  // Render the coin detail screen
  return (
    <>
      {/* Configure the Stack.Screen header */}
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
        {/* Header card with basic coin info and price chart */}
        <Surface style={styles.headerCard}>
          {/* Basic coin information section */}
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

          {/* Price Chart */}
          <View style={styles.chartContainer}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Price Chart</Text>
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

        {/* Price Change Information Section */}
        <Surface style={styles.card}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Performance</Text>
          
          <View style={styles.timeframeContainer}>
            {/* 1 hour performance */}
            <View style={styles.timeframe}>
              <Text style={styles.timeframeLabel}>1h</Text>
              <View style={[styles.timeframeValue, { backgroundColor: isPositive1h ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                <Text style={[styles.timeframeText, { color: isPositive1h ? '#22c55e' : '#ef4444' }]}>
                  {isPositive1h ? '+' : ''}{coin.percent_change_1h}%
                </Text>
              </View>
            </View>
            {/* 24 hour performance */}
            <View style={styles.timeframe}>
              <Text style={styles.timeframeLabel}>24h</Text>
              <View style={[styles.timeframeValue, { backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                <Text style={[styles.timeframeText, { color: isPositive ? '#22c55e' : '#ef4444' }]}>
                  {isPositive ? '+' : ''}{coin.percent_change_24h}%
                </Text>
              </View>
            </View>
            {/* 7 day performance */}
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

        {/* Statistics Section */}
        <Surface style={styles.card}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Market Statistics</Text>
          
          {/* BTC Price */}
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>BTC Price</Text>
            <Text style={styles.statValue}>{parseFloat(coin.price_btc).toFixed(8)}</Text>
          </View>
          
          {/* Market Cap */}
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Market Cap</Text>
            <Text style={styles.statValue}>${formatValue(parseFloat(coin.market_cap_usd))}</Text>
          </View>
          
          {/* 24h Volume */}
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Volume (24h)</Text>
            <Text style={styles.statValue}>${formatValue(parseFloat(coin.volume24))}</Text>
          </View>
        </Surface>

        {/* Supply Information Section - only shown if totalSupply > 0 */}
        {totalSupply > 0 && (
          <Surface style={styles.card}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Supply Information</Text>
            
            {/* Circulating Supply */}
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Circulating Supply</Text>
              <Text style={styles.statValue}>{formatValue(currentSupply)} {coin.symbol}</Text>
            </View>
            
            {/* Total Supply */}
            {totalSupply > 0 && (
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Supply</Text>
                <Text style={styles.statValue}>{formatValue(totalSupply)} {coin.symbol}</Text>
              </View>
            )}
            
            {/* Max Supply - only shown if maxSupply > 0 */}
            {maxSupply > 0 && (
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Max Supply</Text>
                <Text style={styles.statValue}>{formatValue(maxSupply)} {coin.symbol}</Text>
              </View>
            )}
            
            {/* Circulation percentage progress bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Circulation Percentage</Text>
                <Text style={styles.progressValue}>{supplyPercentage.toFixed(2)}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${supplyPercentage}%` }]} />
              </View>
            </View>
          </Surface>
        )}

        {/* Markets Section - only shown if markets exist */}
        {markets.length > 0 && (
          <Surface style={styles.card}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Markets</Text>
            
            {/* Display up to 5 markets */}
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
            
            {/* Show how many more markets are available if > 5 */}
            {markets.length > 5 && (
              <Text style={styles.moreMarketsText}>+ {markets.length - 5} more markets</Text>
            )}
          </Surface>
        )}
      </ScrollView>
      
      {/* Floating back button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </>
  );
};

/**
 * Styles for the CoinDetail component
 */
const styles = StyleSheet.create({
  // Main container styles
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Card container styles
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
  
  // Coin basic info section styles
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
  
  // Price section styles
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
  
  // Chart container styles
  chartContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#FFFFFF',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  
  // Timeframe section styles
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
  
  // Stats row styles
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
  
  // Progress bar styles
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
  
  // Market item styles
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
  
  // Back button styles
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