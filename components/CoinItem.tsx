import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ticker } from '../services/types';
import { formatPercentChange, formatPrice, getChangeColor } from '../utils/formatters';
import { styles } from './CoinItem.styles';

interface CoinItemProps {
  coin: Ticker;
  onSelect: (coin: Ticker) => void;
}

const CoinItem: React.FC<CoinItemProps> = ({ coin, onSelect }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onSelect(coin)}
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
          ${formatPrice(coin.price_usd)}
        </Text>
        <Text style={[styles.change, { color: getChangeColor(coin.percent_change_24h) }]}>
          {formatPercentChange(coin.percent_change_24h)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(CoinItem);