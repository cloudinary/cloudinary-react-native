import { isCustomDataValid, parseCustomData, parseCustomerVideoData, useCustomerVideoDataFallback } from './customer-data';
import { VIEW_EVENT } from '../events.consts';
import { getVideoPlayerType, getVideoPlayerVersion } from './video-player-options';
import { SDKAnalyticsConstants } from '../../../../internal/SDKAnalyticsConstants';

const ANALYTICS_VERSION = JSON.stringify(SDKAnalyticsConstants.sdkSemver);

export const createRegularVideoViewStartEvent = (baseData, customerOptions) => {
  const customData = parseCustomData(customerOptions?.customData);
  const isValidCustomData = isCustomDataValid(customData);
  const customerVideoDataFromFallback = customerOptions?.customVideoUrlFallback ? useCustomerVideoDataFallback(baseData.videoUrl, customerOptions.customVideoUrlFallback) : null;
  const customerVideoData = parseCustomerVideoData(customerVideoDataFromFallback);
  return createEvent(VIEW_EVENT.START, {
    ...baseData,
    analyticsModuleVersion: ANALYTICS_VERSION,
    videoPlayer: {
      type: getVideoPlayerType(customerOptions?.videoPlayerType),
      version: getVideoPlayerVersion(customerOptions?.videoPlayerVersion),
    },
    customerData: {
      ...(isValidCustomData ? { providedData: customData } : {}),
      ...(customerVideoData ? { videoData: customerVideoData } : {}),
    },
  });
};

export const createRegularVideoViewEndEvent = (baseData = {}) => {
  return createEvent(VIEW_EVENT.END, { ...baseData });
};

export const createLiveStreamViewStartEvent = (baseData, customerOptions) => {
  return createEvent(VIEW_EVENT.START, {
    ...baseData,
    analyticsModuleVersion: ANALYTICS_VERSION,
    videoPlayer: {
      type: getVideoPlayerType(customerOptions?.videoPlayerType),
      version: getVideoPlayerVersion(customerOptions?.videoPlayerVersion),
    },
  });
};

export const createLiveStreamViewEndEvent = (baseData, customerOptions) => {
  return createEvent(VIEW_EVENT.END, { ...baseData });
};

export const createEvent = (eventName, eventDetails) => ({
  eventName,
  eventTime: Date.now(),
  eventDetails,
});

export const prepareEvents = (collectedEvents) => {
  const events = [...collectedEvents];
  return JSON.stringify(events);
};
