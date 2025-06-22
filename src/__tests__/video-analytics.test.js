import { connectCloudinaryAnalytics } from '../widgets/video/analytics/cloudinary-analytics-react-native';
import { initEventsCollector } from '../widgets/video/analytics/events-collector';
import { getUserId, getVideoViewId } from '../widgets/video/analytics/utils/unique-ids';
import { 
  metadataValidator, 
  mainOptionsValidator, 
  trackingOptionsValidator,
  throwErrorIfInvalid 
} from '../widgets/video/analytics/utils/validators';
import { 
  createEvent,
  createRegularVideoViewStartEvent,
  createRegularVideoViewEndEvent,
  createLiveStreamViewStartEvent,
  createLiveStreamViewEndEvent,
  prepareEvents
} from '../widgets/video/analytics/utils/events';
import { VIDEO_EVENT, VIEW_EVENT } from '../widgets/video/analytics/events.consts';
import { registerPlayEvent } from '../widgets/video/analytics/events/play-event';
import { registerPauseEvent } from '../widgets/video/analytics/events/pause-event';
import { registerMetadataEvent } from '../widgets/video/analytics/events/metadata-event';

// Mock external dependencies
jest.mock('../widgets/video/analytics/utils/send-request-react-native', () => ({
  sendRequest: jest.fn(() => Promise.resolve({}))
}));

jest.mock('../widgets/video/analytics/utils/app-state-events', () => ({
  createAppStateTracker: jest.fn(() => jest.fn())
}));

jest.mock('../widgets/video/analytics/player-adapters/expoAVVideoPlayerAdapter', () => ({
  expoAVVideoPlayerAdapter: jest.fn(() => ({
    getCurrentSrc: jest.fn(() => 'http://example.com/video.mp4'),
    getCurrentTime: jest.fn(() => 0),
    getReadyState: jest.fn(() => 0),
    getDuration: jest.fn(() => 120),
    onPlay: jest.fn((callback) => {
      return jest.fn();
    }),
    onPause: jest.fn((callback) => {
      return jest.fn();
    }),
    onLoadedMetadata: jest.fn((callback) => {
      return jest.fn();
    }),
    onEmptied: jest.fn((callback) => {
      return jest.fn();
    }),
    onLoadStart: jest.fn((callback) => {
      return jest.fn();
    })
  }))
}));

describe('Video Analytics', () => {
  let mockVideoRef;
  let mockPlayerAdapter;

  beforeAll(() => {
    // Use fake timers to control setTimeout calls
    jest.useFakeTimers();
  });

  afterAll(() => {
    // Restore real timers after all tests
    jest.useRealTimers();
  });

  beforeEach(() => {
    mockVideoRef = {};
    mockPlayerAdapter = {
      getCurrentSrc: jest.fn(() => 'http://example.com/video.mp4'),
      getCurrentTime: jest.fn(() => 0),
      getReadyState: jest.fn(() => 0),
      getDuration: jest.fn(() => 120),
      onPlay: jest.fn((callback) => {
        // Don't trigger callback immediately to avoid unwanted events during tests
        return jest.fn();
      }),
      onPause: jest.fn((callback) => {
        return jest.fn();
      }),
      onLoadedMetadata: jest.fn((callback) => {
        return jest.fn();
      }),
      onEmptied: jest.fn((callback) => {
        return jest.fn();
      }),
      onLoadStart: jest.fn((callback) => {
        return jest.fn();
      })
    };
  });

  afterEach(() => {
    // Clear all mocks and pending timers after each test
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('Unique IDs', () => {
    it('should generate a user ID', () => {
      const userId = getUserId();
      expect(userId).toBeDefined();
      expect(typeof userId).toBe('string');
      expect(userId.length).toBeGreaterThan(0);
    });

    it('should return the same user ID on subsequent calls', () => {
      const userId1 = getUserId();
      const userId2 = getUserId();
      expect(userId1).toBe(userId2);
    });

    it('should generate a video view ID', () => {
      const viewId = getVideoViewId();
      expect(viewId).toBeDefined();
      expect(typeof viewId).toBe('string');
      expect(viewId.length).toBeGreaterThan(0);
    });

    it('should generate different video view IDs', () => {
      const viewId1 = getVideoViewId();
      const viewId2 = getVideoViewId();
      expect(viewId1).not.toBe(viewId2);
    });
  });

  describe('Validators', () => {
    describe('metadataValidator', () => {
      it('should validate valid metadata', () => {
        const metadata = {
          cloudName: 'test-cloud',
          publicId: 'test-video'
        };
        const result = metadataValidator(metadata);
        expect(result.isValid).toBe(true);
      });

      it('should invalidate non-object metadata', () => {
        const result = metadataValidator('invalid');
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toContain('object');
      });

      it('should invalidate metadata without cloudName', () => {
        const metadata = { publicId: 'test-video' };
        const result = metadataValidator(metadata);
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toContain('cloud name');
      });

      it('should invalidate metadata without publicId', () => {
        const metadata = { cloudName: 'test-cloud' };
        const result = metadataValidator(metadata);
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toContain('public ID');
      });

      it('should validate live stream metadata', () => {
        const metadata = {
          cloudName: 'test-cloud',
          publicId: 'test-stream',
          type: 'live'
        };
        const result = metadataValidator(metadata);
        expect(result.isValid).toBe(true);
      });

      it('should invalidate invalid type', () => {
        const metadata = {
          cloudName: 'test-cloud',
          publicId: 'test-video',
          type: 'invalid'
        };
        const result = metadataValidator(metadata);
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toContain('type');
      });
    });

    describe('mainOptionsValidator', () => {
      it('should validate valid options', () => {
        const options = { playerAdapter: mockPlayerAdapter };
        const result = mainOptionsValidator(options);
        expect(result.isValid).toBe(true);
      });

      it('should validate empty options', () => {
        const result = mainOptionsValidator();
        expect(result.isValid).toBe(true);
      });

      it('should invalidate non-object options', () => {
        const result = mainOptionsValidator('invalid');
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toContain('object');
      });
    });

    describe('trackingOptionsValidator', () => {
      it('should validate valid tracking options', () => {
        const options = { customData: { key: 'value' } };
        const result = trackingOptionsValidator(options);
        expect(result.isValid).toBe(true);
      });

      it('should validate empty tracking options', () => {
        const result = trackingOptionsValidator();
        expect(result.isValid).toBe(true);
      });

      it('should invalidate non-object tracking options', () => {
        const result = trackingOptionsValidator('invalid');
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toContain('object');
      });
    });

    describe('throwErrorIfInvalid', () => {
      it('should not throw for valid result', () => {
        const validResult = { isValid: true };
        expect(() => throwErrorIfInvalid(validResult, 'Test')).not.toThrow();
      });

      it('should throw for invalid result', () => {
        const invalidResult = { isValid: false, errorMessage: 'Test error' };
        expect(() => throwErrorIfInvalid(invalidResult, 'Test')).toThrow('Test error');
      });

      it('should throw with header for invalid result', () => {
        const invalidResult = { isValid: false, errorMessage: 'Test error' };
        expect(() => throwErrorIfInvalid(invalidResult, 'Test Header')).toThrow('Test Header');
      });
    });
  });

  describe('Events', () => {
    describe('createEvent', () => {
      it('should create an event with eventName and eventDetails', () => {
        const eventName = 'test-event';
        const eventDetails = { key: 'value' };
        const event = createEvent(eventName, eventDetails);
        
        expect(event.eventName).toBe(eventName);
        expect(event.eventDetails).toBe(eventDetails);
        expect(event.eventTime).toBeDefined();
        expect(typeof event.eventTime).toBe('number');
      });

      it('should create event with current timestamp', () => {
        const beforeTime = Date.now();
        const event = createEvent('test', {});
        const afterTime = Date.now();
        
        expect(event.eventTime).toBeGreaterThanOrEqual(beforeTime);
        expect(event.eventTime).toBeLessThanOrEqual(afterTime);
      });
    });

    describe('createRegularVideoViewStartEvent', () => {
      it('should create a regular video view start event', () => {
        const baseData = { videoUrl: 'http://example.com/video.mp4', trackingType: 'manual' };
        const options = { customData: { key: 'value' } };
        
        const event = createRegularVideoViewStartEvent(baseData, options);
        
        expect(event.eventName).toBe(VIEW_EVENT.START);
        expect(event.eventDetails.videoUrl).toBe(baseData.videoUrl);
        expect(event.eventDetails.trackingType).toBe(baseData.trackingType);
        expect(event.eventDetails.analyticsModuleVersion).toBeDefined();
        expect(event.eventDetails.videoPlayer).toBeDefined();
      });
    });

    describe('createRegularVideoViewEndEvent', () => {
      it('should create a regular video view end event', () => {
        const event = createRegularVideoViewEndEvent();
        
        expect(event.eventName).toBe(VIEW_EVENT.END);
        expect(event.eventDetails).toBeDefined();
      });
    });

    describe('createLiveStreamViewStartEvent', () => {
      it('should create a live stream view start event', () => {
        const baseData = { liveStreamData: { publicId: 'test-stream' } };
        const options = { videoPlayerType: 'expo-av' };
        
        const event = createLiveStreamViewStartEvent(baseData, options);
        
        expect(event.eventName).toBe(VIEW_EVENT.START);
        expect(event.eventDetails.liveStreamData).toBe(baseData.liveStreamData);
        expect(event.eventDetails.analyticsModuleVersion).toBeDefined();
        expect(event.eventDetails.videoPlayer).toBeDefined();
      });
    });

    describe('createLiveStreamViewEndEvent', () => {
      it('should create a live stream view end event', () => {
        const baseData = { liveStreamData: { publicId: 'test-stream' } };
        const event = createLiveStreamViewEndEvent(baseData);
        
        expect(event.eventName).toBe(VIEW_EVENT.END);
        expect(event.eventDetails.liveStreamData).toBe(baseData.liveStreamData);
      });
    });

    describe('prepareEvents', () => {
      it('should prepare events for sending', () => {
        const events = [
          createEvent('event1', { key: 'value1' }),
          createEvent('event2', { key: 'value2' })
        ];
        
        const prepared = prepareEvents(events);
        
        expect(typeof prepared).toBe('string');
        const parsed = JSON.parse(prepared);
        expect(Array.isArray(parsed)).toBe(true);
        expect(parsed).toHaveLength(2);
      });
    });
  });

  describe('Events Collector', () => {
    let eventsCollector;
    let collectorInstance;

    beforeEach(() => {
      eventsCollector = initEventsCollector(mockPlayerAdapter);
      collectorInstance = eventsCollector();
    });

    it('should initialize events collector', () => {
      expect(eventsCollector).toBeDefined();
      expect(typeof eventsCollector).toBe('function');
    });

    it('should create collector instance', () => {
      expect(collectorInstance).toBeDefined();
      expect(collectorInstance.start).toBeDefined();
      expect(collectorInstance.destroy).toBeDefined();
      expect(collectorInstance.flushEvents).toBeDefined();
      expect(collectorInstance.getCollectedEventsCount).toBeDefined();
      expect(collectorInstance.addEvent).toBeDefined();
    });

    it('should start collector session', () => {
      const viewId = 'test-view-id';
      expect(() => collectorInstance.start(viewId)).not.toThrow();
    });

    it('should throw when starting already started session', () => {
      const viewId = 'test-view-id';
      collectorInstance.start(viewId);
      expect(() => collectorInstance.start(viewId)).toThrow('already started');
    });

    it('should collect events when session is active', () => {
      const viewId = 'test-view-id';
      collectorInstance.start(viewId);
      
      const initialCount = collectorInstance.getCollectedEventsCount();
      collectorInstance.addEvent(createEvent('test-event', {}));
      
      expect(collectorInstance.getCollectedEventsCount()).toBe(initialCount + 1);
    });

    it('should flush events', () => {
      const viewId = 'test-view-id';
      collectorInstance.start(viewId);
      
      // Clear any events that were triggered during start
      collectorInstance.flushEvents();
      
      // Now add our test event
      collectorInstance.addEvent(createEvent('test-event', {}));
      const events = collectorInstance.flushEvents();
      
      expect(Array.isArray(events)).toBe(true);
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('test-event');
      
      // After flush, raw events should be empty but collected events count should remain
      expect(collectorInstance.getCollectedEventsCount()).toBe(0);
    });

    it('should destroy collector session', () => {
      const viewId = 'test-view-id';
      collectorInstance.start(viewId);
      expect(() => collectorInstance.destroy()).not.toThrow();
    });

    it('should throw when destroying non-started session', () => {
      expect(() => collectorInstance.destroy()).toThrow('not started');
    });

    it('should register player events on start', () => {
      const viewId = 'test-view-id';
      collectorInstance.start(viewId);
      
      expect(mockPlayerAdapter.onPlay).toHaveBeenCalled();
      expect(mockPlayerAdapter.onPause).toHaveBeenCalled();
      expect(mockPlayerAdapter.onLoadedMetadata).toHaveBeenCalled();
    });
  });

  describe('Event Registration', () => {
    let reportEvent;

    beforeEach(() => {
      reportEvent = jest.fn();
    });

    describe('registerPlayEvent', () => {
      it('should register play event', () => {
        const cleanup = registerPlayEvent(mockPlayerAdapter, reportEvent);
        
        expect(mockPlayerAdapter.onPlay).toHaveBeenCalled();
        
        // Manually trigger the callback that was passed to onPlay
        const playCallback = mockPlayerAdapter.onPlay.mock.calls[0][0];
        playCallback();
        
        expect(reportEvent).toHaveBeenCalledWith(VIDEO_EVENT.PLAY, {});
        expect(typeof cleanup).toBe('function');
      });
    });

    describe('registerPauseEvent', () => {
      it('should register pause event', () => {
        const cleanup = registerPauseEvent(mockPlayerAdapter, reportEvent);
        
        expect(mockPlayerAdapter.onPause).toHaveBeenCalled();
        expect(mockPlayerAdapter.onEmptied).toHaveBeenCalled();
        
        // Manually trigger the callbacks
        const pauseCallback = mockPlayerAdapter.onPause.mock.calls[0][0];
        const emptiedCallback = mockPlayerAdapter.onEmptied.mock.calls[0][0];
        
        pauseCallback();
        emptiedCallback();
        
        expect(reportEvent).toHaveBeenCalledWith(VIDEO_EVENT.PAUSE, {});
        expect(typeof cleanup).toBe('function');
      });
    });

    describe('registerMetadataEvent', () => {
      it('should register metadata event', () => {
        const cleanup = registerMetadataEvent(mockPlayerAdapter, reportEvent);
        
        expect(mockPlayerAdapter.onLoadedMetadata).toHaveBeenCalled();
        
        // Manually trigger the callback
        const metadataCallback = mockPlayerAdapter.onLoadedMetadata.mock.calls[0][0];
        metadataCallback();
        
        expect(reportEvent).toHaveBeenCalledWith(VIDEO_EVENT.LOADED_METADATA, expect.objectContaining({
          videoDuration: expect.any(Number),
          videoUrl: expect.any(String)
        }));
        expect(typeof cleanup).toBe('function');
      });
    });
  });

  describe('connectCloudinaryAnalytics', () => {
    it('should connect analytics with default options', () => {
      expect(() => connectCloudinaryAnalytics(mockVideoRef)).not.toThrow();
    });

    it('should connect analytics with custom options', () => {
      const options = { playerAdapter: mockPlayerAdapter };
      expect(() => connectCloudinaryAnalytics(mockVideoRef, options)).not.toThrow();
    });

    it('should throw with invalid options', () => {
      expect(() => connectCloudinaryAnalytics(mockVideoRef, 'invalid')).toThrow();
    });

    it('should return analytics interface', () => {
      const analytics = connectCloudinaryAnalytics(mockVideoRef, { playerAdapter: mockPlayerAdapter });
      
      expect(analytics).toBeDefined();
      expect(analytics.startManualTracking).toBeDefined();
      expect(analytics.startAutoTracking).toBeDefined();
      expect(analytics.stopManualTracking).toBeDefined();
      expect(typeof analytics.startManualTracking).toBe('function');
      expect(typeof analytics.startAutoTracking).toBe('function');
      expect(typeof analytics.stopManualTracking).toBe('function');
    });

    describe('Manual Tracking', () => {
      let analytics;

      beforeEach(() => {
        analytics = connectCloudinaryAnalytics(mockVideoRef, { playerAdapter: mockPlayerAdapter });
      });

      it('should start manual tracking for regular video', () => {
        const metadata = {
          cloudName: 'test-cloud',
          publicId: 'test-video'
        };
        
        expect(() => analytics.startManualTracking(metadata)).not.toThrow();
      });

      it('should start manual tracking for live stream', () => {
        const metadata = {
          cloudName: 'test-cloud',
          publicId: 'test-stream',
          type: 'live'
        };
        
        expect(() => analytics.startManualTracking(metadata)).not.toThrow();
      });

      it('should throw with invalid metadata', () => {
        expect(() => analytics.startManualTracking('invalid')).toThrow();
      });

      it('should throw with invalid options', () => {
        const metadata = {
          cloudName: 'test-cloud',
          publicId: 'test-video'
        };
        
        expect(() => analytics.startManualTracking(metadata, 'invalid')).toThrow();
      });
    });

    describe('Auto Tracking', () => {
      let analytics;

      beforeEach(() => {
        analytics = connectCloudinaryAnalytics(mockVideoRef, { playerAdapter: mockPlayerAdapter });
      });

      afterEach(() => {
        // Clear any remaining timers and stop tracking
        if (analytics && analytics.stopManualTracking) {
          analytics.stopManualTracking();
        }
      });

      it('should start auto tracking', () => {
        expect(() => analytics.startAutoTracking()).not.toThrow();
        // Fast-forward any setTimeout calls to prevent them from running after test
        jest.runAllTimers();
      });

      it('should throw with invalid options', () => {
        expect(() => analytics.startAutoTracking('invalid')).toThrow();
      });

      it('should throw when starting tracking twice', () => {
        analytics.startAutoTracking();
        
        // Trigger the onLoadStart callback to actually start the tracking session
        const loadStartCallback = mockPlayerAdapter.onLoadStart.mock.calls[0][0];
        loadStartCallback();
        
        expect(() => analytics.startAutoTracking()).toThrow();
        
        // Fast-forward any setTimeout calls
        jest.runAllTimers();
      });
    });

    describe('Stop Tracking', () => {
      let analytics;

      beforeEach(() => {
        analytics = connectCloudinaryAnalytics(mockVideoRef, { playerAdapter: mockPlayerAdapter });
      });

      afterEach(() => {
        // Clear any remaining timers
        jest.runAllTimers();
      });

      it('should stop tracking', () => {
        analytics.startAutoTracking();
        expect(() => analytics.stopManualTracking()).not.toThrow();
        // Fast-forward any setTimeout calls
        jest.runAllTimers();
      });

      it('should not throw when stopping non-active tracking', () => {
        expect(() => analytics.stopManualTracking()).not.toThrow();
      });
    });
  });

  describe('Event Constants', () => {
    it('should define video events', () => {
      expect(VIDEO_EVENT.PLAY).toBe('play');
      expect(VIDEO_EVENT.PAUSE).toBe('pause');
      expect(VIDEO_EVENT.LOADED_METADATA).toBe('loadMetadata');
    });

    it('should define view events', () => {
      expect(VIEW_EVENT.START).toBe('viewStart');
      expect(VIEW_EVENT.END).toBe('viewEnd');
    });
  });
}); 