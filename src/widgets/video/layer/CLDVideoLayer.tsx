import React from 'react';
import { View, TouchableOpacity, Text, PanResponder, ActivityIndicator, Animated, StyleSheet, Easing, Dimensions } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AdvancedVideo from '../../../AdvancedVideo';
import { CLDVideoLayerProps, ButtonPosition, ButtonLayoutDirection, SubtitleOption, QualityOption } from './types';
import { formatTime, handleDefaultShare, isHLSVideo, parseHLSManifest, parseHLSQualityLevels, getVideoUrl } from './utils';
import { SubtitleCue, fetchSubtitleFile, findActiveSubtitle } from './utils/subtitleUtils';
import { styles, getResponsiveStyles } from './styles';
import { TopControls, CenterControls, BottomControls, CustomButton, SubtitleDisplay } from './components';
import { ICON_SIZES, calculateButtonPosition, getBottomControlsPadding, BOTTOM_BUTTON_SIZE, SEEKBAR_HEIGHT, getTopPadding } from './constants';

interface CLDVideoLayerState {
  status: any | null;
  isControlsVisible: boolean;
  isSeeking: boolean;
  seekingPosition: number;
  lastSeekPosition: number;
  isSeekingComplete: boolean;
  isLandscape: boolean;
  isFullScreen: boolean;
  previousOrientation: 'portrait' | 'landscape' | null;
  currentPlaybackSpeed: number;
  isSpeedMenuVisible: boolean;
  currentSubtitle: string;
  isSubtitlesMenuVisible: boolean;
  availableSubtitleTracks: SubtitleOption[];
  subtitleCues: SubtitleCue[];
  activeSubtitleText: string | null;
  currentQuality: string;
  isQualityMenuVisible: boolean;
  availableQualityLevels: QualityOption[];
}

export class CLDVideoLayer extends React.Component<CLDVideoLayerProps, CLDVideoLayerState> {
  private videoRef: React.RefObject<AdvancedVideo | null>;
  private seekbarRef: React.RefObject<View | null>;
  private fadeAnim: Animated.Value;
  private autoHideTimeoutId: NodeJS.Timeout | null = null;
  private panResponder: any;
  private orientationSubscription: any = null;
  private orientationCheckInterval: NodeJS.Timeout | null = null;

  constructor(props: CLDVideoLayerProps) {
    super(props);
    this.videoRef = React.createRef<AdvancedVideo | null>();
    this.seekbarRef = React.createRef<View | null>();
    this.fadeAnim = new Animated.Value(1);
    
    // Get initial orientation
    const { width, height } = Dimensions.get('window');
    const initialIsLandscape = width > height;
    
    this.state = {
      status: null,
      isControlsVisible: true,
      isSeeking: false,
      seekingPosition: 0,
      lastSeekPosition: 0,
      isSeekingComplete: false,
      isLandscape: initialIsLandscape,
      isFullScreen: false,
      previousOrientation: null,
      currentPlaybackSpeed: props.playbackSpeed?.defaultSpeed || 1.0,
      isSpeedMenuVisible: false,
      currentSubtitle: props.subtitles?.defaultLanguage || 'off',
      isSubtitlesMenuVisible: false,
      availableSubtitleTracks: [],
      subtitleCues: [],
      activeSubtitleText: null,
      currentQuality: props.quality?.defaultQuality || 'auto',
      isQualityMenuVisible: false,
      availableQualityLevels: [],
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_evt) => {
        this.setState({ isSeeking: true });
        // Clear auto-hide timer while seeking
        this.clearAutoHideTimer();
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
                  
                  this.videoRef.current.setStatusAsync({ positionMillis: validSeekPosition }).catch((error: any) => {
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
        
        // Restart auto-hide timer after seeking ends (if controls are visible)
        if (this.state.isControlsVisible) {
          this.startAutoHideTimer();
        }
      },
    });
  }

  componentDidMount() {
    if (this.state.isControlsVisible) {
      this.startAutoHideTimer();
    }
  
    // Parse HLS manifest for subtitle tracks and quality levels if video is HLS
    setTimeout(() => {
      this.parseHLSSubtitlesIfNeeded();
      this.parseHLSQualityLevelsIfNeeded();
    }, 100);
    
    // Try multiple approaches for orientation detection
    this.orientationSubscription = Dimensions.addEventListener('change', this.handleOrientationChange);
    
    // Also check orientation periodically as fallback
    this.orientationCheckInterval = setInterval(() => {
      const { width, height } = Dimensions.get('window');
      const isLandscape = width > height;
      if (isLandscape !== this.state.isLandscape) {
        this.setState({ isLandscape });
      }
    }, 500);
  }

  componentDidUpdate(prevProps: CLDVideoLayerProps) {
    // Re-parse subtitles and quality levels if video URL changed
    if (prevProps.videoUrl !== this.props.videoUrl) {
      this.parseHLSSubtitlesIfNeeded();
      this.parseHLSQualityLevelsIfNeeded();
    }
  }

  componentWillUnmount() {
    this.clearAutoHideTimer();
    
    // Remove orientation listener
    if (this.orientationSubscription && this.orientationSubscription.remove) {
      this.orientationSubscription.remove();
    }
    
    // Clear orientation polling interval
    if (this.orientationCheckInterval) {
      clearInterval(this.orientationCheckInterval);
      this.orientationCheckInterval = null;
    }
  }

  handleOrientationChange = ({ window }: any) => {
    const { width, height } = window;
    const isLandscape = width > height;
    if (isLandscape !== this.state.isLandscape) {
      this.setState({ isLandscape });
    }
  };

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
    // Always update status to handle loading states properly
    if (this.state.isSeekingComplete && this.state.lastSeekPosition > 0 && s?.isLoaded) {
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
    
    // Update subtitle text based on current time
    this.updateActiveSubtitle(s);
    
    this.setState({ status: s });
  };

  handlePlayPause = async () => {
    if (this.videoRef.current) {
      try {
        if (this.state.status?.isPlaying) {
          await this.videoRef.current.setStatusAsync({ shouldPlay: false });
        } else {
          await this.videoRef.current.setStatusAsync({ shouldPlay: true });
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

  handlePlaybackSpeedChange = async (speed: number) => {
    if (this.videoRef.current && this.state.status) {
      try {
        await this.videoRef.current.setStatusAsync({ rate: speed });
        this.setState({ currentPlaybackSpeed: speed });
      } catch (error) {
        console.warn('Failed to change playback speed:', error);
      }
    }
  };

  handleToggleSpeedMenu = () => {
    this.setState({ isSpeedMenuVisible: !this.state.isSpeedMenuVisible });
  };

  handleSubtitleChange = async (languageCode: string) => {
    this.setState({ currentSubtitle: languageCode, activeSubtitleText: null });
    
    if (languageCode === 'off') {
      // Clear subtitle cues when turned off
      this.setState({ subtitleCues: [], activeSubtitleText: null });
      return;
    }
    
    // Find the selected subtitle track
    const selectedTrack = this.state.availableSubtitleTracks.find(
      track => track.code === languageCode
    );
    
    if (selectedTrack?.url) {
      try {
        const subtitleCues = await fetchSubtitleFile(selectedTrack.url);
        this.setState({ subtitleCues });
      } catch (error) {
        console.warn('Failed to load subtitle file:', error);
        this.setState({ subtitleCues: [] });
      }
    } else {
      console.warn('No URL found for subtitle track:', languageCode);
      this.setState({ subtitleCues: [] });
    }
  };

  handleToggleSubtitlesMenu = () => {
    this.setState({ isSubtitlesMenuVisible: !this.state.isSubtitlesMenuVisible });
  };

  handleQualityChange = async (qualityValue: string) => {
    this.setState({ currentQuality: qualityValue });
    
    if (qualityValue === 'auto') {
      // Reset to original URL for automatic quality selection
      const originalUrl = getVideoUrl(this.props.videoUrl, this.props.cldVideo);
      if (this.videoRef.current) {
        try {
          await this.videoRef.current.setStatusAsync({
            uri: originalUrl,
            shouldPlay: this.state.status?.shouldPlay || false,
            positionMillis: this.state.status?.positionMillis || 0
          });
        } catch (error) {
          console.warn('Failed to switch to auto quality:', error);
        }
      }
      return;
    }
    
    // Find the selected quality level
    const selectedQuality = this.state.availableQualityLevels.find(
      level => level.value === qualityValue
    );
    
    if (selectedQuality?.url && this.videoRef.current) {
      try {
        await this.videoRef.current.setStatusAsync({
          uri: selectedQuality.url,
          shouldPlay: this.state.status?.shouldPlay || false,
          positionMillis: this.state.status?.positionMillis || 0
        });
      } catch (error) {
        console.warn('Failed to switch to quality level:', qualityValue, error);
      }
    } else {
      console.warn('No URL found for quality level:', qualityValue);
    }
  };

  handleToggleQualityMenu = () => {
    this.setState({ isQualityMenuVisible: !this.state.isQualityMenuVisible });
  };

  /**
   * Parse HLS manifest to get available subtitle tracks if video is HLS
   */
  parseHLSSubtitlesIfNeeded = async () => {
    const videoUrl = getVideoUrl(this.props.videoUrl, this.props.cldVideo);
    
    if (isHLSVideo(videoUrl)) {
      try {
        const subtitleTracks = await parseHLSManifest(videoUrl);
        
        // Always include "Off" option
        const availableSubtitleTracks: SubtitleOption[] = [
          { code: 'off', label: 'Off' },
          ...subtitleTracks
        ];
        
        this.setState({ availableSubtitleTracks });
      } catch (error) {
        console.warn('Failed to parse HLS subtitles:', error);
        this.setState({ availableSubtitleTracks: [{ code: 'off', label: 'Off' }] });
      }
    }
  };

  /**
   * Parse HLS manifest to get available quality levels if video is HLS
   */
  parseHLSQualityLevelsIfNeeded = async () => {
    const videoUrl = getVideoUrl(this.props.videoUrl, this.props.cldVideo);
    
    if (isHLSVideo(videoUrl)) {
      try {
        const qualityLevels = await parseHLSQualityLevels(videoUrl);
        
        // Always include "Auto" option
        const availableQualityLevels: QualityOption[] = [
          { value: 'auto', label: 'Auto' },
          ...qualityLevels
        ];
        
        this.setState({ availableQualityLevels });
      } catch (error) {
        console.warn('Failed to parse HLS quality levels:', error);
        this.setState({ availableQualityLevels: [{ value: 'auto', label: 'Auto' }] });
      }
    }
  };

  /**
   * Update active subtitle text based on current video time
   */
  updateActiveSubtitle = (status: any) => {
    const { subtitleCues, currentSubtitle } = this.state;
    
    // Don't update if subtitles are off or no cues loaded
    if (currentSubtitle === 'off' || subtitleCues.length === 0 || !status?.isLoaded) {
      if (this.state.activeSubtitleText !== null) {
        this.setState({ activeSubtitleText: null });
      }
      return;
    }
    
    const currentTimeSeconds = (status.positionMillis || 0) / 1000;
    const activeSubtitle = findActiveSubtitle(subtitleCues, currentTimeSeconds);
    const newSubtitleText = activeSubtitle?.text || null;
    
    // Only update state if subtitle text changed to avoid unnecessary re-renders
    if (this.state.activeSubtitleText !== newSubtitleText) {
      this.setState({ activeSubtitleText: newSubtitleText });
    }
  };

  handleShare = async () => {
    try {
      if (this.props.onShare) {
        this.props.onShare();
      } else {
        await handleDefaultShare(this.props.cldVideo);
      }
    } catch (error) {
      console.warn('CLDVideoLayer: Failed to handle share:', error);
    }
  };

  handleToggleFullScreen = async () => {
    const { fullScreen } = this.props;
    const { isFullScreen } = this.state;
    
    // If fullScreen is not explicitly enabled, do nothing
    if (fullScreen?.enabled !== true) {
      return;
    }

    try {
      if (!isFullScreen) {
        // Store current orientation before entering full screen
        const currentOrientation = this.state.isLandscape ? 'landscape' : 'portrait';
        this.setState({ 
          previousOrientation: currentOrientation,
          isFullScreen: true 
        });

        // Call custom enter full screen handler if provided
        if (fullScreen?.onEnterFullScreen) {
          fullScreen.onEnterFullScreen();
        }
      } else {
        // Exit full screen
        this.setState({ 
          isFullScreen: false,
          previousOrientation: null 
        });

        // Call custom exit full screen handler if provided
        if (fullScreen?.onExitFullScreen) {
          fullScreen.onExitFullScreen();
        }
      }
    } catch (error) {
      console.warn('Failed to toggle full screen:', error);
    }
  };

  render() {
    const { 
      cldVideo, 
      videoUrl, 
      onBack, 
      backButtonPosition, 
      shareButtonPosition, 
      showCenterPlayButton = true, 
      seekBar = {},
      fullScreen,
      playbackSpeed,
      subtitles,
      quality,
      buttonGroups = [],
      titleLeftOffset
    } = this.props;
    const { status, isLandscape, isFullScreen, availableSubtitleTracks, availableQualityLevels } = this.state;
    const progress = this.getProgress();
    const currentPosition = this.getCurrentPosition();
    const isVideoLoaded = status?.isLoaded === true;
    
    // Get the effective video URL for HLS detection
    const effectiveVideoUrl = getVideoUrl(videoUrl, cldVideo);

    // Create dynamic subtitles config based on HLS availability
    const dynamicSubtitles = isHLSVideo(effectiveVideoUrl) && subtitles?.enabled ? {
      ...subtitles,
      enabled: true,
      languages: availableSubtitleTracks.length > 0 ? availableSubtitleTracks : [{ code: 'off', label: 'Off' }],
      defaultLanguage: subtitles?.defaultLanguage || 'off'
    } : subtitles;

    // Create dynamic quality config based on HLS availability
    const dynamicQuality = isHLSVideo(effectiveVideoUrl) && quality?.enabled ? {
      ...quality,
      enabled: true,
      qualities: availableQualityLevels.length > 0 ? availableQualityLevels : [{ value: 'auto', label: 'Auto' }],
      defaultQuality: quality?.defaultQuality || 'auto'
    } : quality;

    // Get responsive styles based on current orientation
    const responsiveStyles = getResponsiveStyles(isLandscape);

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={this.toggleControls}
      >
        <AdvancedVideo
          ref={this.videoRef}
          cldVideo={undefined}
          videoUrl={effectiveVideoUrl}
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

        {/* Subtitle Display */}
        <SubtitleDisplay
          text={this.state.activeSubtitleText || undefined}
          isLandscape={isLandscape}
          visible={!!this.state.activeSubtitleText && this.state.currentSubtitle !== 'off'}
        />

        <Animated.View 
          style={[styles.overlay, { opacity: this.fadeAnim }]}
          pointerEvents={this.state.isControlsVisible ? 'auto' : 'none'}
        >
          <TopControls 
            onBack={onBack} 
            onShare={this.handleShare}
            backButtonPosition={backButtonPosition}
            shareButtonPosition={shareButtonPosition}
            isLandscape={isLandscape}
            fullScreen={fullScreen}
            isFullScreen={isFullScreen}
            onToggleFullScreen={this.handleToggleFullScreen}
            buttonGroups={buttonGroups}
          />
          {showCenterPlayButton && (
            <CenterControls status={status} onPlayPause={this.handlePlayPause} />
          )}
          <View style={(() => {
            // If bottom button bar is enabled, add extra bottom padding to push seekbar up
            if (this.props.bottomButtonBar?.enabled) {
              const buttonBarPadding = (this.props.bottomButtonBar.style?.paddingVertical || 8) * 2;
              const buttonHeight = 22; // Icon size from button bar
              const buttonBarHeight = buttonBarPadding + buttonHeight;
              const extraSpacing = 8; // Small gap between seekbar and button bar
              
              return {
                paddingBottom: buttonBarHeight + extraSpacing
              };
            }
            return {};
          })()}>
            <BottomControls
              status={status}
              onPlayPause={this.handlePlayPause}
              onMuteToggle={this.handleMuteToggle}
              formatTime={formatTime}
              getProgress={this.getProgress}
              getCurrentPosition={this.getCurrentPosition}
              seekBarRef={this.seekbarRef}
              panResponder={this.panResponder}
              backButtonPosition={backButtonPosition}
              shareButtonPosition={shareButtonPosition}
              isLandscape={isLandscape}
              seekbar={seekBar}
              fullScreen={fullScreen}
              isFullScreen={isFullScreen}
              onToggleFullScreen={this.handleToggleFullScreen}
              playbackSpeed={playbackSpeed}
              currentPlaybackSpeed={this.state.currentPlaybackSpeed}
              onPlaybackSpeedChange={this.handlePlaybackSpeedChange}
              isSpeedMenuVisible={this.state.isSpeedMenuVisible}
              onToggleSpeedMenu={this.handleToggleSpeedMenu}
              subtitles={dynamicSubtitles}
              currentSubtitle={this.state.currentSubtitle}
              onSubtitleChange={this.handleSubtitleChange}
              isSubtitlesMenuVisible={this.state.isSubtitlesMenuVisible}
              onToggleSubtitlesMenu={this.handleToggleSubtitlesMenu}
              quality={dynamicQuality}
              currentQuality={this.state.currentQuality}
              onQualityChange={this.handleQualityChange}
              isQualityMenuVisible={this.state.isQualityMenuVisible}
              onToggleQualityMenu={this.handleToggleQualityMenu}
              buttonGroups={buttonGroups}
            />
          </View>
        </Animated.View>

        {/* Absolute positioned buttons - rendered outside animated overlay for proper positioning */}
        {this.state.isControlsVisible && (
          <>
            {onBack && backButtonPosition === ButtonPosition.SE && (
              <TouchableOpacity 
                style={[responsiveStyles.topButton, responsiveStyles.buttonPositionSE]} 
                onPress={onBack}
              >
                <Ionicons name="close" size={ICON_SIZES.top} color="white" />
              </TouchableOpacity>
            )}
            {shareButtonPosition === ButtonPosition.SE && (
              <TouchableOpacity 
                style={[responsiveStyles.topButton, responsiveStyles.buttonPositionSE]} 
                onPress={this.handleShare}
              >
                <Ionicons name="share-outline" size={ICON_SIZES.top} color="white" />
              </TouchableOpacity>
            )}
            
            {/* Render absolute positioned custom buttons and full screen button */}
            {(() => {
              // Create default full screen button if enabled
              const defaultFullScreenButton = fullScreen?.enabled === true && fullScreen?.button ? {
                ...fullScreen.button,
                onPress: fullScreen.button.onPress || this.handleToggleFullScreen
              } : fullScreen?.enabled === true ? {
                icon: isFullScreen ? 'contract-outline' : 'expand-outline',
                position: ButtonPosition.NE,
                onPress: this.handleToggleFullScreen
              } : null;

              // Process button groups format
              const processedButtonGroups: Record<string, { buttons: any[], layoutDirection: ButtonLayoutDirection }> = {};
              
              buttonGroups.forEach(group => {
                processedButtonGroups[group.position] = {
                  buttons: group.buttons,
                  layoutDirection: group.layoutDirection || ButtonLayoutDirection.VERTICAL
                };
              });

              // Add default full screen button if enabled and not already in a group
              if (defaultFullScreenButton && !processedButtonGroups[ButtonPosition.NE]) {
                processedButtonGroups[ButtonPosition.NE] = {
                  buttons: [defaultFullScreenButton],
                  layoutDirection: ButtonLayoutDirection.VERTICAL
                };
              } else if (defaultFullScreenButton && processedButtonGroups[ButtonPosition.NE]) {
                // Check if full screen button is already in the group to avoid duplicates
                const existingButtons = processedButtonGroups[ButtonPosition.NE].buttons;
                const hasFullScreenButton = existingButtons.some(button => 
                  button.icon === defaultFullScreenButton.icon || 
                  (button.icon === 'expand-outline' || button.icon === 'contract-outline')
                );
                
                if (!hasFullScreenButton) {
                  processedButtonGroups[ButtonPosition.NE].buttons.push(defaultFullScreenButton);
                }
              }

              // Filter for absolute positioning (not in top controls bar)
              const absolutePositions = [ButtonPosition.SE, ButtonPosition.SW, ButtonPosition.S, ButtonPosition.E, ButtonPosition.W];
              const absoluteButtonGroups = Object.entries(processedButtonGroups).filter(([position]) => 
                absolutePositions.includes(position as ButtonPosition)
              );

              // Render buttons with enhanced spacing and layout direction
              const renderedButtons: React.ReactElement[] = [];

              absoluteButtonGroups.forEach(([position, { buttons, layoutDirection }]) => {
                buttons.forEach((button, index) => {
                  // Get base position style
                  const basePositionStyle = (() => {
                    switch (button.position) {
                      case ButtonPosition.SE: return responsiveStyles.buttonPositionSE;
                      case ButtonPosition.SW: return responsiveStyles.buttonPositionSW;
                      case ButtonPosition.S: return responsiveStyles.buttonPositionS;
                      case ButtonPosition.E: return responsiveStyles.buttonPositionE;
                      case ButtonPosition.W: return responsiveStyles.buttonPositionW;
                      default: return {};
                    }
                  })();

                  // Calculate spacing offset with layout direction support
                  const spacingStyle = calculateButtonPosition(
                    position, 
                    index, 
                    buttons.length, 
                    isLandscape,
                    layoutDirection
                  );

                  // Combine base position with spacing
                  const finalStyle = { ...basePositionStyle, ...spacingStyle };

                  renderedButtons.push(
                    <CustomButton 
                      key={`absolute-${position}-${index}`}
                      config={button}
                      isLandscape={isLandscape}
                      style={finalStyle}
                      defaultOnPress={button === defaultFullScreenButton ? this.handleToggleFullScreen : undefined}
                    />
                  );
                });
              });

              return renderedButtons;
            })()}
          </>
        )}

        {/* Title and Subtitle in NW corner */}
        {this.state.isControlsVisible && (this.props.title || this.props.subtitle) && (
          <View style={[
            {
              position: 'absolute',
              top: getTopPadding(isLandscape) + (isLandscape ? 6 : 8),
              left: titleLeftOffset !== undefined ? titleLeftOffset : (onBack && backButtonPosition === ButtonPosition.NW ? 80 : 20), // Custom offset or default positioning
              zIndex: 15,
              maxWidth: '60%', // Prevent overlap with right side buttons
            }
          ]}>
            {this.props.title && (
              <Text style={{
                color: 'white',
                fontSize: isLandscape ? 16 : 18,
                fontWeight: 'bold',
                textShadowColor: 'rgba(0,0,0,0.8)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
                marginBottom: 2,
              }} numberOfLines={1}>
                {this.props.title}
              </Text>
            )}
            {this.props.subtitle && (
              <Text style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: isLandscape ? 12 : 14,
                fontWeight: '500',
                textShadowColor: 'rgba(0,0,0,0.8)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }} numberOfLines={1}>
                {this.props.subtitle}
              </Text>
            )}
          </View>
        )}

        {/* Bottom Button Bar - positioned below seekbar */}
        {this.state.isControlsVisible && this.props.bottomButtonBar?.enabled && (
          <View style={[
            {
              position: 'absolute',
              bottom: (() => {
                // Position button bar below the seekbar (closer to screen bottom)
                // Use a small bottom value to place it below the seekbar
                const spacingFromBottom = 0;
                
                return spacingFromBottom;
              })(),
              left: this.props.bottomButtonBar.style?.marginHorizontal || 20,
              right: this.props.bottomButtonBar.style?.marginHorizontal || 20,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1, // Lower than seekbar and bottom controls
              backgroundColor: this.props.bottomButtonBar.style?.backgroundColor || 'rgba(0,0,0,0.7)',
              borderRadius: this.props.bottomButtonBar.style?.borderRadius || 20,
              paddingHorizontal: this.props.bottomButtonBar.style?.paddingHorizontal || 16,
              paddingVertical: this.props.bottomButtonBar.style?.paddingVertical || 8,
              marginBottom: this.props.bottomButtonBar.style?.marginBottom || 0,
            }
          ]}>
            {this.props.bottomButtonBar.buttons.map((button, index) => (
              <TouchableOpacity
                key={`bottom-bar-${index}`}
                style={{
                  marginHorizontal: 16,
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  backgroundColor: button.backgroundColor || 'transparent',
                  borderRadius: button.backgroundColor ? 15 : 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={button.onPress}
              >
                <Ionicons 
                  name={button.icon as any} 
                  size={button.size || 20} 
                  color={button.color || 'white'} 
                />
                {button.text && (
                  <Text style={{
                    color: button.textColor || button.color || 'white',
                    fontSize: 14,
                    fontWeight: '500',
                    marginLeft: 6,
                  }}>
                    {button.text}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  }
}