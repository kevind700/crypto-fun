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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    marginBottom: LAYOUT.SPACING_LG,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
  },
  statValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE_MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },
}); 