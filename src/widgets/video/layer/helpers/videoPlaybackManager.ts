import { PanResponder } from 'react-native';
import AdvancedVideo from '../../../../AdvancedVideo';

export class VideoPlaybackManager {
  createPanResponder(
    getCurrentState: () => any,
    updateState: (updates: any) => void,
    clearAutoHideTimer: () => void,
    startAutoHideTimer: (onHide: () => void) => void,
    videoRef: React.RefObject<AdvancedVideo | null>,
    seekbarRef: React.RefObject<any>
  ) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_evt) => {
        updateState({ isSeeking: true });
        clearAutoHideTimer();
      },
      onPanResponderMove: (evt) => {
        const state = getCurrentState();
        if (seekbarRef.current && state.status) {
          const touchPageX = evt.nativeEvent.pageX;
          seekbarRef.current.measure((_x: any, _y: any, width: any, _height: any, pageX: any, _pageY: any) => {
            const touchX = touchPageX - pageX;
            const progress = Math.max(0, Math.min(1, touchX / width));
            const seekPosition = progress * (state.status?.durationMillis || 0);
            updateState({ seekingPosition: seekPosition });
          });
        }
      },
      onPanResponderRelease: (evt) => {
        const state = getCurrentState();
        if (seekbarRef.current && state.status) {
          const touchPageX = evt.nativeEvent.pageX;
          seekbarRef.current.measure((_x: any, _y: any, width: any, _height: any, pageX: any, _pageY: any) => {
            const touchX = touchPageX - pageX;
            const progress = Math.max(0, Math.min(1, touchX / width));
            const duration = state.status?.durationMillis || 0;
            const seekPosition = progress * duration;
            
            if (videoRef.current && state.status && duration > 0) {
              const validSeekPosition = Math.max(0, Math.min(seekPosition, duration - 100));
              const currentPosition = state.status.positionMillis || 0;
              const positionDiff = Math.abs(validSeekPosition - currentPosition);
              
              if (positionDiff > 100) {
                if (state.status.isLoaded && 
                    state.status.durationMillis && 
                    state.status.durationMillis > 0 &&
                    validSeekPosition >= 0 && 
                    validSeekPosition < state.status.durationMillis) {
                  
                  videoRef.current.setStatusAsync({ positionMillis: validSeekPosition }).catch((error: any) => {
                    console.warn('Seek failed:', error);
                    updateState({
                      isSeeking: false,
                      seekingPosition: 0,
                      lastSeekPosition: 0,
                      isSeekingComplete: false
                    });
                  });
                }
              }
              
              updateState({
                isSeeking: false,
                seekingPosition: validSeekPosition,
                lastSeekPosition: validSeekPosition,
                isSeekingComplete: true
              });
            } else {
              updateState({
                isSeeking: false,
                seekingPosition: 0,
                lastSeekPosition: 0,
                isSeekingComplete: false
              });
            }
          });
        }
        
        const currentState = getCurrentState();
        if (currentState.isControlsVisible) {
          startAutoHideTimer(() => updateState({ isControlsVisible: false }));
        }
      },
    });
  }

  getProgress(state: any): number {
    if (!state.status) return 0;
    
    const duration = state.status.durationMillis || 1;
    const currentVideoPosition = state.status.positionMillis || 0;
    
    if (state.isSeeking) {
      return state.seekingPosition / duration;
    }
    
    if (state.isSeekingComplete && state.lastSeekPosition > 0) {
      return state.lastSeekPosition / duration;
    }
    
    return currentVideoPosition / duration;
  }

  getCurrentPosition(state: any): number {
    if (!state.status) return 0;
    
    const currentVideoPosition = state.status.positionMillis || 0;
    
    if (state.isSeeking) {
      return state.seekingPosition;
    }
    
    if (state.isSeekingComplete && state.lastSeekPosition > 0) {
      return state.lastSeekPosition;
    }
    
    return currentVideoPosition;
  }

  async handlePlayPause(videoRef: React.RefObject<AdvancedVideo | null>, status: any) {
    if (videoRef.current) {
      try {
        if (status?.isPlaying) {
          await videoRef.current.setStatusAsync({ shouldPlay: false });
        } else {
          await videoRef.current.setStatusAsync({ shouldPlay: true });
        }
      } catch (error) {
        console.warn('Failed to toggle play/pause:', error);
      }
    }
  }

  async handleMuteToggle(videoRef: React.RefObject<AdvancedVideo | null>, status: any) {
    if (videoRef.current && status) {
      try {
        await videoRef.current.setIsMutedAsync(!status.isMuted);
      } catch (error) {
        console.warn('Failed to toggle mute:', error);
      }
    }
  }

  async handlePlaybackSpeedChange(
    videoRef: React.RefObject<AdvancedVideo | null>, 
    speed: number, 
    updateState: (updates: any) => void
  ) {
    if (videoRef.current) {
      try {
        await videoRef.current.setStatusAsync({ rate: speed });
        updateState({ currentPlaybackSpeed: speed });
      } catch (error) {
        console.warn('Failed to change playback speed:', error);
      }
    }
  }

  handleToggleSpeedMenu(isVisible: boolean, updateState: (updates: any) => void) {
    updateState({ isSpeedMenuVisible: !isVisible });
  }
}
