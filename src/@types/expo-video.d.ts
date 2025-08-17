// Type declarations for expo-video
declare module 'expo-video' {
  import { Component } from 'react';
  import { ViewStyle, StyleProp } from 'react-native';

  export interface VideoViewProps {
    source?: { uri: string };
    style?: StyleProp<ViewStyle>;
    useNativeControls?: boolean;
    onLoad?: (data: any) => void;
    onLoadStart?: (data: any) => void;
    onReadyForDisplay?: (data: any) => void;
    onPlayingChange?: (isPlaying: boolean) => void;
    onError?: (error: any) => void;
    onEnd?: (data: any) => void;
    onPlaybackStatusUpdate?: (status: any) => void;
    [key: string]: any;
  }

  export class VideoView extends Component<VideoViewProps> {}
}