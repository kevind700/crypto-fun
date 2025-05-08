import React from 'react';
import { View, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme, Text } from 'react-native-paper';
import { ChartData } from '../../services/types';

interface MarketChartProps {
  data: ChartData;
  height?: number;
  width?: number;
  withDots?: boolean;
  withInnerLines?: boolean;
  withOuterLines?: boolean;
  withVerticalLabels?: boolean;
  withHorizontalLabels?: boolean;
}

const MarketChart: React.FC<MarketChartProps> = ({
  data,
  height = 180,
  width = Dimensions.get('window').width - 32,
  withDots = false,
  withInnerLines = true,
  withOuterLines = false,
  withVerticalLabels = true,
  withHorizontalLabels = true,
}) => {
  const theme = useTheme();

  // Validate data to prevent chart errors
  const isValidData = data && 
    data.datasets && 
    data.datasets.length > 0 && 
    data.datasets[0].data && 
    data.datasets[0].data.length > 0;

  if (!isValidData) {
    return (
      <View style={[styles.container, styles.noDataContainer]}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={styles.noDataText}>Loading chart data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        width={width}
        height={height}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: theme.colors.surface,
          backgroundGradientFrom: theme.colors.surface,
          backgroundGradientTo: theme.colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
          style: {
            borderRadius: theme.roundness,
          },
          propsForDots: {
            r: '3',
            strokeWidth: '1',
            stroke: '#2563eb',
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            strokeWidth: 1,
            stroke: 'rgba(0, 0, 0, 0.05)',
          },
        }}
        bezier
        fromZero={false}
        segments={4}
        style={{
          marginVertical: 8,
          borderRadius: 12,
          paddingRight: 12,
        }}
        withDots={withDots}
        withInnerLines={withInnerLines}
        withOuterLines={withOuterLines}
        withVerticalLabels={withVerticalLabels}
        withHorizontalLabels={withHorizontalLabels}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
  }
});

export default MarketChart;