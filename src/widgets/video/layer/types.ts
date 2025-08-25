import { Animated } from 'react-native';
import { AVPlaybackStatusSuccess } from 'expo-av';
import type { CloudinaryVideo } from '@cloudinary/url-gen';

export enum ButtonPosition {
  NE = 'NE', // North East (top-right)
  NW = 'NW', // North West (top-left)
  N = 'N',   // North (top-center)
  SE = 'SE'  // South East (bottom-right)
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
  seekbar?: SeekbarConfig;
}

export interface TopControlsProps {
  onBack?: () => void;
  onShare: () => void;
  backButtonPosition?: ButtonPosition;
  shareButtonPosition?: ButtonPosition;
  isLandscape?: boolean;
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
  seekbarRef: React.RefObject<any>;
  panResponder: any;
  backButtonPosition?: ButtonPosition;
  shareButtonPosition?: ButtonPosition;
  isLandscape?: boolean;
  seekbar?: SeekbarConfig;
}

export interface SeekbarProps {
  progress: number;
  currentPosition: number;
  status: any | null;
  formatTime: (milliseconds: number) => string;
  seekbarRef: React.RefObject<any>;
  panResponder: any;
  isLandscape?: boolean;
  seekbar?: SeekbarConfig;
}
