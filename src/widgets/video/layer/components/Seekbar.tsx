import React from 'react';
import { View, Text } from 'react-native';
import { SeekbarProps } from '../types';
import { styles, getResponsiveStyles } from '../styles';

export const Seekbar: React.FC<SeekbarProps> = ({
  progress,
  currentPosition,
  status,
  formatTime,
  seekbarRef,
  panResponder,
  isLandscape = false,
}) => {
  const responsiveStyles = getResponsiveStyles(isLandscape);

  return (
    <View style={responsiveStyles.seekbarContainer}>
      <View 
        ref={seekbarRef}
        style={responsiveStyles.seekbar}
        {...panResponder.panHandlers}
      >
        <View style={responsiveStyles.seekbarTrack} />
        <View 
          style={[
            responsiveStyles.seekbarProgress, 
            { width: `${progress * 100}%` }
          ]} 
        />
        <View 
          style={[
            responsiveStyles.seekbarHandle, 
            { left: `${progress * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.timeText}>
        {formatTime(currentPosition)} / {formatTime(status?.durationMillis || 0)}
      </Text>
    </View>
  );
}; 