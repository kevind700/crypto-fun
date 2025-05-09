import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Searchbar, Surface, Text, useTheme } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import SortModal, { SortOption } from "../../components/common/SortModal";
import { useCrypto } from "../../contexts/CryptoContext";
import { Ticker } from "../../models/types/crypto";
import {
  formatPercentChange,
  formatValue,
  getChangeBackgroundColor,
  getChangeBorderColor,
  getChangeColor,
} from "../../utils";
import { styles } from "./styles/markets.styles";

type SortField =
  | "rank"
  | "price_usd"
  | "percent_change_24h"
  | "volume24"
  | "market_cap_usd";

const sortOptions: SortOption<SortField>[] = [
  { field: "rank", label: "Rank" },
  { field: "price_usd", label: "Price" },
  { field: "percent_change_24h", label: "Change" },
  { field: "volume24", label: "Volume" },
  { field: "market_cap_usd", label: "Mkt Cap" },
];

const CoinItem = memo(({ item }: { item: Ticker }) => {
  const priceChange = parseFloat(item.percent_change_24h);
  const isPositive = priceChange >= 0;

  const handleCoinPress = () => {
    router.push({
      pathname: "/coin-detail",
      params: { id: item.id },
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400)
        .delay(Number(item.rank) * 20)
        .springify()}
    >
      <TouchableOpacity onPress={handleCoinPress}>
        <Surface style={styles.coinCard}>
          <View style={styles.coinHeader}>
            <View style={styles.coinInfo}>
              <View style={styles.rankContainer}>
                <Text style={styles.rank}>{item.rank}</Text>
              </View>
              <View>
                <Text variant="titleMedium" style={styles.symbol}>
                  {item.symbol}
                </Text>
                <Text variant="bodySmall" style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
            </View>
            <View style={styles.priceInfo}>
              <Text variant="titleMedium" style={styles.price}>
                $
                {Number(parseFloat(item.price_usd)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                })}
              </Text>
              <View
                style={[
                  styles.changeContainer,
                  {
                    backgroundColor: getChangeBackgroundColor(
                      item.percent_change_24h,
                    ),
                    borderWidth: 1,
                    borderColor: getChangeBorderColor(item.percent_change_24h),
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={isPositive ? "trending-up" : "trending-down"}
                  size={14}
                  color={getChangeColor(item.percent_change_24h)}
                  style={{ marginRight: 4 }}
                />
                <Text
                  variant="bodySmall"
                  style={[
                    styles.change,
                    { color: getChangeColor(item.percent_change_24h) },
                  ]}
                >
                  {formatPercentChange(item.percent_change_24h)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <MaterialCommunityIcons
                name="chart-pie"
                size={16}
                color="#60A5FA"
                style={styles.statIcon}
              />
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Mkt Cap</Text>
                <Text variant="bodySmall" style={styles.statValue}>
                  ${formatValue(parseFloat(item.market_cap_usd))}
                </Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <MaterialCommunityIcons
                name="chart-bar"
                size={16}
                color="#60A5FA"
                style={styles.statIcon}
              />
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Vol 24h</Text>
                <Text variant="bodySmall" style={styles.statValue}>
                  ${formatValue(parseFloat(item.volume24))}
                </Text>
              </View>
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
    </Animated.View>
  );
});

const EmptyListComponent = memo(() => {
  const theme = useTheme();
  return (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={48}
        color={theme.colors.error}
      />
      <Text
        variant="titleMedium"
        style={[styles.emptyText, { color: theme.colors.error }]}
      >
        No coins found
      </Text>
    </View>
  );
});

const Markets = () => {
  const theme = useTheme();
  const { tickers, isLoading } = useCrypto();
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortAsc, setSortAsc] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTickers, setFilteredTickers] = useState<Ticker[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10; // Mostramos 10 elementos por página
  const [displayedTickers, setDisplayedTickers] = useState<Ticker[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (tickers) {
      setFilteredTickers(tickers);
      resetPagination();
    }
  }, [tickers]);

  useEffect(() => {
    applyPagination();
  }, [filteredTickers, sortField, sortAsc, page]);

  const resetPagination = () => {
    setPage(1);
    setDisplayedTickers([]);
  };

  const applyPagination = () => {
    if (filteredTickers.length === 0) return;

    const sortedData = [...filteredTickers].sort((a, b) => {
      const multiplier = sortAsc ? 1 : -1;
      const aValue = parseFloat(a[sortField] as string) || 0;
      const bValue = parseFloat(b[sortField] as string) || 0;
      return (aValue - bValue) * multiplier;
    });

    // Si estamos en la primera página, reemplazamos completamente los elementos
    if (page === 1) {
      setDisplayedTickers(sortedData.slice(0, pageSize));
    } else {
      // Si es página posterior, añadimos los nuevos elementos
      const nextItems = sortedData.slice(0, page * pageSize);
      setDisplayedTickers(nextItems);
    }
    
    setIsLoadingMore(false);
  };

  const handleSort = (field: SortField) => {
    if (field !== sortField) {
      setSortField(field);
      resetPagination();
    }
  };

  const handleDirectionChange = () => {
    setSortAsc(!sortAsc);
    resetPagination();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    resetPagination();
    
    if (!query.trim()) {
      setFilteredTickers(tickers || []);
    } else {
      const lowercaseQuery = query.toLowerCase();
      const filtered = (tickers || []).filter(
        (coin) =>
          coin.name.toLowerCase().includes(lowercaseQuery) ||
          coin.symbol.toLowerCase().includes(lowercaseQuery),
      );
      setFilteredTickers(filtered);
    }
  };

  const handleEndReached = () => {
    if (isLoading || isLoadingMore) return;
    if (displayedTickers.length >= filteredTickers.length) return;
    
    setIsLoadingMore(true);
    setPage(prevPage => prevPage + 1);
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#60A5FA" />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <View style={styles.headerContainer}>
        <View style={styles.headerControls}>
          <Searchbar
            placeholder="Search coins..."
            onChangeText={handleSearch}
            value={searchQuery}
            style={[
              styles.searchBar,
              {
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                borderRadius: 20,
                elevation: 0,
                height: 44,
                borderWidth: 1,
                borderColor: "rgba(96, 165, 250, 0.2)",
              },
            ]}
            icon="magnify"
            iconColor="#60A5FA"
            inputStyle={{
              color: "#FFFFFF",
              fontSize: 14,
              alignSelf: "center",
              marginLeft: -5,
            }}
            placeholderTextColor="rgba(148, 163, 184, 0.8)"
          />

          <SortModal
            sortOptions={sortOptions}
            currentSortField={sortField}
            isAscending={sortAsc}
            onSortChange={handleSort}
            onDirectionChange={handleDirectionChange}
          />
        </View>

        {filteredTickers.length > 0 && (
          <View style={styles.sortInfoContainer}>
            <Text style={styles.sortInfoText}>
              Sorting by:{" "}
              {sortOptions.find((option) => option.field === sortField)
                ?.label || "Rank"}
              {sortAsc ? " (Ascending)" : " (Descending)"}
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={displayedTickers}
        renderItem={({ item }) => <CoinItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyListComponent />}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#60A5FA" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default memo(Markets);
