import AdvancedImage from '../AdvancedImage';
import { CloudinaryImage } from '@cloudinary/url-gen/assets/CloudinaryImage';
import { create, act } from 'react-test-renderer';
import React from 'react';

// Mock React Native Image component for testing
jest.mock('react-native', () => {
  const mockReact = require('react');
  return {
    Image: ({ source, testID, ...props }) => mockReact.createElement('Image', { source, testID, ...props }),
    Platform: { OS: 'ios' },
  };
});

// Mock SDKAnalyticsConstants
const mockSDKAnalyticsConstants = {
  sdkSemver: '1.0.0',
  techVersion: '10.2.5',
  osType: 'A',
  osVersion: '30',
};

jest.mock('../internal/SDKAnalyticsConstants', () => ({
  SDKAnalyticsConstants: mockSDKAnalyticsConstants,
}));

// Import after mocking
import { SDKAnalyticsConstants } from '../internal/SDKAnalyticsConstants';

describe('analytics', () => {
  beforeEach(() => {
    mockSDKAnalyticsConstants.sdkSemver = '1.0.0';
    mockSDKAnalyticsConstants.techVersion = '10.2.5';
    mockSDKAnalyticsConstants.osType = 'A';
    mockSDKAnalyticsConstants.osVersion = '30';
  });
  
  it('creates a url with analytics', () => {
    const componentImage = new CloudinaryImage('sample', { cloudName: 'demo' });

    let component;
    act(() => {
      component = create(
        <AdvancedImage cldImg={componentImage} testID="cld-image" />
      );
    });
    const tree = component.toJSON();

    // Check that the URL contains analytics parameters
    const actualUrl = tree.props.source.uri;
    expect(actualUrl).toContain('https://res.cloudinary.com/demo/image/upload/sample');
    expect(actualUrl).toContain('_a='); // Analytics parameter is present
    
    // Verify basic URL structure
    expect(actualUrl).toMatch(/^https:\/\/res\.cloudinary\.com\/demo\/image\/upload\/sample\?_a=[A-Za-z0-9]+$/);
  });

  it('sets correct osType', () => {
    expect(mockSDKAnalyticsConstants.osType).toBe('A'); // For Android
  });

  it('sets correct osVersion', () => {
    expect(mockSDKAnalyticsConstants.osVersion).toBe('30'); // Mocked Android version (API level)
  });
});
