import React from 'react';
import { StyleSheet, View, Text, Alert, SafeAreaView } from 'react-native';
import { CLDVideoLayer } from '../src/widgets/video/CLDVideoLayer';
import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'demo'
  },
  url: {
    secure: true
  }
});

interface VideoLayerDemoProps {
  onBack?: () => void;
}

export default function VideoLayerDemo({ onBack }: VideoLayerDemoProps) {
  function createMyVideoObject() {
    const myVideo = cld.video('sea_turtle')
    return myVideo
  }

  const handleShare = () => {
    Alert.alert('Share', 'Video sharing feature!');
  };

  return (
    <View style={styles.container}>
      <CLDVideoLayer
        cldVideo={createMyVideoObject()}
        onBack={onBack}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
}); 