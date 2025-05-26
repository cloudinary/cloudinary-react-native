import React from 'react';
import { Image } from 'react-native';
import { CloudinaryImage } from '@cloudinary/url-gen';
import AdvancedImage from '../AdvancedImage';
import { render } from '@testing-library/react-native';

describe('AdvancedImage', () => {
  it('should render an Image with the correct URI', () => {
    const cldImg = new CloudinaryImage('sample', { cloudName: 'demo' }, { analytics: false });
    const { UNSAFE_getByType } = render(<AdvancedImage cldImg={cldImg} />);
    const imageComponent = UNSAFE_getByType(Image);
    expect(imageComponent.props.source.uri).toBe(cldImg.toURL());
  });

  it('should forward any other props to the Image', () => {
    const cldImg = new CloudinaryImage('sample', { cloudName: 'demo' }, { analytics: false });
    const { getByTestId } = render(<AdvancedImage cldImg={cldImg} testID="my-image" />);
    const image = getByTestId('my-image');
    expect(image).toBeTruthy();
  });

  it('should throw an error if not passed a CloudinaryImage prop', () => {
    const errorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    const cldImg = new CloudinaryImage('myImage');
    jest.spyOn(cldImg, 'toURL').mockImplementation(() => {
      throw new Error('Failed to generate image URL');
    });

    expect(() => render(<AdvancedImage cldImg={cldImg} />)).toThrow('Failed to generate image URL');

    errorMock.mockRestore();
  });
});
