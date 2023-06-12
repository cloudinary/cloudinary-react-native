import { SDKAnalyticsConstants } from '../internal/SDKAnalyticsConstants';
import { Image } from 'react-native';
import AdvancedImage from '../AdvancedImage';
import { CloudinaryImage } from '@cloudinary/url-gen/assets/CloudinaryImage';
import { render } from '@testing-library/react-native';
import React from 'react';

const cloudinaryImage = new CloudinaryImage('sample', { cloudName: 'demo' });

describe('analytics', () => {
    beforeEach(() => {
      SDKAnalyticsConstants.sdkSemver = '1.0.0';
      SDKAnalyticsConstants.techVersion = '10.2.5';
    });
    it('creates a url with analytics', () => {
        const element = render(<AdvancedImage cldImg={cloudinaryImage}></AdvancedImage>);
        const imageComponent = element.root.findByType(Image);
        expect(imageComponent.props.source.uri).toBe(cloudinaryImage.toURL({trackedAnalytics: SDKAnalyticsConstants}));
    });
  });