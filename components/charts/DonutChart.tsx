import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Svg, { G, Circle, Text as SvgText } from 'react-native-svg';

interface DonutChartProps {
  data: {
    value: number;
    color: string;
    label: string;
  }[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  radius?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  width = Dimensions.get('window').width - 32,
  height = 220,
  strokeWidth = 40,
  radius = 80,
}) => {
  const theme = useTheme();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = width / 2;
  const centerY = height / 2;

  // Create label data for the legend
  const legendItems = data.map((item) => {
    const percentage = (item.value / total) * 100;
    return {
      color: item.color,
      label: item.label,
      percentage: percentage.toFixed(1),
    };
  });

  // Calculate circle segments
  let currentAngle = 0;
  const circles = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    
    // Calculate angle for labels
    const midAngle = ((currentAngle + (currentAngle + angle)) / 2) * (Math.PI / 180);
    const labelRadius = radius + 10;
    const labelX = centerX + labelRadius * Math.cos(midAngle);
    const labelY = centerY + labelRadius * Math.sin(midAngle);
    
    // Calculate the arc
    const startAngle = currentAngle;
    currentAngle += angle;
    
    return (
      <G key={index}>
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke={item.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${(angle / 360) * (2 * Math.PI * radius)} ${2 * Math.PI * radius}`}
          strokeDashoffset={-(startAngle / 360) * (2 * Math.PI * radius)}
          fill="none"
        />
        <SvgText
          x={labelX}
          y={labelY}
          fontSize="12"
          fill={theme.colors.onSurface.toString()}
          textAnchor="middle"
          alignmentBaseline="middle">
          {percentage > 5 ? `${percentage.toFixed(0)}%` : ''}
        </SvgText>
      </G>
    );
  });

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {circles}
      </Svg>
      <View style={styles.legend}>
        {legendItems.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.label}: {item.percentage}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  colorBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
});

export default DonutChart;