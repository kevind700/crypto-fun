import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Searchbar, Surface, Text, useTheme } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import SortModal, { SortOption } from "../../components/common/SortModal";
import { COLORS, LIMITS, UI } from "../../constants";
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
  const { tickers, isLoading, refreshData } = useCrypto();
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortAsc, setSortAsc] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTickers, setFilteredTickers] = useState<Ticker[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = LIMITS.PAGE_SIZE; // Display items per page
  const [displayedTickers, setDisplayedTickers] = useState<Ticker[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (tickers) {
      setFilteredTickers(tickers);
      resetPagination();
    }
  }, [tickers]);

  useEffect(() => {
    applyPagination();
  }, [filteredTickers, sortField, sortAsc, page]);

  /**
   * Resets pagination state to initial values
   */
  const resetPagination = () => {
    setPage(1);
    setDisplayedTickers([]);
  };

  /**
   * Applies pagination, sorting, and filtering to the data
   */
  const applyPagination = () => {
    if (filteredTickers.length === 0) return;

    const sortedData = [...filteredTickers].sort((a, b) => {
      const multiplier = sortAsc ? 1 : -1;
      const aValue = parseFloat(a[sortField] as string) || 0;
      const bValue = parseFloat(b[sortField] as string) || 0;
      return (aValue - bValue) * multiplier;
    });

    // For the first page, replace all items
    if (page === 1) {
      setDisplayedTickers(sortedData.slice(0, pageSize));
    } else {
      // For subsequent pages, add new items
      const nextItems = sortedData.slice(0, page * pageSize);
      setDisplayedTickers(nextItems);
    }
    
    setIsLoadingMore(false);
  };

  /**
   * Handles pull-to-refresh action
   */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      resetPagination();
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * Handles changing the sort field
   */
  const handleSort = (field: SortField) => {
    if (field !== sortField) {
      setSortField(field);
      resetPagination();
    }
  };

  /**
   * Toggles sort direction between ascending and descending
   */
  const handleDirectionChange = () => {
    setSortAsc(!sortAsc);
    resetPagination();
  };

  /**
   * Handles search query changes and filters data accordingly
   */
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

  /**
   * Handles loading more items when user reaches end of list
   */
  const handleEndReached = () => {
    if (isLoading || isLoadingMore) return;
    if (displayedTickers.length >= filteredTickers.length) return;
    
    setIsLoadingMore(true);
    setPage(prevPage => prevPage + 1);
  };

  /**
   * Renders loading indicator at the bottom of the list during pagination
   */
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size={UI.INDICATOR_SIZE_SMALL} color={COLORS.ACCENT_BLUE} />
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
                backgroundColor: COLORS.DARK_INPUT,
                borderRadius: 20,
                elevation: 0,
                height: UI.SEARCH_BAR_HEIGHT,
                borderWidth: 1,
                borderColor: COLORS.ACCENT_BLUE_BORDER,
              },
            ]}
            icon="magnify"
            iconColor={COLORS.ACCENT_BLUE}
            inputStyle={{
              color: "#FFFFFF",
              fontSize: 14,
              alignSelf: "center",
              marginLeft: -5,
            }}
            placeholderTextColor={COLORS.TEXT_MUTED}
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
        onEndReachedThreshold={UI.END_REACHED_THRESHOLD}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={handleRefresh}
            colors={[COLORS.ACCENT_BLUE]}
            tintColor={theme.colors.primary}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      />
      
      {isLoading && !isRefreshing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size={UI.INDICATOR_SIZE_LARGE} color={COLORS.ACCENT_BLUE} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default memo(Markets);
