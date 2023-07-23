  import { StyleSheet, View } from 'react-native';
  import {AdvancedImage} from 'cloudinary-react-native';
  import {Cloudinary} from '@cloudinary/url-gen';
  import {scale} from "@cloudinary/url-gen/actions/resize";
  import {cartoonify} from "@cloudinary/url-gen/actions/effect";
  import {max} from "@cloudinary/url-gen/actions/roundCorners";
  import React from 'react';
  import { UploadApiOptions } from '../../api/upload/model/params/upload-params';
  import { upload } from '../../api/upload/src/uploader';
  import { Asset } from 'expo-asset';

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'adimizrahi2'
    },
    url: {
      secure: true
    }
  });
  export default function App() {

    uploadImage();

    function createMyImage() {

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

    const extraParams: UploadApiOptions = {
       upload_preset: 'ios_sample',
       unsigned: true,
    }

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
    await upload(cld, {file: filePath , options: extraParams, callback: (error: any, response: any) => {
        console.log(error)
        console.log(response)
      }})

    // explicit({public_id: "to", options: {type: "upload", eager: [
    //       {
    //         crop: "scale",
    //         width: "2.0"
    //       }
    //     ]}, callback: (error: any, response: any) => {
    //     console.log(response);
    //     console.log(error);
    //   }})

    // rename(cld, {from_public_id: "to", to_public_id: "now", callback: (error: any, response: any) => {
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
