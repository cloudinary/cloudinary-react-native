import { StyleSheet, View } from 'react-native';
import {AdvancedImage, upload} from 'cloudinary-react-native';
import {Cloudinary} from '@cloudinary/url-gen';
import {scale} from "@cloudinary/url-gen/actions/resize";
import {cartoonify} from "@cloudinary/url-gen/actions/effect";
import {max} from "@cloudinary/url-gen/actions/roundCorners";
import React, {useRef} from "react";
import CLDVideoPlayer from '../../src/CldVideoPlayer';
import { streamingProfile } from '@cloudinary/url-gen/actions/transcode';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'adimizrahi2'
  },
  url: {
    secure: true
  }
});
export default function App() {

  const videoPlayer = useRef<CLDVideoPlayer>(null);
  function createMyImage() {
    var myImage = cld.image('sample').resize(scale().width(300)).effect(cartoonify()).roundCorners(max());
    return myImage
  }

  function createMyVideoObject() {
    const myVideo = cld.video('sea_turtle_arkyym.m3u8').transcode(streamingProfile("auto"))
    console.log(myVideo.toURL())
    return myVideo
  };

  return (
    <View style={styles.container}>
      <View>
      <AdvancedImage cldImg={createMyImage()} style={{backgroundColor:"black", width:300, height:200}}/>
    </View>
      <View style={styles.videoContainer}>
        <CLDVideoPlayer
          ref={videoPlayer}
          videoUrl="https://res.cloudinary.com/demo/video/upload/sp_auto:subtitles_(code_en-US;file_docs:narration.vtt)/sea_turtle.m3u8"
          videoStyle={styles.video}
          // cldVideo={createMyVideoObject()}
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
