import { StyleSheet } from 'react-native';
import { COLORS, LAYOUT, TYPOGRAPHY } from '../constants';

export const styles = StyleSheet.create({
  container: {
    margin: LAYOUT.SPACING_LG,
    padding: LAYOUT.SPACING_LG,
    borderRadius: LAYOUT.BORDER_RADIUS_MD,
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    marginBottom: LAYOUT.SPACING_LG,
  },
  listContent: {
    paddingRight: LAYOUT.SPACING_SM,
  },
  moverItem: {
    padding: LAYOUT.SPACING_MD,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: LAYOUT.BORDER_RADIUS_MD,
    marginRight: LAYOUT.SPACING_SM,
    minWidth: 120,
    alignItems: 'center',
  },
  symbol: {
    fontSize: TYPOGRAPHY.FONT_SIZE_MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    marginBottom: LAYOUT.SPACING_XS,
  },
  price: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    marginBottom: LAYOUT.SPACING_XS,
  },
  change: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },
}); 