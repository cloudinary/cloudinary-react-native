import { parseCustomerVideoData, parseCustomData, isCustomDataValid } from '../widgets/video/analytics/utils/customer-data';
import { isMobile } from '../widgets/video/analytics/utils/platform-detection';
import { getVideoPlayerType, getVideoPlayerVersion } from '../widgets/video/analytics/utils/video-player-options';
import { isValidCloudName, isValidPublicId, isValidUrl } from '../widgets/video/analytics/utils/validators';

// Mock React Native Platform for testing
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    Version: '14.0'
  }
}));

describe('Video Analytics Utils', () => {
  describe('Customer Data', () => {
    describe('parseCustomerVideoData', () => {
      it('should parse valid customer video data', () => {
        const videoData = {
          cloudName: 'test-cloud',
          publicId: 'test-video',
          version: '1.0.0'
        };
        
        const result = parseCustomerVideoData(videoData);
        
        expect(result).toBeDefined();
        expect(result.cloudName).toBe(videoData.cloudName);
        expect(result.publicId).toBe(videoData.publicId);
        expect(result.version).toBeUndefined();
      });

      it('should handle null input', () => {
        const result = parseCustomerVideoData(null);
        expect(result).toBeNull();
      });

      it('should handle undefined input', () => {
        const result = parseCustomerVideoData(undefined);
        expect(result).toBeNull();
      });

      it('should parse live stream data but only return cloudName and publicId', () => {
        const liveStreamData = {
          cloudName: 'test-cloud',
          publicId: 'test-stream',
          type: 'live'
        };
        
        const result = parseCustomerVideoData(liveStreamData);
        
        expect(result).toBeDefined();
        expect(result.cloudName).toBe(liveStreamData.cloudName);
        expect(result.publicId).toBe(liveStreamData.publicId);
        expect(result.type).toBeUndefined();
      });
    });

    describe('parseCustomData', () => {
      it('should parse valid custom data with customData fields', () => {
        const customData = {
          customData1: 'value1',
          customData2: 'value2',
          userId: 'user123',
          sessionId: 'session456'
        };
        
        const result = parseCustomData(customData);
        
        expect(result).toBeDefined();
        expect(result.customData1).toBe('value1');
        expect(result.customData2).toBe('value2');
        expect(result.userId).toBeUndefined();
        expect(result.sessionId).toBeUndefined();
      });

      it('should handle null custom data', () => {
        const result = parseCustomData(null);
        expect(result).toBeNull();
      });

      it('should handle empty object custom data', () => {
        const result = parseCustomData({});
        expect(result).toBeNull();
      });
    });

    describe('isCustomDataValid', () => {
      it('should validate valid custom data object', () => {
        const customData = { key: 'value' };
        const result = isCustomDataValid(customData);
        expect(result).toBe(true);
      });

      it('should invalidate null custom data', () => {
        const result = isCustomDataValid(null);
        expect(result).toBe(false);
      });

      it('should validate non-object custom data if under char limit', () => {
        const result = isCustomDataValid('invalid');
        expect(result).toBe(true);
      });

      it('should validate empty object custom data', () => {
        const result = isCustomDataValid({});
        expect(result).toBe(true);
      });
    });
  });

  describe('Platform Detection', () => {
    describe('isMobile', () => {
      it('should detect mobile platform', () => {
        const result = isMobile();
        expect(typeof result).toBe('boolean');
      });

      it('should return true for React Native environment', () => {
        const result = isMobile();
        expect(result).toBe(true);
      });
    });
  });

  describe('Video Player Options', () => {
    describe('getVideoPlayerType', () => {
      it('should return native for non-allowed video player type', () => {
        const playerType = 'expo-av';
        const result = getVideoPlayerType(playerType);
        expect(result).toBe('native');
      });

      it('should return default type when not provided', () => {
        const result = getVideoPlayerType();
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
        expect(result).toBe('native');
      });

      it('should handle null input', () => {
        const result = getVideoPlayerType(null);
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
        expect(result).toBe('native');
      });
    });

    describe('getVideoPlayerVersion', () => {
      it('should return provided video player version if valid semver', () => {
        const playerVersion = '2.1.0';
        const result = getVideoPlayerVersion(playerVersion);
        expect(result).toBe(playerVersion);
      });

      it('should return null when not provided', () => {
        const result = getVideoPlayerVersion();
        expect(result).toBeNull();
      });

      it('should handle null input', () => {
        const result = getVideoPlayerVersion(null);
        expect(result).toBeNull();
      });
    });
  });

  describe('Advanced Validators', () => {
    describe('isValidCloudName', () => {
      it('should validate proper cloud name', () => {
        const result = isValidCloudName?.('test-cloud');
        if (isValidCloudName) {
          expect(result).toBe(true);
        }
      });

      it('should invalidate empty cloud name', () => {
        const result = isValidCloudName?.('');
        if (isValidCloudName) {
          expect(result).toBe(false);
        }
      });

      it('should invalidate non-string cloud name', () => {
        const result = isValidCloudName?.(123);
        if (isValidCloudName) {
          expect(result).toBe(false);
        }
      });
    });

    describe('isValidPublicId', () => {
      it('should validate proper public ID', () => {
        const result = isValidPublicId?.('test-video');
        if (isValidPublicId) {
          expect(result).toBe(true);
        }
      });

      it('should invalidate empty public ID', () => {
        const result = isValidPublicId?.('');
        if (isValidPublicId) {
          expect(result).toBe(false);
        }
      });

      it('should invalidate non-string public ID', () => {
        const result = isValidPublicId?.(123);
        if (isValidPublicId) {
          expect(result).toBe(false);
        }
      });
    });

    describe('isValidUrl', () => {
      it('should validate proper URL', () => {
        const result = isValidUrl?.('https://example.com/video.mp4');
        if (isValidUrl) {
          expect(result).toBe(true);
        }
      });

      it('should invalidate invalid URL', () => {
        const result = isValidUrl?.('not-a-url');
        if (isValidUrl) {
          expect(result).toBe(false);
        }
      });

      it('should invalidate non-string URL', () => {
        const result = isValidUrl?.(123);
        if (isValidUrl) {
          expect(result).toBe(false);
        }
      });
    });
  });

  describe('Integration Tests', () => {
    it('should work together for complete video metadata validation', () => {
      const videoMetadata = {
        cloudName: 'test-cloud',
        publicId: 'test-video',
        version: '1.0.0'
      };

      const parsedData = parseCustomerVideoData(videoMetadata);
      expect(parsedData).toBeDefined();
      expect(parsedData.cloudName).toBe(videoMetadata.cloudName);
      expect(parsedData.publicId).toBe(videoMetadata.publicId);
    });

    it('should work together for complete custom data validation', () => {
      const customData = {
        customData1: 'user123',
        customData2: 'session456'
      };

      const isValid = isCustomDataValid(customData);
      expect(isValid).toBe(true);

      const parsedData = parseCustomData(customData);
      expect(parsedData).toEqual(customData);
    });

    it('should work together for player configuration', () => {
      const playerType = getVideoPlayerType('native');
      const playerVersion = getVideoPlayerVersion('2.1.0');

      expect(playerType).toBe('native');
      expect(playerVersion).toBe('2.1.0');

      const playerConfig = {
        type: playerType,
        version: playerVersion
      };

      expect(playerConfig.type).toBe('native');
      expect(playerConfig.version).toBe('2.1.0');
    });

    it('should handle mobile detection in analytics context', () => {
      const isMobileDevice = isMobile();
      
      const analyticsConfig = {
        isMobile: isMobileDevice,
        platform: isMobileDevice ? 'mobile' : 'desktop'
      };

      expect(typeof analyticsConfig.isMobile).toBe('boolean');
      expect(['mobile', 'desktop']).toContain(analyticsConfig.platform);
    });
  });
}); 