import { Platform } from "react-native";
import { LAYOUT, TYPOGRAPHY } from "../../../constants";

export const getTabStyles = (colors: any) => ({
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.onSurfaceDisabled,
  tabBarStyle: {
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    height: Platform.OS === "ios" ? 90 : 60,
    paddingBottom: Platform.OS === "ios" ? 30 : 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 3,
  },
  tabBarLabelStyle: {
    fontFamily: "System",
    fontSize: TYPOGRAPHY.FONT_SIZE_XS,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
    marginTop: LAYOUT.SPACING_XS,
  },
  headerStyle: {
    backgroundColor: colors.surface,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    fontFamily: "System",
    fontSize: TYPOGRAPHY.FONT_SIZE_XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: colors.onSurface,
  },
  headerTintColor: colors.onSurface,
  tabBarIconStyle: {
    marginTop: LAYOUT.SPACING_XS,
  },
});
