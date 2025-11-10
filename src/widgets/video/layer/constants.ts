import { Platform, Dimensions } from 'react-native';

// Helper function to detect devices with notch/home indicator
export const hasNotch = (): boolean => {
  const { height, width } = Dimensions.get('window');
  const aspectRatio = height / width;
  
  // Check based on dimensions regardless of platform
  // This works for both native and web (with mobile viewport)
  // iPhone X and newer have heights of 812+
  // Modern devices with notches typically have aspect ratio > 2
  if (height >= 812 || aspectRatio > 2) {
    return true;
  }
  
  // Additional check for smaller modern devices
  if (height >= 780 && aspectRatio >= 1.95) {
    return true;
  }
  
  return false;
};

// Get safe area bottom inset
export const getSafeAreaBottomInset = (): number => {
  if (Platform.OS === 'web') {
    // For web, use minimal safe area since the MobileWrapper handles the frame
    const { height } = Dimensions.get('window');
    return height >= 812 ? 24 : 0;
  }
  
  // For native platforms, use standard safe area for devices with notch
  return hasNotch() ? 28 : 0;
};

// Animation and timing constants
export const CONTROLS_AUTO_HIDE_DELAY = 3000; // 3 seconds
export const CONTROLS_FADE_DURATION = 300; // 300ms
export const SEEK_DEBOUNCE_DELAY = 200; // 200ms
export const SEEK_POSITION_THRESHOLD = 100; // 100ms
export const SEEK_POSITION_TOLERANCE = 500; // 500ms
export const SEEK_BUFFER_MS = 100; // 100ms buffer from end

// Responsive UI dimensions - now orientation-aware
export const TOP_BUTTON_SIZE = Platform.select({ ios: 44, android: 48, web: 44, default: 44 });
export const CENTER_PLAY_BUTTON_SIZE = 72; // Center button size
export const BOTTOM_BUTTON_SIZE = Platform.select({ ios: 40, android: 44, web: 40, default: 40 });
export const SEEKBAR_HEIGHT = 20;
export const SEEKBAR_TRACK_HEIGHT = Platform.select({ ios: 3, android: 3, web: 4, default: 3 });
export const SEEKBAR_HANDLE_SIZE = Platform.select({ ios: 16, android: 16, web: 18, default: 16 });

// Platform-specific padding with safe area consideration - orientation-responsive
export const TOP_PADDING_IOS = 60;
export const TOP_PADDING_ANDROID = 30;
export const LEGACY_TOP_PADDING_IOS = 50;
export const LEGACY_TOP_PADDING_ANDROID = 20;

// Landscape-specific padding (reduced for landscape mode)
export const TOP_PADDING_IOS_LANDSCAPE = 20;
export const TOP_PADDING_ANDROID_LANDSCAPE = 6;


// Bottom controls alignment constants (responsive and orientation-aware)
export const BOTTOM_CONTROLS_PADDING = Platform.select({ ios: 18, android: 16, web: 12, default: 16 });
export const BOTTOM_CONTROLS_PADDING_LANDSCAPE = Platform.select({ ios: 12, android: 10, web: 8, default: 10 });
export const SEEKBAR_ALIGNMENT_OFFSET = Platform.select({ ios: 16, android: 14, web: 14, default: 14 }); // Platform-specific alignment
export const SEEKBAR_ALIGNMENT_OFFSET_LANDSCAPE = Platform.select({ ios: 12, android: 10, web: 10, default: 10 });
// Align SE buttons with volume button position
// Volume button position = bottomControlsBar paddingHorizontal (20) + volumeButton marginRight (8) = 28
export const SE_BUTTON_RIGHT_OFFSET = 28; // Align with volume button
export const SE_BUTTON_BOTTOM_OFFSET = Platform.select({ ios: 32, android: 28, web: 40, default: 32 }); // Platform-specific bottom offset
export const SE_BUTTON_BOTTOM_OFFSET_LANDSCAPE = Platform.select({ ios: 20, android: 18, web: 25, default: 20 });


// Button spacing constants for multiple buttons in the same position
export const BUTTON_SPACING = Platform.select({ ios: 8, android: 6 }); // Space between buttons
export const BUTTON_MARGIN = Platform.select({ ios: 4, android: 3 }); // Margin from edge


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
  topControlsBackground: 'rgba(0, 0, 0, 0.7)',
  bottomControlsBackground: 'rgba(0, 0, 0, 0.75)',
  topButtonBackground: 'rgba(255, 255, 255, 0.15)',
  centerButtonBackground: 'rgba(255, 255, 255, 0.95)',
  centerButtonBorder: 'rgba(255, 255, 255, 0.8)',
  seekbarTrack: 'rgba(255, 255, 255, 0.3)',
  seekbarProgress: '#FFFFFF',
  seekbarHandle: '#FFFFFF',
  seekbarHandleBorder: 'rgba(255, 255, 255, 0.9)',
  text: {
    white: 'white',
    black: '#1a1a1a',
    shadow: 'rgba(0, 0, 0, 0.6)',
    whiteShadow: 'rgba(255, 255, 255, 0.3)',
  },
};

// Icon sizes
export const ICON_SIZES = {
  top: Platform.select({ ios: 24, android: 24, web: 22, default: 24 }),
  center: 32,
  bottom: Platform.select({ ios: 26, android: 26, web: 24, default: 26 }),
  bottomVolume: Platform.select({ ios: 26, android: 26, web: 24, default: 26 }),
  bottomPlayPause: Platform.select({ ios: 26, android: 26, web: 24, default: 26 }),
}; 