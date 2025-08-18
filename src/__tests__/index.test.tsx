import React from 'react';
import { CloudinaryImage } from '@cloudinary/url-gen';
import AdvancedImage from '../AdvancedImage';
import { create, act } from 'react-test-renderer';

// Mock React Native Image component for testing
jest.mock('react-native', () => {
  const mockReact = require('react');
  return {
    Image: ({ source, testID, ...props }) => mockReact.createElement('Image', { source, testID, ...props }),
    Platform: { OS: 'ios' },
  };
});

// Mock SDKAnalyticsConstants to prevent initialization issues
jest.mock('../internal/SDKAnalyticsConstants', () => ({
  SDKAnalyticsConstants: {
    sdkSemver: '1.0.0',
    techVersion: '10.0.0',
    osType: 'A',
    osVersion: '30',
  },
}));

describe('AdvancedImage', () => {
  it('should render an Image with the correct URI', () => {
    const cldImg = new CloudinaryImage('sample', { cloudName: 'demo' }, { analytics: false });
    let component;
    
    act(() => {
      component = create(<AdvancedImage cldImg={cldImg} />);
    });
    
    const tree = component.toJSON();
    
    expect(tree.type).toBe('Image');
    expect(tree.props.source.uri).toBe(cldImg.toURL());
  });

  it('should forward any other props to the Image', () => {
    const cldImg = new CloudinaryImage('sample', { cloudName: 'demo' }, { analytics: false });
    let component;
    
    act(() => {
      component = create(<AdvancedImage cldImg={cldImg} testID="my-image" style={{ width: 100 }} />);
    });
    
    const tree = component.toJSON();
    
    expect(tree.props.testID).toBe('my-image');
    expect(tree.props.style).toEqual({ width: 100 });
  });

  it('should throw an error if not passed a CloudinaryImage prop', () => {
    const errorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    const cldImg = new CloudinaryImage('myImage');
    jest.spyOn(cldImg, 'toURL').mockImplementation(() => {
      throw new Error('Failed to generate image URL');
    });

    expect(() => {
      act(() => {
        create(<AdvancedImage cldImg={cldImg} />);
      });
    }).toThrow('Failed to generate image URL');

    errorMock.mockRestore();
  });
});
