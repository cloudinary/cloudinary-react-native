import React from 'react';
import { Image } from 'react-native';
import { CloudinaryImage } from '@cloudinary/url-gen';
import AdvancedImage from '../AdvancedImage';
import { render } from '@testing-library/react-native';
import TestRenderer from 'react-test-renderer';
describe('AdvancedImage', () => {
    it('should render an Image with the correct URI', () => {
        const cldImg = new CloudinaryImage('sample', { cloudName: 'demo' });
        const component = TestRenderer.create(<AdvancedImage cldImg={cldImg} />);
        const imageComponent = component.root.findByType(Image);
        expect(imageComponent.props.source.uri).toBe(cldImg.toURL());
    });

    it('should forward any other props to the Image', () => {
        const cldImg = new CloudinaryImage( 'sample', { cloudName: 'demo' });
        const { getByTestId } = render(<AdvancedImage cldImg={cldImg} testID="my-image" />);
        const image = getByTestId('my-image');
        expect(image).toBeTruthy();
    });
    it('should throw an error if not passed a CloudinaryImage prop', () => {
        const cldImg = new CloudinaryImage('myImage');
        jest.spyOn(cldImg, 'toURL').mockImplementation(() => {
            throw new Error('Failed to generate image URL');
        });
        expect(() => render(<AdvancedImage cldImg={cldImg} />)).toThrowError(
            'Failed to generate image URL'
        );
    });
});