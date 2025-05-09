import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import {
  Menu,
  Button,
  Text,
  Surface,
  useTheme,
  IconButton,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type SortOption<T extends string> = {
  field: T;
  label: string;
};

interface SortSelectorProps<T extends string> {
  sortOptions: SortOption<T>[];
  currentSortField: T;
  isAscending: boolean;
  onSortChange: (field: T) => void;
  onDirectionChange: () => void;
}

function SortSelector<T extends string>({
  sortOptions,
  currentSortField,
  isAscending,
  onSortChange,
  onDirectionChange,
}: SortSelectorProps<T>) {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  const currentOption = sortOptions.find(
    (option) => option.field === currentSortField,
  );

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Surface style={styles.container}>
      <View style={styles.sortSelector}>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu} style={styles.fieldSelector}>
              <Text style={styles.selectorText}>
                Sort by: {currentOption?.label || "Rank"}
              </Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={18}
                color="#CBD5E1"
              />
            </TouchableOpacity>
          }
          contentStyle={styles.menuContent}
        >
          {sortOptions.map((option) => (
            <Menu.Item
              key={option.field}
              onPress={() => {
                onSortChange(option.field);
                closeMenu();
              }}
              title={option.label}
              titleStyle={[
                styles.menuItemText,
                currentSortField === option.field &&
                  styles.selectedMenuItemText,
              ]}
              style={[
                styles.menuItem,
                currentSortField === option.field && styles.selectedMenuItem,
              ]}
              leadingIcon={
                currentSortField === option.field ? "check" : undefined
              }
            />
          ))}
        </Menu>

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={onDirectionChange}
          style={styles.directionButton}
        >
          <MaterialCommunityIcons
            name={isAscending ? "sort-ascending" : "sort-descending"}
            size={22}
            color="#60A5FA"
          />
        </TouchableOpacity>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    backgroundColor: "#1A2234",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2A3346",
  },
  sortSelector: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
  },
  fieldSelector: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 48,
  },
  selectorText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#374151",
  },
  directionButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(96, 165, 250, 0.1)",
  },
  menuContent: {
    backgroundColor: "#1A2234",
    marginTop: 8,
    borderRadius: 10,
    width: 200,
    borderWidth: 1,
    borderColor: "#2A3346",
    elevation: 8,
  },
  menuItem: {
    height: 44,
  },
  selectedMenuItem: {
    backgroundColor: "rgba(96, 165, 250, 0.15)",
    borderLeftWidth: 3,
    borderLeftColor: "#60A5FA",
  },
  menuItemText: {
    color: "#CBD5E1",
  },
  selectedMenuItemText: {
    color: "#60A5FA",
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
});

export default SortSelector;
