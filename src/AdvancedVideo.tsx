import React, { Component } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { AVPlaybackStatus, Video, AVPlaybackStatusSuccess } from 'expo-av';
import type { CloudinaryVideo } from '@cloudinary/url-gen';
import { SDKAnalyticsConstants } from './internal/SDKAnalyticsConstants';

interface AdvancedVideoProps {
  videoUrl?: string;
  cldVideo?: CloudinaryVideo;
  videoStyle?: StyleProp<ViewStyle>;
  // Analytics props - all optional to maintain backward compatibility
  enableAnalytics?: boolean;
  autoTrackAnalytics?: boolean;
  analyticsOptions?: {
    customData?: any;
    videoPlayerType?: string;
    videoPlayerVersion?: string;
  };
}

// Extend Video type to include our custom properties
interface ExtendedVideo extends Video {
  _currentStatus?: any;
  _cloudinaryEventCallbacks?: any;
}

interface AdvancedVideoState {
  analyticsConnector: any;
  previousStatus?: AVPlaybackStatus;
  analyticsInitialized: boolean;
}

export interface AdvancedVideoRef extends Video {
  startAnalyticsTracking: (metadata?: any, options?: any) => void;
  stopAnalyticsTracking: () => void;
  startAutoAnalyticsTracking: (options?: any) => void;
  addCustomEvent: (eventName: string, eventDetails?: any) => void;
}

class AdvancedVideo extends Component<AdvancedVideoProps, AdvancedVideoState> {
  private videoRef: React.RefObject<ExtendedVideo>;
  private processExpoAVStatus: ((videoRef: any, status: AVPlaybackStatus, previousStatus?: AVPlaybackStatus) => void) | null = null;

  constructor(props: AdvancedVideoProps) {
    super(props);
    this.videoRef = React.createRef<ExtendedVideo>();
    this.state = {
      analyticsConnector: null,
      previousStatus: undefined,
      analyticsInitialized: false,
    };
  }

  componentDidMount() {
    // Use setTimeout to ensure the ref is properly mounted
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
      // Dynamically import analytics modules to avoid initial load issues
      const { connectCloudinaryAnalytics } = await import('./widgets/video/analytics/cloudinary-analytics-react-native');
      const { processExpoAVStatus } = await import('./widgets/video/analytics/player-adapters/expoAVVideoPlayerAdapter');

      const videoUri = this.getVideoUri();

      if (this.videoRef.current) {
        if (!this.videoRef.current._currentStatus) {
          this.videoRef.current._currentStatus = {};
        }
        this.videoRef.current._currentStatus.uri = videoUri;
      }

      const connector = connectCloudinaryAnalytics(this.videoRef.current);

      // Auto-start tracking if enabled - do this after URI is set
      if (this.props.autoTrackAnalytics) {
        connector.startAutoTracking(this.props.analyticsOptions || {});
      }

      this.processExpoAVStatus = processExpoAVStatus;

      this.setState({
        analyticsConnector: connector,
        analyticsInitialized: true,
      });
    } catch (error) {
      console.warn('Failed to initialize Cloudinary analytics:', error);
    }
  };

  private onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;

      const successStatus = status as AVPlaybackStatusSuccess;

    // Process analytics events if enabled and initialized
    if (this.props.enableAnalytics && this.videoRef.current && this.state.analyticsInitialized) {
      // Store current status for analytics adapter
      if (!this.videoRef.current._currentStatus) {
        this.videoRef.current._currentStatus = {};
      }
      this.videoRef.current._currentStatus = {
        ...successStatus,
        uri: this.getVideoUri()
      };

      try {
        if (this.processExpoAVStatus) {
          this.processExpoAVStatus(this.videoRef.current, successStatus, this.state.previousStatus);
          this.setState({ previousStatus: successStatus });
        }
      } catch (error) {
        console.warn('Error processing analytics status:', error);
      }
    }
  };

  public startAnalyticsTracking = (metadata?: any, options?: any) => {
    if (this.state.analyticsConnector) {
      try {
        this.state.analyticsConnector.startManualTracking(metadata, { ...this.props.analyticsOptions, ...options });
      } catch (error) {
        console.warn('Failed to start manual analytics tracking:', error);
      }
    } else {
      console.warn('Analytics not enabled or not initialized. Set enableAnalytics=true and wait for initialization.');
    }
  };

  public stopAnalyticsTracking = () => {
    if (this.state.analyticsConnector) {
      try {
        this.state.analyticsConnector.stopManualTracking();
      } catch (error) {
        console.warn('Failed to stop analytics tracking:', error);
      }
    }
  };

  public startAutoAnalyticsTracking = (options?: any) => {
    if (this.state.analyticsConnector) {
      try {
        this.state.analyticsConnector.startAutoTracking({ ...this.props.analyticsOptions, ...options });
      } catch (error) {
        console.warn('Failed to start auto analytics tracking:', error);
      }
    } else {
      console.warn('Analytics not enabled or not initialized. Set enableAnalytics=true and wait for initialization.');
    }
  };

  public addCustomEvent = (eventName: string, eventDetails: any = {}) => {

    if (!this.props.enableAnalytics) {
      console.warn('Analytics not enabled. Set enableAnalytics=true to use custom events.');
      return;
    }

    if (!this.state.analyticsInitialized) {
      console.warn('Analytics not yet initialized. Please wait for initialization to complete.');
      return;
    }

    if (this.state.analyticsConnector && this.state.analyticsInitialized) {
      try {
        if (this.state.analyticsConnector.addCustomEvent) {
          this.state.analyticsConnector.addCustomEvent(eventName, eventDetails);
        } else {
          console.warn('Custom events not supported by current analytics connector');
        }
      } catch (error) {
        console.warn('Failed to add custom analytics event:', error);
      }
    } else {
      console.warn('Analytics connector not available. Please ensure analytics are properly initialized.');
    }
  };

  render() {
    const videoUri = this.getVideoUri();

    if (!videoUri) {
      console.warn('Video URI is empty. Cannot play the video.');
    }

    return (
      <Video
        ref={this.videoRef}
        source={{ uri: videoUri }}
        style={this.props.videoStyle}
        useNativeControls
        onPlaybackStatusUpdate={this.onPlaybackStatusUpdate}
      />
    );
  }
}

export default AdvancedVideo;
