import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ticker } from '../services/types';
import { useCrypto } from '../contexts/CryptoContext';

interface CoinItemProps {
  coin: Ticker;
}

const CoinItem: React.FC<CoinItemProps> = ({ coin }) => {
  const { setSelectedCoin } = useCrypto();

  const priceChangeColor = parseFloat(coin.percent_change_24h) >= 0 ? '#4CAF50' : '#FF5252';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setSelectedCoin(coin)}
    >
      <View style={styles.leftSection}>
        <Text style={styles.rank}>#{coin.rank}</Text>
        <View style={styles.nameSection}>
          <Text style={styles.symbol}>{coin.symbol}</Text>
          <Text style={styles.name}>{coin.name}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.price}>
          ${parseFloat(coin.price_usd).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
          })}
        </Text>
        <Text style={[styles.change, { color: priceChangeColor }]}>
          {parseFloat(coin.percent_change_24h) >= 0 ? '+' : ''}
          {coin.percent_change_24h}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rank: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
    minWidth: 30,
  },
  nameSection: {
    flex: 1,
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  name: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  change: {
    fontSize: 14,
    marginTop: 2,
  },
});

export default CoinItem;