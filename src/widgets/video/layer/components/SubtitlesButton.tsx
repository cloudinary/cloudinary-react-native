import React from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SubtitlesConfig, SubtitleOption } from '../types';
import { getResponsiveStyles } from '../styles';
import { ICON_SIZES } from '../constants';

interface SubtitlesButtonProps {
  subtitles?: SubtitlesConfig;
  currentSubtitle?: string;
  onSubtitleChange?: (languageCode: string) => void;
  isLandscape?: boolean;
  isMenuVisible?: boolean;
  onToggleMenu?: () => void;
}

// Remove hardcoded default subtitles - now dynamically loaded from HLS manifest

export const SubtitlesButton: React.FC<SubtitlesButtonProps> = ({
  subtitles,
  currentSubtitle = 'off',
  onSubtitleChange,
  isLandscape = false,
  isMenuVisible = false,
  onToggleMenu,
}) => {
  const responsiveStyles = getResponsiveStyles(isLandscape);

  // Don't render if subtitles are not enabled or no options available
  if (!subtitles?.enabled) {
    return null;
  }

  const subtitleOptions = subtitles.languages || [];
  
  // Don't render if no subtitle options available (should not happen with our logic but defensive)
  if (subtitleOptions.length === 0) {
    return null;
  }
  const currentSubtitleLabel = subtitleOptions.find(option => option.code === currentSubtitle)?.label || 'Off';

  const handleSubtitleSelect = (languageCode: string) => {
    onToggleMenu?.(); // Close the menu
    onSubtitleChange?.(languageCode);
  };

  const toggleMenu = () => {
    onToggleMenu?.();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[responsiveStyles.volumeButton, styles.subtitlesButton]} 
        onPress={toggleMenu}
      >
        <Ionicons 
          name="chatbox-outline" 
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
          <View style={[styles.subtitlesMenu, isLandscape && styles.subtitlesMenuLandscape]}>
            <View style={styles.subtitlesMenuHeader}>
              <Text style={styles.subtitlesMenuTitle}>Subtitles</Text>
            </View>
            
            {subtitleOptions.map((option) => (
              <TouchableOpacity
                key={option.code}
                style={[
                  styles.subtitleOption,
                  currentSubtitle === option.code && styles.subtitleOptionSelected
                ]}
                onPress={() => handleSubtitleSelect(option.code)}
              >
                <Text style={[
                  styles.subtitleOptionText,
                  currentSubtitle === option.code && styles.subtitleOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {currentSubtitle === option.code && (
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
  subtitlesButton: {
    // Additional styling for the subtitles button if needed
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitlesMenu: {
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
  subtitlesMenuLandscape: {
    maxWidth: 240,
  },
  subtitlesMenuHeader: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  subtitlesMenuTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  subtitleOptionSelected: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
  },
  subtitleOptionText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '400',
  },
  subtitleOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
