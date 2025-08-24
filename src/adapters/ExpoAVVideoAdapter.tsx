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

  getAdapterName(): string {
    return VideoPlayerType.EXPO_AV;
  }

  renderVideo(props: VideoPlayerProps, ref: RefObject<VideoPlayerRef | null>): ReactElement {
    if (!this.isAvailable()) {
      throw new Error('expo-av is not available');
    }

    console.log('ExpoAVVideoAdapter - Rendering video:', {
      videoUri: props.videoUri,
      hasOnPlaybackStatusUpdate: !!props.onPlaybackStatusUpdate
    });

    const { Video } = this.expoAVModule;
    
    return React.createElement(Video, {
      ref: (videoInstance: any) => {
        if (ref && typeof ref === 'object' && 'current' in ref) {
          ref.current = videoInstance;
        }
      },
      source: { uri: props.videoUri },
      style: props.style,
      useNativeControls: false,
      shouldPlay: false,
      isLooping: false,
      resizeMode: 'contain',
      onPlaybackStatusUpdate: (status: any) => {
        console.log('ExpoAVVideoAdapter - Status update:', status);
        if (props.onPlaybackStatusUpdate) {
          props.onPlaybackStatusUpdate(status);
        }
      },
      onError: (error: any) => {
        console.log('ExpoAVVideoAdapter - Error:', error);
        if (props.onError) {
          props.onError(error);
        }
      },
      onLoad: (data: any) => {
        console.log('ExpoAVVideoAdapter - Load:', data);
        if (props.onLoad) {
          props.onLoad(data);
        }
      },
      onLoadStart: (data: any) => {
        console.log('ExpoAVVideoAdapter - Load Start:', data);
        if (props.onLoadStart) {
          props.onLoadStart(data);
        }
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
