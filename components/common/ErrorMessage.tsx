/**
 * ErrorMessage Component
 * 
 * This component displays an error message to the user when
 * something goes wrong in the application, such as API failures
 * or data loading errors.
 * 
 * It provides a consistent error display across the application.
 */

import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { styles } from './ErrorMessage.styles';

/**
 * ErrorMessage component props
 * @interface ErrorMessageProps
 * @property {string} message - The error message to display
 */
interface ErrorMessageProps {
  message: string;
}

/**
 * ErrorMessage component renders an error notification
 * @param {ErrorMessageProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ErrorMessage); 