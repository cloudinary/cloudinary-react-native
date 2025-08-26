import React from 'react';
import { StyleSheet, View, Text, Alert, SafeAreaView } from 'react-native';
import { CLDVideoLayer, ButtonPosition, TimePosition } from '../src/widgets/video/layer';
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
        seekBar={{
          height: 30,
          color: 'red',
          timePosition: TimePosition.BELOW,
        }}
        playbackSpeed={{
          enabled: true,
          defaultSpeed: 1.0,
          speeds: [
            { value: 0.5, label: '0.5×' },
            { value: 1.0, label: '1.0×' },
            { value: 1.25, label: '1.25×' },
            { value: 1.5, label: '1.5×' },
            { value: 2.0, label: '2.0×' },
          ],
        }}
        subtitles={{
          enabled: true,
          defaultLanguage: 'off',
          languages: [
            { code: 'off', label: 'Off' },
            { code: 'en', label: 'English' },
            { code: 'es', label: 'Spanish' },
            { code: 'ar', label: 'Arabic' },
          ],
        }}
        // fullScreen={{
        //   enabled: true,
        //   landscapeOnly: true,
        //   button: {
        //     icon: 'resize-outline',           // Ionicons name
        //     position: ButtonPosition.SE,     // Bottom-right corner (will auto-space above volume button)
        //     size: 28,                        // Icon size in pixels
        //     color: '#FFD700',               // Icon color
        //     backgroundColor: 'rgba(0,0,0,0.8)', // Button background
        //   },
        //   onEnterFullScreen: () => {
        //     // Custom logic when entering full screen
        //     console.log('Entering full screen');
        //     // Example: Lock orientation using expo-screen-orientation
        //     // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        //   },
        //   onExitFullScreen: () => {
        //     // Custom logic when exiting full screen
        //     console.log('Exiting full screen');
        //     // Example: Unlock orientation
        //     // ScreenOrientation.unlockAsync();
        //   },
        // }}
        // customButtons={[
        //   // Demo: Multiple buttons in SE position - they will auto-stack vertically
        //   // All SE buttons are automatically aligned with the volume button's right edge
        //   {
        //     icon: 'bookmark-outline',
        //     position: ButtonPosition.SE,
        //     color: '#FF6B6B',
        //     size: 24,
        //     onPress: () => Alert.alert('Bookmark', 'Video bookmarked!'),
        //   },
        //   {
        //     icon: 'heart-outline',
        //     position: ButtonPosition.SE,
        //     color: '#FF1493',
        //     size: 24,
        //     onPress: () => Alert.alert('Like', 'Video liked!'),
        //   },
        //   // Demo: Button in different position
        //   {
        //     icon: 'information-circle-outline',
        //     position: ButtonPosition.NE, // This will stack with share button
        //     color: '#00BFFF',
        //     size: 24,
        //     onPress: () => Alert.alert('Info', 'Video information!'),
        //   },
        // ]}
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
