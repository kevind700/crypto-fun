import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList, Dimensions } from 'react-native';
import { Text, Surface, Portal, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type SortOption<T extends string> = {
  field: T;
  label: string;
};

interface SortModalProps<T extends string> {
  sortOptions: SortOption<T>[];
  currentSortField: T;
  isAscending: boolean;
  onSortChange: (field: T) => void;
  onDirectionChange: () => void;
}

function SortModal<T extends string>({
  sortOptions,
  currentSortField,
  isAscending,
  onSortChange,
  onDirectionChange,
}: SortModalProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSortField, setTempSortField] = useState<T>(currentSortField);
  const [tempIsAscending, setTempIsAscending] = useState(isAscending);
  const insets = useSafeAreaInsets();
  
  const currentOption = sortOptions.find(option => option.field === currentSortField);

  const openModal = () => {
    setTempSortField(currentSortField);
    setTempIsAscending(isAscending);
    setModalVisible(true);
  };
  
  const closeModal = () => setModalVisible(false);

  const handleSortChange = (field: T) => {
    setTempSortField(field);
  };

  const renderSortOption = ({ item }: { item: SortOption<T> }) => {
    const isSelected = item.field === tempSortField;
    
    return (
      <TouchableOpacity
        style={[styles.optionItem, isSelected && styles.selectedOptionItem]}
        onPress={() => handleSortChange(item.field)}
      >
        <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
          {item.label}
        </Text>
        {isSelected && (
          <MaterialCommunityIcons 
            name="check" 
            size={22} 
            color="#60A5FA" 
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.sortButton}
        onPress={openModal}
      >
        <View style={styles.sortButtonContent}>
          <View style={styles.sortTypeContainer}>
            <MaterialCommunityIcons 
              name="sort" 
              size={18} 
              color="#60A5FA" 
            />
            <Text style={styles.sortButtonText}>
              {currentOption?.label || 'Sort by'}
            </Text>
          </View>
          <View style={styles.sortDirectionContainer}>
            <MaterialCommunityIcons 
              name={isAscending ? "sort-ascending" : "sort-descending"} 
              size={18} 
              color="#60A5FA" 
            />
            <MaterialCommunityIcons 
              name="chevron-down" 
              size={16} 
              color="#94A3B8" 
              style={styles.chevronIcon}
            />
          </View>
        </View>
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalDismissArea} 
              onPress={closeModal}
              activeOpacity={1}
            />
            <Surface 
              style={[
                styles.modalContent, 
                { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }
              ]}
            >
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>

              <Text style={styles.modalTitle}>Sort by</Text>

              <FlatList
                data={sortOptions}
                renderItem={renderSortOption}
                keyExtractor={(item) => item.field}
                style={styles.optionsList}
              />

              <View style={styles.directionContainer}>
                <Text style={styles.directionTitle}>Direction</Text>
                
                <View style={styles.directionButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.directionButton, 
                      tempIsAscending && styles.activeDirectionButton
                    ]}
                    onPress={() => { 
                      setTempIsAscending(true); 
                    }}
                  >
                    <MaterialCommunityIcons 
                      name="sort-ascending" 
                      size={24} 
                      color={tempIsAscending ? "white" : "#94A3B8"} 
                    />
                    <Text style={[
                      styles.directionText,
                      tempIsAscending && styles.activeDirectionText
                    ]}>
                      Ascending
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.directionButton, 
                      !tempIsAscending && styles.activeDirectionButton
                    ]}
                    onPress={() => { 
                      setTempIsAscending(false); 
                    }}
                  >
                    <MaterialCommunityIcons 
                      name="sort-descending" 
                      size={24} 
                      color={!tempIsAscending ? "white" : "#94A3B8"} 
                    />
                    <Text style={[
                      styles.directionText,
                      !tempIsAscending && styles.activeDirectionText
                    ]}>
                      Descending
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <Button 
                mode="contained" 
                style={styles.closeButton}
                onPress={() => {
                  if (tempSortField !== currentSortField) {
                    onSortChange(tempSortField);
                  }
                  if (tempIsAscending !== isAscending) {
                    onDirectionChange();
                  }
                  closeModal();
                }}
              >
                Done
              </Button>
            </Surface>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  sortButton: {
    backgroundColor: '#1A2234',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#2A3346',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  sortButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortDirectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 15,
  },
  chevronIcon: {
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalDismissArea: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#374151',
    borderRadius: 3,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 16,
    marginHorizontal: 20,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  selectedOptionItem: {
    backgroundColor: 'rgba(96, 165, 250, 0.15)',
  },
  optionText: {
    fontSize: 16,
    color: '#CBD5E1',
  },
  selectedOptionText: {
    color: '#60A5FA',
    fontWeight: 'bold',
  },
  directionContainer: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  directionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  directionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  directionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  activeDirectionButton: {
    backgroundColor: '#3B82F6',
  },
  directionText: {
    color: '#94A3B8',
    fontWeight: '500',
    marginLeft: 8,
  },
  activeDirectionText: {
    color: 'white',
  },
  closeButton: {
    margin: 20,
    marginTop: 8,
    backgroundColor: '#3B82F6',
  },
});

export default SortModal;