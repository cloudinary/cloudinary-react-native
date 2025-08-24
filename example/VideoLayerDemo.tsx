import React from 'react';
import { StyleSheet, View, Text, Alert, SafeAreaView } from 'react-native';
import { CLDVideoLayer, ButtonPosition } from '../src/widgets/video/layer';
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
        // onShare={handleShare}
        // Example: Position back button in top-left (NW) and share button in top-right (NE)
        backButtonPosition={ButtonPosition.NW}
        shareButtonPosition={ButtonPosition.NE}
        showCenterPlayButton={true}
        // Other positioning options:
        // ButtonPosition.N - Top center
        // ButtonPosition.SE - Bottom right (above bottom controls)
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
