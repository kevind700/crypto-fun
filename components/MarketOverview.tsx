import React, { memo } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { COLORS } from '../constants';
import { useCrypto } from '../contexts/CryptoContext';
import CoinItem from './CoinItem';
import EmptyState from './common/EmptyState';
import ErrorMessage from './common/ErrorMessage';
import GlobalStatsCard from './GlobalStatsCard';
import { styles } from './MarketOverview.styles';
import TopMoversCard from './TopMoversCard';

const MarketOverview: React.FC = () => {
  const { 
    tickers, 
    globalData, 
    isLoading, 
    error, 
    refreshData,
    setSelectedCoin,
    topGainers,
    topLosers
  } = useCrypto();

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={COLORS.LOADING} />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (isLoading) return null;
    return <EmptyState message="No hay datos disponibles" />;
  };

  const renderHeader = () => (
    <>
      {globalData && <GlobalStatsCard data={globalData} />}
      
      {topGainers.length > 0 && (
        <TopMoversCard 
          title="Top Ganadores (24h)" 
          data={topGainers}
          onSelectCoin={setSelectedCoin}
        />
      )}
      
      {topLosers.length > 0 && (
        <TopMoversCard 
          title="Top Perdedores (24h)" 
          data={topLosers}
          onSelectCoin={setSelectedCoin}
        />
      )}
      
      <Text style={styles.sectionTitle}>Todas las Criptomonedas</Text>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tickers}
        renderItem={({ item }) => (
          <CoinItem 
            coin={item} 
            onSelect={setSelectedCoin}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
        }
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

export default memo(MarketOverview);