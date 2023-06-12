import { StyleSheet, View, Image } from 'react-native';
import {AdvancedImage} from 'cloudinary-react-native';
import {Cloudinary} from '@cloudinary/url-gen';
import {scale} from "@cloudinary/url-gen/actions/resize";
import {cartoonify} from "@cloudinary/url-gen/actions/effect";
import {max} from "@cloudinary/url-gen/actions/roundCorners";
import React from 'react';
import { makeRequest } from '../../api/upload/src/uploader';
import { UploadApiOptions } from 'api/upload/model/params/upload-params';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';


export default function App() {

  uploadImage();

  function createMyImage() {
    const cld = new Cloudinary({
        cloud: {
          cloudName: 'demo'
        },
        url: {
          secure: true // force https, set to false to force http
        }
      });
      var myImage = cld.image('sample').resize(scale().width(300)).effect(cartoonify()).roundCorners(max());
      return myImage
}
  return (
    <View style={styles.container}>
      <AdvancedImage cldImg={createMyImage()} style={{backgroundColor:"black", width:300, height:200}}/>
    </View>
  );
}

async function uploadImage() {
  const getFile =  async () => {
    const localAsset = Asset.fromModule(require('../assets/logo.png'));
    try {
      await localAsset.downloadAsync();
      const fileUri = localAsset.localUri;
      const fileContents = await FileSystem.readAsStringAsync(fileUri!, { encoding: FileSystem.EncodingType.Base64 });
      return fileContents;
    } catch (error) {
      return null;
    }
  };
  const file = await getFile();

  const extraParams: UploadApiOptions = {
    upload_preset: 'ios_sample'
  }

  makeRequest(file,  'POST', { Accept: 'application/json', 'Content-Type': 'application/json' }, extraParams, (error: any, response: any) => {
    console.log("================");
    console.log(error);
    console.log("================");
    console.log(response);
    console.log("================");
  });
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
