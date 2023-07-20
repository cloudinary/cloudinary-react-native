  import { StyleSheet, View, Image } from 'react-native';
  import {AdvancedImage} from 'cloudinary-react-native';
  import {Cloudinary} from '@cloudinary/url-gen';
  import {scale} from "@cloudinary/url-gen/actions/resize";
  import {cartoonify} from "@cloudinary/url-gen/actions/effect";
  import {max} from "@cloudinary/url-gen/actions/roundCorners";
  import React from 'react';
  import { UploadApiOptions } from 'api/upload/model/params/upload-params';
  import { Asset } from 'expo-asset';
  import { upload, rename, explicit, unsignedUpload, uploadBase64, uploadLarge } from '../../api/upload/src/uploader';
  import * as FileSystem from 'expo-file-system';
  import { Buffer } from "buffer";
  import { base64ToUint8Array } from 'base64-js';

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
    const getFileContents = async () => {
      const localAsset = Asset.fromModule(require('../assets/temp.jpg'));
      try {
        await localAsset.downloadAsync();
        const fileUri = localAsset.localUri;
        const fileContents = await FileSystem.readAsStringAsync(fileUri!, { encoding: FileSystem.EncodingType.Base64 });
        return fileContents;
        // return fileUri;
      } catch (error) {
        return null;
      }
    };

    const getFilePath = async () => {
      const localAsset = Asset.fromModule(require('../assets/temp.jpg'));
      try {
        await localAsset.downloadAsync();
        const fileUri = localAsset.localUri;
        return fileUri;
      } catch (error) {
        return null;
      }
    };
    const file = await getFileContents();
    const filePath = await getFilePath();

    const extraParams: UploadApiOptions = {
       upload_preset: 'ios_sample',
       unsigned: true,
      useFilename: true,
    }
    await uploadLarge({path: file!, options: extraParams,callback: (error: any, response: any) => {
        console.log(error)
        console.log(response)
    }})

    // await uploadBase64({file: file! , options: extraParams, callback: (error: any, response: any) => {
    //     console.log(error)
    //     console.log(response)
    //   }})
    //
    // await upload({file: 'https://c8.alamy.com/comp/2JD8XXJ/courage-courage-the-cowardly-dog-1999-2JD8XXJ.jpg', options: extraParams, callback: (error: any, response: any) => {
    //     console.log(error)
    //     console.log(response)
    // }})

    // await unsignedUpload({file: file!, upload_preset: 'ios_sample' , options: extraParams, callback: (error: any, response: any) => {
    //     console.log(error)
    //     console.log(response)
    // }})
    // await upload({file: filePath , options: extraParams, callback: (error: any, response: any) => {
    //     console.log(error)
    //     console.log(response)
    //   }})

    // explicit({public_id: "to", options: {type: "upload", eager: [
    //       {
    //         crop: "scale",
    //         width: "2.0"
    //       }
    //     ]}, callback: (error: any, response: any) => {
    //     console.log(response);
    //     console.log(error);
    //   }})

    // rename({from_public_id: "paisbcpgnr2bnvyd0t97", to_public_id: "to", callback: (error: any, response: any) => {
    //   console.log(response)
    //   console.log(error)
    // }});

    // upload({file: file!,options: extraParams,callback: (error: any, response: any) => {
    //   console.log(response);
    //   console.log(error)
    // }});



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
