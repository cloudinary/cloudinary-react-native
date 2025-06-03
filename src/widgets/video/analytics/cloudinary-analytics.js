import { isMobile } from 'is-mobile';
import { initEventsCollector } from './events-collector';
import { getVideoViewId, getUserId } from './utils/unique-ids';
import { sendBeaconRequest } from './utils/send-beacon-request';
import {
  createRegularVideoViewEndEvent,
  createLiveStreamViewStartEvent,
  createLiveStreamViewEndEvent,
  createRegularVideoViewStartEvent,
  prepareEvents,
} from './utils/events';
import { throwErrorIfInvalid, metadataValidator, mainOptionsValidator, trackingOptionsValidator } from './utils/validators';
import { nativeHtmlVideoPlayerAdapter } from './player-adapters/nativeHtmlVideoPlayerAdapter';
import { parseCustomerVideoData } from './utils/customer-data';
import { createPageTracker } from './utils/page-events';

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
const CLD_ANALYTICS_ENDPOINT = process.env.NODE_ENV === 'development' ? CLD_ANALYTICS_ENDPOINTS_LIST.development : CLD_ANALYTICS_ENDPOINTS_LIST.production;

export const connectCloudinaryAnalytics = (videoElement, mainOptions = {}) => {
  throwErrorIfInvalid(
    mainOptionsValidator(mainOptions),
    'Cloudinary video analytics requires proper options object'
  );

  if (!mainOptions.playerAdapter) {
    mainOptions.playerAdapter = nativeHtmlVideoPlayerAdapter(videoElement);
  }

  let videoTrackingSession = null;
  const userId = getUserId();
  const { playerAdapter } = mainOptions;
  const isMobileDetected = isMobile({ tablet: true, featureDetect: true });
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
      throw 'Cloudinary video analytics auto tracking is already connected with this HTML Video Element, to start manual tracking you need to stop auto tracking';
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
    const sendData = (data) => sendBeaconRequest(CLD_ANALYTICS_ENDPOINT.default, data);
    const videoViewEventCollector = createEventsCollector();
    const finishVideoTracking = () => {
      // multiple events can be triggered one by one for specific browsers but we don't have guarantee which ones
      // in this case send data for first event and for rest just skip it to avoid empty payload
      if (videoViewEventCollector.getCollectedEventsCount() > 0) {
        videoViewEventCollector.addEvent(createRegularVideoViewEndEvent());
        const events = prepareEvents([...videoViewEventCollector.flushEvents()]);
        sendData({
          userId,
          viewId: viewId.getValue(),
          events,
        });
      }
    };

    const pageEventsRemoval = createPageTracker({
      onPageViewStart: () => {
        viewId.regenerateValue();

        videoViewEventCollector.start(viewId.getValue());
        videoViewEventCollector.addEvent(
          createRegularVideoViewStartEvent({
            videoUrl: playerAdapter.getCurrentSrc(),
            trackingType: 'manual',
          }, options)
        );
      },
      onPageViewEnd: () => {
        finishVideoTracking();
        videoViewEventCollector.destroy();
      },
    }, isMobileDetected);

    videoTrackingSession = {
      viewId,
      type: 'manual',
      subtype: 'default',
      clear: () => {
        finishVideoTracking();
        videoViewEventCollector.destroy();
        pageEventsRemoval();
      },
    };
  };
  const _startManualTrackingLiveStream = (metadata, options) => {
    const liveStreamData = parseCustomerVideoData(metadata);
    const sendLiveStreamEvent = (event) => {
      sendBeaconRequest(CLD_ANALYTICS_ENDPOINT.liveStreams, {
        userId,
        viewId: viewId.getValue(),
        events: prepareEvents([event]),
      });
    };
    const pageEventsRemoval = createPageTracker({
      onPageViewStart: () => {
        viewId.regenerateValue();

        sendLiveStreamEvent(
          createLiveStreamViewStartEvent({ liveStreamData }, options)
        );
      },
      onPageViewEnd: () => {
        sendLiveStreamEvent(
          createLiveStreamViewEndEvent({ liveStreamData }, options)
        );
      },
    }, isMobileDetected);

    videoTrackingSession = {
      viewId: viewId.getValue(),
      type: 'manual',
      subtype: 'live-stream',
      clear: () => {
        pageEventsRemoval();
      },
    };
  };

  const startAutoTracking = (options = {}) => {
    if (videoTrackingSession) {
      throw 'Cloudinary video analytics tracking is already connected with this HTML Video Element';
    }

    throwErrorIfInvalid(
      trackingOptionsValidator(options),
      'Cloudinary video analytics auto tracking called with invalid options'
    );

    // ... existing code ...

    const startAutoTracking = (options = {}) => {
      if (videoTrackingSession) {
        throw 'Cloudinary video analytics tracking is already connected with this Video component';
      }

      throwErrorIfInvalid(
          trackingOptionsValidator(options),
          'Cloudinary video analytics auto tracking called with invalid options'
      );

      const sendData = (data) => sendRequest(CLD_ANALYTICS_ENDPOINT.default, data);
      const videoViewEventCollector = createEventsCollector();
      let isCollectorActive = false;

      const finishVideoTracking = () => {
        if (isCollectorActive && videoViewEventCollector.getCollectedEventsCount() > 0) {
          videoViewEventCollector.addEvent(createRegularVideoViewEndEvent());
          const events = prepareEvents([...videoViewEventCollector.flushEvents()]);
          sendData({
            userId,
            viewId: viewId.getValue(),
            events,
          });
        }
      };

      const startVideoTracking = () => {
        const sourceUrl = playerAdapter.getCurrentSrc();
        if (!sourceUrl) {
          return null;
        }

        // Don't start if already tracking
        if (videoTrackingSession) {
          return;
        }

        viewId.regenerateValue();
        videoViewEventCollector.start(viewId.getValue());
        isCollectorActive = true;

        videoViewEventCollector.addEvent(
            createRegularVideoViewStartEvent({
              videoUrl: sourceUrl,
              trackingType: 'auto',
            }, options)
        );

        videoTrackingSession = {
          viewId,
          type: 'auto',
          clear: () => {
            finishVideoTracking();
            if (isCollectorActive) {
              videoViewEventCollector.destroy();
              isCollectorActive = false;
            }
          },
        };
      };

      createAppStateTracker({
        onAppForeground: () => {
          // Only start if not already tracking
          if (!videoTrackingSession) {
            startVideoTracking();
          }
        },
        onAppBackground: () => {
          if (videoTrackingSession) {
            finishVideoTracking();
            if (isCollectorActive) {
              videoViewEventCollector.destroy();
              isCollectorActive = false;
            }
            // Don't clear the session here, just pause tracking
          }
        },
      });

      // Listen for video load events to start tracking
      playerAdapter.onLoadStart(() => !videoTrackingSession && startVideoTracking());
      playerAdapter.onEmptied(() => clearVideoTracking());
    };

  return {
    startManualTracking,
    stopManualTracking: clearVideoTracking,
    startAutoTracking,
  };
};
}
