import { Platform, Dimensions } from 'react-native';

// Get device dimensions for responsive calculations
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Helper function to determine if device is in landscape
export const isLandscapeOrientation = () => {
  const { width, height } = Dimensions.get('window');
  return width > height;
};

// Animation and timing constants
export const CONTROLS_AUTO_HIDE_DELAY = 3000; // 3 seconds
export const CONTROLS_FADE_DURATION = 300; // 300ms
export const SEEK_DEBOUNCE_DELAY = 200; // 200ms
export const SEEK_POSITION_THRESHOLD = 100; // 100ms
export const SEEK_POSITION_TOLERANCE = 500; // 500ms
export const SEEK_BUFFER_MS = 100; // 100ms buffer from end

// Responsive UI dimensions - now orientation-aware
export const TOP_BUTTON_SIZE = Platform.select({ ios: 44, android: 48 });
export const CENTER_PLAY_BUTTON_SIZE = Math.min(SCREEN_WIDTH * 0.15, 72); // Responsive center button
export const BOTTOM_BUTTON_SIZE = Platform.select({ ios: 40, android: 44 });
export const SEEKBAR_HEIGHT = 20;
export const SEEKBAR_TRACK_HEIGHT = 3;
export const SEEKBAR_HANDLE_SIZE = 16;

// Platform-specific padding with safe area consideration - orientation-responsive
export const TOP_PADDING_IOS = 60;
export const TOP_PADDING_ANDROID = 30;
export const LEGACY_TOP_PADDING_IOS = 50;
export const LEGACY_TOP_PADDING_ANDROID = 20;

// Landscape-specific padding (reduced for landscape mode)
export const TOP_PADDING_IOS_LANDSCAPE = 20;
export const TOP_PADDING_ANDROID_LANDSCAPE = 6;

// Get responsive top padding based on orientation
export const getTopPadding = (isLandscape: boolean = false) => {
  if (Platform.OS === 'ios') {
    return isLandscape ? TOP_PADDING_IOS_LANDSCAPE : TOP_PADDING_IOS;
  }
  return isLandscape ? TOP_PADDING_ANDROID_LANDSCAPE : TOP_PADDING_ANDROID;
};

// Bottom controls alignment constants (responsive and orientation-aware)
export const BOTTOM_CONTROLS_PADDING = Platform.select({ ios: 15, android: 12 });
export const BOTTOM_CONTROLS_PADDING_LANDSCAPE = Platform.select({ ios: 10, android: 8 });
export const SEEKBAR_ALIGNMENT_OFFSET = Platform.select({ ios: 16, android: 14 }); // Platform-specific alignment
export const SEEKBAR_ALIGNMENT_OFFSET_LANDSCAPE = Platform.select({ ios: 12, android: 10 });
export const SE_BUTTON_RIGHT_OFFSET = Math.min(SCREEN_WIDTH * 0.1, 38); // Responsive right offset
export const SE_BUTTON_BOTTOM_OFFSET = Platform.select({ ios: 32, android: 28 }); // Platform-specific bottom offset
export const SE_BUTTON_BOTTOM_OFFSET_LANDSCAPE = Platform.select({ ios: 20, android: 18 });

// Get responsive bottom controls padding
export const getBottomControlsPadding = (isLandscape: boolean = false) => {
  return isLandscape ? BOTTOM_CONTROLS_PADDING_LANDSCAPE : BOTTOM_CONTROLS_PADDING;
};

// Get responsive seekbar alignment offset
export const getSeekbarAlignmentOffset = (isLandscape: boolean = false) => {
  return isLandscape ? SEEKBAR_ALIGNMENT_OFFSET_LANDSCAPE : SEEKBAR_ALIGNMENT_OFFSET;
};

// Get responsive SE button bottom offset
export const getSEButtonBottomOffset = (isLandscape: boolean = false) => {
  return isLandscape ? SE_BUTTON_BOTTOM_OFFSET_LANDSCAPE : SE_BUTTON_BOTTOM_OFFSET;
};

// Visual styling constants
export const BORDER_RADIUS = {
  topButton: 22,
  centerButton: 36,
  bottomButton: 20,
  seekbar: 10,
  seekbarTrack: 1.5,
  seekbarHandle: 8,
};

// Shadow and elevation values
export const SHADOW_VALUES = {
  topButton: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  centerButton: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  seekbarProgress: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 2,
  },
  seekbarHandle: {
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
};

// Color constants
export const COLORS = {
  overlay: 'rgba(0, 0, 0, 0.4)',
  loadingBackground: 'rgba(0, 0, 0, 0.8)',
  topControlsBackground: 'rgba(0, 0, 0, 0.6)',
  bottomControlsBackground: 'rgba(0, 0, 0, 0.6)',
  topButtonBackground: 'rgba(0, 0, 0, 0.7)',
  centerButtonBackground: 'rgba(255, 255, 255, 0.95)',
  centerButtonBorder: 'rgba(255, 255, 255, 0.8)',
  seekbarTrack: 'rgba(255, 255, 255, 0.2)',
  seekbarProgress: '#FFFFFF',
  seekbarHandle: '#FFFFFF',
  seekbarHandleBorder: 'rgba(255, 255, 255, 0.9)',
  text: {
    white: 'white',
    black: '#1a1a1a',
    shadow: 'rgba(0, 0, 0, 0.5)',
    whiteShadow: 'rgba(255, 255, 255, 0.3)',
  },
};

// Icon sizes
export const ICON_SIZES = {
  top: 24,
  center: 32,
  bottom: 26,
  bottomVolume: 26,
  bottomPlayPause: 26,
}; 