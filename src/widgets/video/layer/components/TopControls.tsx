import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopControlsProps, ButtonPosition } from '../types';
import { styles } from '../styles';
import { ICON_SIZES } from '../constants';

export const TopControls: React.FC<TopControlsProps> = ({ 
  onBack, 
  onShare, 
  backButtonPosition,
  shareButtonPosition 
}) => {
  const getPositionStyle = (position: ButtonPosition) => {
    switch (position) {
      case ButtonPosition.NE:
        return styles.buttonPositionNE;
      case ButtonPosition.NW:
        return styles.buttonPositionNW;
      case ButtonPosition.N:
        return styles.buttonPositionN;
      default:
        return {};
    }
  };

  // Check if we have any top-positioned buttons (NE, NW, N)
  const hasTopPositionedButtons = 
    (backButtonPosition && backButtonPosition !== ButtonPosition.SE) ||
    (shareButtonPosition && shareButtonPosition !== ButtonPosition.SE);

  // If we have top-positioned buttons, render them with absolute positioning
  if (hasTopPositionedButtons) {
    return (
      <View style={styles.topControlsBar}>
        {/* Invisible spacer to maintain layout */}
        {onBack && backButtonPosition && backButtonPosition !== ButtonPosition.SE && (
          <TouchableOpacity 
            style={[styles.topButton, getPositionStyle(backButtonPosition)]} 
            onPress={onBack}
          >
            <Ionicons name="close" size={ICON_SIZES.top} color="white" />
          </TouchableOpacity>
        )}
        {shareButtonPosition && shareButtonPosition !== ButtonPosition.SE && (
          <TouchableOpacity 
            style={[styles.topButton, getPositionStyle(shareButtonPosition)]} 
            onPress={onShare}
          >
            <Ionicons name="share-outline" size={ICON_SIZES.top} color="white" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Default layout (original behavior) - only if no positioning is specified
  if (!backButtonPosition && !shareButtonPosition) {
    return (
      <View style={styles.topControlsBar}>
        {onBack && (
          <TouchableOpacity style={styles.topButton} onPress={onBack}>
            <Ionicons name="close" size={ICON_SIZES.top} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.topButton} onPress={onShare}>
          <Ionicons name="share-outline" size={ICON_SIZES.top} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  // Return empty spacer if only SE buttons are specified
  return <View style={styles.topControlsBar} />;
}; 