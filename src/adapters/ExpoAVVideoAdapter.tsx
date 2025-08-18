import React, { ReactElement, RefObject } from 'react';
import { VideoPlayerAdapter, VideoPlayerProps, VideoPlayerRef, VideoPlayerType } from './types';

// Log module import (but not during tests)
if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
  console.log('📼 [Cloudinary] ExpoAVVideoAdapter module imported!');
}

export class ExpoAVVideoAdapter implements VideoPlayerAdapter {
  private expoAVModule: any = null;

  constructor() {
    this.loadExpoAV();
  }

  private loadExpoAV(): void {
    try {
      this.expoAVModule = require('expo-av');
      if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
        console.log('[Cloudinary ExpoAVVideoAdapter] Successfully loaded expo-av module');
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
        console.log('[Cloudinary ExpoAVVideoAdapter] Failed to load expo-av module:', (error as Error)?.message || 'Unknown error');
      }
      this.expoAVModule = null;
    }
  }

  isAvailable(): boolean {
    const hasModule = !!this.expoAVModule;
    const hasVideo = !!(this.expoAVModule && this.expoAVModule.Video);
    const isAvailable = hasModule && hasVideo;
    
    if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
      console.log(`[Cloudinary ExpoAVVideoAdapter] Availability check: module=${hasModule}, Video=${hasVideo}, available=${isAvailable}`);
    }
    
    return isAvailable;
  }

  getAdapterName(): string {
    return VideoPlayerType.EXPO_AV;
  }

  renderVideo(props: VideoPlayerProps, ref: RefObject<VideoPlayerRef | null>): ReactElement {
    if (!this.isAvailable()) {
      throw new Error('expo-av is not available');
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
