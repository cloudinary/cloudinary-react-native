import React from 'react';
import { View, Text } from 'react-native';
import { SeekbarProps } from '../types';
import { styles } from '../styles';

export const Seekbar: React.FC<SeekbarProps> = ({
  progress,
  currentPosition,
  status,
  formatTime,
  seekbarRef,
  panResponder,
}) => {
  return (
    <View style={styles.seekbarContainer}>
      <View 
        ref={seekbarRef}
        style={styles.seekbar}
        {...panResponder.panHandlers}
      >
        <View style={styles.seekbarTrack} />
        <View 
          style={[
            styles.seekbarProgress, 
            { width: `${progress * 100}%` }
          ]} 
        />
        <View 
          style={[
            styles.seekbarHandle, 
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