/**
 * TopMoversCard Component
 *
 * This component displays a horizontal scrollable list of the top movers
 * (cryptocurrencies with the biggest price changes) in the market.
 *
 * It is typically used on the dashboard/home screen to highlight
 * significant market activity to users.
 */

import React, { memo } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { Surface } from "react-native-paper";
import { Ticker } from "../models/types/crypto";
import {
  formatPercentChange,
  formatPrice,
  getChangeColor,
} from "../utils/formatters";
import { styles } from "./TopMoversCard.styles";

/**
 * TopMoversCard component props
 * @interface TopMoversCardProps
 * @property {string} title - Title for the card (e.g., "Top Gainers", "Top Losers")
 * @property {Ticker[]} data - Array of cryptocurrency data to display
 * @property {function} onSelectCoin - Callback when a cryptocurrency is selected
 */
interface TopMoversCardProps {
  title: string;
  data: Ticker[];
  onSelectCoin: (coin: Ticker) => void;
}

/**
 * TopMoversCard displays cryptocurrencies with significant price movements
 * @param {TopMoversCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const TopMoversCard: React.FC<TopMoversCardProps> = ({
  title,
  data,
  onSelectCoin,
}) => {
  return (
    <Surface style={styles.container}>
      {/* Card title */}
      <Text style={styles.title}>{title}</Text>

      {/* Horizontal scrollable list of top movers */}
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

/**
 * MoverItem component props
 * @interface MoverItemProps
 * @property {Ticker} coin - The cryptocurrency data to display
 * @property {function} onSelect - Callback when the item is selected
 */
interface MoverItemProps {
  coin: Ticker;
  onSelect: (coin: Ticker) => void;
}

/**
 * MoverItem displays a single cryptocurrency in the top movers list
 * @param {MoverItemProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const MoverItem: React.FC<MoverItemProps> = memo(({ coin, onSelect }) => {
  return (
    <TouchableOpacity style={styles.moverItem} onPress={() => onSelect(coin)}>
      {/* Cryptocurrency symbol (e.g., BTC, ETH) */}
      <Text style={styles.symbol}>{coin.symbol}</Text>

      {/* Current price formatted as currency */}
      <Text style={styles.price}>${formatPrice(coin.price_usd)}</Text>

      {/* Percentage change with color coding */}
      <Text
        style={[
          styles.change,
          { color: getChangeColor(coin.percent_change_24h) },
        ]}
      >
        {formatPercentChange(coin.percent_change_24h)}
      </Text>
    </TouchableOpacity>
  );
});

// Memoize the component to prevent unnecessary re-renders
export default memo(TopMoversCard);
