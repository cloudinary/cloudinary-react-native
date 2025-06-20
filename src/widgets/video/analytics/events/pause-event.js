import { VIDEO_EVENT } from '../events.consts';

export const registerPauseEvent = (playerAdapter, reportEvent) => {
  const eventPauseClearCallback = playerAdapter.onPause(() => {
    reportEvent(VIDEO_EVENT.PAUSE, {});
  });
  const eventEmptiedClearCallback = playerAdapter.onEmptied(() => {
    reportEvent(VIDEO_EVENT.PAUSE, {});
  });

  return () => {
    eventPauseClearCallback();
    eventEmptiedClearCallback();
  };
};
