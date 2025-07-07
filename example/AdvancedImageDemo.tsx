import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AdvancedImage } from 'cloudinary-react-native';
import { Cloudinary } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { cartoonify } from '@cloudinary/url-gen/actions/effect';
import { max } from '@cloudinary/url-gen/actions/roundCorners';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'demo'
  },
  url: {
    secure: true
  }
});

export default function AdvancedImageDemo() {
  const myImage = cld.image('sample')
    .resize(scale().width(300))
    .effect(cartoonify())
    .roundCorners(max());

  return (
    <View style={styles.container}>
      <AdvancedImage cldImg={myImage} style={{ width: 300, height: 200, backgroundColor: 'black' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
