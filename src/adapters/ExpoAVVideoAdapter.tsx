import React, { ReactElement, RefObject } from 'react';
import { VideoPlayerAdapter, VideoPlayerProps, VideoPlayerRef, VideoPlayerType } from './types';

export class ExpoAVVideoAdapter implements VideoPlayerAdapter {
  private expoAVModule: any = null;
  private loadError: Error | null = null;

  constructor() {
    this.loadExpoAV();
  }

  private loadExpoAV(): void {
    try {
      this.expoAVModule = require('expo-av');
    } catch (error) {
      this.loadError = error as Error;
      this.expoAVModule = null;
    }
  }

  isAvailable(): boolean {
    return !!this.expoAVModule && !!this.expoAVModule.Video;
  }

  /**
   * Get detailed information about adapter availability
   * @returns Object containing availability status, error details, and installation guidance
   */
  getAvailabilityInfo(): { 
    available: boolean; 
    error?: string; 
    installationCommand?: string;
  } {
    if (this.isAvailable()) {
      return { available: true };
    }
    
    return {
      available: false,
      error: this.loadError?.message || 'expo-av not installed',
      installationCommand: 'npx expo install expo-av'
    };
  }

  getAdapterName(): string {
    return VideoPlayerType.EXPO_AV;
  }

  renderVideo(props: VideoPlayerProps, ref: RefObject<VideoPlayerRef | null>): ReactElement {
    if (!this.isAvailable()) {
      const info = this.getAvailabilityInfo();
      throw new Error(
        `ExpoAVVideoAdapter: ${info.error}. Please install expo-av: "${info.installationCommand}"`
      );
    }

    const { Video } = this.expoAVModule;
    
    return React.createElement(Video, {
      ref,
      source: { uri: props.videoUri },
      style: props.style,
      useNativeControls: true,
      shouldPlay: false,
      isLooping: false,
      resizeMode: 'contain',
      onPlaybackStatusUpdate: props.onPlaybackStatusUpdate,
      onError: props.onError,
      onLoad: props.onLoad,
      onLoadStart: props.onLoadStart,
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
