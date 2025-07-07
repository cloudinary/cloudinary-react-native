import React from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
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

export default function VideoLayerDemo() {
  function createMyVideoObject() {
    const myVideo = cld.video('sea_turtle')
    return myVideo
  }

  const handleBack = () => {
    Alert.alert('Back', 'Back button pressed!');
  };

  const handleShare = () => {
    Alert.alert('Share', 'Video sharing feature!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoLayerContainer}>
        <CLDVideoLayer
          cldVideo={createMyVideoObject()}
          onBack={handleBack}
          onShare={handleShare}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  videoLayerContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
}); 