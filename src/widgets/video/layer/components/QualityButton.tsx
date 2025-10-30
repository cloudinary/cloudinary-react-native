import React from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QualityConfig, QualityOption } from '../types';
import { getResponsiveStyles } from '../styles';
import { ICON_SIZES } from '../constants';

interface QualityButtonProps {
  quality?: QualityConfig;
  currentQuality?: string;
  onQualityChange?: (qualityValue: string) => void;
  isLandscape?: boolean;
  isMenuVisible?: boolean;
  onToggleMenu?: () => void;
}

export const QualityButton: React.FC<QualityButtonProps> = ({
  quality,
  currentQuality = 'auto',
  onQualityChange,
  isLandscape = false,
  isMenuVisible = false,
  onToggleMenu,
}) => {
  const responsiveStyles = getResponsiveStyles(isLandscape);

  // Don't render if quality selection is not enabled or no options available
  if (!quality?.enabled) {
    return null;
  }

  const qualityOptions = quality.qualities || [];
  
  // Don't render if no quality options available
  if (qualityOptions.length === 0) {
    return null;
  }

  const currentQualityLabel = qualityOptions.find(option => option.value === currentQuality)?.label || 'Auto';

  const handleQualitySelect = (qualityValue: string) => {
    onQualityChange?.(qualityValue);
    onToggleMenu?.(); // Close the menu
  };

  const toggleMenu = () => {
    onToggleMenu?.();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[responsiveStyles.volumeButton, styles.qualityButton]} 
        onPress={toggleMenu}
      >
        <Ionicons 
          name="cog-outline" 
          size={ICON_SIZES.bottomVolume} 
          color="white" 
          style={responsiveStyles.volumeIcon}
        />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isMenuVisible}
        animationType="fade"
        onRequestClose={onToggleMenu}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={onToggleMenu}
        >
          <View style={[styles.qualityMenu, isLandscape && styles.qualityMenuLandscape]}>
            <View style={styles.qualityMenuHeader}>
              <Text style={styles.qualityMenuTitle}>Quality</Text>
            </View>
            
            {qualityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.qualityOption,
                  currentQuality === option.value && styles.qualityOptionSelected
                ]}
                onPress={() => handleQualitySelect(option.value)}
              >
                <View style={styles.qualityOptionContent}>
                  <Text style={[
                    styles.qualityOptionText,
                    currentQuality === option.value && styles.qualityOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {option.resolution && option.value !== 'auto' && (
                    <Text style={styles.qualityOptionSubtext}>
                      {option.resolution}
                    </Text>
                  )}
                </View>
                {currentQuality === option.value && (
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  qualityButton: {
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qualityMenu: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 12,
    padding: 4,
    minWidth: 200,
    maxWidth: 300,
    maxHeight: '70%',
    marginBottom: 100,
  },
  qualityMenuLandscape: {
    marginBottom: 50,
    minWidth: 220,
  },
  qualityMenuHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  qualityMenuTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  qualityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
    marginHorizontal: 4,
  },
  qualityOptionSelected: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
  },
  qualityOptionContent: {
    flex: 1,
  },
  qualityOptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  qualityOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  qualityOptionSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
});
