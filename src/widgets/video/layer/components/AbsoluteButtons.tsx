import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ButtonPosition, ButtonLayoutDirection } from '../types';
import { ICON_SIZES } from '../constants';
import { calculateButtonPosition } from '../utils';
import { getResponsiveStyles } from '../styles';
import { CustomButton } from './CustomButton';

interface AbsoluteButtonsProps {
  isControlsVisible: boolean;
  onBack?: () => void;
  backButtonPosition?: ButtonPosition;
  shareButtonPosition?: ButtonPosition;
  onShare: () => void;
  fullScreen?: any;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
  buttonGroups: any[];
  isLandscape: boolean;
}

export function AbsoluteButtons({
  isControlsVisible,
  onBack,
  backButtonPosition,
  shareButtonPosition,
  onShare,
  fullScreen,
  isFullScreen,
  onToggleFullScreen,
  buttonGroups,
  isLandscape
}: AbsoluteButtonsProps) {
  if (!isControlsVisible) return null;

  const responsiveStyles = getResponsiveStyles(isLandscape);

  // Create default full screen button if enabled
  const defaultFullScreenButton = fullScreen?.enabled === true && fullScreen?.button ? {
    ...fullScreen.button,
    onPress: fullScreen.button.onPress || onToggleFullScreen
  } : fullScreen?.enabled === true ? {
    icon: isFullScreen ? 'contract-outline' : 'expand-outline',
    position: ButtonPosition.NE,
    onPress: onToggleFullScreen
  } : null;

  // Process button groups format
  const processedButtonGroups: Record<string, { buttons: any[], layoutDirection: ButtonLayoutDirection }> = {};
  
  buttonGroups.forEach(group => {
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

  // Filter for absolute positioning (not in top controls bar)
  const absolutePositions = [ButtonPosition.SE, ButtonPosition.SW, ButtonPosition.S, ButtonPosition.E, ButtonPosition.W];
  const absoluteButtonGroups = Object.entries(processedButtonGroups).filter(([position]) => 
    absolutePositions.includes(position as ButtonPosition)
  );

  // Render buttons with enhanced spacing and layout direction
  const renderedButtons: React.ReactElement[] = [];

  absoluteButtonGroups.forEach(([position, { buttons, layoutDirection }]) => {
    buttons.forEach((button, index) => {
      // Get base position style
      const basePositionStyle = (() => {
        switch (button.position) {
          case ButtonPosition.SE: return responsiveStyles.buttonPositionSE;
          case ButtonPosition.SW: return responsiveStyles.buttonPositionSW;
          case ButtonPosition.S: return responsiveStyles.buttonPositionS;
          case ButtonPosition.E: return responsiveStyles.buttonPositionE;
          case ButtonPosition.W: return responsiveStyles.buttonPositionW;
          default: return {};
        }
      })();

      // Calculate spacing offset with layout direction support
      const spacingStyle = calculateButtonPosition(
        position, 
        index, 
        buttons.length, 
        isLandscape,
        layoutDirection
      );

      // Combine base position with spacing
      const finalStyle = { ...basePositionStyle, ...spacingStyle };

      renderedButtons.push(
        <CustomButton 
          key={`absolute-${position}-${index}`}
          config={button}
          isLandscape={isLandscape}
          style={finalStyle}
          defaultOnPress={button === defaultFullScreenButton ? onToggleFullScreen : undefined}
        />
      );
    });
  });

  return (
    <>
      {onBack && backButtonPosition === ButtonPosition.SE && (
        <TouchableOpacity 
          style={[responsiveStyles.topButton, responsiveStyles.buttonPositionSE]} 
          onPress={onBack}
        >
          <Ionicons name="close" size={ICON_SIZES.top} color="white" />
        </TouchableOpacity>
      )}
      {shareButtonPosition === ButtonPosition.SE && (
        <TouchableOpacity 
          style={[responsiveStyles.topButton, responsiveStyles.buttonPositionSE]} 
          onPress={onShare}
        >
          <Ionicons name="share-outline" size={ICON_SIZES.top} color="white" />
        </TouchableOpacity>
      )}
      {renderedButtons}
    </>
  );
}
