import React, { Component, RefObject, useRef } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { AVPlaybackStatus, Video, AVPlaybackStatusSuccess } from 'expo-av';
import type { CloudinaryVideo } from '@cloudinary/url-gen';
import { SDKAnalyticsConstants } from './internal/SDKAnalyticsConstants';
import VideoAnalyticsAdapter from './widgets/video/analytics/VideoAnalyticsAdapter';

interface AdvancedVideoProps {
  videoUrl?: string;
  cldVideo?: CloudinaryVideo;
  videoStyle?: StyleProp<ViewStyle>;
}

type VideoRef = Video | null;

const AdvancedVideo = React.forwardRef<VideoRef, AdvancedVideoProps>(
  (props, ref) => {
    const { videoUrl, cldVideo, videoStyle } = props;
    console.log('props');
    const analyticsRef = useRef<VideoAnalyticsAdapter | null>(null);

    const getVideoUri = (): string => {
      console.log('getVideoUri');
      if (videoUrl) {
        return videoUrl;
      }
      if (cldVideo) {
        console.log("got here!")
        // const publicId = cldVideo.publicID;
        if (!analyticsRef.current) {
          analyticsRef.current = new VideoAnalyticsAdapter({
            cloudName: '',
            publicId: '',
          });
        }
        return cldVideo.toURL({ trackedAnalytics: SDKAnalyticsConstants });
      }
      return '';
    };

    const videoUri = getVideoUri();

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;

      const successStatus = status as AVPlaybackStatusSuccess;
      const position = successStatus.positionMillis / 1000;

      if (successStatus.durationMillis) {
        const duration = successStatus.durationMillis / 1000;
        analyticsRef.current?.setVideoDuration(duration);
      }

      if (successStatus.isPlaying) {
        analyticsRef.current?.onPlay(position);
      } else if (!successStatus.isPlaying && !successStatus.didJustFinish) {
        analyticsRef.current?.onPause(position);
      }

      if (successStatus.didJustFinish) {
        analyticsRef.current?.onComplete(position);
      }
    };

    if (!videoUri) {
      console.warn('Video URI is empty. Cannot play the video.');
    }
    return (
      <Video
        ref={ref}
        source={{ uri: videoUri }}
        style={videoStyle}
        useNativeControls
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />
    );
  }
);

export default AdvancedVideo;
