import React from 'react';
import { View, Text } from 'react-native';
import { SeekbarProps, TimePosition } from '../types';
import { styles, getResponsiveStyles } from '../styles';
import { SEEKBAR_HEIGHT, COLORS } from '../constants';

export const Seekbar: React.FC<SeekbarProps> = ({
  progress,
  currentPosition,
  status,
  formatTime,
  seekbarRef,
  panResponder,
  isLandscape = false,
  seekbar = {},
}) => {
  const responsiveStyles = getResponsiveStyles(isLandscape);
  
  // Get values from config with fallbacks to current defaults
  const seekbarHeight = seekbar?.height ?? SEEKBAR_HEIGHT;
  const seekbarColor = seekbar?.color ?? COLORS.seekbarProgress;
  const timePosition = seekbar?.timePosition ?? TimePosition.BELOW;

  // Create consistent spacing with wrapper View - different heights for above/below
  const timeTextSpacingAbove = isLandscape ? 22 : 24; // Total height for above position
  const timeTextSpacingBelow = isLandscape ? 12 : 14; // Much smaller height for below position
  
  const timeText = (
    <View style={{ 
      height: timePosition === TimePosition.ABOVE ? timeTextSpacingAbove : timeTextSpacingBelow, 
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <Text style={[styles.timeText, { lineHeight: 16 }]}>
        {formatTime(currentPosition)} / {formatTime(status?.durationMillis || 0)}
      </Text>
    </View>
  );

  return (
    <View style={responsiveStyles.seekbarContainer}>
      {timePosition === TimePosition.ABOVE && timeText}
      <View 
        ref={seekbarRef}
        style={[responsiveStyles.seekbar, { height: seekbarHeight }]}
        {...panResponder.panHandlers}
      >
        <View style={responsiveStyles.seekbarTrack} />
        <View 
          style={[
            responsiveStyles.seekbarProgress, 
            { 
              width: `${progress * 100}%`,
              backgroundColor: seekbarColor
            }
          ]} 
        />
        <View 
          style={[
            responsiveStyles.seekbarHandle, 
            { left: `${progress * 100}%` }
          ]} 
        />
      </View>
      {timePosition === TimePosition.BELOW && timeText}
    </View>
  );
}; 