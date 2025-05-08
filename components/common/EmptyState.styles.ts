import { StyleSheet } from 'react-native';
import { COLORS, LAYOUT, TYPOGRAPHY } from '../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: LAYOUT.SPACING_XL,
  },
  message: {
    textAlign: 'center',
    fontSize: TYPOGRAPHY.FONT_SIZE_MD,
    color: COLORS.TEXT_SECONDARY,
  },
}); 