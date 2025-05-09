import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlobalData } from "../models/types/crypto";

interface GlobalStatsProps {
  data: GlobalData;
}

const GlobalStats: React.FC<GlobalStatsProps> = ({ data }) => {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    return num.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={styles.label}>Coins</Text>
          <Text style={styles.value}>{data.coins_count}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.label}>Markets</Text>
          <Text style={styles.value}>{data.active_markets}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={styles.label}>Market Cap</Text>
          <Text style={styles.value}>${formatNumber(data.total_mcap)}</Text>
          <Text
            style={[
              styles.change,
              {
                color:
                  parseFloat(data.mcap_change) >= 0 ? "#4CAF50" : "#FF5252",
              },
            ]}
          >
            {parseFloat(data.mcap_change) >= 0 ? "+" : ""}
            {data.mcap_change}%
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.label}>24h Volume</Text>
          <Text style={styles.value}>${formatNumber(data.total_volume)}</Text>
          <Text
            style={[
              styles.change,
              {
                color:
                  parseFloat(data.volume_change) >= 0 ? "#4CAF50" : "#FF5252",
              },
            ]}
          >
            {parseFloat(data.volume_change) >= 0 ? "+" : ""}
            {data.volume_change}%
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={styles.label}>BTC Dominance</Text>
          <Text style={styles.value}>{data.btc_d}%</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.label}>ETH Dominance</Text>
          <Text style={styles.value}>{data.eth_d}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  change: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default GlobalStats;
