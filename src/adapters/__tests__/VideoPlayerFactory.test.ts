import { VideoPlayerFactory, VideoPlayerType } from '../VideoPlayerFactory';

describe('VideoPlayerFactory', () => {
  describe('getAvailableAdapter', () => {
    it('should return a video adapter', () => {
      const adapter = VideoPlayerFactory.getAvailableAdapter();
      expect(adapter).toBeDefined();
      expect(adapter.getAdapterName()).toBeDefined();
      expect(adapter.isAvailable()).toBeDefined();
    });

    it('should return fallback adapter when no video libraries are available', () => {
      const adapter = VideoPlayerFactory.getAvailableAdapter();
      // Since we're in a test environment without expo-video or expo-av,
      // it should return a fallback adapter
      expect(adapter.getAdapterName()).toBe(VideoPlayerType.FALLBACK);
    });
  });

  describe('getAvailableAdapters', () => {
    it('should return list of adapters with availability status', () => {
      const adapters = VideoPlayerFactory.getAvailableAdapters();
      expect(Array.isArray(adapters)).toBe(true);
      expect(adapters.length).toBeGreaterThan(0);
      
      adapters.forEach(adapter => {
        expect(adapter.name).toBeDefined();
        expect(typeof adapter.available).toBe('boolean');
      });
    });
  });

  describe('isAdapterAvailable', () => {
    it('should return boolean for adapter availability', () => {
      const isExpoVideoAvailable = VideoPlayerFactory.isAdapterAvailable(VideoPlayerType.EXPO_VIDEO);
      const isExpoAVAvailable = VideoPlayerFactory.isAdapterAvailable(VideoPlayerType.EXPO_AV);
      
      expect(typeof isExpoVideoAvailable).toBe('boolean');
      expect(typeof isExpoAVAvailable).toBe('boolean');
    });
  });
});
