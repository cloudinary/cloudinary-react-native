import { ExpoAVVideoAdapter } from '../ExpoAVVideoAdapter';
import { ExpoVideoAdapter } from '../ExpoVideoAdapter';
import { FallbackVideoAdapter } from '../FallbackVideoAdapter';

describe('Video Adapter Error Handling Improvements', () => {
  describe('ExpoAVVideoAdapter', () => {
    it('should have getAvailabilityInfo method', () => {
      const adapter = new ExpoAVVideoAdapter();
      
      expect(typeof adapter.getAvailabilityInfo).toBe('function');
      
      const info = adapter.getAvailabilityInfo();
      expect(info).toHaveProperty('available');
      expect(info).toHaveProperty('installationCommand', 'npx expo install expo-av');
      
      if (!info.available) {
        expect(info).toHaveProperty('error');
        expect(typeof info.error).toBe('string');
      }
    });

    it('should throw descriptive error when rendering video with unavailable module', () => {
      const adapter = new ExpoAVVideoAdapter();
      
      // Only test if expo-av is actually not available (which it likely isn't in test environment)
      if (!adapter.isAvailable()) {
        const props = { videoUri: 'test://video.mp4' };
        const ref = { current: null };

        expect(() => {
          adapter.renderVideo(props, ref);
        }).toThrow(/ExpoAVVideoAdapter:.*Please install expo-av:/);
      }
    });

    it('should provide installation command in error message', () => {
      const adapter = new ExpoAVVideoAdapter();
      
      if (!adapter.isAvailable()) {
        const info = adapter.getAvailabilityInfo();
        expect(info.installationCommand).toBe('npx expo install expo-av');
      }
    });
  });

  describe('ExpoVideoAdapter', () => {
    it('should have getAvailabilityInfo method', () => {
      const adapter = new ExpoVideoAdapter();
      
      expect(typeof adapter.getAvailabilityInfo).toBe('function');
      
      const info = adapter.getAvailabilityInfo();
      expect(info).toHaveProperty('available');
      expect(info).toHaveProperty('installationCommand', 'npx expo install expo-video');
      
      if (!info.available) {
        expect(info).toHaveProperty('error');
        expect(typeof info.error).toBe('string');
      }
    });

    it('should throw descriptive error when rendering video with unavailable module', () => {
      const adapter = new ExpoVideoAdapter();
      
      // Only test if expo-video is actually not available (which it likely isn't in test environment)
      if (!adapter.isAvailable()) {
        const props = { videoUri: 'test://video.mp4' };
        const ref = { current: null };

        expect(() => {
          adapter.renderVideo(props, ref);
        }).toThrow(/ExpoVideoAdapter:.*Please install expo-video:/);
      }
    });
  });

  describe('FallbackVideoAdapter', () => {
    it('should always be available and provide installation guidance', () => {
      const adapter = new FallbackVideoAdapter('Custom error message');

      expect(adapter.isAvailable()).toBe(true);
      
      const info = adapter.getAvailabilityInfo();
      expect(info).toEqual({
        available: true,
        error: 'Custom error message',
        installationCommand: 'npx expo install expo-video expo-av'
      });
    });

    it('should use default error message when none provided', () => {
      const adapter = new FallbackVideoAdapter();

      const info = adapter.getAvailabilityInfo();
      expect(info).toEqual({
        available: true,
        error: 'No video player available',
        installationCommand: 'npx expo install expo-video expo-av'
      });
    });
  });

  describe('Error Message Format', () => {
    it('should include adapter name in error messages', () => {
      const expoAVAdapter = new ExpoAVVideoAdapter();
      const expoVideoAdapter = new ExpoVideoAdapter();

      if (!expoAVAdapter.isAvailable()) {
        const props = { videoUri: 'test://video.mp4' };
        const ref = { current: null };
        
        expect(() => {
          expoAVAdapter.renderVideo(props, ref);
        }).toThrow(/ExpoAVVideoAdapter:/);
      }

      if (!expoVideoAdapter.isAvailable()) {
        const props = { videoUri: 'test://video.mp4' };
        const ref = { current: null };
        
        expect(() => {
          expoVideoAdapter.renderVideo(props, ref);
        }).toThrow(/ExpoVideoAdapter:/);
      }
    });

    it('should include installation commands in error messages', () => {
      const expoAVAdapter = new ExpoAVVideoAdapter();
      const expoVideoAdapter = new ExpoVideoAdapter();

      if (!expoAVAdapter.isAvailable()) {
        const props = { videoUri: 'test://video.mp4' };
        const ref = { current: null };
        
        expect(() => {
          expoAVAdapter.renderVideo(props, ref);
        }).toThrow(/npx expo install expo-av/);
      }

      if (!expoVideoAdapter.isAvailable()) {
        const props = { videoUri: 'test://video.mp4' };
        const ref = { current: null };
        
        expect(() => {
          expoVideoAdapter.renderVideo(props, ref);
        }).toThrow(/npx expo install expo-video/);
      }
    });
  });
});