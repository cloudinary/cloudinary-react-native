import React from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlaybackSpeedConfig, PlaybackSpeedOption } from '../types';
import { getResponsiveStyles } from '../styles';
import { ICON_SIZES } from '../constants';

interface PlaybackSpeedButtonProps {
  playbackSpeed?: PlaybackSpeedConfig;
  currentSpeed?: number;
  onSpeedChange?: (speed: number) => void;
  isLandscape?: boolean;
  isMenuVisible?: boolean;
  onToggleMenu?: () => void;
}

const DEFAULT_SPEEDS: PlaybackSpeedOption[] = [
  { value: 0.5, label: '0.5×' },
  { value: 1.0, label: '1.0×' },
  { value: 1.25, label: '1.25×' },
  { value: 1.5, label: '1.5×' },
  { value: 2.0, label: '2.0×' },
];

export const PlaybackSpeedButton: React.FC<PlaybackSpeedButtonProps> = ({
  playbackSpeed,
  currentSpeed = 1.0,
  onSpeedChange,
  isLandscape = false,
  isMenuVisible = false,
  onToggleMenu,
}) => {
  const responsiveStyles = getResponsiveStyles(isLandscape);

  // Don't render if playback speed is not enabled
  if (!playbackSpeed?.enabled) {
    return null;
  }

  const speedOptions = playbackSpeed.speeds || DEFAULT_SPEEDS;
  const currentSpeedLabel = speedOptions.find(option => option.value === currentSpeed)?.label || '1.0×';

  const handleSpeedSelect = (speed: number) => {
    onToggleMenu?.(); // Close the menu
    onSpeedChange?.(speed);
  };

  const toggleMenu = () => {
    onToggleMenu?.();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[responsiveStyles.volumeButton, styles.speedButton]} 
        onPress={toggleMenu}
      >
        <Ionicons 
          name="speedometer-outline" 
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
          <View style={[styles.speedMenu, isLandscape && styles.speedMenuLandscape]}>
            <View style={styles.speedMenuHeader}>
              <Text style={styles.speedMenuTitle}>Playback Speed</Text>
            </View>
            
            {speedOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.speedOption,
                  currentSpeed === option.value && styles.speedOptionSelected
                ]}
                onPress={() => handleSpeedSelect(option.value)}
              >
                <Text style={[
                  styles.speedOptionText,
                  currentSpeed === option.value && styles.speedOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {currentSpeed === option.value && (
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
  speedButton: {
    // Additional styling for the speed button if needed
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedMenu: {
    backgroundColor: 'rgba(42, 42, 46, 0.95)',
    borderRadius: 16,
    minWidth: 200,
    maxWidth: 280,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  speedMenuLandscape: {
    maxWidth: 240,
  },
  speedMenuHeader: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  speedMenuTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  speedOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  speedOptionSelected: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
  },
  speedOptionText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '400',
  },
  speedOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
