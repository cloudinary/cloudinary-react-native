import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { CloudinaryVideoPlayer } from 'cloudinary-react-native';
import { ButtonPosition } from '../src/widgets/video/layer/types';

/**
 * Demo showing different full screen button configurations
 */
export const FullScreenButtonDemo = () => {
  const handleEnterFullScreen = () => {
    console.log('Entering full screen mode');
    // Here you can add logic to:
    // - Lock orientation to landscape
    // - Hide status bar
    // - Use expo-screen-orientation if needed
  };

  const handleExitFullScreen = () => {
    console.log('Exiting full screen mode');
    // Here you can add logic to:
    // - Unlock orientation
    // - Show status bar
    // - Restore previous orientation
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Full Screen Button Examples</Text>
      
      {/* Example 1: Default full screen button (top-right, default icon) */}
      <View style={styles.example}>
        <Text style={styles.exampleTitle}>Default Full Screen Button</Text>
        <CloudinaryVideoPlayer
          cldVideo="your-video-id"
          fullScreen={{
            enabled: true, // Default: full screen button enabled
            landscapeOnly: true, // Default: landscape only in full screen
          }}
          style={styles.video}
        />
      </View>

      {/* Example 2: Custom positioned full screen button */}
      <View style={styles.example}>
        <Text style={styles.exampleTitle}>Custom Position & Icon</Text>
        <CloudinaryVideoPlayer
          cldVideo="your-video-id"
          fullScreen={{
            enabled: true,
            landscapeOnly: true,
            button: {
              icon: 'resize-outline',
              position: ButtonPosition.SW, // Bottom-left
              size: 28,
              color: '#FFD700',
              backgroundColor: 'rgba(0, 0, 0, 0.8)'
            },
            onEnterFullScreen: handleEnterFullScreen,
            onExitFullScreen: handleExitFullScreen,
          }}
          style={styles.video}
        />
      </View>

      {/* Example 3: Custom buttons + Full screen */}
      <View style={styles.example}>
        <Text style={styles.exampleTitle}>Multiple Custom Buttons</Text>
        <CloudinaryVideoPlayer
          cldVideo="your-video-id"
          fullScreen={{
            enabled: true,
            button: {
              icon: 'expand',
              position: ButtonPosition.E, // Middle-right
              color: 'white',
            }
          }}
          customButtons={[
            {
              icon: 'information-circle-outline',
              position: ButtonPosition.NW,
              color: '#00BFFF',
              onPress: () => console.log('Info pressed'),
            },
            {
              icon: 'settings-outline',
              position: ButtonPosition.S,
              color: 'white',
              onPress: () => console.log('Settings pressed'),
            },
          ]}
          style={styles.video}
        />
      </View>

      {/* Example 4: Disabled full screen */}
      <View style={styles.example}>
        <Text style={styles.exampleTitle}>Full Screen Disabled</Text>
        <CloudinaryVideoPlayer
          cldVideo="your-video-id"
          fullScreen={{
            enabled: false // No full screen button
          }}
          style={styles.video}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  example: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    borderRadius: 8,
  },
});

export default FullScreenButtonDemo;
