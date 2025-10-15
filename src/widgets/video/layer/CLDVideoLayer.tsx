import React from 'react';
import { View, TouchableOpacity, Text, PanResponder, ActivityIndicator, Animated, StyleSheet, Easing, Dimensions } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AdvancedVideo from '../../../AdvancedVideo';
import { CLDVideoLayerProps, ButtonPosition, ButtonLayoutDirection, SubtitleOption, QualityOption } from './types';
import { formatTime, handleDefaultShare, isHLSVideo, parseHLSManifest, parseHLSQualityLevels, getVideoUrl } from './utils';
import { SubtitleCue, fetchSubtitleFile, findActiveSubtitle } from './utils/subtitleUtils';
import { styles, getResponsiveStyles } from './styles';
import { TopControls, CenterControls, BottomControls, SubtitleDisplay, AbsoluteButtons, TitleSubtitle, BottomButtonBar } from './components';
import { ICON_SIZES, calculateButtonPosition, getTopPadding } from './constants';
import { parseHLSSubtitlesIfNeeded, parseHLSQualityLevelsIfNeeded } from './helpers/hlsHelpers';

// Import the organized logic functions
import { VideoControlsManager } from './helpers/videoControlsManager';
import { VideoPlaybackManager } from './helpers/videoPlaybackManager';
import { VideoSubtitlesManager } from './helpers/videoSubtitlesManager';
import { VideoQualityManager } from './helpers/videoQualityManager';
import { VideoOrientationManager } from './helpers/videoOrientationManager';

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
  private seekbarRef: React.RefObject<any>;
  private panResponder: any;
  
  // Manager instances
  private controlsManager: VideoControlsManager;
  private playbackManager: VideoPlaybackManager;
  private subtitlesManager: VideoSubtitlesManager;
  private qualityManager: VideoQualityManager;
  private orientationManager: VideoOrientationManager;

  constructor(props: CLDVideoLayerProps) {
    super(props);
    this.videoRef = React.createRef<AdvancedVideo | null>();
    this.seekbarRef = React.createRef<any>();
    
    // Initialize managers
    this.controlsManager = new VideoControlsManager();
    this.playbackManager = new VideoPlaybackManager();
    this.subtitlesManager = new VideoSubtitlesManager();
    this.qualityManager = new VideoQualityManager();
    this.orientationManager = new VideoOrientationManager();
    
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

    // Create pan responder
    this.panResponder = this.playbackManager.createPanResponder(
      () => this.state,
      (updates) => this.setState(updates),
      this.controlsManager.clearAutoHideTimer,
      this.controlsManager.startAutoHideTimer,
      this.videoRef,
      this.seekbarRef
    );
  }

  componentDidMount() {
    if (this.state.isControlsVisible) {
      this.controlsManager.startAutoHideTimer(() => this.setState({ isControlsVisible: false }));
    }
    
    // Initialize orientation handling
    this.orientationManager.initialize((updates) => this.setState(updates as any));
    
    // Parse HLS manifest for subtitle tracks and quality levels if video is HLS
    setTimeout(() => {
      parseHLSSubtitlesIfNeeded(this.props, (updates) => this.setState(updates as any));
      parseHLSQualityLevelsIfNeeded(this.props, (updates) => this.setState(updates as any));
    }, 100);
  }

  componentDidUpdate(prevProps: CLDVideoLayerProps) {
    // Re-parse subtitles and quality levels if video URL changed
    if (prevProps.videoUrl !== this.props.videoUrl) {
      parseHLSSubtitlesIfNeeded(this.props, (updates) => this.setState(updates as any));
      parseHLSQualityLevelsIfNeeded(this.props, (updates) => this.setState(updates as any));
    }
  }

  componentWillUnmount() {
    this.controlsManager.cleanup();
    this.orientationManager.cleanup();
  }

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
    this.subtitlesManager.updateActiveSubtitle(s, this.state, (updates) => this.setState(updates));
    
    this.setState({ status: s });
  };

  handlePlayPause = async () => {
    await this.playbackManager.handlePlayPause(this.videoRef, this.state.status);
  };

  handleMuteToggle = async () => {
    await this.playbackManager.handleMuteToggle(this.videoRef, this.state.status);
  };

  handlePlaybackSpeedChange = async (speed: number) => {
    await this.playbackManager.handlePlaybackSpeedChange(this.videoRef, speed, (updates) => this.setState(updates));
  };

  handleToggleSpeedMenu = () => {
    this.playbackManager.handleToggleSpeedMenu(this.state.isSpeedMenuVisible, (updates) => this.setState(updates));
  };

  handleSubtitleChange = async (languageCode: string) => {
    await this.subtitlesManager.handleSubtitleChange(languageCode, this.state, (updates) => this.setState(updates));
  };

  handleToggleSubtitlesMenu = () => {
    this.subtitlesManager.handleToggleSubtitlesMenu(this.state.isSubtitlesMenuVisible, (updates) => this.setState(updates));
  };

  handleQualityChange = async (qualityValue: string) => {
    await this.qualityManager.handleQualityChange(qualityValue, this.videoRef, this.state, (updates) => this.setState(updates), this.props);
  };

  handleToggleQualityMenu = () => {
    this.qualityManager.handleToggleQualityMenu(this.state.isQualityMenuVisible, (updates) => this.setState(updates));
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
    await this.orientationManager.handleToggleFullScreen(
      this.state.isFullScreen, 
      this.state.isLandscape, 
      this.props.fullScreen, 
      (updates) => this.setState(updates)
    );
  };

  getProgress = (): number => {
    return this.playbackManager.getProgress(this.state);
  };

  getCurrentPosition = (): number => {
    return this.playbackManager.getCurrentPosition(this.state);
  };

  toggleControls = () => {
    this.controlsManager.toggleControls(this.state.isControlsVisible, (visible) => this.setState({ isControlsVisible: visible }));
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
    const isVideoLoaded = status?.isLoaded === true;
    const progress = this.getProgress();
    const currentPosition = this.getCurrentPosition();
    
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
          style={[styles.overlay, { opacity: this.controlsManager.getFadeAnim() }]}
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

        <AbsoluteButtons
          isControlsVisible={this.state.isControlsVisible}
          onBack={onBack}
          backButtonPosition={backButtonPosition}
          shareButtonPosition={shareButtonPosition}
          onShare={this.handleShare}
          fullScreen={fullScreen}
          isFullScreen={isFullScreen}
          onToggleFullScreen={this.handleToggleFullScreen}
          buttonGroups={buttonGroups}
          isLandscape={isLandscape}
        />

        <TitleSubtitle
          isControlsVisible={this.state.isControlsVisible}
          title={this.props.title}
          subtitle={this.props.subtitle}
          isLandscape={isLandscape}
          onBack={onBack}
          backButtonPosition={backButtonPosition}
          titleLeftOffset={titleLeftOffset}
        />

        <BottomButtonBar
          isControlsVisible={this.state.isControlsVisible}
          bottomButtonBar={this.props.bottomButtonBar as any}
        />
      </TouchableOpacity>
    );
  }
}