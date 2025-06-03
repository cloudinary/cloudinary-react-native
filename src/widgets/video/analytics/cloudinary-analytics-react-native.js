import { isMobile } from './utils/platform-detection';
import { initEventsCollector } from './events-collector';
import { getVideoViewId, getUserId } from './utils/unique-ids';
import { sendRequest } from './utils/send-request-react-native';
import {
  createRegularVideoViewEndEvent,
  createLiveStreamViewStartEvent,
  createLiveStreamViewEndEvent,
  createRegularVideoViewStartEvent,
  prepareEvents,
} from './utils/events';
import { throwErrorIfInvalid, metadataValidator, mainOptionsValidator, trackingOptionsValidator } from './utils/validators';
import { expoAVVideoPlayerAdapter } from './player-adapters/expoAVVideoPlayerAdapter';
import { parseCustomerVideoData } from './utils/customer-data';
import { createAppStateTracker } from './utils/app-state-events';

const CLD_ANALYTICS_ENDPOINTS_LIST = {
  production: {
    default: 'https://video-analytics-api.cloudinary.com/v1/video-analytics',
    liveStreams: 'https://video-analytics-api.cloudinary.com/v1/live-streams',
  },
  development: {
    default: 'http://localhost:3001/events',
    liveStreams: 'http://localhost:3001/events',
  },
};
const CLD_ANALYTICS_ENDPOINT = CLD_ANALYTICS_ENDPOINTS_LIST.production;

export const connectCloudinaryAnalytics = (videoRef, mainOptions = {}) => {
  throwErrorIfInvalid(
      mainOptionsValidator(mainOptions),
      'Cloudinary video analytics requires proper options object'
  );

  if (!mainOptions.playerAdapter) {
    mainOptions.playerAdapter = expoAVVideoPlayerAdapter(videoRef);
  }

  let videoTrackingSession = null;
  const userId = getUserId();
  const { playerAdapter } = mainOptions;
  const isMobileDetected = isMobile();
  const createEventsCollector = initEventsCollector(playerAdapter);
  const clearVideoTracking = () => {
    if (videoTrackingSession) {
      videoTrackingSession.clear();
      videoTrackingSession = null;
    }
  };
  const viewId = {
    _value: getVideoViewId(),
    getValue: () => viewId._value,
    regenerateValue: () => {
      viewId._value = getVideoViewId();

      if (videoTrackingSession) {
        videoTrackingSession.viewId = viewId._value;
      }

      return viewId._value;
    },
  };

  const startManualTracking = (metadata, options = {}) => {
    if (videoTrackingSession?.type === 'auto') {
      throw 'Cloudinary video analytics auto tracking is already connected with this Video component, to start manual tracking you need to stop auto tracking';
    }

    throwErrorIfInvalid(
        metadataValidator(metadata),
        'Cloudinary video analytics manual tracking called without necessary data'
    );
    throwErrorIfInvalid(
        trackingOptionsValidator(options),
        'Cloudinary video analytics manual tracking called with invalid options'
    );

    clearVideoTracking();

    if (metadata.type === 'live') {
      _startManualTrackingLiveStream(metadata, options);
    } else {
      options.customVideoUrlFallback = options.customVideoUrlFallback || (() => metadata);
      _startManualTrackingRegularVideo(metadata, options);
    }
  };

  const _startManualTrackingRegularVideo = (metadata, options) => {
    const sendData = (data) => {
      return sendRequest(CLD_ANALYTICS_ENDPOINT.default, data);
    };
    const videoViewEventCollector = createEventsCollector();
    const finishVideoTracking = () => {
      if (videoViewEventCollector.getCollectedEventsCount() > 0) {
        videoViewEventCollector.addEvent(createRegularVideoViewEndEvent());
        const events = prepareEvents([...videoViewEventCollector.flushEvents()]);
        sendData({
          userId,
          viewId: viewId.getValue(),
          events,
        });
        videoViewEventCollector.destroy();
      }
    };

    const appStateRemoval = createAppStateTracker({
      onAppForeground: () => {
        viewId.regenerateValue();

        videoViewEventCollector.start(viewId.getValue());
        videoViewEventCollector.addEvent(
            createRegularVideoViewStartEvent({
              videoUrl: playerAdapter.getCurrentSrc(),
              trackingType: 'manual',
            }, options)
        );
      },
      onAppBackground: () => {
        finishVideoTracking();
      },
    });

    videoTrackingSession = {
      viewId,
      type: 'manual',
      subtype: 'default',
      eventCollector: videoViewEventCollector,
      clear: () => {
        finishVideoTracking();
        appStateRemoval();
      },
    };
  };

  const _startManualTrackingLiveStream = (metadata, options) => {
    const liveStreamData = parseCustomerVideoData(metadata);
    const sendLiveStreamEvent = (event) => {
      sendRequest(CLD_ANALYTICS_ENDPOINT.liveStreams, {
        userId,
        viewId: viewId.getValue(),
        events: prepareEvents([event]),
      });
    };
    const appStateRemoval = createAppStateTracker({
      onAppForeground: () => {
        viewId.regenerateValue();

        sendLiveStreamEvent(
            createLiveStreamViewStartEvent({ liveStreamData }, options)
        );
      },
      onAppBackground: () => {
        sendLiveStreamEvent(
            createLiveStreamViewEndEvent({ liveStreamData }, options)
        );
      },
    });

    videoTrackingSession = {
      viewId: viewId.getValue(),
      type: 'manual',
      subtype: 'live-stream',
      clear: () => {
        appStateRemoval();
      },
    };
  };

  const startAutoTracking = (options = {}) => {
    if (videoTrackingSession) {
      throw 'Cloudinary video analytics tracking is already connected with this Video component';
    }

    throwErrorIfInvalid(
        trackingOptionsValidator(options),
        'Cloudinary video analytics auto tracking called with invalid options'
    );
    const sendData = (data) => {
      return sendRequest(CLD_ANALYTICS_ENDPOINT.default, data);
    };
    const videoViewEventCollector = createEventsCollector();

    const finishVideoTracking = () => {
      if (videoTrackingSession && videoViewEventCollector.getCollectedEventsCount() > 0) {
        videoViewEventCollector.addEvent(createRegularVideoViewEndEvent());
        const events = prepareEvents([...videoViewEventCollector.flushEvents()]);
        sendData({
          userId,
          viewId: viewId.getValue(),
          events,
        });
        videoViewEventCollector.destroy();
      }
    };

    const startVideoTracking = () => {
      const sourceUrl = playerAdapter.getCurrentSrc();
      if (!videoTrackingSession) {
        return null;
      }
      
      if (!sourceUrl) {
        return null;
      }
      if (!videoTrackingSession.viewStarted) {
        viewId.regenerateValue();
        videoViewEventCollector.start(viewId.getValue());
        videoViewEventCollector.addEvent(
            createRegularVideoViewStartEvent({
              videoUrl: sourceUrl,
              trackingType: 'auto',
            }, options)
        );
        videoTrackingSession.viewStarted = true;
      }
    };

    videoTrackingSession = {
      viewId,
      type: 'auto',
      eventCollector: videoViewEventCollector,
      viewStarted: false,
      clear: () => {
        finishVideoTracking();
      },
    };

    createAppStateTracker({
      onAppForeground: () => startVideoTracking(),
      onAppBackground: () => {
        if (videoTrackingSession) {
          finishVideoTracking();
        }
      },
    });

    playerAdapter.onLoadStart(() => {
      if (videoTrackingSession) {
        startVideoTracking();
      }
    });
    playerAdapter.onEmptied(() => clearVideoTracking());
    
    setTimeout(() => {
      startVideoTracking();
    }, 100);
  };

  const addCustomEvent = (eventName, eventDetails = {}) => {
    
    if (!videoTrackingSession) {
      try {
        const videoViewEventCollector = createEventsCollector();
        viewId.regenerateValue();
        videoViewEventCollector.start(viewId.getValue());
        
        videoTrackingSession = {
          viewId,
          type: 'custom-events-only',
          eventCollector: videoViewEventCollector,
          viewStarted: true,
          clear: () => {
            if (videoViewEventCollector.getCollectedEventsCount() > 0) {
              const events = prepareEvents([...videoViewEventCollector.flushEvents()]);
              sendRequest(CLD_ANALYTICS_ENDPOINT.default, {
                userId,
                viewId: viewId.getValue(),
                events,
              });
            }
            videoViewEventCollector.destroy();
          },
        };
      } catch (error) {
        console.warn('Failed to create minimal tracking session:', error);
        return;
      }
    }
    
    if (!videoTrackingSession || !videoTrackingSession.eventCollector) {
      console.warn('No active analytics tracking session. Start tracking first.');
      return;
    }

    try {
      if (videoTrackingSession.type === 'auto' && !videoTrackingSession.viewStarted) {
        viewId.regenerateValue();
        videoTrackingSession.eventCollector.start(viewId.getValue());
        videoTrackingSession.viewStarted = true;
      }
      
      videoTrackingSession.eventCollector.addEvent({
        eventName,
        eventDetails,
        timestamp: Date.now()
      });
    } catch (error) {
      console.warn('Failed to add custom event:', error);
      console.warn('Error details:', error.message);
    }
  };

  return {
    startManualTracking,
    stopManualTracking: clearVideoTracking,
    startAutoTracking,
    addCustomEvent,
  };
};
