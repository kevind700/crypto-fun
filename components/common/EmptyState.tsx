import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { styles } from './EmptyState.styles';

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default memo(EmptyState); 