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
      console.log('ExpoVideoAdapter - Attempting to load expo-video...');
      this.expoVideoModule = require('expo-video');
      console.log('ExpoVideoAdapter - expo-video loaded successfully:', {
        hasVideoView: !!this.expoVideoModule?.VideoView,
        hasCreateVideoPlayer: !!this.expoVideoModule?.createVideoPlayer,
        exports: Object.keys(this.expoVideoModule || {})
      });
    } catch (error) {
      console.log('ExpoVideoAdapter - Failed to load expo-video:', error);
      this.expoVideoModule = null;
    }
  }

  isAvailable(): boolean {
    // Check if expo-video module loaded successfully and has Video component
    const available = !!(this.expoVideoModule && this.expoVideoModule.VideoView);
    console.log('ExpoVideoAdapter - isAvailable():', {
      hasModule: !!this.expoVideoModule,
      hasVideoView: !!this.expoVideoModule?.VideoView,
      result: available
    });
    return available;
  }

  getAdapterName(): string {
    return VideoPlayerType.EXPO_VIDEO;
  }

  renderVideo(props: VideoPlayerProps, ref: RefObject<VideoPlayerRef | null>): ReactElement {
    console.log('ExpoVideoAdapter - renderVideo() called with:', {
      videoUri: props.videoUri,
      hasStyle: !!props.style,
      useNativeControls: props.useNativeControls
    });

    if (!this.isAvailable()) {
      console.log('ExpoVideoAdapter - renderVideo() failed: not available');
      throw new Error('expo-video is not available');
    }

    const { VideoView, createVideoPlayer } = this.expoVideoModule;
    console.log('ExpoVideoAdapter - Using expo-video components:', {
      hasVideoView: !!VideoView,
      hasCreateVideoPlayer: !!createVideoPlayer
    });
    
    // Create VideoPlayer instance for expo-video
    const player = createVideoPlayer({ uri: props.videoUri });
    
    // Configure player properties
    player.loop = false;
    player.muted = false;
    
    // Set up event listeners for status updates
    if (props.onPlaybackStatusUpdate) {
      // Listen to various player events and map them to status updates
      player.addListener('playingChange', (isPlaying: boolean) => {
        const status = {
          uri: props.videoUri,
          isLoaded: true,
          shouldPlay: isPlaying,
          isPlaying: isPlaying,
          positionMillis: player.currentTime * 1000,
          durationMillis: player.duration * 1000,
          isMuted: player.muted,
          rate: 1.0,
          volume: player.muted ? 0 : 1.0
        };
        props.onPlaybackStatusUpdate!(status);
      });
      
      player.addListener('timeUpdate', () => {
        const status = {
          uri: props.videoUri,
          isLoaded: true,
          shouldPlay: player.playing,
          isPlaying: player.playing,
          positionMillis: player.currentTime * 1000,
          durationMillis: player.duration * 1000,
          isMuted: player.muted,
          rate: 1.0,
          volume: player.muted ? 0 : 1.0
        };
        props.onPlaybackStatusUpdate!(status);
      });
    }
    
    // Handle errors
    if (props.onError) {
      player.addListener('error', (error: any) => {
        props.onError!(error);
      });
    }
    
    return React.createElement(VideoView, {
      ref: (videoInstance: any) => {
        if (ref && typeof ref === 'object' && 'current' in ref) {
          // Store the player reference for compatibility with existing code
          ref.current = {
            ...videoInstance,
            // Add expo-av compatible methods for backward compatibility
            setStatusAsync: async (status: any) => {
              if (status.shouldPlay !== undefined) {
                if (status.shouldPlay) {
                  player.play();
                } else {
                  player.pause();
                }
              }
              if (status.positionMillis !== undefined) {
                player.currentTime = status.positionMillis / 1000;
              }
              if (status.isMuted !== undefined) {
                player.muted = status.isMuted;
              }
            },
            _currentStatus: {
              uri: props.videoUri,
              isLoaded: true,
              shouldPlay: player.playing,
              positionMillis: player.currentTime * 1000,
              durationMillis: player.duration * 1000,
              isMuted: player.muted
            }
          };
        }
      },
      player: player,
      style: props.style,
      nativeControls: props.useNativeControls || false,
      contentFit: 'contain',
      onLoad: (data: any) => {
        if (props.onLoad) {
          props.onLoad(data);
        }
      },
      onLoadStart: (data: any) => {
        if (props.onLoadStart) {
          props.onLoadStart(data);
        }
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
}
