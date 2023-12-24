import { StyleSheet, View } from 'react-native';
import {AdvancedImage, upload} from 'cloudinary-react-native';
import {Cloudinary} from '@cloudinary/url-gen';
import {scale} from "@cloudinary/url-gen/actions/resize";
import {cartoonify} from "@cloudinary/url-gen/actions/effect";
import {max} from "@cloudinary/url-gen/actions/roundCorners";
import React, {useRef} from "react";
import { streamingProfile } from '@cloudinary/url-gen/actions/transcode';
import AdvancedVideo from '../../src/AdvancedVideo';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'demo'
  },
  url: {
    secure: true
  }
});
export default function App() {

  const videoPlayer = useRef<typeof AdvancedVideo>(null);
  function createMyImage() {
    var myImage = cld.image('sample').resize(scale().width(300)).effect(cartoonify()).roundCorners(max());
    return myImage
  }

  function createMyVideoObject() {
    const myVideo = cld.video('sea_turtle.m3u8').transcode(streamingProfile("auto"))
    return myVideo
  };

  return (
    <View style={styles.container}>
      <View>
      <AdvancedImage cldImg={createMyImage()} style={{backgroundColor:"black", width:300, height:200}}/>
    </View>
      <View style={styles.videoContainer}>
        <AdvancedVideo
          ref={videoPlayer}
          videoStyle={styles.video}
          cldVideo={createMyVideoObject()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  video: {
    width: 400,
    height: 220,
  },
});
