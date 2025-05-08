import { StyleSheet } from 'react-native';
import { COLORS, LAYOUT, TYPOGRAPHY } from '../../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: LAYOUT.SPACING_LG,
    paddingVertical: LAYOUT.SPACING_SM,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    marginRight: LAYOUT.SPACING_MD,
    height: 40,
    shadowColor: 'rgba(96, 165, 250, 0.2)',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.3,
  },
  sortInfoContainer: {
    marginTop: LAYOUT.SPACING_SM,
    paddingVertical: LAYOUT.SPACING_XS,
    paddingHorizontal: LAYOUT.SPACING_SM,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    borderRadius: LAYOUT.BORDER_RADIUS_MD,
    alignSelf: 'flex-start',
  },
  sortInfoText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: '#60A5FA',
  },
  list: {
    padding: LAYOUT.SPACING_LG,
  },
  coinCard: {
    padding: LAYOUT.SPACING_LG,
    marginBottom: LAYOUT.SPACING_LG,
    borderRadius: LAYOUT.BORDER_RADIUS_LG,
  },
  coinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: LAYOUT.SPACING_MD,
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: LAYOUT.SPACING_SM,
  },
  rank: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: '#60A5FA',
  },
  symbol: {
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },
  name: {
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
    maxWidth: 150,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    marginBottom: LAYOUT.SPACING_XS,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.SPACING_SM,
    paddingVertical: LAYOUT.SPACING_XS,
    borderRadius: LAYOUT.BORDER_RADIUS_SM,
  },
  change: {
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: LAYOUT.SPACING_SM,
    marginTop: LAYOUT.SPACING_SM,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: LAYOUT.SPACING_SM,
    flex: 1,
    justifyContent: 'center',
  },
  statIcon: {
    marginRight: LAYOUT.SPACING_SM,
  },
  statTextContainer: {
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XS,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  statValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: LAYOUT.SPACING_XL,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: LAYOUT.SPACING_MD,
  },
}); 