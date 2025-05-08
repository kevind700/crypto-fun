import { StyleSheet } from 'react-native';
import { COLORS, LAYOUT, TYPOGRAPHY } from '../constants';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: LAYOUT.SPACING_LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    backgroundColor: COLORS.SURFACE,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rank: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginRight: LAYOUT.SPACING_MD,
    minWidth: 30,
  },
  nameSection: {
    flex: 1,
  },
  symbol: {
    fontSize: TYPOGRAPHY.FONT_SIZE_MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  name: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: LAYOUT.SPACING_XS,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: TYPOGRAPHY.FONT_SIZE_MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  change: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    marginTop: LAYOUT.SPACING_XS,
  },
}); 