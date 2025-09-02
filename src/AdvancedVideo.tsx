import React, { Component } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import type { CloudinaryVideo } from '@cloudinary/url-gen';
import { SDKAnalyticsConstants } from './internal/SDKAnalyticsConstants';
import { VideoPlayerAdapter, VideoPlayerRef, VideoPlayerFactory } from './adapters';

export interface AdvancedVideoProps {
  videoUrl?: string;
  cldVideo?: CloudinaryVideo;
  videoStyle?: StyleProp<ViewStyle>;
  enableAnalytics?: boolean;
  autoTrackAnalytics?: boolean;
  onPlaybackStatusUpdate?: (status: any) => void;
  useNativeControls?: boolean;
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
  setStatusAsync: (status: any) => Promise<void>;
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
    console.log('AdvancedVideo - Status Update:', {
      adapterName: this.state.videoAdapter.getAdapterName(),
      videoUri: this.getVideoUri(),
      status: status,
      hasCallback: !!this.props.onPlaybackStatusUpdate
    });
    
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
        console.log('AdvancedVideo - Status processing error:', error);
      }
    }

    // Forward status updates to parent component
    if (this.props.onPlaybackStatusUpdate) {
      this.props.onPlaybackStatusUpdate(status);
    }
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
        // expo-av uses setStatusAsync for playback control
        await this.videoRef.current.setStatusAsync({ shouldPlay: true });
      } catch (error) {
        console.warn('Failed to play video:', error);
      }
    }
  };

  public pauseAsync = async () => {
    if (this.videoRef.current) {
      try {
        // expo-av uses setStatusAsync for playback control
        await this.videoRef.current.setStatusAsync({ shouldPlay: false });
      } catch (error) {
        console.warn('Failed to pause video:', error);
      }
    }
  };

  public setIsMutedAsync = async (isMuted: boolean) => {
    if (this.videoRef.current) {
      try {
        // expo-av uses setStatusAsync for muting
        await this.videoRef.current.setStatusAsync({ isMuted });
      } catch (error) {
        console.warn('Failed to set muted state:', error);
      }
    }
  };

  public setPositionAsync = async (positionMillis: number) => {
    if (this.videoRef.current) {
      try {
        // expo-av uses setStatusAsync for seeking
        await this.videoRef.current.setStatusAsync({ positionMillis });
      } catch (error) {
        console.warn('Failed to set position:', error);
      }
    }
  };

  public setStatusAsync = async (status: any) => {
    if (this.videoRef.current) {
      try {
        // Forward to underlying video component
        await this.videoRef.current.setStatusAsync(status);
      } catch (error) {
        console.warn('Failed to set status:', error);
      }
    }
  };

  render() {
    const videoUri = this.getVideoUri();
    console.log('AdvancedVideo - Render:', {
      videoUri,
      adapterName: this.state.videoAdapter.getAdapterName(),
      isAdapterAvailable: this.state.videoAdapter.isAvailable()
    });

    if (!videoUri) {
      console.log('AdvancedVideo - No video URI provided');
      return this.state.videoAdapter.renderVideo({
        videoUri: '',
        style: this.props.videoStyle,
      }, this.videoRef);
    }

    try {
      const videoElement = this.state.videoAdapter.renderVideo({
        videoUri,
        style: this.props.videoStyle,
        useNativeControls: this.props.useNativeControls,
        onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
        onLoadStart: () => {
          console.log('AdvancedVideo - Load Start');
        },
        onLoad: () => {
          console.log('AdvancedVideo - Load Complete');
        },
        onError: (error: any) => {
          console.log('AdvancedVideo - Load Error:', error);
        },
      }, this.videoRef);
      
      return videoElement;
    } catch (error) {
      console.log('AdvancedVideo - Adapter Error:', error);
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
