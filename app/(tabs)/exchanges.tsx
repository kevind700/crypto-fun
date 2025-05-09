import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo, useEffect, useState } from "react";
import { FlatList, Linking, RefreshControl, View } from "react-native";
import {
  ActivityIndicator,
  Searchbar,
  Surface,
  Text,
  TouchableRipple,
  useTheme
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import SortModal, { SortOption } from "../../components/common/SortModal";
import { COLORS, LIMITS, UI } from "../../constants";
import { Exchange } from "../../models/types/crypto";
import CoinloreApiService from "../../services/CoinloreApiService";
import { formatVolume } from "../../utils";
import { styles } from "./styles/exchanges.styles";

type SortField = "rank" | "volume_usd" | "active_pairs";

const sortOptions: SortOption<SortField>[] = [
  { field: "volume_usd", label: "Volume" },
  { field: "active_pairs", label: "Pairs" },
];

const ExchangeItem = memo(({ item }: { item: Exchange }) => {
  const volume = formatVolume(item.volume_usd);
  const pairs = `${item.active_pairs}`;

  return (
    <TouchableRipple onPress={() => Linking.openURL(item.url)}>
      <Surface style={styles.exchangeCard}>
        <View style={styles.exchangeHeader}>
          <View style={styles.exchangeInfo}>
            <Text variant="titleLarge" style={styles.name}>
              {item.name}
            </Text>
            <View style={styles.locationContainer}>
              <MaterialCommunityIcons
                name="map-marker"
                size={14}
                color="#94A3B8"
                style={styles.locationIcon}
              />
              <Text variant="labelMedium" style={styles.locationText}>
                {item.country || "Unknown location"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <MaterialCommunityIcons
              name="chart-line"
              size={20}
              color="#60A5FA"
            />
            <Text variant="titleMedium" style={styles.statValue}>
              {volume}
            </Text>
            <Text variant="labelSmall" style={styles.statLabel}>
              Volume (24h)
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <MaterialCommunityIcons
              name="swap-horizontal"
              size={20}
              color="#60A5FA"
            />
            <Text variant="titleMedium" style={styles.statValue}>
              {Number(pairs).toLocaleString()}
            </Text>
            <Text variant="labelSmall" style={styles.statLabel}>
              Active Pairs
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <MaterialCommunityIcons
            name="open-in-new"
            size={16}
            color="#60A5FA"
          />
          <Text variant="labelMedium" style={styles.visitText}>
            Visit Exchange
          </Text>
        </View>
      </Surface>
    </TouchableRipple>
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
        No exchanges found
      </Text>
    </View>
  );
});

const Exchanges = () => {
  const theme = useTheme();
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("volume_usd");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = LIMITS.PAGE_SIZE; // Display items per page
  const [displayedExchanges, setDisplayedExchanges] = useState<Exchange[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    loadExchanges();
  }, []);

  useEffect(() => {
    applyPagination();
  }, [exchanges, sortField, sortAsc, page, searchQuery]);

  /**
   * Resets pagination state to initial values
   */
  const resetPagination = () => {
    setPage(1);
    setDisplayedExchanges([]);
  };

  /**
   * Applies pagination, sorting, and filtering to the data
   */
  const applyPagination = () => {
    if (exchanges.length === 0) return;

    // Filter by search query
    const filteredExchanges = exchanges.filter((exchange) =>
      exchange.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Sort data
    const sortedData = [...filteredExchanges].sort((a, b) => {
      const multiplier = sortAsc ? 1 : -1;
      const aValue = parseFloat(a[sortField] as string) || 0;
      const bValue = parseFloat(b[sortField] as string) || 0;
      return (aValue - bValue) * multiplier;
    });

    // Apply pagination
    if (page === 1) {
      setDisplayedExchanges(sortedData.slice(0, pageSize));
    } else {
      const nextItems = sortedData.slice(0, page * pageSize);
      setDisplayedExchanges(nextItems);
    }
    
    setIsLoadingMore(false);
  };

  /**
   * Loads exchanges data from API
   * @param isRefresh - Whether the load is triggered by pull-to-refresh
   */
  const loadExchanges = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else if (!isLoadingMore) {
        setIsLoading(true);
      }

      const service = CoinloreApiService.getInstance();
      const data = await service.getExchanges();
      const exchangesArray = Object.values(data || {});
      setExchanges(exchangesArray);
      resetPagination();
    } catch (error) {
      console.error("Failed to load exchanges:", error);
      setExchanges([]);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  /**
   * Handles pull-to-refresh action
   */
  const handleRefresh = () => {
    loadExchanges(true);
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
   * Handles search query changes and filters data
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    resetPagination();
  };

  /**
   * Handles loading more items when user reaches end of list
   */
  const handleEndReached = () => {
    if (isLoading || isLoadingMore) return;
    
    const filteredTotal = exchanges.filter((exchange) =>
      exchange.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ).length;
    
    if (displayedExchanges.length >= filteredTotal) return;
    
    setIsLoadingMore(true);
    setPage(prevPage => prevPage + 1);
  };

  /**
   * Renders loading indicator at the bottom of the list during pagination
   */
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
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
            placeholder="Search exchanges..."
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

        {displayedExchanges.length > 0 && (
          <View style={styles.sortInfoContainer}>
            <Text style={styles.sortInfoText}>
              Sorting by:{" "}
              {sortOptions.find((option) => option.field === sortField)
                ?.label || "Volume"}
              {sortAsc ? " (Ascending)" : " (Descending)"}
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={displayedExchanges}
        renderItem={({ item }) => <ExchangeItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={handleRefresh}
            colors={[COLORS.ACCENT_BLUE]}
            tintColor={theme.colors.primary}
            progressBackgroundColor={theme.colors.surface}
          />
        }
        ListEmptyComponent={<EmptyListComponent />}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={UI.END_REACHED_THRESHOLD}
      />
      
      {isLoading && !isRefreshing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size={UI.INDICATOR_SIZE_LARGE} color={COLORS.ACCENT_BLUE} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default memo(Exchanges);
