import { StyleSheet, View } from 'react-native';
import { AdvancedImage, upload, UploadApiOptions } from 'cloudinary-react-native';
import {Cloudinary} from '@cloudinary/url-gen';
import {scale} from "@cloudinary/url-gen/actions/resize";
import {cartoonify} from "@cloudinary/url-gen/actions/effect";
import {max} from "@cloudinary/url-gen/actions/roundCorners";
import React, {useRef} from "react";
import { streamingProfile } from '@cloudinary/url-gen/actions/transcode';
import AdvancedVideo from '../../src/AdvancedVideo';
import { Video } from 'expo-av';
import { Asset } from 'expo-asset';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'demo'
  },
  url: {
    secure: true
  }
});
export default function App() {


  async function uploadImage() {
    const getFilePath = async () => {
      const localAsset = Asset.fromModule(require('../assets/icon.png'));
      try {
        await localAsset.downloadAsync();
        const fileUri = localAsset.localUri;
        return fileUri;
      } catch (error) {
        return null;
      }
    };
    const filePath = await getFilePath();
    console.log(filePath)
    // const file = await getFile();
    // console.log(file)
    const options: UploadApiOptions = {
      upload_preset: 'ios_sample',
      resource_type: 'image',
      unsigned: true,
    }
    await upload(cld, {
      file: filePath, options: options,
      callback: (error: any, response: any) => {
        console.log(response)
        console.log(error)
        //.. handle response
      }
    })
  }

  uploadImage();

  const videoPlayer = useRef<Video>(null);
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
