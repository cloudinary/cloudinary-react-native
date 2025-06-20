import { VIDEO_EVENT } from '../events.consts';

export const registerPlayEvent = (playerAdapter, reportEvent) => {
  const eventPlayClearCallback = playerAdapter.onPlay(() => {
    reportEvent(VIDEO_EVENT.PLAY, {});
  });

  return () => {
    eventPlayClearCallback();
  };
};
