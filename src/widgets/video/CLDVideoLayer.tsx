import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Easing, Platform, PanResponder, Dimensions, Share, ActivityIndicator } from 'react-native';
import { AVPlaybackStatusSuccess } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import AdvancedVideo, { AdvancedVideoRef } from '../../AdvancedVideo'
import type { CloudinaryVideo } from '@cloudinary/url-gen';

interface CLDVideoLayerProps {
  cldVideo: CloudinaryVideo;
  videoUrl?: string;
  autoPlay?: boolean;
  muted?: boolean;
  onBack?: () => void;
  onShare?: () => void;
  hideControls?: boolean;
}

interface CLDVideoLayerState {
  status: AVPlaybackStatusSuccess | null;
  isControlsVisible: boolean;
  fadeAnim: Animated.Value;
  isSeeking: boolean;
  seekingPosition: number;
  lastSeekPosition: number;
  isSeekingComplete: boolean;
}

export class CLDVideoLayer extends React.Component<CLDVideoLayerProps, CLDVideoLayerState> {
  private videoRef: React.RefObject<AdvancedVideo>;
  private seekbarRef: React.RefObject<View>;
  private panResponder: any;
  private seekTimeoutId: NodeJS.Timeout | null = null;
  private autoHideTimeoutId: NodeJS.Timeout | null = null;
  private lastSeekTime: number = 0;

  constructor(props: CLDVideoLayerProps) {
    super(props);
    this.videoRef = React.createRef<AdvancedVideo>();
    this.seekbarRef = React.createRef<View>();
    this.state = {
      status: null,
      isControlsVisible: true,
      fadeAnim: new Animated.Value(1),
      isSeeking: false,
      seekingPosition: 0,
      lastSeekPosition: 0,
      isSeekingComplete: false,
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        this.handleSeekStart(evt);
      },
      onPanResponderMove: (evt) => {
        this.handleSeekMove(evt);
      },
      onPanResponderRelease: (evt) => {
        this.handleSeekEnd(evt);
      },
    });
  }

  componentDidMount() {
    // Start auto-hide timer since controls are initially visible
    this.startAutoHideTimer();
  }

  componentWillUnmount() {
    // Clean up seek timeout
    if (this.seekTimeoutId) {
      clearTimeout(this.seekTimeoutId);
      this.seekTimeoutId = null;
    }
    // Clean up auto-hide timeout
    if (this.autoHideTimeoutId) {
      clearTimeout(this.autoHideTimeoutId);
      this.autoHideTimeoutId = null;
    }
  }

  startAutoHideTimer = () => {
    // Clear existing timeout
    if (this.autoHideTimeoutId) {
      clearTimeout(this.autoHideTimeoutId);
    }
    
    // Set new timeout to hide controls after 3 seconds
    this.autoHideTimeoutId = setTimeout(() => {
      if (this.state.isControlsVisible) {
        this.setState({ isControlsVisible: false });
        Animated.timing(this.state.fadeAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      }
    }, 3000);
  };

  clearAutoHideTimer = () => {
    if (this.autoHideTimeoutId) {
      clearTimeout(this.autoHideTimeoutId);
      this.autoHideTimeoutId = null;
    }
  };

  toggleControls = () => {
    const newVisibility = !this.state.isControlsVisible;
    this.setState({ isControlsVisible: newVisibility });
    
    Animated.timing(this.state.fadeAnim, {
      toValue: newVisibility ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    // Handle auto-hide timer based on new visibility state
    if (newVisibility) {
      // Controls are now visible, start auto-hide timer
      this.startAutoHideTimer();
    } else {
      // Controls are now hidden, clear auto-hide timer
      this.clearAutoHideTimer();
    }
  };

  handleStatusUpdate = (s: any) => {
    if (s.isLoaded) {
      // Check if we need to clear the seeking complete state
      if (this.state.isSeekingComplete && this.state.lastSeekPosition > 0) {
        const currentVideoPosition = s.positionMillis || 0;
        const seekPositionDiff = Math.abs(currentVideoPosition - this.state.lastSeekPosition);
        
        // If video position is within 500ms of our seek position, clear seeking state
        if (seekPositionDiff < 500) {
          this.setState({ 
            status: s,
            isSeekingComplete: false,
            lastSeekPosition: 0
          });
          return;
        }
      }
      
      this.setState({ status: s });
    }
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

  handleDefaultShare = async () => {
    try {
      const videoUrl = this.props.cldVideo.toURL();
      await Share.share({
        message: '',
        url: videoUrl,
      });
    } catch (error) {
      console.warn('Failed to share video:', error);
    }
  };

  handleSeekStart = (_evt: any) => {
    this.setState({ isSeeking: true });
  };

  handleSeekMove = (evt: any) => {
    if (this.seekbarRef.current && this.state.status) {
      // Extract pageX before async measure call to avoid synthetic event pooling issues
      const touchPageX = evt.nativeEvent.pageX;
      this.seekbarRef.current.measure((_x, _y, width, _height, pageX, _pageY) => {
        const touchX = touchPageX - pageX;
        const progress = Math.max(0, Math.min(1, touchX / width));
        const seekPosition = progress * (this.state.status?.durationMillis || 0);
        this.setState({ seekingPosition: seekPosition });
      });
    }
  };

  handleSeekEnd = (evt: any) => {
    if (this.seekbarRef.current && this.state.status) {
      // Extract pageX before async measure call to avoid synthetic event pooling issues
      const touchPageX = evt.nativeEvent.pageX;
      this.seekbarRef.current.measure((_x, _y, width, _height, pageX, _pageY) => {
        const touchX = touchPageX - pageX;
        const progress = Math.max(0, Math.min(1, touchX / width));
        const duration = this.state.status?.durationMillis || 0;
        const seekPosition = progress * duration;
        
        // Validate seek position before calling setPositionAsync
        if (this.videoRef.current && this.state.status && duration > 0) {
          // Ensure seekPosition is within valid bounds with some buffer
          const validSeekPosition = Math.max(0, Math.min(seekPosition, duration - 100));
          
          // Only seek if the position is significantly different from current position
          const currentPosition = this.state.status.positionMillis || 0;
          const positionDiff = Math.abs(validSeekPosition - currentPosition);
          
          // Add debouncing to prevent rapid seek operations
          const now = Date.now();
          const timeSinceLastSeek = now - this.lastSeekTime;
          
          // Only seek if difference is more than 100ms and enough time has passed since last seek
          if (positionDiff > 100 && timeSinceLastSeek > 200) {
            // Additional validation: ensure video is in a seekable state
            if (this.state.status.isLoaded && 
                this.state.status.durationMillis && 
                this.state.status.durationMillis > 0 &&
                validSeekPosition >= 0 && 
                validSeekPosition < this.state.status.durationMillis) {
              
              this.lastSeekTime = now;
              this.videoRef.current.setPositionAsync(validSeekPosition).catch((error) => {
                console.warn('Seek failed:', error);
                // Reset seeking state on failure
                this.setState({ 
                  isSeeking: false, 
                  seekingPosition: 0,
                  lastSeekPosition: 0,
                  isSeekingComplete: false
                });
              });
            }
          }
          
          // Set state and let the getProgress method handle switching back to video position
          this.setState({ 
            isSeeking: false, 
            seekingPosition: validSeekPosition,
            lastSeekPosition: validSeekPosition,
            isSeekingComplete: true
          });
        } else {
          // If validation fails, just stop seeking without changing position
          this.setState({ 
            isSeeking: false, 
            seekingPosition: 0,
            lastSeekPosition: 0,
            isSeekingComplete: false
          });
        }
      });
    }
  };

  getProgress = (): number => {
    if (!this.state.status) return 0;
    
    const duration = this.state.status?.durationMillis || 1;
    const currentVideoPosition = this.state.status?.positionMillis || 0;
    
    // If actively seeking, use the seeking position
    if (this.state.isSeeking) {
      return this.state.seekingPosition / duration;
    }
    
    // If we just finished seeking and haven't switched back yet, use the seek position
    if (this.state.isSeekingComplete && this.state.lastSeekPosition > 0) {
      return this.state.lastSeekPosition / duration;
    }
    
    // Otherwise use the video's current position
    return currentVideoPosition / duration;
  };

  getCurrentPosition = (): number => {
    if (!this.state.status) return 0;
    
    const currentVideoPosition = this.state.status?.positionMillis || 0;
    
    // If actively seeking, use the seeking position
    if (this.state.isSeeking) {
      return this.state.seekingPosition;
    }
    
    // If we just finished seeking and haven't switched back yet, use the seek position
    if (this.state.isSeekingComplete && this.state.lastSeekPosition > 0) {
      return this.state.lastSeekPosition;
    }
    
    // Otherwise use the video's current position
    return currentVideoPosition;
  };

  render() {
    const { cldVideo, videoUrl, onBack, onShare } = this.props;
    const { status, fadeAnim } = this.state;
    const progress = this.getProgress();
    const currentPosition = this.getCurrentPosition();
    const isVideoLoaded = status?.isLoaded === true;

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

        {/* Loading Spinner */}
        {!isVideoLoaded && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}

        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          {/* Top Controls Bar */}
          <View style={styles.topControlsBar}>
            {onBack && (
              <TouchableOpacity style={styles.topButton} onPress={onBack}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.topButton} onPress={onShare || this.handleDefaultShare}>
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Center Play/Pause Button */}
          <View style={styles.centerControls}>
            <TouchableOpacity 
              style={styles.centerPlayButton}
              onPress={this.handlePlayPause}
            >
              <Ionicons 
                name={status?.isPlaying ? 'pause' : 'play'} 
                size={32} 
                color="#1a1a1a"
                style={{ marginLeft: status?.isPlaying ? 0 : 3 }} // Slight offset for play icon visual balance
              />
            </TouchableOpacity>
          </View>

          {/* Bottom Controls Bar */}
          <View style={styles.bottomControlsBar}>
            <View style={styles.bottomLeftControls}>
              <TouchableOpacity 
                style={styles.playPauseButton}
                onPress={this.handlePlayPause}
              >
                <Ionicons 
                  name={status?.isPlaying ? 'pause' : 'play'} 
                  size={26} 
                  color="white" 
                />
              </TouchableOpacity>
              
              {/* Seekbar */}
              <View style={styles.seekbarContainer}>
                <View 
                  ref={this.seekbarRef}
                  style={styles.seekbar}
                  {...this.panResponder.panHandlers}
                >
                  <View style={styles.seekbarTrack} />
                  <View 
                    style={[
                      styles.seekbarProgress, 
                      { width: `${progress * 100}%` }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.seekbarHandle, 
                      { left: `${progress * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.timeText}>
                  {this.formatTime(currentPosition)} / {this.formatTime(status?.durationMillis || 0)}
                </Text>
              </View>
            </View>
            
            <View style={styles.bottomRightControls}>
              <TouchableOpacity 
                style={styles.volumeButton}
                onPress={this.handleMuteToggle}
              >
                <Ionicons 
                  name={status?.isMuted ? 'volume-mute' : 'volume-high'} 
                  size={26} 
                  color="white" 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.fullscreenButton}>
                <Ionicons name="expand" size={26} color="white" />
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
  // Loading styles
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    opacity: 0.9,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Seekbar
  seekbarContainer: {
    flex: 1,
    marginRight: 18,
    marginLeft: 8,
  },
  seekbar: {
    height: 20,
    borderRadius: 10,
    position: 'relative',
    marginBottom: 8,
    justifyContent: 'center',
    paddingVertical: 8, // Increase touch area
  },
  seekbarTrack: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 1.5,
    position: 'absolute',
    top: 8.5,
    left: 0,
    right: 0,
  },
  seekbarProgress: {
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
    position: 'absolute',
    top: 8.5, // Center within the 20px height
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 2,
  },
  seekbarHandle: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    top: 2, // Center within the 20px height
    marginLeft: -8, // Half of width to center properly
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
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


