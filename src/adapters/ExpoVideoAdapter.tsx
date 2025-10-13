import React, { ReactElement, RefObject } from 'react';
import { VideoPlayerAdapter, VideoPlayerProps, VideoPlayerRef, VideoPlayerType } from './types';

export class ExpoVideoAdapter implements VideoPlayerAdapter {
  private expoVideoModule: any = null;
  private videoPlayer: any = null;

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
    const hasModule = !!this.expoVideoModule;
    const hasVideoView = !!(this.expoVideoModule && this.expoVideoModule.VideoView);
    const hasCreatePlayer = !!(this.expoVideoModule && this.expoVideoModule.createVideoPlayer);
    return hasModule && hasVideoView && hasCreatePlayer;
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
    if (!this.expoVideoModule) {
      return {
        isAvailable: false,
        error: 'Module not found: expo-video',
        installationCommand: 'npx expo install expo-video'
      };
    }
    
    if (!this.expoVideoModule.VideoView) {
      return {
        isAvailable: false,
        error: 'VideoView component not found in expo-video module',
        installationCommand: 'npx expo install expo-video'
      };
    }
    
    if (!this.expoVideoModule.createVideoPlayer) {
      return {
        isAvailable: false,
        error: 'createVideoPlayer function not found in expo-video module',
        installationCommand: 'npx expo install expo-video'
      };
    }
    
    return { isAvailable: true };
  }

  getAdapterName(): string {
    return VideoPlayerType.EXPO_VIDEO;
  }

  renderVideo(props: VideoPlayerProps, ref: RefObject<VideoPlayerRef | null>): ReactElement {
    if (!this.isAvailable()) {
      const info = this.getAvailabilityInfo();
      throw new Error(
        `ExpoVideoAdapter: ${info.error}. Please install: "${info.installationCommand}"`
      );
    }

    const { VideoView, createVideoPlayer } = this.expoVideoModule;
    
    // Create or reuse the video player
    if (!this.videoPlayer) {
      this.videoPlayer = createVideoPlayer(props.videoUri);
    } else {
      // Update the source if it changed
      this.videoPlayer.source = props.videoUri;
    }
    
    return React.createElement(VideoView, {
      ref,
      player: this.videoPlayer,
      style: props.style,
      nativeControls: true,
      onPlaybackStatusUpdate: (status: any) => {
        this.processExpoVideoEvents(ref.current, 'onPlaybackStatusUpdate', status);
        props.onPlaybackStatusUpdate?.(status);
      },
      onLoadStart: (data: any) => {
        this.processExpoVideoEvents(ref.current, 'onLoadStart', data);
        props.onLoadStart?.(data);
      },
      onLoad: (data: any) => {
        this.processExpoVideoEvents(ref.current, 'onLoad', data);
        props.onLoad?.(data);
      },
      onError: (error: any) => {
        this.processExpoVideoEvents(ref.current, 'onError', error);
        props.onError?.(error);
      },
      onReadyForDisplay: (data: any) => {
        this.processExpoVideoEvents(ref.current, 'onReadyForDisplay', data);
        props.onReadyForDisplay?.(data);
      },
      onPlayingChange: (isPlaying: boolean) => {
        this.processExpoVideoEvents(ref.current, 'onPlayingChange', isPlaying);
        props.onPlayingChange?.(isPlaying);
      },
      onEnd: (data: any) => {
        this.processExpoVideoEvents(ref.current, 'onEnd', data);
        props.onEnd?.(data);
      },
    });
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

  cleanup(): void {
    this.videoPlayer = null;
  }
}
