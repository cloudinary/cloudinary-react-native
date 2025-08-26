import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomControlsProps, ButtonPosition } from '../types';
import { styles, getResponsiveStyles } from '../styles';
import { ICON_SIZES } from '../constants';
import { Seekbar } from './Seekbar';
import { PlaybackSpeedButton } from './PlaybackSpeedButton';
import { SubtitlesButton } from './SubtitlesButton';

export const BottomControls: React.FC<BottomControlsProps> = ({
  status,
  onPlayPause,
  onMuteToggle,
  formatTime,
  getProgress,
  getCurrentPosition,
  seekBarRef,
  panResponder,
  backButtonPosition,
  shareButtonPosition,
  isLandscape = false,
  seekbar = {},
  playbackSpeed,
  currentPlaybackSpeed,
  onPlaybackSpeedChange,
  isSpeedMenuVisible,
  onToggleSpeedMenu,
  subtitles,
  currentSubtitle,
  onSubtitleChange,
  isSubtitlesMenuVisible,
  onToggleSubtitlesMenu,
}) => {
  const responsiveStyles = getResponsiveStyles(isLandscape);
  const progress = getProgress();
  const currentPosition = getCurrentPosition();
  
  // Check if we need to leave space for SE positioned buttons
  const hasSEButton = backButtonPosition === ButtonPosition.SE || shareButtonPosition === ButtonPosition.SE;
  
  return (
    <View style={[
      responsiveStyles.bottomControlsBar,
      hasSEButton && { paddingRight: 80 } // Create space for SE button
    ]}>
      <View style={responsiveStyles.bottomLeftControls}>
        <TouchableOpacity 
          style={responsiveStyles.playPauseButton}
          onPress={onPlayPause}
        >
          <Ionicons 
            name={status?.isPlaying ? 'pause' : 'play'} 
            size={ICON_SIZES.bottomPlayPause} 
            color="white" 
            style={responsiveStyles.playPauseIcon}
          />
        </TouchableOpacity>
        
        <Seekbar
          progress={progress}
          currentPosition={currentPosition}
          status={status}
          formatTime={formatTime}
          seekBarRef={seekBarRef}
          panResponder={panResponder}
          isLandscape={isLandscape}
          seekBar={seekbar}
        />
      </View>
      
      <View style={responsiveStyles.bottomRightControls}>
        <SubtitlesButton
          subtitles={subtitles}
          currentSubtitle={currentSubtitle}
          onSubtitleChange={onSubtitleChange}
          isLandscape={isLandscape}
          isMenuVisible={isSubtitlesMenuVisible}
          onToggleMenu={onToggleSubtitlesMenu}
        />
        <PlaybackSpeedButton
          playbackSpeed={playbackSpeed}
          currentSpeed={currentPlaybackSpeed}
          onSpeedChange={onPlaybackSpeedChange}
          isLandscape={isLandscape}
          isMenuVisible={isSpeedMenuVisible}
          onToggleMenu={onToggleSpeedMenu}
        />
        <TouchableOpacity 
          style={responsiveStyles.volumeButton}
          onPress={onMuteToggle}
        >
          <Ionicons 
            name={status?.isMuted ? 'volume-mute' : 'volume-high'} 
            size={ICON_SIZES.bottomVolume} 
            color="white" 
            style={responsiveStyles.volumeIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}; 