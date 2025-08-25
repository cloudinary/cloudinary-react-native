import { StyleSheet, Platform } from 'react-native';
import {
  COLORS,
  BORDER_RADIUS,
  SHADOW_VALUES,
  TOP_BUTTON_SIZE,
  CENTER_PLAY_BUTTON_SIZE,
  BOTTOM_BUTTON_SIZE,
  SEEKBAR_HEIGHT,
  SEEKBAR_TRACK_HEIGHT,
  SEEKBAR_HANDLE_SIZE,
  TOP_PADDING_IOS,
  TOP_PADDING_ANDROID,
  LEGACY_TOP_PADDING_IOS,
  LEGACY_TOP_PADDING_ANDROID,
  BOTTOM_CONTROLS_PADDING,
  SEEKBAR_ALIGNMENT_OFFSET,
  SE_BUTTON_RIGHT_OFFSET,
  SE_BUTTON_BOTTOM_OFFSET,
  getTopPadding,
  getBottomControlsPadding,
  getSeekbarAlignmentOffset,
  getSEButtonBottomOffset,
} from './constants';

// Base styles (orientation-independent)
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  // Loading styles
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.loadingBackground,
    zIndex: 1,
  },
  loadingText: {
    color: COLORS.text.white,
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  // Center Controls
  centerControls: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerPlayButton: {
    width: CENTER_PLAY_BUTTON_SIZE,
    height: CENTER_PLAY_BUTTON_SIZE,
    borderRadius: BORDER_RADIUS.centerButton,
    backgroundColor: COLORS.centerButtonBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    ...SHADOW_VALUES.centerButton,
    borderWidth: 1,
    borderColor: COLORS.centerButtonBorder,
  },
  centerPlayIcon: {
    color: COLORS.text.black,
    fontSize: 32,
    fontWeight: '500',
    marginLeft: 2, // Slight offset for play icon visual balance
    textShadowColor: COLORS.text.whiteShadow,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  iconText: {
    color: COLORS.text.white,
    fontSize: 20,
    fontWeight: '400',
    textShadowColor: COLORS.text.shadow,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  timeText: {
    color: COLORS.text.white,
    fontSize: 12,
    opacity: 0.8,
  },
  // Legacy styles (keeping for backward compatibility)
  topRow: {
    marginTop: Platform.OS === 'ios' ? LEGACY_TOP_PADDING_IOS : LEGACY_TOP_PADDING_ANDROID,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
});

// Orientation-responsive style functions
export const getResponsiveStyles = (isLandscape: boolean = false) => {
  const topPadding = getTopPadding(isLandscape);
  const bottomPadding = getBottomControlsPadding(isLandscape);
  const seekbarOffset = getSeekbarAlignmentOffset(isLandscape);
  const seButtonBottomOffset = getSEButtonBottomOffset(isLandscape);

  return StyleSheet.create({
    // Top Controls
    topControlsBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: topPadding,
      paddingBottom: (bottomPadding || 15) * 2,
      backgroundColor: COLORS.topControlsBackground,
    },
    topButton: {
      width: TOP_BUTTON_SIZE,
      height: TOP_BUTTON_SIZE,
      borderRadius: BORDER_RADIUS.topButton,
      backgroundColor: COLORS.topButtonBackground,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      ...SHADOW_VALUES.topButton,
    },
    // Button positioning styles
    buttonPositionNE: {
      position: 'absolute',
      top: topPadding + (isLandscape ? 6 : 8),
      right: 20,
    },
    buttonPositionNW: {
      position: 'absolute',
      top: topPadding + (isLandscape ? 6 : 8),
      left: 20,
    },
    buttonPositionN: {
      position: 'absolute',
      top: topPadding + (isLandscape ? 6 : 8),
      alignSelf: 'center',
    },
    buttonPositionSE: {
      position: 'absolute',
      bottom: seButtonBottomOffset,
      right: SE_BUTTON_RIGHT_OFFSET,
      zIndex: 10,
    },
    // Bottom Controls
    bottomControlsBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: bottomPadding,
      backgroundColor: COLORS.bottomControlsBackground,
    },
    bottomLeftControls: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    bottomRightControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    playPauseButton: {
      width: BOTTOM_BUTTON_SIZE,
      height: BOTTOM_BUTTON_SIZE,
      borderRadius: BORDER_RADIUS.bottomButton,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      marginBottom: seekbarOffset,
    },
    playPauseIcon: {
      color: COLORS.text.white,
      fontSize: isLandscape ? 20 : 22,
      fontWeight: '500',
      textShadowColor: COLORS.text.shadow,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    volumeButton: {
      width: BOTTOM_BUTTON_SIZE,
      height: BOTTOM_BUTTON_SIZE,
      borderRadius: BORDER_RADIUS.bottomButton,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
      marginBottom: seekbarOffset,
    },
    volumeIcon: {
      color: COLORS.text.white,
      fontSize: isLandscape ? 18 : 20,
      fontWeight: '500',
      textShadowColor: COLORS.text.shadow,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    // Seekbar
    seekbarContainer: {
      flex: 1,
      marginRight: 18,
      marginLeft: 8,
    },
    seekbar: {
      height: SEEKBAR_HEIGHT,
      borderRadius: BORDER_RADIUS.seekbar,
      position: 'relative',
      justifyContent: 'center',
      paddingVertical: isLandscape ? 6 : 8, // Reduce touch area in landscape
    },
    seekbarTrack: {
      height: SEEKBAR_TRACK_HEIGHT,
      backgroundColor: COLORS.seekbarTrack,
      borderRadius: BORDER_RADIUS.seekbarTrack,
      position: 'absolute',
      top: 8.5,
      left: 0,
      right: 0,
    },
    seekbarProgress: {
      height: SEEKBAR_TRACK_HEIGHT,
      backgroundColor: COLORS.seekbarProgress,
      borderRadius: BORDER_RADIUS.seekbarTrack,
      position: 'absolute',
      top: 8.5, // Center within the 20px height
      shadowColor: COLORS.seekbarProgress,
      ...SHADOW_VALUES.seekbarProgress,
    },
    seekbarHandle: {
      position: 'absolute',
      width: SEEKBAR_HANDLE_SIZE,
      height: SEEKBAR_HANDLE_SIZE,
      borderRadius: BORDER_RADIUS.seekbarHandle,
      backgroundColor: COLORS.seekbarHandle,
      top: 2, // Center within the 20px height
      marginLeft: -8, // Half of width to center properly
      shadowColor: '#000',
      ...SHADOW_VALUES.seekbarHandle,
      borderWidth: 2,
      borderColor: COLORS.seekbarHandleBorder,
    },
  });
}; 