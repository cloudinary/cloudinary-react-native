  import { StyleSheet, View } from 'react-native';
  import {AdvancedImage} from 'cloudinary-react-native';
  import {Cloudinary} from '@cloudinary/url-gen';
  import {scale} from "@cloudinary/url-gen/actions/resize";
  import {cartoonify} from "@cloudinary/url-gen/actions/effect";
  import {max} from "@cloudinary/url-gen/actions/roundCorners";
  import React from 'react';

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'adimizrahi2'
    },
    url: {
      secure: true
    }
  });
  export default function App() {
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
