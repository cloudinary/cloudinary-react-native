import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopControlsProps, ButtonPosition, ButtonLayoutDirection } from '../types';
import { styles, getResponsiveStyles } from '../styles';
import { ICON_SIZES } from '../constants';
import { CustomButton } from './CustomButton';

export const TopControls: React.FC<TopControlsProps> = ({ 
  onBack, 
  onShare, 
  backButtonPosition,
  shareButtonPosition,
  isLandscape = false,
  fullScreen,
  isFullScreen = false,
  onToggleFullScreen,
  buttonGroups = []
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
      case ButtonPosition.SE:
        return responsiveStyles.buttonPositionSE;
      case ButtonPosition.SW:
        return responsiveStyles.buttonPositionSW;
      case ButtonPosition.S:
        return responsiveStyles.buttonPositionS;
      case ButtonPosition.E:
        return responsiveStyles.buttonPositionE;
      case ButtonPosition.W:
        return responsiveStyles.buttonPositionW;
      default:
        return {};
    }
  };



  // Create default full screen button if enabled
  const defaultFullScreenButton = fullScreen?.enabled === true && fullScreen?.button ? {
    ...fullScreen.button,
    onPress: fullScreen.button.onPress || onToggleFullScreen
  } : fullScreen?.enabled === true ? {
    icon: isFullScreen ? 'contract-outline' : 'expand-outline',
    position: ButtonPosition.NE,
    onPress: onToggleFullScreen
  } : null;

  // Process button groups format for top positions
  const processedButtonGroups: Record<string, { buttons: any[], layoutDirection: ButtonLayoutDirection }> = {};
  
  buttonGroups
    .filter(group => [ButtonPosition.N, ButtonPosition.NE, ButtonPosition.NW].includes(group.position))
    .forEach(group => {
      processedButtonGroups[group.position] = {
        buttons: group.buttons,
        layoutDirection: group.layoutDirection || ButtonLayoutDirection.VERTICAL
      };
    });

  // Add default full screen button if enabled and not already in a group
  if (defaultFullScreenButton && !processedButtonGroups[ButtonPosition.NE]) {
    processedButtonGroups[ButtonPosition.NE] = {
      buttons: [defaultFullScreenButton],
      layoutDirection: ButtonLayoutDirection.VERTICAL
    };
  } else if (defaultFullScreenButton && processedButtonGroups[ButtonPosition.NE]) {
    // Check if full screen button is already in the group to avoid duplicates
    const existingButtons = processedButtonGroups[ButtonPosition.NE].buttons;
    const hasFullScreenButton = existingButtons.some(button => 
      button.icon === defaultFullScreenButton.icon || 
      (button.icon === 'expand-outline' || button.icon === 'contract-outline')
    );
    
    if (!hasFullScreenButton) {
      processedButtonGroups[ButtonPosition.NE].buttons.push(defaultFullScreenButton);
    }
  }

  // Extract buttons for each position
  const topPositionedButtons = Object.values(processedButtonGroups).flatMap(group => group.buttons);

  // Check if we have any top-positioned buttons (NE, NW, N)
  const hasTopPositionedButtons = 
    (backButtonPosition && [ButtonPosition.N, ButtonPosition.NE, ButtonPosition.NW].includes(backButtonPosition)) ||
    (shareButtonPosition && [ButtonPosition.N, ButtonPosition.NE, ButtonPosition.NW].includes(shareButtonPosition)) ||
    topPositionedButtons.length > 0;

  // If we have top-positioned buttons, render them within the bar
  if (hasTopPositionedButtons) {
    return (
      <View style={responsiveStyles.topControlsBar}>
        {/* Left side - NW positioned button */}
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
          {onBack && backButtonPosition === ButtonPosition.NW && (
            <TouchableOpacity 
              style={responsiveStyles.topButton} 
              onPress={onBack}
            >
              <Ionicons name="close" size={ICON_SIZES.top} color="white" />
            </TouchableOpacity>
          )}
          {shareButtonPosition === ButtonPosition.NW && (
            <TouchableOpacity 
              style={responsiveStyles.topButton} 
              onPress={onShare}
            >
              <Ionicons name="share-outline" size={ICON_SIZES.top} color="white" />
            </TouchableOpacity>
          )}
          {processedButtonGroups[ButtonPosition.NW]?.buttons.map((button, index) => (
            <CustomButton 
              key={`nw-${index}`}
              config={button}
              isLandscape={isLandscape}
              defaultOnPress={button === defaultFullScreenButton ? onToggleFullScreen : undefined}
            />
          ))}
        </View>

        {/* Center - N positioned buttons */}
        <View style={{ flexDirection: 'row' }}>
          {onBack && backButtonPosition === ButtonPosition.N && (
            <TouchableOpacity 
              style={responsiveStyles.topButton} 
              onPress={onBack}
            >
              <Ionicons name="close" size={ICON_SIZES.top} color="white" />
            </TouchableOpacity>
          )}
          {shareButtonPosition === ButtonPosition.N && (
            <TouchableOpacity 
              style={responsiveStyles.topButton} 
              onPress={onShare}
            >
              <Ionicons name="share-outline" size={ICON_SIZES.top} color="white" />
            </TouchableOpacity>
          )}
          {processedButtonGroups[ButtonPosition.N]?.buttons.map((button, index) => (
            <CustomButton 
              key={`n-${index}`}
              config={button}
              isLandscape={isLandscape}
              defaultOnPress={button === defaultFullScreenButton ? onToggleFullScreen : undefined}
            />
          ))}
        </View>

        {/* Right side - NE positioned button */}
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
          {onBack && backButtonPosition === ButtonPosition.NE && (
            <TouchableOpacity 
              style={responsiveStyles.topButton} 
              onPress={onBack}
            >
              <Ionicons name="close" size={ICON_SIZES.top} color="white" />
            </TouchableOpacity>
          )}
          {shareButtonPosition === ButtonPosition.NE && (
            <TouchableOpacity 
              style={responsiveStyles.topButton} 
              onPress={onShare}
            >
              <Ionicons name="share-outline" size={ICON_SIZES.top} color="white" />
            </TouchableOpacity>
          )}
          {processedButtonGroups[ButtonPosition.NE]?.buttons.map((button, index) => (
            <CustomButton 
              key={`ne-${index}`}
              config={button}
              isLandscape={isLandscape}
              defaultOnPress={button === defaultFullScreenButton ? onToggleFullScreen : undefined}
            />
          ))}
        </View>
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