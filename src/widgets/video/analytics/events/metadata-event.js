import { VIDEO_EVENT } from '../events.consts';

export const parseVideoDuration = (durationValue) => {
  const videoDuration = Number.isNaN(durationValue) ? null : durationValue;
  return Number.POSITIVE_INFINITY === videoDuration ? 'Infinity' : videoDuration;
};

export const registerMetadataEvent = (playerAdapter, reportEvent) => {
  const reportLoadedMetadata = () => {
    reportEvent(VIDEO_EVENT.LOADED_METADATA, {
      videoDuration: parseVideoDuration(playerAdapter.getDuration()),
      videoUrl: playerAdapter.getCurrentSrc(),
    });
  };
  const eventLoadedMetadataClearCallback = playerAdapter.onLoadedMetadata(() => reportLoadedMetadata());

  if (playerAdapter.getReadyState() > 0) {
    // make it async to allow collect any initial events
    setTimeout(() => reportLoadedMetadata(), 0);
  }

  return () => {
    eventLoadedMetadataClearCallback();
  };
};
