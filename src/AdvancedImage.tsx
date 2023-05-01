import React from 'react';
import { Image, View} from 'react-native';
import type { CloudinaryImage } from '@cloudinary/url-gen';
import 'react-native-url-polyfill/auto';

type ImageProps = {
    cldImg: CloudinaryImage;
    [x: string]: any;
}


const AdvancedImage: React.FC<ImageProps> = (props) => {
    const {
        cldImg,
        ...otherProps // Assume any other props are for the base element
    } = props;
    return (
        <View>
            <Image {...otherProps} source={{ uri: props.cldImg.toURL() }} />
        </View>
    );
}

export default AdvancedImage;