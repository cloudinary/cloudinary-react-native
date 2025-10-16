import React, { ReactElement, RefObject } from 'react';
import { VideoPlayerAdapter, VideoPlayerProps, VideoPlayerRef, VideoPlayerType } from './types';

// ExpoVideoAdapter - handles expo-video integration
// Currently disabled due to hooks compatibility issues with class-based adapter system

export class ExpoVideoAdapter implements VideoPlayerAdapter {
  private expoVideoModule: any = null;
  private playerCache: Map<string, any> = new Map();

  constructor() {
    this.loadExpoVideo();
  }

  private loadExpoVideo(): void {
    try {
      this.expoVideoModule = require('expo-video');
    } catch (error) {
      this.expoVideoModule = null;
    }
  }

  isAvailable(): boolean {
    const hasModule = !!this.expoVideoModule;
    const hasVideoView = !!(this.expoVideoModule && this.expoVideoModule.VideoView);
    const hasCreatePlayer = !!(this.expoVideoModule && this.expoVideoModule.createVideoPlayer);
    return hasModule && hasVideoView && hasCreatePlayer;
  }

  /**
   * Get detailed information about adapter availability
   * @returns Object containing availability status, error details, and installation guidance
   */
  getAvailabilityInfo(): { 
    isAvailable: boolean; 
    error?: string; 
    installationCommand?: string;
  } {
    if (!this.expoVideoModule) {
      return {
        isAvailable: false,
        error: 'Module not found: expo-video',
        installationCommand: 'npx expo install expo-video'
      };
    }
    
    if (!this.expoVideoModule.VideoView) {
      return {
        isAvailable: false,
        error: 'VideoView component not found in expo-video module',
        installationCommand: 'npx expo install expo-video'
      };
    }
    
    if (!this.expoVideoModule.createVideoPlayer) {
      return {
        isAvailable: false,
        error: 'createVideoPlayer function not found in expo-video module',
        installationCommand: 'npx expo install expo-video'
      };
    }
    
    return { isAvailable: true };
  }

  getAdapterName(): string {
    return VideoPlayerType.EXPO_VIDEO;
  }

  renderVideo(props: VideoPlayerProps, ref: RefObject<VideoPlayerRef | null>): ReactElement {
    if (!this.isAvailable()) {
      const info = this.getAvailabilityInfo();
      throw new Error(
        `ExpoVideoAdapter: ${info.error}. Please install: "${info.installationCommand}"`
      );
    }

    const { VideoView, createVideoPlayer } = this.expoVideoModule;
    
    // Get or create cached player for this URI
    let player = this.playerCache.get(props.videoUri);
    if (!player) {
      player = createVideoPlayer({ uri: props.videoUri });
      
      // Configure player properties with initial values
      player.loop = false;
      player.muted = false;
      player.playbackRate = 1.0;
      
      this.playerCache.set(props.videoUri, player);
    }
    
    // Handle URI changes for quality/source switching
    if (player.source?.uri !== props.videoUri) {
      try {
        // Store current playback state
        const wasPlaying = player.playing;
        const currentTime = player.currentTime || 0;
        
        // Update source
        player.source = { uri: props.videoUri };
        
        // Restore playback state after a brief delay
        setTimeout(() => {
          try {
            if (currentTime > 0) {
              player.currentTime = currentTime;
            }
            if (wasPlaying) {
              player.play();
            }
          } catch (error) {
            // Silently handle playback state restoration errors
          }
        }, 100);
      } catch (error) {
        // Silently handle source update errors
      }
    }
    
    // Set up event listeners for status updates only once per player
    if (props.onPlaybackStatusUpdate && !player._listenersSetup) {
      
      const sendStatusUpdate = () => {
        const status = {
          uri: props.videoUri,
          isLoaded: true,
          shouldPlay: player.playing || false,
          isPlaying: player.playing || false,
          positionMillis: (player.currentTime || 0) * 1000,
          durationMillis: (player.duration || 0) * 1000,
          isMuted: player.muted || false,
          rate: player.playbackRate || 1.0,
          volume: player.muted ? 0 : 1.0
        };
        if (props.onPlaybackStatusUpdate) {
          props.onPlaybackStatusUpdate(status);
        }
        return status;
      };
      
      // Listen to various player events and map them to status updates
      const playingChangeHandler = () => {
        sendStatusUpdate();
      };
      
      const statusChangeHandler = () => {
        sendStatusUpdate();
      };
      
      const timeUpdateHandler = () => {
        // Send time updates for seekbar
        sendStatusUpdate();
      };
      
      const loadedHandler = () => {
        sendStatusUpdate();
      };
      
      // Set up a timer to continuously update time during playback
      let timeUpdateInterval: NodeJS.Timeout | null = null;
      
      const startTimeUpdates = () => {
        if (timeUpdateInterval) clearInterval(timeUpdateInterval);
        timeUpdateInterval = setInterval(() => {
          if (player.playing) {
            sendStatusUpdate();
          }
        }, 250); // Update 4 times per second
      };
      
      const stopTimeUpdates = () => {
        if (timeUpdateInterval) {
          clearInterval(timeUpdateInterval);
          timeUpdateInterval = null;
        }
      };
      
      const enhancedPlayingChangeHandler = (isPlaying: boolean) => {
        if (isPlaying) {
          startTimeUpdates();
        } else {
          stopTimeUpdates();
        }
        sendStatusUpdate();
      };
      
      player.addListener('playingChange', enhancedPlayingChangeHandler);
      player.addListener('statusChange', statusChangeHandler);
      
      // Try multiple possible event names for time updates
      try {
        player.addListener('timeUpdate', timeUpdateHandler);
      } catch (e) {
      }
      
      try {
        player.addListener('playbackStatusUpdate', timeUpdateHandler);
      } catch (e) {
      }
      
      try {
        player.addListener('loadeddata', loadedHandler);
      } catch (e) {
      }
      
      // Mark listeners as setup to prevent duplicates
      player._listenersSetup = true;
      player._handlers = { 
        playingChangeHandler: enhancedPlayingChangeHandler, 
        statusChangeHandler, 
        timeUpdateHandler,
        loadedHandler,
        stopTimeUpdates
      };
      
      // Send initial status
      setTimeout(() => sendStatusUpdate(), 100);
    }
    
    // Handle errors
    if (props.onError) {
      player.addListener('error', (error: any) => {
        props.onError!(error);
      });
    }
    
    return React.createElement(VideoView, {
      ref: (videoInstance: any) => {
        if (ref && typeof ref === 'object' && 'current' in ref) {
          // Store the player reference for compatibility with existing code
          ref.current = {
            ...videoInstance,
            // Add expo-av compatible methods for backward compatibility
            setStatusAsync: async (status: any) => {
              try {
                let statusChanged = false;
                
                if (status.shouldPlay !== undefined) {
                  if (status.shouldPlay) {
                    await player.play();
                    statusChanged = true;
                  } else {
                    player.pause();
                    statusChanged = true;
                  }
                }
                if (status.positionMillis !== undefined) {
                  player.currentTime = status.positionMillis / 1000;
                  statusChanged = true;
                }
                if (status.isMuted !== undefined) {
                  player.muted = status.isMuted;
                  statusChanged = true;
                }
                if (status.rate !== undefined) {
                  player.playbackRate = status.rate;
                  statusChanged = true;
                }
                if (status.uri !== undefined && status.uri !== props.videoUri) {
                  try {
                    // Handle source changes (quality switching)
                    const wasPlaying = player.playing;
                    const currentTime = player.currentTime || 0;
                    
                    player.source = { uri: status.uri };
                    
                    // Restore state
                    setTimeout(() => {
                      if (status.positionMillis !== undefined) {
                        player.currentTime = status.positionMillis / 1000;
                      } else if (currentTime > 0) {
                        player.currentTime = currentTime;
                      }
                      if (status.shouldPlay !== undefined ? status.shouldPlay : wasPlaying) {
                        player.play();
                      }
                    }, 100);
                    
                    statusChanged = true;
                  } catch (error) {
                    console.warn('ExpoVideoAdapter - URI change failed:', error);
                  }
                }
                
                // Send status update after changes
                if (statusChanged && props.onPlaybackStatusUpdate) {
                  setTimeout(() => {
                    const newStatus = {
                      uri: props.videoUri,
                      isLoaded: true,
                      shouldPlay: player.playing || false,
                      isPlaying: player.playing || false,
                      positionMillis: (player.currentTime || 0) * 1000,
                      durationMillis: (player.duration || 0) * 1000,
                      isMuted: player.muted || false,
                      rate: player.playbackRate || 1.0,
                      volume: player.muted ? 0 : 1.0
                    };
                    props.onPlaybackStatusUpdate!(newStatus);
                  }, 50);
                }
              } catch (error) {
                console.warn('ExpoVideoAdapter - setStatusAsync error:', error);
              }
            },
            // Add missing expo-av compatible method for mute toggle
            setIsMutedAsync: async (isMuted: boolean) => {
              try {
                player.muted = isMuted;
                // Send status update after mute change
                if (props.onPlaybackStatusUpdate) {
                  setTimeout(() => {
                    const newStatus = {
                      uri: props.videoUri,
                      isLoaded: true,
                      shouldPlay: player.playing || false,
                      isPlaying: player.playing || false,
                      positionMillis: (player.currentTime || 0) * 1000,
                      durationMillis: (player.duration || 0) * 1000,
                      isMuted: player.muted || false,
                      rate: player.playbackRate || 1.0,
                      volume: player.muted ? 0 : 1.0
                    };
                    if (props.onPlaybackStatusUpdate) {
                      props.onPlaybackStatusUpdate(newStatus);
                    }
                  }, 50);
                }
              } catch (error) {
                // Silently handle mute errors
              }
            },
            // Add cleanup method
            _cleanup: () => {
              try {
                if (player._handlers) {
                  player.removeListener('playingChange', player._handlers.playingChangeHandler);
                  player.removeListener('statusChange', player._handlers.statusChangeHandler);
                  
                  // Clean up time update interval
                  if (player._handlers.stopTimeUpdates) {
                    player._handlers.stopTimeUpdates();
                  }
                  
                  try {
                    player.removeListener('timeUpdate', player._handlers.timeUpdateHandler);
                  } catch (e) {}
                  
                  try {
                    player.removeListener('loadeddata', player._handlers.loadedHandler);
                  } catch (e) {}
                }
                player.remove();
              } catch (error) {
                console.warn('ExpoVideoAdapter - cleanup error:', error);
              }
            },
            _currentStatus: {
              uri: props.videoUri,
              isLoaded: true,
              shouldPlay: player.playing || false,
              positionMillis: (player.currentTime || 0) * 1000,
              durationMillis: (player.duration || 0) * 1000,
              isMuted: player.muted || false,
              rate: player.playbackRate || 1.0,
              volume: player.muted ? 0 : 1.0
            }
          };
        }
      },
      player: player,
      style: props.style,
      nativeControls: props.useNativeControls || false,
      contentFit: 'contain',
      onLoad: (data: any) => {
        props.onLoad?.(data);
      },
      onLoadStart: (data: any) => {
        props.onLoadStart?.(data);
      },
    });
  }

  private processExpoVideoEvents(videoRef: VideoPlayerRef | null, eventType: string, data: any): void {
    if (!videoRef) return;

    try {
      const { processExpoVideoEvents } = require('../widgets/video/analytics/player-adapters/expoVideoPlayerAdapter');
      const handler = processExpoVideoEvents[eventType];
      if (handler) {
        handler(videoRef, data);
      }
    } catch (error) {
      // Silently fail if analytics adapter is not available
    }
  }

  processStatusUpdate(videoRef: VideoPlayerRef, status: any): void {
    // For expo-video, status updates are handled directly in the event handlers
    this.processExpoVideoEvents(videoRef, 'onPlaybackStatusUpdate', status);
  }

  async getAnalyticsAdapter(): Promise<any> {
    try {
      const { expoVideoPlayerAdapter } = await import('../widgets/video/analytics/player-adapters/expoVideoPlayerAdapter');
      return expoVideoPlayerAdapter;
    } catch (error) {
      return null;
    }
  }
}