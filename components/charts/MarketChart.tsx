import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from 'react-native-paper';
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
  height = 220,
  width = Dimensions.get('window').width - 32,
  withDots = false,
  withInnerLines = true,
  withOuterLines = true,
  withVerticalLabels = true,
  withHorizontalLabels = true,
}) => {
  const theme = useTheme();

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
          decimalPlaces: 2,
          color: (opacity = 1) => theme.colors.primary + opacity.toString(16).padStart(2, '0'),
          labelColor: (opacity = 1) => theme.colors.onSurface + opacity.toString(16).padStart(2, '0'),
          style: {
            borderRadius: theme.roundness,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: theme.colors.primary,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: theme.roundness,
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
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MarketChart;