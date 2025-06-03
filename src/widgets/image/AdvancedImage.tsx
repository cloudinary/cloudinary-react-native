import React from 'react';
import { Image, ImageProps } from 'react-native';
import type { CloudinaryImage } from '@cloudinary/url-gen';
import { SDKAnalyticsConstants } from '../../internal/SDKAnalyticsConstants';

interface AdvancedImageProps extends Omit<ImageProps, 'source'> {
  cldImg: CloudinaryImage;
}

const AdvancedImage: React.FC<AdvancedImageProps> = ({
                                                       cldImg,
                                                       ...rest
                                                     }) => {
  const uri = cldImg.toURL({trackedAnalytics: SDKAnalyticsConstants});
  return (
    <Image
      source={{ uri }}
      {...rest}
    />
  );
};

export default AdvancedImage;
