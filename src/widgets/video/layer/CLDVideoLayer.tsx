import React from 'react';
import { View, TouchableOpacity, Text, PanResponder, ActivityIndicator, Animated, StyleSheet, Easing } from 'react-native';
import { AVPlaybackStatusSuccess } from 'expo-av';
import AdvancedVideo from '../../../AdvancedVideo';
import { CLDVideoLayerProps } from './types';
import { formatTime, handleDefaultShare } from './utils';
import { styles } from './styles';
import { TopControls, CenterControls, BottomControls } from './components';

interface CLDVideoLayerState {
  status: AVPlaybackStatusSuccess | null;
  isControlsVisible: boolean;
  isSeeking: boolean;
  seekingPosition: number;
  lastSeekPosition: number;
  isSeekingComplete: boolean;
}

export class CLDVideoLayer extends React.Component<CLDVideoLayerProps, CLDVideoLayerState> {
  private videoRef: React.RefObject<AdvancedVideo>;
  private seekbarRef: React.RefObject<View>;
  private fadeAnim: Animated.Value;
  private autoHideTimeoutId: NodeJS.Timeout | null = null;
  private panResponder: any;

  constructor(props: CLDVideoLayerProps) {
    super(props);
    this.videoRef = React.createRef<AdvancedVideo>();
    this.seekbarRef = React.createRef<View>();
    this.fadeAnim = new Animated.Value(1);
    
    this.state = {
      status: null,
      isControlsVisible: true,
      isSeeking: false,
      seekingPosition: 0,
      lastSeekPosition: 0,
      isSeekingComplete: false,
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_evt) => {
        this.setState({ isSeeking: true });
      },
      onPanResponderMove: (evt) => {
        if (this.seekbarRef.current && this.state.status) {
          const touchPageX = evt.nativeEvent.pageX;
          this.seekbarRef.current.measure((_x, _y, width, _height, pageX, _pageY) => {
            const touchX = touchPageX - pageX;
            const progress = Math.max(0, Math.min(1, touchX / width));
            const seekPosition = progress * (this.state.status?.durationMillis || 0);
            this.setState({ seekingPosition: seekPosition });
          });
        }
      },
      onPanResponderRelease: (evt) => {
        if (this.seekbarRef.current && this.state.status) {
          const touchPageX = evt.nativeEvent.pageX;
          this.seekbarRef.current.measure((_x, _y, width, _height, pageX, _pageY) => {
            const touchX = touchPageX - pageX;
            const progress = Math.max(0, Math.min(1, touchX / width));
            const duration = this.state.status?.durationMillis || 0;
            const seekPosition = progress * duration;
            
            if (this.videoRef.current && this.state.status && duration > 0) {
              const validSeekPosition = Math.max(0, Math.min(seekPosition, duration - 100));
              const currentPosition = this.state.status.positionMillis || 0;
              const positionDiff = Math.abs(validSeekPosition - currentPosition);
              
              if (positionDiff > 100) {
                if (this.state.status.isLoaded && 
                    this.state.status.durationMillis && 
                    this.state.status.durationMillis > 0 &&
                    validSeekPosition >= 0 && 
                    validSeekPosition < this.state.status.durationMillis) {
                  
                  this.videoRef.current.setPositionAsync(validSeekPosition).catch((error) => {
                    console.warn('Seek failed:', error);
                    this.setState({
                      isSeeking: false,
                      seekingPosition: 0,
                      lastSeekPosition: 0,
                      isSeekingComplete: false
                    });
                  });
                }
              }
              
              this.setState({
                isSeeking: false,
                seekingPosition: validSeekPosition,
                lastSeekPosition: validSeekPosition,
                isSeekingComplete: true
              });
            } else {
              this.setState({
                isSeeking: false,
                seekingPosition: 0,
                lastSeekPosition: 0,
                isSeekingComplete: false
              });
            }
          });
        }
      },
    });
  }

  componentDidMount() {
    if (this.state.isControlsVisible) {
      this.startAutoHideTimer();
    }
  }

  componentWillUnmount() {
    this.clearAutoHideTimer();
  }

  clearAutoHideTimer = () => {
    if (this.autoHideTimeoutId) {
      clearTimeout(this.autoHideTimeoutId);
      this.autoHideTimeoutId = null;
    }
  };

  startAutoHideTimer = () => {
    this.clearAutoHideTimer();
    this.autoHideTimeoutId = setTimeout(() => {
      if (this.state.isControlsVisible) {
        this.setState({ isControlsVisible: false });
        Animated.timing(this.fadeAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      }
    }, 3000);
  };

  toggleControls = () => {
    const newVisibility = !this.state.isControlsVisible;
    this.setState({ isControlsVisible: newVisibility });
    
    Animated.timing(this.fadeAnim, {
      toValue: newVisibility ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    if (newVisibility) {
      this.startAutoHideTimer();
    } else {
      this.clearAutoHideTimer();
    }
  };

  getProgress = (): number => {
    if (!this.state.status) return 0;
    
    const duration = this.state.status.durationMillis || 1;
    const currentVideoPosition = this.state.status.positionMillis || 0;
    
    if (this.state.isSeeking) {
      return this.state.seekingPosition / duration;
    }
    
    if (this.state.isSeekingComplete && this.state.lastSeekPosition > 0) {
      return this.state.lastSeekPosition / duration;
    }
    
    return currentVideoPosition / duration;
  };

  getCurrentPosition = (): number => {
    if (!this.state.status) return 0;
    
    const currentVideoPosition = this.state.status.positionMillis || 0;
    
    if (this.state.isSeeking) {
      return this.state.seekingPosition;
    }
    
    if (this.state.isSeekingComplete && this.state.lastSeekPosition > 0) {
      return this.state.lastSeekPosition;
    }
    
    return currentVideoPosition;
  };

  handleStatusUpdate = (s: any) => {
    if (s.isLoaded) {
      if (this.state.isSeekingComplete && this.state.lastSeekPosition > 0) {
        const currentVideoPosition = s.positionMillis || 0;
        const seekPositionDiff = Math.abs(currentVideoPosition - this.state.lastSeekPosition);
        
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

  handleShare = async () => {
    if (this.props.onShare) {
      this.props.onShare();
    } else {
      await handleDefaultShare(this.props.cldVideo);
    }
  };

  render() {
    const { cldVideo, videoUrl, onBack } = this.props;
    const { status } = this.state;
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

        <Animated.View 
          style={[styles.overlay, { opacity: this.fadeAnim }]}
          pointerEvents={this.state.isControlsVisible ? 'auto' : 'none'}
        >
          <TopControls onBack={onBack} onShare={this.handleShare} />
          <CenterControls status={status} onPlayPause={this.handlePlayPause} />
          <BottomControls
            status={status}
            onPlayPause={this.handlePlayPause}
            onMuteToggle={this.handleMuteToggle}
            formatTime={formatTime}
            getProgress={this.getProgress}
            getCurrentPosition={this.getCurrentPosition}
            seekbarRef={this.seekbarRef}
            panResponder={this.panResponder}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  }
}