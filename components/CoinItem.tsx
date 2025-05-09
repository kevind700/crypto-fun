/**
 * CoinItem Component
 *
 * This component displays a cryptocurrency item in a list.
 * It shows the rank, symbol, name, price, and 24-hour price change
 * with appropriate color coding based on the price movement.
 *
 * The component is designed to be used within FlatList or similar list components.
 */

import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ticker } from "../models/types/crypto";
import {
  formatPercentChange,
  formatPrice,
  getChangeColor,
} from "../utils/formatters";
import { styles } from "./CoinItem.styles";

/**
 * CoinItem component props
 * @interface CoinItemProps
 * @property {Ticker} coin - The cryptocurrency data to display
 * @property {function} onSelect - Callback function when coin is selected
 */
interface CoinItemProps {
  coin: Ticker;
  onSelect: (coin: Ticker) => void;
}

/**
 * CoinItem component displays a single cryptocurrency in the list
 * @param {CoinItemProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const CoinItem: React.FC<CoinItemProps> = ({ coin, onSelect }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onSelect(coin)}>
      {/* Left section with rank and name information */}
      <View style={styles.leftSection}>
        <Text style={styles.rank}>#{coin.rank}</Text>
        <View style={styles.nameSection}>
          <Text style={styles.symbol}>{coin.symbol}</Text>
          <Text style={styles.name}>{coin.name}</Text>
        </View>
      </View>

      {/* Right section with price and change information */}
      <View style={styles.rightSection}>
        <Text style={styles.price}>${formatPrice(coin.price_usd)}</Text>
        <Text
          style={[
            styles.change,
            { color: getChangeColor(coin.percent_change_24h) },
          ]}
        >
          {formatPercentChange(coin.percent_change_24h)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(CoinItem);
