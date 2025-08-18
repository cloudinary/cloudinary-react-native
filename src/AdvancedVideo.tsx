import React, { Component } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import type { CloudinaryVideo } from '@cloudinary/url-gen';
import { SDKAnalyticsConstants } from './internal/SDKAnalyticsConstants';
import { VideoPlayerAdapter, VideoPlayerRef, VideoPlayerFactory } from './adapters';

// Log module import (but not during tests)
if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
  console.log('🚀 [Cloudinary] AdvancedVideo module imported successfully!');
}

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
}

class AdvancedVideo extends Component<AdvancedVideoProps, AdvancedVideoState> {
  private videoRef: React.RefObject<VideoPlayerRef | null>;

  constructor(props: AdvancedVideoProps) {
    super(props);
    this.videoRef = React.createRef<VideoPlayerRef | null>();
    
    const videoAdapter = VideoPlayerFactory.getAvailableAdapter();
    
    // Log detailed information about video adapter selection
    if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
      console.log('[Cloudinary AdvancedVideo] Initializing video component...');
      const availableAdapters = VideoPlayerFactory.getAvailableAdapters();
      console.log(`[Cloudinary AdvancedVideo] Available adapters:`, availableAdapters);
      console.log(`[Cloudinary AdvancedVideo] 🎥 Selected video adapter: ${videoAdapter.getAdapterName()}`);
      console.log(`[Cloudinary AdvancedVideo] You are using: ${videoAdapter.getAdapterName() === 'expo-video' ? '📱 EXPO-VIDEO (newer)' : videoAdapter.getAdapterName() === 'expo-av' ? '📱 EXPO-AV (legacy)' : '⚠️ FALLBACK'}`);
    }
    
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

  render() {
    const videoUri = this.getVideoUri();

    if (!videoUri) {
      return this.state.videoAdapter.renderVideo({
        videoUri: '',
        style: this.props.videoStyle,
      }, this.videoRef);
    }

    try {
      if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
        console.log(`[Cloudinary AdvancedVideo] 🎬 Rendering video with ${this.state.videoAdapter.getAdapterName()} adapter`);
      }
      const videoElement = this.state.videoAdapter.renderVideo({
        videoUri,
        style: this.props.videoStyle,
        onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
        onLoadStart: () => {
          if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
            console.log(`[Cloudinary AdvancedVideo] 📡 Video load started using ${this.state.videoAdapter.getAdapterName()}`);
          }
        },
        onLoad: () => {
          if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
            console.log(`[Cloudinary AdvancedVideo] ✅ Video loaded successfully using ${this.state.videoAdapter.getAdapterName()}`);
          }
        },
        onError: (error: any) => {
          if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
            console.log(`[Cloudinary AdvancedVideo] ❌ Video error with ${this.state.videoAdapter.getAdapterName()}:`, error);
          }
        },
      }, this.videoRef);
      
      if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
        console.log(`[Cloudinary AdvancedVideo] ✅ Video component successfully rendered with ${this.state.videoAdapter.getAdapterName()}`);
      }
      return videoElement;
    } catch (error) {
      // If the adapter fails, fall back to a fallback adapter
      if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
        console.log(`[Cloudinary AdvancedVideo] ❌ ${this.state.videoAdapter.getAdapterName()} adapter failed, falling back to fallback adapter:`, error instanceof Error ? error.message : 'Unknown error');
      }
      const { FallbackVideoAdapter } = require('./adapters/FallbackVideoAdapter');
      const fallbackAdapter = new FallbackVideoAdapter(
        error instanceof Error ? `Video Error: ${error.message}` : 'Unknown video error'
      );
      
      if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
        console.log(`[Cloudinary AdvancedVideo] 🔄 Using fallback adapter to render video`);
      }
      return fallbackAdapter.renderVideo({
        videoUri,
        style: this.props.videoStyle,
      }, this.videoRef);
    }
  }
}

export default AdvancedVideo;
