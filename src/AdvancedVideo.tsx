import React, { Component } from 'react';
import { ViewStyle, StyleProp, View, Text } from 'react-native';
import type { CloudinaryVideo } from '@cloudinary/url-gen';
import { SDKAnalyticsConstants } from './internal/SDKAnalyticsConstants';


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


interface ExtendedVideoRef {
  _currentStatus?: any;
  _cloudinaryEventCallbacks?: any;

  [key: string]: any;
}

interface AdvancedVideoState {
  analyticsConnector: any;
  previousStatus?: any;
  analyticsInitialized: boolean;
}

export interface AdvancedVideoRef {
  startAnalyticsTracking: (metadata?: any, options?: any) => void;
  stopAnalyticsTracking: () => void;
  startAutoAnalyticsTracking: (options?: any) => void;
  addCustomEvent: (eventName: string, eventDetails?: any) => void;
}

class AdvancedVideo extends Component<AdvancedVideoProps, AdvancedVideoState> {
  private videoRef: React.RefObject<ExtendedVideoRef | null>;
  private processVideoStatus: ((videoRef: any, status: any, previousStatus?: any) => void) | null = null;
  private processExpoVideoEvents: any = null;

  constructor(props: AdvancedVideoProps) {
    super(props);
    this.videoRef = React.createRef<ExtendedVideoRef>();
    this.state = {
      analyticsConnector: null,
      previousStatus: undefined,
      analyticsInitialized: false,
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

      // Load expo-video event processing functions
      try {
        const { processExpoVideoEvents } = await import('./widgets/video/analytics/player-adapters/expoVideoPlayerAdapter');
        this.processExpoVideoEvents = processExpoVideoEvents;
      } catch (expoVideoError) {
        // expo-video adapter not available, will use expo-av fallback
      }

      this.setState({
        analyticsConnector: connector,
        analyticsInitialized: true,
      });
    } catch (error) {
      // Failed to initialize analytics
    }
  };

  private onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) return;

    if (this.props.enableAnalytics && this.videoRef.current && this.state.analyticsInitialized) {
      if (!this.videoRef.current._currentStatus) {
        this.videoRef.current._currentStatus = {};
      }
      this.videoRef.current._currentStatus = {
        ...status,
        uri: this.getVideoUri()
      };

      try {
        if (this.processVideoStatus) {
          this.processVideoStatus(this.videoRef.current, status, this.state.previousStatus);
          this.setState({ previousStatus: status });
        }
      } catch (error) {
        // Error processing analytics status
      }
    }
  };

  private createExpoVideoHandler = (eventType: string) => {
    return (data: any) => {
      if (this.props.enableAnalytics && this.videoRef.current && this.state.analyticsInitialized) {
        try {
          this.processExpoVideoEvents[eventType]?.(this.videoRef.current, data);
        } catch (error) {
          // Error processing expo-video event
        }
      }
    };
  };

  public startAnalyticsTracking = (metadata?: any, options?: any) => {
    if (this.state.analyticsConnector) {
      try {
        this.state.analyticsConnector.startManualTracking(metadata, { ...this.props.analyticsOptions, ...options });
      } catch (error) {
        // Failed to start manual analytics tracking
      }
    }
  };

  public stopAnalyticsTracking = () => {
    if (this.state.analyticsConnector) {
      try {
        this.state.analyticsConnector.stopManualTracking();
      } catch (error) {
        // Failed to stop analytics tracking
      }
    }
  };

  public startAutoAnalyticsTracking = (options?: any) => {
    if (this.state.analyticsConnector) {
      try {
        this.state.analyticsConnector.startAutoTracking({ ...this.props.analyticsOptions, ...options });
      } catch (error) {
        // Failed to start auto analytics tracking
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
        // Failed to add custom analytics event
      }
    }
  };

  render() {
    const videoUri = this.getVideoUri();

    if (!videoUri) {
      return React.createElement(View, {
        style: [this.props.videoStyle, { backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }]
      }, React.createElement(Text, {
        style: { color: 'white', textAlign: 'center' }
      }, 'No Video URL'));
    }

    console.log('[Cloudinary] Starting video component detection...');
    
    // Simple approach: try expo-video first, fallback to expo-av
    let useExpoVideo = false;
    let detectionMethod = 'unknown';
    
    // First, try to detect expo-video availability
    try {
      const expoVideo = require('expo-video');
      console.log('[Cloudinary] expo-video package found:', !!expoVideo);
      console.log('[Cloudinary] expo-video exports:', Object.keys(expoVideo));
      
      if (expoVideo && expoVideo.VideoView) {
        useExpoVideo = true;
        detectionMethod = 'expo-video available';
        console.log('[Cloudinary] Will attempt to use expo-video');
      } else {
        console.log('[Cloudinary] expo-video package found but no suitable Video component');
        console.log('[Cloudinary] Available exports:', Object.keys(expoVideo));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('[Cloudinary] expo-video not available:', errorMessage);
      useExpoVideo = false;
      detectionMethod = 'expo-video unavailable';
    }

    // Use the detected video component
    if (useExpoVideo) {
      try {
        const { VideoView, createVideoPlayer } = require('expo-video');
        console.log(`[Cloudinary] Using expo-video (${detectionMethod})`);
        
        // Create a player instance for expo-video
        const player = createVideoPlayer(videoUri);
        
        return React.createElement(VideoView, {
          ref: this.videoRef,
          player: player,
          style: this.props.videoStyle,
          nativeControls: true,
          onPlaybackStatusUpdate: (status: any) => {
            if (this.processExpoVideoEvents) {
              this.processExpoVideoEvents.onPlaybackStatusUpdate(this.videoRef.current, status);
            }
            if (this.onPlaybackStatusUpdate) {
              this.onPlaybackStatusUpdate(status);
            }
          },
          onLoadStart: (data: any) => {
            if (this.processExpoVideoEvents) {
              this.processExpoVideoEvents.onLoadStart(this.videoRef.current, data);
            }
          },
          onLoad: (data: any) => {
            if (this.processExpoVideoEvents) {
              this.processExpoVideoEvents.onLoad(this.videoRef.current, data);
            }
          },
          onError: (error: any) => {
            if (this.processExpoVideoEvents) {
              this.processExpoVideoEvents.onError(this.videoRef.current, error);
            }
          },
        });
      } catch (videoError) {
        const errorMessage = videoError instanceof Error ? videoError.message : String(videoError);
        console.log('[Cloudinary] expo-video failed, falling back to expo-av:', errorMessage);
        console.log('[Cloudinary] Full error:', videoError);
      }
    }

    // Fallback to expo-av (for older SDKs or if expo-video fails)
    try {
      const { Video } = require('expo-av');
      console.log(`[Cloudinary] Using expo-av (${detectionMethod})`);
      
      return React.createElement(Video, {
        ref: this.videoRef,
        source: { uri: videoUri },
        style: this.props.videoStyle,
        useNativeControls: true,
        shouldPlay: false,
        isLooping: false,
        resizeMode: 'contain',
        onPlaybackStatusUpdate: (status: any) => {
          if (this.onPlaybackStatusUpdate) {
            this.onPlaybackStatusUpdate(status);
          }
        },
        onError: () => {},
        onLoad: () => {},
        onLoadStart: () => {},
      });
    } catch (avError) {
      const errorMessage = avError instanceof Error ? avError.message : String(avError);
      return React.createElement(View, {
        style: [this.props.videoStyle, { backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }]
      }, React.createElement(Text, {
        style: { color: 'white', textAlign: 'center' }
      }, `Video Error: ${errorMessage}`));
    }
  }
}

export default AdvancedVideo;
