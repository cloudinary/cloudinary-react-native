// Expo Video Player Adapter for expo-video
// This adapter provides the same interface as expoAVVideoPlayerAdapter
// but works with expo-video VideoView component refs

const createBaseOnEventListener = (videoRef, eventName, callback) => {
    // For expo-video, we'll store the callback and return a cleanup function
    const eventCallbacks = videoRef._cloudinaryEventCallbacks || {};
    if (!eventCallbacks[eventName]) {
      eventCallbacks[eventName] = [];
    }
    eventCallbacks[eventName].push(callback);
    videoRef._cloudinaryEventCallbacks = eventCallbacks;

    return () => {
      const callbacks = videoRef._cloudinaryEventCallbacks?.[eventName];
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  };

  // Helper function to trigger events from the VideoView component
  export const triggerExpoVideoEvent = (videoRef, eventName, eventData) => {
    const callbacks = videoRef._cloudinaryEventCallbacks?.[eventName];
    if (callbacks) {
      callbacks.forEach(callback => callback(eventData));
    }
  };

  // Helper to map expo-video events to HTML5-like events
  export const processExpoVideoEvents = {
    onPlaybackStatusUpdate: (videoRef, status) => {
      // Store current status for analytics adapter
      if (!videoRef._currentStatus) {
        videoRef._currentStatus = {};
      }
      videoRef._currentStatus = { ...status, uri: videoRef._currentStatus.uri };

      // Map expo-video status changes to HTML5 video events
      triggerExpoVideoEvent(videoRef, 'timeupdate', status);
      triggerExpoVideoEvent(videoRef, 'progress', status);
    },
    
    onLoad: (videoRef, data) => {
      triggerExpoVideoEvent(videoRef, 'loadstart', data);
      triggerExpoVideoEvent(videoRef, 'loadedmetadata', data);
      triggerExpoVideoEvent(videoRef, 'loadeddata', data);
      triggerExpoVideoEvent(videoRef, 'canplay', data);
    },
    
    onLoadStart: (videoRef, data) => {
      triggerExpoVideoEvent(videoRef, 'loadstart', data);
    },
    
    onReadyForDisplay: (videoRef, data) => {
      triggerExpoVideoEvent(videoRef, 'canplay', data);
      triggerExpoVideoEvent(videoRef, 'canplaythrough', data);
    },
    
    onPlayingChange: (videoRef, isPlaying) => {
      if (isPlaying) {
        triggerExpoVideoEvent(videoRef, 'play', { isPlaying });
        triggerExpoVideoEvent(videoRef, 'playing', { isPlaying });
      } else {
        triggerExpoVideoEvent(videoRef, 'pause', { isPlaying });
      }
    },
    
    onError: (videoRef, error) => {
      triggerExpoVideoEvent(videoRef, 'error', { error });
    },
    
    onEnd: (videoRef, data) => {
      triggerExpoVideoEvent(videoRef, 'ended', data);
    }
  };

  export const expoVideoPlayerAdapter = (videoRef) => ({
    // Video events mapping from expo-video to HTML5 video events
    onCanPlay: (callback) => createBaseOnEventListener(videoRef, 'canplay', callback),
    onCanPlayThrough: (callback) => createBaseOnEventListener(videoRef, 'canplaythrough', callback),
    onComplete: (callback) => createBaseOnEventListener(videoRef, 'complete', callback),
    onDurationChange: (callback) => createBaseOnEventListener(videoRef, 'durationchange', callback),
    onEmptied: (callback) => createBaseOnEventListener(videoRef, 'emptied', callback),
    onEnded: (callback) => createBaseOnEventListener(videoRef, 'ended', callback),
    onError: (callback) => createBaseOnEventListener(videoRef, 'error', callback),
    onLoadedData: (callback) => createBaseOnEventListener(videoRef, 'loadeddata', callback),
    onLoadedMetadata: (callback) => createBaseOnEventListener(videoRef, 'loadedmetadata', callback),
    onLoadStart: (callback) => createBaseOnEventListener(videoRef, 'loadstart', callback),
    onPause: (callback) => createBaseOnEventListener(videoRef, 'pause', callback),
    onPlay: (callback) => createBaseOnEventListener(videoRef, 'play', callback),
    onPlaying: (callback) => createBaseOnEventListener(videoRef, 'playing', callback),
    onProgress: (callback) => createBaseOnEventListener(videoRef, 'progress', callback),
    onRateChange: (callback) => createBaseOnEventListener(videoRef, 'ratechange', callback),
    onSeeked: (callback) => createBaseOnEventListener(videoRef, 'seeked', callback),
    onSeeking: (callback) => createBaseOnEventListener(videoRef, 'seeking', callback),
    onStalled: (callback) => createBaseOnEventListener(videoRef, 'stalled', callback),
    onSuspend: (callback) => createBaseOnEventListener(videoRef, 'suspend', callback),
    onTimeUpdate: (callback) => createBaseOnEventListener(videoRef, 'timeupdate', callback),
    onVolumeChange: (callback) => createBaseOnEventListener(videoRef, 'volumechange', callback),
    onWaiting: (callback) => createBaseOnEventListener(videoRef, 'waiting', callback),

    // Video properties - these will be extracted from expo-video status
    getCurrentSrc: () => videoRef._currentStatus?.uri || '',
    getCurrentTime: () => (videoRef._currentStatus?.currentTime || 0),
    getReadyState: () => {
      const status = videoRef._currentStatus;
      if (!status?.isLoaded) return 0;
      return 4; // HAVE_ENOUGH_DATA
    },
    getDuration: () => (videoRef._currentStatus?.duration || 0),
  });