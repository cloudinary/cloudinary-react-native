import React, { ReactElement, RefObject } from 'react';
import { View, Text } from 'react-native';
import { VideoPlayerAdapter, VideoPlayerProps, VideoPlayerRef, VideoPlayerType } from './types';

export class FallbackVideoAdapter implements VideoPlayerAdapter {
  private errorMessage: string;

  constructor(errorMessage: string = 'No video player available') {
    this.errorMessage = errorMessage;
  }

  isAvailable(): boolean {
    return true; // Fallback is always available
  }

  getAdapterName(): string {
    return VideoPlayerType.FALLBACK;
  }

  /**
   * Get detailed information about adapter availability
   * @returns Object containing availability status and installation guidance for video libraries
   */
  getAvailabilityInfo(): { 
    available: boolean; 
    error?: string; 
    installationCommand?: string;
  } {
    return {
      available: true,
      error: this.errorMessage,
      installationCommand: 'npx expo install expo-video expo-av'
    };
  }

  renderVideo(props: VideoPlayerProps, _ref: RefObject<VideoPlayerRef | null>): ReactElement {
    return React.createElement(View, {
      style: [
        props.style,
        {
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center'
        }
      ]
    }, React.createElement(Text, {
      style: {
        color: 'white',
        textAlign: 'center',
        padding: 10
      }
    }, this.errorMessage));
  }

  processStatusUpdate(): void {
    // No-op for fallback
  }

  async getAnalyticsAdapter(): Promise<any> {
    return null;
  }
}
