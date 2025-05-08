/**
 * EmptyState Component
 * 
 * This component displays a message when there is no content to show,
 * such as an empty list or search results with no matches.
 * 
 * It provides a consistent empty state display across the application.
 */

import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { styles } from './EmptyState.styles';

/**
 * EmptyState component props
 * @interface EmptyStateProps
 * @property {string} message - The message to display in the empty state
 */
interface EmptyStateProps {
  message: string;
}

/**
 * EmptyState component renders a simple message for empty content states
 * @param {EmptyStateProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(EmptyState); 