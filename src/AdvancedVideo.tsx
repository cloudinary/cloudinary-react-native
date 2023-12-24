import React, { Component, RefObject } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { Video } from 'expo-av';
import 'react-native-url-polyfill/auto';
import type { CloudinaryVideo } from '@cloudinary/url-gen';
import { SDKAnalyticsConstants } from './internal/SDKAnalyticsConstants';

interface AdvancedVideoProps {
  videoUrl?: string;
  cldVideo?: CloudinaryVideo;
  videoStyle?: StyleProp<ViewStyle>;
}

type VideoRef = Video | null;

const AdvancedVideo = React.forwardRef<VideoRef, AdvancedVideoProps>(
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
    const videoUri = getVideoUri();

    if (!videoUri) {
      console.warn('Video URI is empty. Cannot play the video.');
    }

    return (
      <Video
        ref={ref}
        source={{ uri: videoUri }}
        style={videoStyle}
        useNativeControls // Enable native controls
      />
    );
  });
export default AdvancedVideo;
