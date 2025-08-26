import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopControlsProps, ButtonPosition } from '../types';
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
  customButtons = []
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

  // Combine all buttons (default full screen + custom buttons)
  const allButtons = [
    ...(defaultFullScreenButton ? [defaultFullScreenButton] : []),
    ...customButtons
  ];

  // Filter buttons by position for top area (N, NE, NW)
  const topPositionedButtons = allButtons.filter(button => 
    [ButtonPosition.N, ButtonPosition.NE, ButtonPosition.NW].includes(button.position)
  );

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
          {topPositionedButtons
            .filter(button => button.position === ButtonPosition.NW)
            .map((button, index) => (
              <CustomButton 
                key={`nw-${index}`}
                config={button}
                isLandscape={isLandscape}
                defaultOnPress={button === defaultFullScreenButton ? onToggleFullScreen : undefined}
              />
            ))}
        </View>

        {/* Center - N positioned button */}
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
          {topPositionedButtons
            .filter(button => button.position === ButtonPosition.N)
            .map((button, index) => (
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
          {topPositionedButtons
            .filter(button => button.position === ButtonPosition.NE)
            .map((button, index) => (
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