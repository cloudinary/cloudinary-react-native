import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar, Image } from 'react-native';
import { CLDVideoLayer, ButtonPosition, TimePosition } from '../src/widgets/video/layer';
import { Cloudinary } from '@cloudinary/url-gen';
import { ButtonLayoutDirection } from '../src/widgets/video/layer/types';
import * as ScreenOrientation from 'expo-screen-orientation';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'demo'
  },
  url: {
    secure: true
  }
});

interface NetflixLayerDemoProps {
  onBack: () => void;
}

export default function NetflixLayerDemo({ onBack }: NetflixLayerDemoProps) {
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);

  // Lock orientation to landscape when component mounts
  useEffect(() => {
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (error) {
        console.warn('Failed to lock orientation:', error);
      }
    };

    lockOrientation();

    // Cleanup: unlock orientation when component unmounts
    return () => {
      ScreenOrientation.unlockAsync().catch((error) => {
        console.warn('Failed to unlock orientation:', error);
      });
    };
  }, []);

  function createNetflixStyleVideo() {
    // Using a demo video that simulates Netflix-style content
    const myVideo = cld.video('samples/cld-sample-video');
    return myVideo;
  }

  // Netflix-style button configuration for bottom bar
  const netflixStyleButtons: any[] = [];
  
  const bottomButtonBarConfig = {
    enabled: true,
    buttons: [
      {
        icon: 'cut-outline',
        size: 20,
        color: '#ffffff',
        position: ButtonPosition.S,
        text: 'Clip',
        textColor: '#ffffff',
        onPress: () => console.log('Clip pressed'),
      },
      {
        icon: 'speedometer-outline', 
        size: 20,
        color: '#ffffff',
        position: ButtonPosition.S,
        text: 'Speed (1x)',
        textColor: '#ffffff',
        onPress: () => console.log('Speed pressed'),
      },
      {
        icon: 'list-outline',
        size: 20,
        color: '#ffffff',
        position: ButtonPosition.S,
        text: 'Episodes',
        textColor: '#ffffff',
        onPress: () => console.log('Episodes pressed'),
      },
      {
        icon: 'chatbox-outline',
        size: 20,
        color: '#ffffff',
        position: ButtonPosition.S,
        text: 'Audio & Subtitles',
        textColor: '#ffffff',
        onPress: () => console.log('Audio & Subtitles pressed'),
      },
      {
        icon: 'play-forward-outline',
        size: 20,
        color: '#ffffff',
        position: ButtonPosition.S,
        text: 'Next Ep.',
        textColor: '#ffffff',
        onPress: () => console.log('Next Episode pressed'),
      },
    ],
    style: {
      backgroundColor: 'rgba(0,0,0,0.9)',
      borderRadius: 0,
      paddingHorizontal: 20,
      paddingVertical: 16,
      marginHorizontal: 0,
      marginBottom: 0,
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Netflix logo - positioned top-left like real Netflix */}
      <View style={styles.netflixLogoContainer}>
        <Image 
          source={require('./assets/netlfix.png')} 
          style={styles.netflixLogo}
          resizeMode="contain"
        />
      </View>

      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Netflix-style video layer */}
      <CLDVideoLayer
        cldVideo={createNetflixStyleVideo()}
        buttonGroups={netflixStyleButtons}
        autoPlay={false}
        muted={false}
        seekBar={{
          timePosition: TimePosition.BELOW,
          color: '#e50914', // Netflix red
          height: 4,
        }}
        bottomButtonBar={bottomButtonBarConfig}
        backButtonPosition={ButtonPosition.NW}
        title="S7:E9 'Mort: Ragnarick'"
        subtitle=""
        titleLeftOffset={75} // Position title to the right of Netflix logo
        fullScreen={{
          enabled: true,
          landscapeOnly: true,
        }}
        playbackSpeed={{
          enabled: true,
          defaultSpeed: 1.0,
          speeds: [
            { value: 0.5, label: '0.5×' },
            { value: 0.75, label: '0.75×' },
            { value: 1.0, label: 'Normal' },
            { value: 1.25, label: '1.25×' },
            { value: 1.5, label: '1.5×' },
          ]
        }}
        subtitles={{
          enabled: true,
          defaultLanguage: 'off',
          languages: [
            { code: 'off', label: 'Off' },
            { code: 'en', label: 'English' },
            { code: 'es', label: 'Spanish' },
            { code: 'fr', label: 'French' },
            { code: 'de', label: 'German' },
          ]
        }}
      />

      {/* Demo info overlay */}
      {!isDemoPlaying && (
        <View style={styles.demoInfoOverlay}>
          <View style={styles.demoInfo}>
            <View style={styles.netflixLogoDemoContainer}>
              <Image 
                source={require('./assets/netlfix.png')} 
                style={styles.netflixLogoDemoImage}
                resizeMode="contain"
              />
            </View>
            
            <Text style={styles.demoTitle}>Netflix Integration Demo</Text>
            <Text style={styles.demoDescription}>
              Authentic Netflix-style streaming experience featuring:
            </Text>
            <Text style={styles.demoFeature}>• Netflix red accent colors</Text>
            <Text style={styles.demoFeature}>• Like/dislike and My List functionality</Text>
            <Text style={styles.demoFeature}>• Download for offline viewing</Text>
            <Text style={styles.demoFeature}>• Multi-language subtitles</Text>
            <Text style={styles.demoFeature}>• Variable playback speeds</Text>
            <Text style={styles.demoFeature}>• More info and sharing options</Text>
            
            <TouchableOpacity 
              style={styles.playDemoButton}
              onPress={() => setIsDemoPlaying(true)}
            >
              <Text style={styles.playDemoText}>▶ Watch Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414', // Netflix dark background
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  netflixLogoContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1000,
  },
  netflixLogo: {
    width: 45,
    height: 45,
    shadowColor: '#e50914',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  demoInfoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  demoInfo: {
    backgroundColor: '#1a1a1a',
    padding: 24,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#333333',
  },
  netflixLogoDemoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  netflixLogoDemoImage: {
    width: 120,
    height: 40,
  },
  demoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  demoDescription: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  demoFeature: {
    fontSize: 14,
    color: '#aaaaaa',
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  playDemoButton: {
    backgroundColor: '#e50914', // Netflix red
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 20,
    shadowColor: '#e50914',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  playDemoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
