import React, { Component } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import type { CloudinaryVideo } from '@cloudinary/url-gen';
import { SDKAnalyticsConstants } from './internal/SDKAnalyticsConstants';
import { VideoPlayerAdapter, VideoPlayerRef, VideoPlayerFactory } from './adapters';

interface AdvancedVideoProps {
  videoUrl?: string;
  cldVideo?: CloudinaryVideo;
  videoStyle?: StyleProp<ViewStyle>;
  enableAnalytics?: boolean;
  autoTrackAnalytics?: boolean;
  analyticsOptions?: {
    customData?: any;
    videoPlayerType?: string;
    videoPlayerVersion?: string;
  };
}

interface AdvancedVideoState {
  analyticsConnector: any;
  previousStatus?: any;
  analyticsInitialized: boolean;
  videoAdapter: VideoPlayerAdapter;
}

export interface AdvancedVideoRef {
  startAnalyticsTracking: (metadata?: any, options?: any) => void;
  stopAnalyticsTracking: () => void;
  startAutoAnalyticsTracking: (options?: any) => void;
  addCustomEvent: (eventName: string, eventDetails?: any) => void;
  playAsync: () => Promise<void>;
  pauseAsync: () => Promise<void>;
  setIsMutedAsync: (isMuted: boolean) => Promise<void>;
  setPositionAsync: (positionMillis: number) => Promise<void>;
}

class AdvancedVideo extends Component<AdvancedVideoProps, AdvancedVideoState> {
  private videoRef: React.RefObject<VideoPlayerRef | null>;

  constructor(props: AdvancedVideoProps) {
    super(props);
    this.videoRef = React.createRef<VideoPlayerRef | null>();
    
    const videoAdapter = VideoPlayerFactory.getAvailableAdapter();
    
    this.state = {
      analyticsConnector: null,
      previousStatus: undefined,
      analyticsInitialized: false,
      videoAdapter,
    };
  }

  async componentDidMount() {
    setTimeout(() => {
      if (this.props.enableAnalytics && this.videoRef.current) {
        this.initializeAnalytics();
      }
    }, 100);
  }

  componentDidUpdate(prevProps: AdvancedVideoProps) {
    if (
      this.props.enableAnalytics &&
      !prevProps.enableAnalytics &&
      this.videoRef.current &&
      !this.state.analyticsInitialized
    ) {
      this.initializeAnalytics();
    }
  }

  componentWillUnmount() {
    if (this.state.analyticsConnector && this.state.analyticsConnector.stopManualTracking) {
      this.state.analyticsConnector.stopManualTracking();
    }
  }

  private getVideoUri = (): string => {
    if (this.props.videoUrl) {
      return this.props.videoUrl;
      }
    if (this.props.cldVideo) {
      return this.props.cldVideo.toURL({ trackedAnalytics: SDKAnalyticsConstants });
      }
      return '';
    };

  private initializeAnalytics = async () => {
    if (!this.props.enableAnalytics || !this.videoRef.current || this.state.analyticsInitialized) {
      return;
    }

    try {
      const { connectCloudinaryAnalytics } = await import('./widgets/video/analytics/cloudinary-analytics-react-native');
      
      const videoUri = this.getVideoUri();

      if (this.videoRef.current) {
        if (!this.videoRef.current._currentStatus) {
          this.videoRef.current._currentStatus = {};
        }
        this.videoRef.current._currentStatus.uri = videoUri;
      }

      const connector = connectCloudinaryAnalytics(this.videoRef.current);

      if (this.props.autoTrackAnalytics) {
        connector.startAutoTracking(this.props.analyticsOptions || {});
      }

      this.setState({
        analyticsConnector: connector,
        analyticsInitialized: true,
      });
    } catch (error) {
      // Silently fail if analytics initialization fails
    }
  };

  private onPlaybackStatusUpdate = (status: any) => {
    if (this.props.enableAnalytics && this.videoRef.current && this.state.analyticsInitialized) {
      if (!this.videoRef.current._currentStatus) {
        this.videoRef.current._currentStatus = {};
      }
      this.videoRef.current._currentStatus = {
        ...status,
        uri: this.getVideoUri()
      };

      try {
        // Use the adapter's status processing if available
        if (this.state.videoAdapter.processStatusUpdate) {
          this.state.videoAdapter.processStatusUpdate(this.videoRef.current, status, this.state.previousStatus);
        }
        this.setState({ previousStatus: status });
      } catch (error) {
        // Silently fail if status processing fails
      }
    }

    // Note: onPlaybackStatusUpdate forwarding removed as it's not in the interface anymore
  };



  public startAnalyticsTracking = (metadata?: any, options?: any) => {
    if (this.state.analyticsConnector) {
      try {
        this.state.analyticsConnector.startManualTracking(metadata, { ...this.props.analyticsOptions, ...options });
      } catch (error) {
      }
    }
  };

  public stopAnalyticsTracking = () => {
    if (this.state.analyticsConnector) {
      try {
        this.state.analyticsConnector.stopManualTracking();
      } catch (error) {
      }
    }
  };

  public startAutoAnalyticsTracking = (options?: any) => {
    if (this.state.analyticsConnector) {
      try {
        this.state.analyticsConnector.startAutoTracking({ ...this.props.analyticsOptions, ...options });
      } catch (error) {
      }
    }
  };

  public addCustomEvent = (eventName: string, eventDetails: any = {}) => {
    if (!this.props.enableAnalytics) {
      return;
    }

    if (!this.state.analyticsInitialized) {
      return;
    }

    if (this.state.analyticsConnector && this.state.analyticsInitialized) {
      try {
        if (this.state.analyticsConnector.addCustomEvent) {
          this.state.analyticsConnector.addCustomEvent(eventName, eventDetails);
        }
      } catch (error) {
      }
    }
  };

  // Playback control methods
  public playAsync = async () => {
    if (this.videoRef.current) {
      try {
        await this.videoRef.current.playAsync();
      } catch (error) {
        console.warn('Failed to play video:', error);
      }
    }
  };

  public pauseAsync = async () => {
    if (this.videoRef.current) {
      try {
        await this.videoRef.current.pauseAsync();
      } catch (error) {
        console.warn('Failed to pause video:', error);
      }
    }
  };

  public setIsMutedAsync = async (isMuted: boolean) => {
    if (this.videoRef.current) {
      try {
        await this.videoRef.current.setIsMutedAsync(isMuted);
      } catch (error) {
        console.warn('Failed to set muted state:', error);
      }
    }
  };

  public setPositionAsync = async (positionMillis: number) => {
    if (this.videoRef.current) {
      try {
        await this.videoRef.current.setPositionAsync(positionMillis);
      } catch (error) {
        console.warn('Failed to set position:', error);
      }
    }
  };

  render() {
    const videoUri = this.getVideoUri();

    if (!videoUri) {
      return this.state.videoAdapter.renderVideo({
        videoUri: '',
        style: this.props.videoStyle,
      }, this.videoRef);
    }

    try {
      const videoElement = this.state.videoAdapter.renderVideo({
        videoUri,
        style: this.props.videoStyle,
        onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
        onLoadStart: () => {},
        onLoad: () => {},
        onError: (_error: any) => {},
      }, this.videoRef);
      
      return videoElement;
    } catch (error) {
      // If the adapter fails, fall back to a fallback adapter
      const { FallbackVideoAdapter } = require('./adapters/FallbackVideoAdapter');
      const fallbackAdapter = new FallbackVideoAdapter(
        error instanceof Error ? `Video Error: ${error.message}` : 'Unknown video error'
      );
      
      return fallbackAdapter.renderVideo({
        videoUri,
        style: this.props.videoStyle,
      }, this.videoRef);
    }
  }
}

export default AdvancedVideo;
