import React, { Component, ReactElement, RefObject } from 'react';
import { Platform, View } from 'react-native';
import { VideoPlayerAdapter, VideoPlayerProps, VideoPlayerRef, VideoPlayerType } from './types';

/**
 * WebVideoAdapter - handles HTML5 video for web platform
 */
export class WebVideoAdapter implements VideoPlayerAdapter {
  
  isAvailable(): boolean {
    return Platform.OS === 'web';
  }

  getAdapterName(): string {
    return 'web-video' as VideoPlayerType;
  }

  renderVideo(props: VideoPlayerProps, ref: RefObject<VideoPlayerRef | null>): ReactElement {
    if (Platform.OS !== 'web') {
      throw new Error('WebVideoAdapter is only available on web platform');
    }

    return React.createElement(WebVideoComponent, { ...props, videoRef: ref });
  }

  processStatusUpdate(_videoRef: VideoPlayerRef, _status: any, _previousStatus?: any): void {
    // Web video status processing if needed
  }
}

// Separate component class for web video
class WebVideoComponent extends Component<VideoPlayerProps & { videoRef: RefObject<VideoPlayerRef | null> }> {
  private videoElementRef: any = null;

  componentDidMount() {
    // Set up the ref
    if (this.props.videoRef) {
      (this.props.videoRef as any).current = {
        _currentStatus: {
          uri: this.props.videoUri,
          isPlaying: false,
          isLoaded: false,
          isMuted: false,
          positionMillis: 0,
          durationMillis: 0,
          rate: 1.0,
        },
        setStatusAsync: async (status: any) => {
          if (!this.videoElementRef) return;
          
          if (status.shouldPlay !== undefined) {
            if (status.shouldPlay) {
              try {
                await this.videoElementRef.play();
              } catch (e) {
                console.warn('Play failed:', e);
              }
            } else {
              this.videoElementRef.pause();
            }
          }
          
          if (status.isMuted !== undefined) {
            this.videoElementRef.muted = status.isMuted;
          }
          
          if (status.positionMillis !== undefined) {
            this.videoElementRef.currentTime = status.positionMillis / 1000;
          }
          
          if (status.rate !== undefined) {
            this.videoElementRef.playbackRate = status.rate;
          }
        },
        getStatusAsync: async () => {
          if (!this.videoElementRef) {
            return {
              uri: this.props.videoUri,
              isPlaying: false,
              isLoaded: false,
              rate: 1.0,
            };
          }
          
          return {
            uri: this.props.videoUri,
            isPlaying: !this.videoElementRef.paused,
            isLoaded: this.videoElementRef.readyState >= 2,
            isMuted: this.videoElementRef.muted,
            positionMillis: this.videoElementRef.currentTime * 1000,
            durationMillis: this.videoElementRef.duration * 1000,
            rate: this.videoElementRef.playbackRate || 1.0,
          };
        },
      };
    }
  }

  handleLoadedMetadata = () => {
    if (this.props.onLoad) {
      this.props.onLoad({
        duration: this.videoElementRef?.duration || 0,
      });
    }
    
    // Emit playback status update to indicate video is loaded
    if (this.props.onPlaybackStatusUpdate && this.videoElementRef) {
      this.props.onPlaybackStatusUpdate({
        isPlaying: !this.videoElementRef.paused,
        isLoaded: true,
        positionMillis: this.videoElementRef.currentTime * 1000,
        durationMillis: this.videoElementRef.duration * 1000,
        isMuted: this.videoElementRef.muted,
        rate: this.videoElementRef.playbackRate || 1.0,
      });
    }
  };

  handleTimeUpdate = () => {
    if (this.props.onPlaybackStatusUpdate && this.videoElementRef) {
      this.props.onPlaybackStatusUpdate({
        isPlaying: !this.videoElementRef.paused,
        isLoaded: true,
        positionMillis: this.videoElementRef.currentTime * 1000,
        durationMillis: this.videoElementRef.duration * 1000,
        isMuted: this.videoElementRef.muted,
        rate: this.videoElementRef.playbackRate || 1.0,
      });
    }
  };

  handleError = (e: any) => {
    if (this.props.onError) {
      this.props.onError(e);
    }
  };

  handleLoadStart = () => {
    if (this.props.onLoadStart) {
      this.props.onLoadStart({});
    }
  };

  handleCanPlayThrough = () => {
    // Emit status when video can play through without buffering
    if (this.props.onPlaybackStatusUpdate && this.videoElementRef) {
      this.props.onPlaybackStatusUpdate({
        isPlaying: !this.videoElementRef.paused,
        isLoaded: true,
        positionMillis: this.videoElementRef.currentTime * 1000,
        durationMillis: this.videoElementRef.duration * 1000,
        isMuted: this.videoElementRef.muted,
        rate: this.videoElementRef.playbackRate || 1.0,
      });
    }
  };

  render() {
    return React.createElement(View, { style: this.props.style }, 
      React.createElement('video', {
        ref: (el: any) => { this.videoElementRef = el; },
        src: this.props.videoUri,
        controls: this.props.useNativeControls !== false,
        style: {
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          objectFit: 'contain',
        },
        onLoadedMetadata: this.handleLoadedMetadata,
        onCanPlayThrough: this.handleCanPlayThrough,
        onTimeUpdate: this.handleTimeUpdate,
        onError: this.handleError,
        onLoadStart: this.handleLoadStart,
      })
    );
  }
}

