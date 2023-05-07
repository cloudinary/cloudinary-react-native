import React from 'react';
import { Image, ImageProps, View} from 'react-native';
import type { CloudinaryImage } from '@cloudinary/url-gen';
import 'react-native-url-polyfill/auto';

interface AdvancedImageProps extends Omit<ImageProps, 'source'> { cldImg: CloudinaryImage; }
const AdvancedImage: React.FC<AdvancedImageProps> = (props) => {
    const {
        cldImg,
        ...rest // Assume any other props are for the base element
    } = props;
    return (
        <View>
            <Image {...rest} source={{ uri: cldImg.toURL() }} />
        </View>
    );
}

export default AdvancedImage;