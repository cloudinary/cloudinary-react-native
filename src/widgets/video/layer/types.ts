import { Animated } from 'react-native';
import { AVPlaybackStatusSuccess } from 'expo-av';
import type { CloudinaryVideo } from '@cloudinary/url-gen';

export enum ButtonPosition {
  NE = 'NE', // North East (top-right)
  NW = 'NW', // North West (top-left)
  N = 'N',   // North (top-center)
  SE = 'SE'  // South East (bottom-right)
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
}





export interface TopControlsProps {
  onBack?: () => void;
  onShare: () => void;
  backButtonPosition?: ButtonPosition;
  shareButtonPosition?: ButtonPosition;
}

export interface CenterControlsProps {
  status: AVPlaybackStatusSuccess | null;
  onPlayPause: () => void;
}

export interface BottomControlsProps {
  status: AVPlaybackStatusSuccess | null;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  formatTime: (milliseconds: number) => string;
  getProgress: () => number;
  getCurrentPosition: () => number;
  seekbarRef: React.RefObject<any>;
  panResponder: any;
  backButtonPosition?: ButtonPosition;
  shareButtonPosition?: ButtonPosition;
}

export interface SeekbarProps {
  progress: number;
  currentPosition: number;
  status: AVPlaybackStatusSuccess | null;
  formatTime: (milliseconds: number) => string;
  seekbarRef: React.RefObject<any>;
  panResponder: any;
} 