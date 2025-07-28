import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomControlsProps, ButtonPosition } from '../types';
import { styles } from '../styles';
import { ICON_SIZES } from '../constants';
import { Seekbar } from './Seekbar';

export const BottomControls: React.FC<BottomControlsProps> = ({
  status,
  onPlayPause,
  onMuteToggle,
  formatTime,
  getProgress,
  getCurrentPosition,
  seekbarRef,
  panResponder,
  backButtonPosition,
  shareButtonPosition,
}) => {
  const progress = getProgress();
  const currentPosition = getCurrentPosition();
  
  // Check if we need to leave space for SE positioned buttons
  const hasSEButton = backButtonPosition === ButtonPosition.SE || shareButtonPosition === ButtonPosition.SE;
  
  return (
    <View style={[
      styles.bottomControlsBar,
      hasSEButton && { paddingRight: 80 } // Create space for SE button
    ]}>
      <View style={styles.bottomLeftControls}>
        <TouchableOpacity 
          style={styles.playPauseButton}
          onPress={onPlayPause}
        >
          <Ionicons 
            name={status?.isPlaying ? 'pause' : 'play'} 
            size={ICON_SIZES.bottomPlayPause} 
            color="white" 
          />
        </TouchableOpacity>
        
        <Seekbar
          progress={progress}
          currentPosition={currentPosition}
          status={status}
          formatTime={formatTime}
          seekbarRef={seekbarRef}
          panResponder={panResponder}
        />
      </View>
      
      <View style={styles.bottomRightControls}>
        <TouchableOpacity 
          style={styles.volumeButton}
          onPress={onMuteToggle}
        >
          <Ionicons 
            name={status?.isMuted ? 'volume-mute' : 'volume-high'} 
            size={ICON_SIZES.bottomVolume} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}; 