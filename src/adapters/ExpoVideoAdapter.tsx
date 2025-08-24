import React, { ReactElement, RefObject } from 'react';
import { VideoPlayerAdapter, VideoPlayerProps, VideoPlayerRef, VideoPlayerType } from './types';

export class ExpoVideoAdapter implements VideoPlayerAdapter {
  private expoVideoModule: any = null;
  private videoPlayer: any = null;
  private eventListeners: any[] = [];

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
    const isAvailable = hasModule && hasVideoView && hasCreatePlayer;
    
    return isAvailable;
  }

  getAdapterName(): string {
    return VideoPlayerType.EXPO_VIDEO;
  }

  renderVideo(props: VideoPlayerProps, ref: RefObject<VideoPlayerRef | null>): ReactElement {
    if (!this.isAvailable()) {
      throw new Error('expo-video is not available');
    }

    console.log('ExpoVideoAdapter - Rendering video:', {
      videoUri: props.videoUri,
      hasOnPlaybackStatusUpdate: !!props.onPlaybackStatusUpdate
    });

    const { VideoView, createVideoPlayer } = this.expoVideoModule;
    
    // Create or reuse the video player
    if (!this.videoPlayer) {
      console.log('ExpoVideoAdapter - Creating new video player');
      this.videoPlayer = createVideoPlayer(props.videoUri);
      
      // Set up player event listeners for expo-video
      if (this.videoPlayer && props.onPlaybackStatusUpdate) {
        // Clear any existing listeners
        this.cleanup();
        
        // Try different event names that might exist in expo-video
        const statusListener = this.videoPlayer.addListener?.('statusChange', (status: any) => {
          console.log('ExpoVideoAdapter - Player status change:', status);
          // Convert expo-video status to expo-av-like status format
          const normalizedStatus = {
            isLoaded: status.status === 'loaded' || status.status === 'readyToPlay',
            isPlaying: status.status === 'playing',
            positionMillis: (status.currentTime || 0) * 1000,
            durationMillis: (status.duration || 0) * 1000,
            isMuted: status.isMuted || false,
            error: status.error,
            ...status
          };
          this.processExpoVideoEvents(ref.current, 'onPlaybackStatusUpdate', normalizedStatus);
          props.onPlaybackStatusUpdate?.(normalizedStatus);
        });
        
        if (statusListener) {
          this.eventListeners.push(statusListener);
        }
        
        // Try alternative event names
        const playbackListener = this.videoPlayer.addListener?.('playbackStatusUpdate', (status: any) => {
          console.log('ExpoVideoAdapter - Playback status update:', status);
          props.onPlaybackStatusUpdate?.(status);
        });
        
        if (playbackListener) {
          this.eventListeners.push(playbackListener);
        }
        
        // Simulate initial status for immediate feedback
        setTimeout(() => {
          const initialStatus = {
            isLoaded: false,
            isPlaying: false,
            positionMillis: 0,
            durationMillis: 0,
            isMuted: false,
          };
          console.log('ExpoVideoAdapter - Sending initial status');
          props.onPlaybackStatusUpdate?.(initialStatus);
        }, 100);
      }
    } else {
      // Update the source if it changed
      console.log('ExpoVideoAdapter - Updating video source');
      this.videoPlayer.source = props.videoUri;
    }
    
    return React.createElement(VideoView, {
      ref,
      player: this.videoPlayer,
      style: props.style,
      nativeControls: false,
      // Note: expo-video uses player event listeners instead of VideoView props for status updates
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
    // Remove all event listeners
    this.eventListeners.forEach(listener => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove();
      }
    });
    this.eventListeners = [];
    this.videoPlayer = null;
  }
}
