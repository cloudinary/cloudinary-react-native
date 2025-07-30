import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopControlsProps, ButtonPosition } from '../types';
import { styles, getResponsiveStyles } from '../styles';
import { ICON_SIZES } from '../constants';

export const TopControls: React.FC<TopControlsProps> = ({ 
  onBack, 
  onShare, 
  backButtonPosition,
  shareButtonPosition,
  isLandscape = false
}) => {
  const responsiveStyles = getResponsiveStyles(isLandscape);

  const getPositionStyle = (position: ButtonPosition) => {
    switch (position) {
      case ButtonPosition.NE:
        return responsiveStyles.buttonPositionNE;
      case ButtonPosition.NW:
        return responsiveStyles.buttonPositionNW;
      case ButtonPosition.N:
        return responsiveStyles.buttonPositionN;
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
      <View style={responsiveStyles.topControlsBar}>
        {/* Invisible spacer to maintain layout */}
        {onBack && backButtonPosition && backButtonPosition !== ButtonPosition.SE && (
          <TouchableOpacity 
            style={[responsiveStyles.topButton, getPositionStyle(backButtonPosition)]} 
            onPress={onBack}
          >
            <Ionicons name="close" size={ICON_SIZES.top} color="white" />
          </TouchableOpacity>
        )}
        {shareButtonPosition && shareButtonPosition !== ButtonPosition.SE && (
          <TouchableOpacity 
            style={[responsiveStyles.topButton, getPositionStyle(shareButtonPosition)]} 
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
      <View style={responsiveStyles.topControlsBar}>
        {onBack && (
          <TouchableOpacity style={responsiveStyles.topButton} onPress={onBack}>
            <Ionicons name="close" size={ICON_SIZES.top} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={responsiveStyles.topButton} onPress={onShare}>
          <Ionicons name="share-outline" size={ICON_SIZES.top} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  // Return empty spacer if only SE buttons are specified
  return <View style={responsiveStyles.topControlsBar} />;
}; 