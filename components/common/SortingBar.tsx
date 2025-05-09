import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type SortOption<T extends string> = {
  field: T;
  label: string;
};

interface SortingBarProps<T extends string> {
  sortOptions: SortOption<T>[];
  currentSortField: T;
  isAscending: boolean;
  onSortChange: (field: T) => void;
  containerStyle?: ViewStyle;
}

function SortingBar<T extends string>({
  sortOptions,
  currentSortField,
  isAscending,
  onSortChange,
  containerStyle,
}: SortingBarProps<T>) {
  const theme = useTheme();

  const getSortIcon = () => {
    return isAscending ? "arrow-up" : "arrow-down";
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sortBarContainer}>
          {sortOptions.map((option) => {
            const isSelected = currentSortField === option.field;

            return (
              <TouchableOpacity
                key={option.field}
                onPress={() => onSortChange(option.field)}
                style={[styles.sortOption, isSelected && styles.selectedOption]}
                activeOpacity={0.7}
              >
                {isSelected ? (
                  <View
                    style={[
                      styles.gradientBackground,
                      { backgroundColor: "#60A5FA" },
                    ]}
                  >
                    <View style={styles.sortOptionContent}>
                      <Text style={[styles.sortLabel, styles.selectedLabel]}>
                        {option.label}
                      </Text>
                      <MaterialCommunityIcons
                        name={getSortIcon()}
                        size={16}
                        color="#FFFFFF"
                        style={styles.sortIcon}
                      />
                    </View>
                    <View style={styles.selectedIndicator} />
                  </View>
                ) : (
                  <View style={styles.sortOptionContent}>
                    <Text style={styles.sortLabel}>{option.label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  sortBarContainer: {
    flexDirection: "row",
    backgroundColor: "#1A2234",
    borderRadius: 16,
    marginVertical: 8,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  sortOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    minWidth: 100,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginHorizontal: 1,
  },
  selectedOption: {
    backgroundColor: "transparent",
    shadowColor: "#60A5FA",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  sortOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sortLabel: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  selectedLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  sortIcon: {
    marginLeft: 6,
  },
  selectedIndicator: {
    position: "absolute",
    bottom: 0,
    left: 6,
    right: 6,
    height: 2.5,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
});

export default SortingBar;
