import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Easing, Platform } from 'react-native';
import { AVPlaybackStatusSuccess } from 'expo-av';
import AdvancedVideo, { AdvancedVideoRef } from '../../AdvancedVideo'
import type { CloudinaryVideo } from '@cloudinary/url-gen';

interface CLDVideoLayerProps {
  cldVideo: CloudinaryVideo;
  videoUrl?: string;
  autoPlay?: boolean;
  muted?: boolean;
  onBack?: () => void;
  onShare?: () => void;
}

interface CLDVideoLayerState {
  status: AVPlaybackStatusSuccess | null;
  isControlsVisible: boolean;
  fadeAnim: Animated.Value;
}

export class CLDVideoLayer extends Component<CLDVideoLayerProps, CLDVideoLayerState> {
  private videoRef: React.RefObject<AdvancedVideo>;

  constructor(props: CLDVideoLayerProps) {
    super(props);
    this.videoRef = React.createRef<AdvancedVideo>();
    this.state = {
      status: null,
      isControlsVisible: true,
      fadeAnim: new Animated.Value(1),
    };
  }

  toggleControls = () => {
    this.setState(prevState => ({ isControlsVisible: !prevState.isControlsVisible }));
    Animated.timing(this.state.fadeAnim, {
      toValue: this.state.isControlsVisible ? 0 : 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  handleStatusUpdate = (s: any) => {
    if (s.isLoaded) this.setState({ status: s });
  };

  formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  handlePlayPause = async () => {
    if (this.videoRef.current) {
      try {
        if (this.state.status?.isPlaying) {
          await this.videoRef.current.pauseAsync();
        } else {
          await this.videoRef.current.playAsync();
        }
      } catch (error) {
        console.warn('Failed to toggle play/pause:', error);
      }
    }
  };

  handleMuteToggle = async () => {
    if (this.videoRef.current && this.state.status) {
      try {
        await this.videoRef.current.setIsMutedAsync(!this.state.status.isMuted);
      } catch (error) {
        console.warn('Failed to toggle mute:', error);
      }
    }
  };

  render() {
    const { cldVideo, videoUrl, onBack, onShare } = this.props;
    const { status, fadeAnim } = this.state;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={this.toggleControls}
      >
        <AdvancedVideo
          ref={this.videoRef}
          cldVideo={cldVideo}
          videoUrl={videoUrl}
          videoStyle={StyleSheet.absoluteFill}
          onPlaybackStatusUpdate={this.handleStatusUpdate}
        />

        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          {/* Top Controls Bar */}
          <View style={styles.topControlsBar}>
            <TouchableOpacity style={styles.topButton} onPress={onBack}>
              <Text style={styles.iconText}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.topButton} onPress={onShare}>
              <Text style={styles.iconText}>⤴</Text>
            </TouchableOpacity>
          </View>

          {/* Center Play/Pause Button */}
          <View style={styles.centerControls}>
            <TouchableOpacity 
              style={styles.centerPlayButton}
              onPress={this.handlePlayPause}
            >
              <Text style={styles.centerPlayIcon}>
                {status?.isPlaying ? '⏸' : '▶'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Controls Bar */}
          <View style={styles.bottomControlsBar}>
            <View style={styles.bottomLeftControls}>
              <TouchableOpacity 
                style={styles.playPauseButton}
                onPress={this.handlePlayPause}
              >
                <Text style={styles.playPauseIcon}>
                  {status?.isPlaying ? '⏸' : '▶'}
                </Text>
              </TouchableOpacity>
              
              {/* Seekbar */}
              <View style={styles.seekbarContainer}>
                <TouchableOpacity style={styles.seekbar}>
                  <View style={styles.seekbarProgress} />
                  <View style={styles.seekbarHandle} />
                </TouchableOpacity>
                <Text style={styles.timeText}>
                  {this.formatTime(status?.positionMillis || 0)} / {this.formatTime(status?.durationMillis || 0)}
                </Text>
              </View>
            </View>
            
            <View style={styles.bottomRightControls}>
              <TouchableOpacity 
                style={styles.volumeButton}
                onPress={this.handleMuteToggle}
              >
                <Text style={styles.volumeIcon}>
                  {status?.isMuted ? '⚊' : '♪'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.fullscreenButton}>
                <Text style={styles.iconText}>⛶</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  // Top Controls
  topControlsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  iconText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  // Center Controls
  centerControls: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerPlayButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  centerPlayIcon: {
    color: '#1a1a1a',
    fontSize: 32,
    fontWeight: '500',
    marginLeft: 2, // Slight offset for play icon visual balance
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  // Bottom Controls
  bottomControlsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  bottomLeftControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playPauseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  playPauseIcon: {
    color: 'white',
    fontSize: 22,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  volumeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  volumeIcon: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  fullscreenButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Seekbar
  seekbarContainer: {
    flex: 1,
    marginRight: 15,
  },
  seekbar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    position: 'relative',
    marginBottom: 5,
  },
  seekbarProgress: {
    height: 4,
    backgroundColor: '#007AFF',
    borderRadius: 2,
    width: '30%', // This will be dynamic based on video progress
  },
  seekbarHandle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    top: -4,
    left: '30%', // This will be dynamic based on video progress
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
  // Legacy styles (keeping for backward compatibility)
  topRow: {
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
});


