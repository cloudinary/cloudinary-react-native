import React from 'react';
import { Animated, Easing } from 'react-native';
import { AVPlaybackStatusSuccess } from 'expo-av';
import {
  CONTROLS_AUTO_HIDE_DELAY,
  CONTROLS_FADE_DURATION,
  SEEK_DEBOUNCE_DELAY,
  SEEK_POSITION_THRESHOLD,
  SEEK_POSITION_TOLERANCE,
} from './constants';
import { validateSeekPosition, hasSignificantPositionDifference, calculateSeekProgress } from './utils';

/**
 * Custom hook for managing video controls visibility and auto-hide functionality
 */
export const useVideoControlsVisibility = () => {
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const autoHideTimeoutId = React.useRef<NodeJS.Timeout | null>(null);

  const clearAutoHideTimer = React.useCallback(() => {
    if (autoHideTimeoutId.current) {
      clearTimeout(autoHideTimeoutId.current);
      autoHideTimeoutId.current = null;
    }
  }, []);

  const startAutoHideTimer = React.useCallback((isControlsVisible: boolean, setIsControlsVisible: (visible: boolean) => void) => {
    clearAutoHideTimer();
    
    autoHideTimeoutId.current = setTimeout(() => {
      if (isControlsVisible) {
        setIsControlsVisible(false);
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: CONTROLS_FADE_DURATION,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      }
    }, CONTROLS_AUTO_HIDE_DELAY);
  }, [fadeAnim, clearAutoHideTimer]);

  const toggleControls = React.useCallback((
    isControlsVisible: boolean,
    setIsControlsVisible: (visible: boolean) => void
  ) => {
    const newVisibility = !isControlsVisible;
    setIsControlsVisible(newVisibility);
    
    Animated.timing(fadeAnim, {
      toValue: newVisibility ? 1 : 0,
      duration: CONTROLS_FADE_DURATION,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    if (newVisibility) {
      startAutoHideTimer(newVisibility, setIsControlsVisible);
    } else {
      clearAutoHideTimer();
    }
  }, [fadeAnim, startAutoHideTimer, clearAutoHideTimer]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      clearAutoHideTimer();
    };
  }, [clearAutoHideTimer]);

  return {
    fadeAnim,
    startAutoHideTimer,
    clearAutoHideTimer,
    toggleControls,
  };
};

/**
 * Custom hook for managing video seeking functionality
 */
export const useVideoSeeking = () => {
  const seekTimeoutId = React.useRef<NodeJS.Timeout | null>(null);
  const lastSeekTime = React.useRef<number>(0);

  const handleSeekStart = React.useCallback(() => {
    return { isSeeking: true };
  }, []);

  const handleSeekMove = React.useCallback((
    evt: any,
    seekbarRef: React.RefObject<any>,
    status: AVPlaybackStatusSuccess | null
  ) => {
    if (seekbarRef.current && status) {
      const touchPageX = evt.nativeEvent.pageX;
      return new Promise<{ seekingPosition: number }>((resolve) => {
        seekbarRef.current.measure((_x: number, _y: number, width: number, _height: number, pageX: number, _pageY: number) => {
          const touchX = touchPageX - pageX;
          const progress = calculateSeekProgress(touchX, width);
          const seekPosition = progress * (status.durationMillis || 0);
          resolve({ seekingPosition: seekPosition });
        });
      });
    }
    return Promise.resolve({ seekingPosition: 0 });
  }, []);

  const handleSeekEnd = React.useCallback((
    evt: any,
    seekbarRef: React.RefObject<any>,
    status: AVPlaybackStatusSuccess | null,
    videoRef: any
  ) => {
    if (seekbarRef.current && status) {
      const touchPageX = evt.nativeEvent.pageX;
      return new Promise<{
        isSeeking: boolean;
        seekingPosition: number;
        lastSeekPosition: number;
        isSeekingComplete: boolean;
      }>((resolve) => {
        seekbarRef.current.measure((_x: number, _y: number, width: number, _height: number, pageX: number, _pageY: number) => {
          const touchX = touchPageX - pageX;
          const progress = calculateSeekProgress(touchX, width);
          const duration = status.durationMillis || 0;
          const seekPosition = progress * duration;
          
          if (videoRef.current && status && duration > 0) {
            const validSeekPosition = validateSeekPosition(seekPosition, duration);
            const currentPosition = status.positionMillis || 0;
            const positionDiff = hasSignificantPositionDifference(validSeekPosition, currentPosition, SEEK_POSITION_THRESHOLD);
            
            const now = Date.now();
            const timeSinceLastSeek = now - lastSeekTime.current;
            
            if (positionDiff && timeSinceLastSeek > SEEK_DEBOUNCE_DELAY) {
              if (status.isLoaded && 
                  status.durationMillis && 
                  status.durationMillis > 0 &&
                  validSeekPosition >= 0 && 
                  validSeekPosition < status.durationMillis) {
                
                lastSeekTime.current = now;
                videoRef.current.setPositionAsync(validSeekPosition).catch((error: any) => {
                  console.warn('Seek failed:', error);
                  resolve({
                    isSeeking: false,
                    seekingPosition: 0,
                    lastSeekPosition: 0,
                    isSeekingComplete: false,
                  });
                });
              }
            }
            
            resolve({
              isSeeking: false,
              seekingPosition: validSeekPosition,
              lastSeekPosition: validSeekPosition,
              isSeekingComplete: true,
            });
          } else {
            resolve({
              isSeeking: false,
              seekingPosition: 0,
              lastSeekPosition: 0,
              isSeekingComplete: false,
            });
          }
        });
      });
    }
    
    return Promise.resolve({
      isSeeking: false,
      seekingPosition: 0,
      lastSeekPosition: 0,
      isSeekingComplete: false,
    });
  }, []);

  const getProgress = React.useCallback((
    status: AVPlaybackStatusSuccess | null,
    isSeeking: boolean,
    seekingPosition: number,
    isSeekingComplete: boolean,
    lastSeekPosition: number
  ): number => {
    if (!status) return 0;
    
    const duration = status.durationMillis || 1;
    const currentVideoPosition = status.positionMillis || 0;
    
    if (isSeeking) {
      return seekingPosition / duration;
    }
    
    if (isSeekingComplete && lastSeekPosition > 0) {
      return lastSeekPosition / duration;
    }
    
    return currentVideoPosition / duration;
  }, []);

  const getCurrentPosition = React.useCallback((
    status: AVPlaybackStatusSuccess | null,
    isSeeking: boolean,
    seekingPosition: number,
    isSeekingComplete: boolean,
    lastSeekPosition: number
  ): number => {
    if (!status) return 0;
    
    const currentVideoPosition = status.positionMillis || 0;
    
    if (isSeeking) {
      return seekingPosition;
    }
    
    if (isSeekingComplete && lastSeekPosition > 0) {
      return lastSeekPosition;
    }
    
    return currentVideoPosition;
  }, []);

  const handleStatusUpdate = React.useCallback((
    s: any,
    isSeekingComplete: boolean,
    lastSeekPosition: number,
    setStatus: (status: any) => void,
    setSeekingState: (state: { isSeekingComplete: boolean; lastSeekPosition: number }) => void
  ) => {
    if (s.isLoaded) {
      if (isSeekingComplete && lastSeekPosition > 0) {
        const currentVideoPosition = s.positionMillis || 0;
        const seekPositionDiff = Math.abs(currentVideoPosition - lastSeekPosition);
        
        if (seekPositionDiff < SEEK_POSITION_TOLERANCE) {
          setStatus(s);
          setSeekingState({
            isSeekingComplete: false,
            lastSeekPosition: 0,
          });
          return;
        }
      }
      
      setStatus(s);
    }
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (seekTimeoutId.current) {
        clearTimeout(seekTimeoutId.current);
        seekTimeoutId.current = null;
      }
    };
  }, []);

  return {
    handleSeekStart,
    handleSeekMove,
    handleSeekEnd,
    getProgress,
    getCurrentPosition,
    handleStatusUpdate,
  };
};

/**
 * Custom hook for managing device orientation detection
 */
export const useOrientation = () => {
  const [isLandscape, setIsLandscape] = React.useState(false);

  React.useEffect(() => {
    const { Dimensions } = require('react-native');
    
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setIsLandscape(width > height);
    };

    // Set initial orientation
    updateOrientation();

    // Listen for orientation changes
    const subscription = Dimensions.addEventListener('change', updateOrientation);

    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  return { isLandscape };
}; 