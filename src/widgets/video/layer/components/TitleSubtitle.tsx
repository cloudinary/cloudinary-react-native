import React from 'react';
import { View, Text } from 'react-native';
import { ButtonPosition } from '../types';
import { getTopPadding } from '../constants';

interface TitleSubtitleProps {
  isControlsVisible: boolean;
  title?: string;
  subtitle?: string;
  isLandscape: boolean;
  onBack?: () => void;
  backButtonPosition?: ButtonPosition;
  titleLeftOffset?: number;
}

export function TitleSubtitle({
  isControlsVisible,
  title,
  subtitle,
  isLandscape,
  onBack,
  backButtonPosition,
  titleLeftOffset
}: TitleSubtitleProps) {
  if (!isControlsVisible || (!title && !subtitle)) return null;

  return (
    <View style={[
      {
        position: 'absolute',
        top: getTopPadding(isLandscape) + (isLandscape ? 6 : 8),
        left: titleLeftOffset !== undefined ? titleLeftOffset : (onBack && backButtonPosition === ButtonPosition.NW ? 80 : 20), // Custom offset or default positioning
        zIndex: 15,
        maxWidth: '60%', // Prevent overlap with right side buttons
      }
    ]}>
      {title && (
        <Text style={{
          color: 'white',
          fontSize: isLandscape ? 16 : 18,
          fontWeight: 'bold',
          textShadowColor: 'rgba(0,0,0,0.8)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
          marginBottom: 2,
        }} numberOfLines={1}>
          {title}
        </Text>
      )}
      {subtitle && (
        <Text style={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: isLandscape ? 12 : 14,
          fontWeight: '500',
          textShadowColor: 'rgba(0,0,0,0.8)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
        }} numberOfLines={1}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
