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

      try {
        const { processExpoVideoEvents } = await import('./widgets/video/analytics/player-adapters/expoVideoPlayerAdapter');
        this.processExpoVideoEvents = processExpoVideoEvents;
      } catch (expoVideoError) {
      }

      this.setState({
        analyticsConnector: connector,
        analyticsInitialized: true,
      });
    } catch (error) {
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
      }
    }
  };

  private createExpoVideoHandler = (eventType: string) => {
    return (data: any) => {
      if (this.props.enableAnalytics && this.videoRef.current && this.state.analyticsInitialized) {
        try {
          this.processExpoVideoEvents[eventType]?.(this.videoRef.current, data);
        } catch (error) {
        }
      }
    };
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
      return React.createElement(View, {
        style: [this.props.videoStyle, { backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }]
      }, React.createElement(Text, {
        style: { color: 'white', textAlign: 'center' }
      }, 'No Video URL'));
    }

    let useExpoVideo = false;
    try {
      const expoVideo = require('expo-video');
      
      if (expoVideo && expoVideo.VideoView) {
        useExpoVideo = true;
      }
    } catch (error) {
      useExpoVideo = false;
    }

    if (useExpoVideo) {
      try {
        const { VideoView, createVideoPlayer } = require('expo-video');
        
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
      }
    }

    try {
      const { Video } = require('expo-av');
      
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
