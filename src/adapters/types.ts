import { ReactElement, RefObject } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface VideoPlayerRef {
  _currentStatus?: any;
  _cloudinaryEventCallbacks?: any;
  [key: string]: any;
}

export interface VideoPlayerProps {
  videoUri: string;
  style?: StyleProp<ViewStyle>;
  onPlaybackStatusUpdate?: (status: any) => void;
  onLoadStart?: (data: any) => void;
  onLoad?: (data: any) => void;
  onError?: (error: any) => void;
  onReadyForDisplay?: (data: any) => void;
  onPlayingChange?: (isPlaying: boolean) => void;
  onEnd?: (data: any) => void;
}

export interface VideoPlayerAdapter {
  /**
   * Check if this adapter's video library is available
   */
  isAvailable(): boolean;

  /**
   * Get detailed availability information including error context and installation guidance
   */
  getAvailabilityInfo(): {
    isAvailable: boolean;
    error?: string;
    installCommand?: string;
    packageName?: string;
  };

  /**
   * Get the display name of this adapter
   */
  getAdapterName(): string;

  /**
   * Render the video component
   */
  renderVideo(props: VideoPlayerProps, ref: RefObject<VideoPlayerRef | null>): ReactElement;

  /**
   * Process status updates for analytics (if applicable)
   */
  processStatusUpdate?(videoRef: VideoPlayerRef, status: any, previousStatus?: any): void;

  /**
   * Get the analytics adapter for this video player (if applicable)
   */
  getAnalyticsAdapter?(): any;
}

export enum VideoPlayerType {
  EXPO_VIDEO = 'expo-video',
  EXPO_AV = 'expo-av',
  FALLBACK = 'fallback'
}
