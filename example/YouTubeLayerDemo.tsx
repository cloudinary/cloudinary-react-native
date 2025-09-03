import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
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

interface YouTubeLayerDemoProps {
  onBack: () => void;
}

export default function YouTubeLayerDemo({ onBack }: YouTubeLayerDemoProps) {
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

  function createYouTubeStyleVideo() {
    // Using a demo video that simulates YouTube-style content
    const myVideo = cld.video('samples/cld-sample-video');
    return myVideo;
  }

  // Use CLDVideoLayer's new bottomButtonBar prop for proper integration
  const youtubeStyleButtons: any[] = [];
  
  const bottomButtonBarConfig = {
    enabled: true,
    buttons: [
      {
        icon: 'thumbs-up',
        size: 22,
        color: '#ffffff',
        position: ButtonPosition.S, // Required by type but not used in bottom bar
        onPress: () => console.log('Like pressed'),
      },
      {
        icon: 'thumbs-down',
        size: 22,
        color: '#ffffff',
        position: ButtonPosition.S,
        onPress: () => console.log('Dislike pressed'),
      },
      {
        icon: 'chatbubble',
        size: 22,
        color: '#ffffff',
        position: ButtonPosition.S,
        onPress: () => console.log('Comment pressed'),
      },
      {
        icon: 'bookmark-outline',
        size: 22,
        color: '#ffffff',
        position: ButtonPosition.S,
        onPress: () => console.log('Save pressed'),
      },
      {
        icon: 'share-outline',
        size: 22,
        color: '#ffffff',
        position: ButtonPosition.S,
        onPress: () => console.log('Share pressed'),
      },
      {
        icon: 'ellipsis-horizontal',
        size: 22,
        color: '#ffffff',
        position: ButtonPosition.S,
        onPress: () => console.log('More pressed'),
      },
    ],
    style: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderRadius: 25,
      paddingHorizontal: 20,
      paddingVertical: 12,
      marginHorizontal: 16,
      marginBottom: 0,
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={async () => {
        try {
          await ScreenOrientation.unlockAsync();
        } catch (error) {
          console.warn('Failed to unlock orientation on back:', error);
        }
        onBack();
      }}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* YouTube-style video layer */}
      <CLDVideoLayer
        cldVideo={createYouTubeStyleVideo()}
        buttonGroups={youtubeStyleButtons}
        autoPlay={false}
        muted={false}
        seekBar={{
          timePosition: TimePosition.BELOW
        }}
        bottomButtonBar={bottomButtonBarConfig}
        backButtonPosition={ButtonPosition.NW}
        title="Cloudinary Video SDK - Advanced Features Demo"
        subtitle="Cloudinary"
      />







      {/* Demo info overlay */}
      {!isDemoPlaying && (
        <View style={styles.demoInfoOverlay}>
          <View style={styles.demoInfo}>
            <Text style={styles.demoTitle}>YouTube Integration Demo</Text>
            <Text style={styles.demoDescription}>
              Professional YouTube-style video experience with:
            </Text>
            <Text style={styles.demoFeature}>• Authentic YouTube layout</Text>
            <Text style={styles.demoFeature}>• Video title and channel branding</Text>
            <Text style={styles.demoFeature}>• Like, dislike, comment, save & share</Text>
            <Text style={styles.demoFeature}>• More videos recommendation</Text>
            
            <TouchableOpacity 
              style={styles.playDemoButton}
              onPress={() => setIsDemoPlaying(true)}
            >
              <Text style={styles.playDemoText}>▶ Start Demo</Text>
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
    backgroundColor: '#000000',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },


  videoLayer: {
    flex: 1,
    width: '100%',
  },


  demoInfoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  demoInfo: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 24,
    borderRadius: 16,
    margin: 20,
    alignItems: 'center',
    maxWidth: 320,
  },
  demoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 12,
    textAlign: 'center',
  },
  demoDescription: {
    fontSize: 16,
    color: '#4a4a4a',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  demoFeature: {
    fontSize: 14,
    color: '#6a6a6a',
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  playDemoButton: {
    backgroundColor: '#ff0000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#ff0000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  playDemoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
