import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { styles } from './ErrorMessage.styles';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
};

export default memo(ErrorMessage); 