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

type VideoRef = Video | null;

const AdvancedVideo = React.forwardRef<VideoRef, CLDVideoPlayerProps>(
  (props, ref) => {
    const getVideoUri = (): string => {
      const { videoUrl, cldVideo } = props;
      if (videoUrl) {
        return videoUrl;
      }
      if (cldVideo) {
        return cldVideo.toURL({ trackedAnalytics: SDKAnalyticsConstants });
      }
      return '';
    };
    const { videoStyle } = props;
    return (
      <Video
        ref={ref}
        source={{ uri: getVideoUri() }}
        style={videoStyle}
        useNativeControls // Enable native controls
      />
    );
  }
);
export default AdvancedVideo;
