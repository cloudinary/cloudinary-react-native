// Expo AV Video Player Adapter for expo-av
// This adapter provides the same interface as nativeHtmlVideoPlayerAdapter
// but works with Expo AV Video component refs

const createBaseOnEventListener = (videoRef, eventName, callback) => {
    // For Expo AV, we'll store the callback and return a cleanup function
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

  // Helper function to trigger events from the Video component
  export const triggerExpoAVEvent = (videoRef, eventName, eventData) => {
    const callbacks = videoRef._cloudinaryEventCallbacks?.[eventName];
    if (callbacks) {
      callbacks.forEach(callback => callback(eventData));
    }
  };

  // Helper to map Expo AV status to HTML5-like events
  export const processExpoAVStatus = (videoRef, status, previousStatus = {}) => {
    if (!status.isLoaded) {
      // Handle error state
      if (status.error) {
        triggerExpoAVEvent(videoRef, 'error', { error: status.error });
      }
      return;
    }

    // Map Expo AV status changes to HTML5 video events

    // Load events
    if (!previousStatus.isLoaded && status.isLoaded) {
      triggerExpoAVEvent(videoRef, 'loadstart', status);
      triggerExpoAVEvent(videoRef, 'loadedmetadata', status);
      triggerExpoAVEvent(videoRef, 'loadeddata', status);
      triggerExpoAVEvent(videoRef, 'canplay', status);
    }

    // Play/Pause events
    if (previousStatus.isPlaying !== status.isPlaying) {
      if (status.isPlaying) {
        triggerExpoAVEvent(videoRef, 'play', status);
        triggerExpoAVEvent(videoRef, 'playing', status);
      } else {
        triggerExpoAVEvent(videoRef, 'pause', status);
      }
    }

    // Time update (progress)
    if (status.positionMillis !== previousStatus.positionMillis) {
      triggerExpoAVEvent(videoRef, 'timeupdate', status);
      triggerExpoAVEvent(videoRef, 'progress', status);
    }

    // Ended
    if (status.didJustFinish) {
      triggerExpoAVEvent(videoRef, 'ended', status);
    }
  };

  export const expoAVVideoPlayerAdapter = (videoRef) => ({
    // Video events mapping from Expo AV to HTML5 video events
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

    // Video properties - these will be extracted from Expo AV status
    getCurrentSrc: () => videoRef._currentStatus?.uri || '',
    getCurrentTime: () => (videoRef._currentStatus?.positionMillis || 0) / 1000,
    getReadyState: () => {
      const status = videoRef._currentStatus;
      if (!status?.isLoaded) return 0;
      return 4; // HAVE_ENOUGH_DATA
    },
    getDuration: () => (videoRef._currentStatus?.durationMillis || 0) / 1000,
  });
