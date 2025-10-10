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
    const hasModule = !!this.expoAVModule;
    const hasVideo = !!(this.expoAVModule && this.expoAVModule.Video);
    const isAvailable = hasModule && hasVideo;
    
    return isAvailable;
  }

  getAvailabilityInfo(): { isAvailable: boolean; error?: string; installCommand?: string; packageName?: string } {
    if (!this.expoAVModule) {
      return {
        isAvailable: false,
        error: "ExpoAVVideoAdapter: Module not found. Please install expo-av to enable video playback functionality.",
        installCommand: "npx expo install expo-av",
        packageName: "expo-av"
      };
    }
    
    if (!this.expoAVModule.Video) {
      return {
        isAvailable: false,
        error: "ExpoAVVideoAdapter: Video component not found in expo-av. Please ensure you have a compatible version installed.",
        installCommand: "npx expo install expo-av",
        packageName: "expo-av"
      };
    }
    
    return { isAvailable: true };
  }

  getAdapterName(): string {
    return VideoPlayerType.EXPO_AV;
  }

  renderVideo(props: VideoPlayerProps, ref: RefObject<VideoPlayerRef | null>): ReactElement {
    const availabilityInfo = this.getAvailabilityInfo();
    if (!availabilityInfo.isAvailable) {
      throw new Error(`${availabilityInfo.error}\n\nTo fix this issue, run: ${availabilityInfo.installCommand}`);
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
      onError: props.onError || (() => {}),
      onLoad: props.onLoad || (() => {}),
      onLoadStart: props.onLoadStart || (() => {}),
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
