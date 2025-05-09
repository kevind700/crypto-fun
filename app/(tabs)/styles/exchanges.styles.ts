import { StyleSheet } from "react-native";
import { COLORS, LAYOUT, TYPOGRAPHY } from "../../../constants";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: LAYOUT.SPACING_LG,
    paddingVertical: LAYOUT.SPACING_SM,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  headerControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    marginRight: LAYOUT.SPACING_MD,
    height: 40,
    shadowColor: "rgba(96, 165, 250, 0.2)",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.3,
  },
  sortInfoContainer: {
    marginTop: LAYOUT.SPACING_SM,
    paddingVertical: LAYOUT.SPACING_XS,
    paddingHorizontal: LAYOUT.SPACING_SM,
    backgroundColor: "rgba(96, 165, 250, 0.1)",
    borderRadius: LAYOUT.BORDER_RADIUS_MD,
    alignSelf: "flex-start",
  },
  sortInfoText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: "#60A5FA",
  },
  list: {
    padding: LAYOUT.SPACING_LG,
  },
  exchangeCard: {
    padding: LAYOUT.SPACING_LG,
    marginBottom: LAYOUT.SPACING_LG,
    borderRadius: LAYOUT.BORDER_RADIUS_LG,
  },
  exchangeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: LAYOUT.SPACING_MD,
  },
  exchangeInfo: {
    flex: 1,
  },
  name: {
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    marginBottom: LAYOUT.SPACING_XS,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    marginRight: LAYOUT.SPACING_XS,
  },
  locationText: {
    color: COLORS.TEXT_SECONDARY,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: LAYOUT.SPACING_LG,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    marginBottom: LAYOUT.SPACING_MD,
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    marginVertical: LAYOUT.SPACING_XS,
  },
  statLabel: {
    color: COLORS.TEXT_SECONDARY,
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(0,0,0,0.05)",
    alignSelf: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  visitText: {
    color: "#60A5FA",
    marginLeft: LAYOUT.SPACING_XS,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: LAYOUT.SPACING_XL,
  },
  emptyText: {
    textAlign: "center",
    marginTop: LAYOUT.SPACING_MD,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: LAYOUT.SPACING_LG,
    paddingHorizontal: LAYOUT.SPACING_MD,
    marginBottom: LAYOUT.SPACING_LG,
  },
  paginationText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
    color: "#60A5FA",
  },
  paginationButton: {
    height: 36,
    minWidth: 100,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingFooter: {
    padding: LAYOUT.SPACING_MD,
    justifyContent: "center",
    alignItems: "center",
  },
});
