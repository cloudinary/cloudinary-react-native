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
  seekBarRef,
  panResponder,
  isLandscape = false,
  seekBar = {},
}) => {
  const responsiveStyles = getResponsiveStyles(isLandscape);
  
  // Get values from config with fallbacks to current defaults
  const seekbarHeight = seekBar?.height ?? SEEKBAR_HEIGHT;
  const seekbarWidth = seekBar?.width; // undefined means full width (default)
  const seekbarColor = seekBar?.color ?? COLORS.seekbarProgress;
  const timePosition = seekBar?.timePosition ?? TimePosition.BELOW;

  // Create consistent spacing with wrapper View - different heights for above/below
  const timeTextSpacingAbove = isLandscape ? 22 : 24; // Total height for above position
  const timeTextSpacingBelow = isLandscape ? 12 : 14; // Much smaller height for below position
  
  const timeText = (
    <View style={{ 
      height: timePosition === TimePosition.ABOVE ? timeTextSpacingAbove : timeTextSpacingBelow, 
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingLeft: 12,
    }}>
      <Text style={[styles.timeText, { lineHeight: 16 }]}>
        {formatTime(currentPosition)} / {formatTime(status?.durationMillis || 0)}
      </Text>
    </View>
  );

  // Create seekbar width styling
  const seekbarWidthStyle = seekbarWidth ? {
    width: seekbarWidth as any, // Accept both number (px) and string (%)
    alignSelf: 'center' as const // Center the seekbar if it's not full width
  } : {};

  return (
    <View style={responsiveStyles.seekbarContainer}>
      <View style={seekbarWidth ? { alignItems: 'center' } : {}}>
        {timePosition === TimePosition.ABOVE && (
          <View style={seekbarWidthStyle}>
            {timeText}
          </View>
        )}
        <View 
          ref={seekBarRef}
          style={[responsiveStyles.seekbar, { height: seekbarHeight }, seekbarWidthStyle]}
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
        {timePosition === TimePosition.BELOW && (
          <View style={seekbarWidthStyle}>
            {timeText}
          </View>
        )}
      </View>
    </View>
  );
}; 