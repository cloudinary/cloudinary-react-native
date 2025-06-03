import { registerPlayEvent } from './events/play-event';
import { registerPauseEvent } from './events/pause-event';
import { registerMetadataEvent } from './events/metadata-event';
import { createEvent } from './utils/events';

export const initEventsCollector = (playerAdapter) => {
  const collectedEvents = {};
  const rawEvents = {};

  return () => {
    let viewId = null;
    const registeredEvents = [];

    const start = (_viewId) => {
      if (viewId) {
        throw new Error('Events collector session already started');
      }
      // create new collection of events for new video view
      viewId = _viewId;
      collectedEvents[viewId] = [];
      rawEvents[viewId] = [];
      registeredEvents.push(
        registerPlayEvent(playerAdapter, reportEvent),
        registerPauseEvent(playerAdapter, reportEvent),
        registerMetadataEvent(playerAdapter, reportEvent),
      );
    };
    const destroy = () => {
      if (!viewId) {
        throw new Error('Events collector session not started');
      }

      registeredEvents.forEach((cb) => cb());
      viewId = null;
    };
    const reportEvent = (eventName, eventDetails) => {
      if (!viewId) {
        throw new Error('Events collector session not started');
      }
      rawEvents[viewId].push(createEvent(eventName, eventDetails));
    };
    const flushEvents = () => {
      if (!viewId) {
        throw new Error('Events collector session not started');
      }

      const events = rawEvents[viewId].splice(0, rawEvents[viewId].length);
      collectedEvents[viewId].splice(collectedEvents[viewId].length, 0, ...events);
      return events;
    };

    const getCollectedEventsCount = () => {
      if (viewId) {
        return rawEvents[viewId]?.length || 0;
      }

      return 0;
    };

    return {
      flushEvents,
      getCollectedEventsCount,
      addEvent: ({ eventName, eventDetails }) => reportEvent(eventName, eventDetails),
      start,
      destroy,
    };
  }
};
