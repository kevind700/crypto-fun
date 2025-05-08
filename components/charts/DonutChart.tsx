import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Svg, { G, Circle } from 'react-native-svg';

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

  let currentAngle = 0;
  const circles = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const x = centerX + radius * Math.cos(((currentAngle + angle / 2) * Math.PI) / 180);
    const y = centerY + radius * Math.sin(((currentAngle + angle / 2) * Math.PI) / 180);

    // Create the SVG arc
    const startAngle = currentAngle;
    currentAngle += angle;
    const endAngle = currentAngle;

    // All path-related calculations removed as they were unused

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
        <Text
          style={[
            styles.label,
            {
              position: 'absolute',
              left: x - 40,
              top: y - 10,
              color: theme.colors.onSurface,
            },
          ]}>
          {`${item.label}\n${percentage.toFixed(1)}%`}
        </Text>
      </G>
    );
  });

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {circles}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default DonutChart;