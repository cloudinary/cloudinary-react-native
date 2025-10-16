import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CenterControlsProps } from '../types';
import { styles } from '../styles';
import { ICON_SIZES } from '../constants';

export const CenterControls: React.FC<CenterControlsProps> = ({ status, onPlayPause }) => {
  return (
    <View style={styles.centerControls}>
      <TouchableOpacity 
        style={styles.centerPlayButton}
        onPress={onPlayPause}
      >
        <Ionicons 
          name={status?.isPlaying ? 'pause' : 'play'} 
          size={ICON_SIZES.center} 
          color="#1a1a1a"
          style={{ marginLeft: status?.isPlaying ? 0 : 3 }} // Slight offset for play icon visual balance
        />
      </TouchableOpacity>
    </View>
  );
}; 