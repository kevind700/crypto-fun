import { StyleSheet } from "react-native";
import { LAYOUT, TYPOGRAPHY } from "../../../constants";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: LAYOUT.SPACING_LG,
  },
  card: {
    borderRadius: LAYOUT.BORDER_RADIUS_LG,
    marginBottom: LAYOUT.SPACING_LG,
    elevation: 2,
    overflow: "hidden",
  },
  cardTitle: {
    padding: LAYOUT.SPACING_LG,
    paddingBottom: LAYOUT.SPACING_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: LAYOUT.SPACING_LG,
    paddingBottom: LAYOUT.SPACING_LG,
  },
  metricBox: {
    flex: 1,
    marginHorizontal: LAYOUT.SPACING_SM,
  },
  metricTitle: {
    opacity: 0.7,
    marginBottom: LAYOUT.SPACING_XS,
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
  },
  metricValue: {
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    marginBottom: LAYOUT.SPACING_SM,
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: LAYOUT.SPACING_SM,
    paddingVertical: LAYOUT.SPACING_XS,
    borderRadius: LAYOUT.BORDER_RADIUS_SM,
    alignSelf: "flex-start",
  },
  changeText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    marginLeft: LAYOUT.SPACING_XS,
  },
  dominanceContainer: {
    paddingHorizontal: LAYOUT.SPACING_LG,
    paddingBottom: LAYOUT.SPACING_LG,
  },
  dominanceTitle: {
    marginBottom: LAYOUT.SPACING_LG,
    opacity: 0.7,
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
  },
  dominanceMetrics: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dominanceItem: {
    alignItems: "center",
  },
  dominanceValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE_MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    marginTop: LAYOUT.SPACING_SM,
  },
  dominanceLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    opacity: 0.7,
    marginTop: LAYOUT.SPACING_XS,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: LAYOUT.SPACING_LG,
    paddingBottom: LAYOUT.SPACING_LG,
    paddingTop: LAYOUT.SPACING_SM,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE_MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
    marginTop: LAYOUT.SPACING_XS,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    opacity: 0.7,
    marginTop: LAYOUT.SPACING_XS,
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  moversContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: LAYOUT.SPACING_LG,
  },
  moverItem: {
    width: "48%",
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: LAYOUT.BORDER_RADIUS_MD,
    padding: LAYOUT.SPACING_MD,
    margin: "1%",
  },
  moverHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: LAYOUT.SPACING_XS,
  },
  moverSymbol: {
    fontSize: TYPOGRAPHY.FONT_SIZE_MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },
  moverChange: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
  },
  moverName: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    opacity: 0.7,
  },
});
