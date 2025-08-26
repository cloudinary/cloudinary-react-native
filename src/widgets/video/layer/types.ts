import { Animated } from 'react-native';
import { AVPlaybackStatusSuccess } from 'expo-av';
import type { CloudinaryVideo } from '@cloudinary/url-gen';

export enum ButtonPosition {
  NE = 'NE', // North East (top-right)
  NW = 'NW', // North West (top-left)
  N = 'N',   // North (top-center)
  SE = 'SE', // South East (bottom-right)
  SW = 'SW', // South West (bottom-left)
  S = 'S',   // South (bottom-center)
  E = 'E',   // East (middle-right)
  W = 'W'    // West (middle-left)
}

export interface ButtonConfig {
  icon: string;                    // Ionicons icon name
  size?: number;                   // Icon size (px)
  color?: string;                  // Icon color
  backgroundColor?: string;        // Button background color
  position: ButtonPosition;        // Button position
  onPress?: () => void;           // Custom functionality
}

export enum TimePosition {
  ABOVE = 'above',
  BELOW = 'below', 
  NONE = 'none'
}

export interface SeekbarConfig {
  height?: number;             // px
  width?: number | string;     // px or percentage (e.g., 200 or '80%')
  color?: string;              // CSS color
  timePosition?: TimePosition; // TimePosition.ABOVE | TimePosition.BELOW | TimePosition.NONE
}

export interface FullScreenConfig {
  enabled?: boolean;           // Enable/disable full screen functionality
  landscapeOnly?: boolean;     // Force landscape mode in full screen (default: true)
  button?: ButtonConfig;       // Custom button configuration
  onEnterFullScreen?: () => void;  // Custom enter full screen handler
  onExitFullScreen?: () => void;   // Custom exit full screen handler
}

export interface PlaybackSpeedOption {
  value: number;               // Speed multiplier (e.g., 0.5, 1.0, 1.25, 1.5, 2.0)
  label: string;               // Display label (e.g., "0.5×", "1.0×", "1.25×", "1.5×", "2.0×")
}

export interface PlaybackSpeedConfig {
  enabled?: boolean;           // Enable/disable playback speed functionality
  defaultSpeed?: number;       // Default playback speed (default: 1.0)
  speeds?: PlaybackSpeedOption[];  // Custom speed options
  button?: Partial<ButtonConfig>;  // Custom button configuration (position not needed as it's fixed in bottom controls)
}

export interface SubtitleOption {
  code: string;                // Language code (e.g., 'en', 'es', 'ar', 'off')
  label: string;               // Display label (e.g., 'English', 'Spanish', 'Arabic', 'Off')
  url?: string;                // Future: URL to subtitle file
}

export interface SubtitlesConfig {
  enabled?: boolean;           // Enable/disable subtitles functionality
  defaultLanguage?: string;    // Default language code (default: 'off')
  languages?: SubtitleOption[]; // Available subtitle languages
  button?: Partial<ButtonConfig>;  // Custom button configuration (position not needed as it's fixed in bottom controls)
}

export interface CLDVideoLayerProps {
  cldVideo: CloudinaryVideo;
  videoUrl?: string;
  autoPlay?: boolean;
  muted?: boolean;
  onBack?: () => void;
  onShare?: () => void;
  hideControls?: boolean;
  showCenterPlayButton?: boolean;
  backButtonPosition?: ButtonPosition;
  shareButtonPosition?: ButtonPosition;
  seekBar?: SeekbarConfig;
  fullScreen?: FullScreenConfig;
  playbackSpeed?: PlaybackSpeedConfig;
  subtitles?: SubtitlesConfig;
  customButtons?: ButtonConfig[];  // Additional custom buttons
}

export interface TopControlsProps {
  onBack?: () => void;
  onShare: () => void;
  backButtonPosition?: ButtonPosition;
  shareButtonPosition?: ButtonPosition;
  isLandscape?: boolean;
  fullScreen?: FullScreenConfig;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  customButtons?: ButtonConfig[];
}

export interface CenterControlsProps {
  status: any | null;
  onPlayPause: () => void;
}

export interface BottomControlsProps {
  status: any | null;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  formatTime: (milliseconds: number) => string;
  getProgress: () => number;
  getCurrentPosition: () => number;
  seekBarRef: React.RefObject<any>;
  panResponder: any;
  backButtonPosition?: ButtonPosition;
  shareButtonPosition?: ButtonPosition;
  isLandscape?: boolean;
  seekbar?: SeekbarConfig;
  fullScreen?: FullScreenConfig;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  playbackSpeed?: PlaybackSpeedConfig;
  currentPlaybackSpeed?: number;
  onPlaybackSpeedChange?: (speed: number) => void;
  isSpeedMenuVisible?: boolean;
  onToggleSpeedMenu?: () => void;
  subtitles?: SubtitlesConfig;
  currentSubtitle?: string;
  onSubtitleChange?: (languageCode: string) => void;
  isSubtitlesMenuVisible?: boolean;
  onToggleSubtitlesMenu?: () => void;
  customButtons?: ButtonConfig[];
}

export interface SeekbarProps {
  progress: number;
  currentPosition: number;
  status: any | null;
  formatTime: (milliseconds: number) => string;
  seekBarRef: React.RefObject<any>;
  panResponder: any;
  isLandscape?: boolean;
  seekBar?: SeekbarConfig;
}
