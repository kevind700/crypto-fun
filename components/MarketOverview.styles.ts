import { StyleSheet } from 'react-native';
import { COLORS, LAYOUT, TYPOGRAPHY } from '../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  footer: {
    padding: LAYOUT.SPACING_SM,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    marginHorizontal: LAYOUT.SPACING_LG,
    marginTop: LAYOUT.SPACING_SM,
    marginBottom: LAYOUT.SPACING_SM,
  }
}); 