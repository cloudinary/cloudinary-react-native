import React, { Component, RefObject } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { Video } from 'expo-av';
import 'react-native-url-polyfill/auto';
import type { CloudinaryVideo } from '@cloudinary/url-gen';
import { SDKAnalyticsConstants } from './internal/SDKAnalyticsConstants';

interface CLDVideoPlayerProps {
  videoUrl?: string;
  cldVideo?: CloudinaryVideo;
  videoStyle?: StyleProp<ViewStyle>;
}

interface CLDVideoPlayerMethods {
  playVideo: () => Promise<void>;
  pauseVideo: () => Promise<void>;
}

class CLDVideoPlayer extends Component<CLDVideoPlayerProps> {
  private video: RefObject<Video> = React.createRef<Video>();

  playVideo = async () => {
    if (this.video.current) {
      await this.video.current.playAsync();
    }
  };

  pauseVideo = async () => {
    if (this.video.current) {
      await this.video.current.pauseAsync();
    }
  };

  getVideoUri = (): string => {
    const { videoUrl, cldVideo } = this.props;
    if (videoUrl) {
      return videoUrl;
    }
    if (cldVideo) {
      return cldVideo.toURL({trackedAnalytics: SDKAnalyticsConstants});
    }
    return '';
  };

  getVideoPlayerMethods = (): CLDVideoPlayerMethods => ({
    playVideo: this.playVideo,
    pauseVideo: this.pauseVideo,
  });

  render() {
    const {  videoStyle } = this.props;
    return (
      <Video
        ref={this.video}
        source={{ uri: this.getVideoUri() }}
        style={videoStyle}
        useNativeControls // Enable native controls
      />
    );
  }
}
export default CLDVideoPlayer;
