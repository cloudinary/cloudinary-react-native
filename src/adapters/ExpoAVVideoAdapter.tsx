import React, { ReactElement, RefObject } from 'react';
import { VideoPlayerAdapter, VideoPlayerProps, VideoPlayerRef, VideoPlayerType } from './types';

export class ExpoAVVideoAdapter implements VideoPlayerAdapter {
  private expoAVModule: any = null;

  constructor() {
    this.loadExpoAV();
  }

  private loadExpoAV(): void {
    try {
      this.expoAVModule = require('expo-av');
    } catch (error) {
      this.expoAVModule = null;
    }
  }

  isAvailable(): boolean {
    return !!(this.expoAVModule && this.expoAVModule.Video);
  }

  /**
   * Get detailed information about adapter availability
   * @returns Object containing availability status, error details, and installation guidance
   */
  getAvailabilityInfo(): { 
    isAvailable: boolean; 
    error?: string; 
    installationCommand?: string;
  } {
    if (!this.expoAVModule) {
      return {
        isAvailable: false,
        error: 'Module not found: expo-av',
        installationCommand: 'npx expo install expo-av'
      };
    }
    
    if (!this.expoAVModule.Video) {
      return {
        isAvailable: false,
        error: 'Video component not found in expo-av module',
        installationCommand: 'npx expo install expo-av'
      };
    }
    
    return { isAvailable: true };
  }

  getAdapterName(): string {
    return VideoPlayerType.EXPO_AV;
  }

  renderVideo(props: VideoPlayerProps, ref: RefObject<VideoPlayerRef | null>): ReactElement {
    if (!this.isAvailable()) {
      const info = this.getAvailabilityInfo();
      throw new Error(
        `ExpoAVVideoAdapter: ${info.error}. Please install: "${info.installationCommand}"`
      );
    }

    const { Video } = this.expoAVModule;
    
    return React.createElement(Video, {
      ref: (videoInstance: any) => {
        if (ref && typeof ref === 'object' && 'current' in ref) {
          ref.current = videoInstance;
        }
      },
      source: { uri: props.videoUri },
      style: props.style,
      useNativeControls: props.useNativeControls || false,
      shouldPlay: false,
      isLooping: false,
      resizeMode: 'contain',
      onPlaybackStatusUpdate: (status: any) => {
        if (props.onPlaybackStatusUpdate) {
          props.onPlaybackStatusUpdate(status);
        }
      },
      onError: (error: any) => {
        if (props.onError) {
          props.onError(error);
        }
      },
      onLoad: (data: any) => {
        props.onLoad?.(data);
      },
      onLoadStart: (data: any) => {
        props.onLoadStart?.(data);
      },
    });
  }

  processStatusUpdate(videoRef: VideoPlayerRef, status: any, previousStatus?: any): void {
    // Import and use the existing expo-av status processor
    try {
      const { processExpoAVStatus } = require('../widgets/video/analytics/player-adapters/expoAVVideoPlayerAdapter');
      processExpoAVStatus(videoRef, status, previousStatus);
    } catch (error) {
      // Silently fail if analytics adapter is not available
    }
  }

  async getAnalyticsAdapter(): Promise<any> {
    try {
      const { expoAVVideoPlayerAdapter } = await import('../widgets/video/analytics/player-adapters/expoAVVideoPlayerAdapter');
      return expoAVVideoPlayerAdapter;
    } catch (error) {
      return null;
    }
  }
}