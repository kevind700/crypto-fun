import React, { memo } from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import { Surface } from 'react-native-paper';
import { Ticker } from '../services/types';
import { formatPercentChange, formatPrice, getChangeColor } from '../utils/formatters';
import { styles } from './TopMoversCard.styles';

interface TopMoversCardProps {
  title: string;
  data: Ticker[];
  onSelectCoin: (coin: Ticker) => void;
}

const TopMoversCard: React.FC<TopMoversCardProps> = ({ 
  title, 
  data, 
  onSelectCoin 
}) => {
  return (
    <Surface style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <MoverItem coin={item} onSelect={onSelectCoin} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </Surface>
  );
};

interface MoverItemProps {
  coin: Ticker;
  onSelect: (coin: Ticker) => void;
}

const MoverItem: React.FC<MoverItemProps> = memo(({ coin, onSelect }) => {
  return (
    <TouchableOpacity 
      style={styles.moverItem}
      onPress={() => onSelect(coin)}
    >
      <Text style={styles.symbol}>{coin.symbol}</Text>
      <Text style={styles.price}>${formatPrice(coin.price_usd)}</Text>
      <Text
        style={[
          styles.change,
          { color: getChangeColor(coin.percent_change_24h) }
        ]}
      >
        {formatPercentChange(coin.percent_change_24h)}
      </Text>
    </TouchableOpacity>
  );
});

export default memo(TopMoversCard);