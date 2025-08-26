import React, { ReactElement, RefObject } from 'react';
import { VideoPlayerAdapter, VideoPlayerProps, VideoPlayerRef, VideoPlayerType } from './types';

// ExpoVideoAdapter - handles expo-video integration
// Currently disabled due to hooks compatibility issues with class-based adapter system

export class ExpoVideoAdapter implements VideoPlayerAdapter {
  private expoVideoModule: any = null;

  constructor() {
    this.loadExpoVideo();
  }

  private loadExpoVideo(): void {
    try {
      this.expoVideoModule = require('expo-video');
    } catch (error) {
      this.expoVideoModule = null;
    }
  }

  isAvailable(): boolean {
    // TODO: expo-video support requires architectural changes to support hooks
    // The current class-based adapter system is incompatible with expo-video's hook-based API
    // For now, return false to allow clean fallback to expo-av
    // This maintains the correct priority: try expo-video first, fall back to expo-av
    return false;
  }

  getAdapterName(): string {
    return VideoPlayerType.EXPO_VIDEO;
  }

  renderVideo(_props: VideoPlayerProps, _ref: RefObject<VideoPlayerRef | null>): ReactElement {
    // This method should never be called since isAvailable() returns false
    // expo-video support requires architectural changes for hooks compatibility
    throw new Error('expo-video is not available - requires architectural redesign for hooks support');
  }

  private processExpoVideoEvents(videoRef: VideoPlayerRef | null, eventType: string, data: any): void {
    if (!videoRef) return;

    try {
      const { processExpoVideoEvents } = require('../widgets/video/analytics/player-adapters/expoVideoPlayerAdapter');
      const handler = processExpoVideoEvents[eventType];
      if (handler) {
        handler(videoRef, data);
      }
    } catch (error) {
      // Silently fail if analytics adapter is not available
    }
  }

  processStatusUpdate(videoRef: VideoPlayerRef, status: any): void {
    // For expo-video, status updates are handled directly in the event handlers
    this.processExpoVideoEvents(videoRef, 'onPlaybackStatusUpdate', status);
  }

  async getAnalyticsAdapter(): Promise<any> {
    try {
      const { expoVideoPlayerAdapter } = await import('../widgets/video/analytics/player-adapters/expoVideoPlayerAdapter');
      return expoVideoPlayerAdapter;
    } catch (error) {
      return null;
    }
  }
}
