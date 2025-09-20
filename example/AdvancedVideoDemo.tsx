import React, { useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AdvancedVideo } from 'cloudinary-react-native';
import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'mobiledemoapp'
  },
  url: {
    secure: true
  }
});

export default function AdvancedVideoDemo() {
  const videoPlayer = useRef<any>(null);

  function createMyVideoObject() {
    const myVideo = cld.video('fzsu0bo1m21oxoxwsznm')
    return myVideo
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Advanced Video Demo</Text>
      
      <View style={styles.videoContainer}>
        <AdvancedVideo
          ref={videoPlayer}
          videoStyle={styles.video}
          cldVideo={createMyVideoObject()}
          useNativeControls={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    paddingVertical: 20,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
}); 