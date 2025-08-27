import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AdvancedImageDemo from './AdvancedImageDemo';
import AdvancedVideoDemo from './AdvancedVideoDemo';
import VideoLayerDemo from './VideoLayerDemo';
import { ButtonLayoutDemo } from './ButtonLayoutDemo';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const getTopPadding = () => {
  if (Platform.OS === 'ios') {
    if (screenHeight >= 812 || screenWidth >= 390) {
      return 60;
    }
    return 40;
  }
  return 35;
};

type CurrentScreen = 'home' | 'image' | 'video' | 'videoLayer' | 'buttonLayout';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('home');

  const navigateToScreen = (screen: CurrentScreen) => {
    setCurrentScreen(screen);
  };

  const navigateHome = () => {
    setCurrentScreen('home');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'image':
        return <AdvancedImageDemo />;
      case 'video':
        return <AdvancedVideoDemo />;
      case 'videoLayer':
        return <VideoLayerDemo onBack={navigateHome} />;
      case 'buttonLayout':
        return <ButtonLayoutDemo />;
      default:
        return renderHomeScreen();
    }
  };

  const renderHomeScreen = () => (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Cloudinary React Native SDK</Text>
        <Text style={styles.subtitle}>Widget Examples</Text>
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.imageButton]}
          onPress={() => navigateToScreen('image')}
        >
          <Text style={styles.buttonTitle}>📸 Advanced Image</Text>
          <Text style={styles.buttonDescription}>
            Showcase image transformations and effects
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.videoButton]}
          onPress={() => navigateToScreen('video')}
        >
          <Text style={styles.buttonTitle}>🎥 Advanced Video</Text>
          <Text style={styles.buttonDescription}>
            Video playback with analytics and controls
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.videoLayerButton]}
          onPress={() => navigateToScreen('videoLayer')}
        >
          <Text style={styles.buttonTitle}>🎬 Video Layer</Text>
          <Text style={styles.buttonDescription}>
            Full-screen video with overlay controls
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonLayoutButton]}
          onPress={() => navigateToScreen('buttonLayout')}
        >
          <Text style={styles.buttonTitle}>🎯 Button Layout Demo</Text>
          <Text style={styles.buttonDescription}>
            Flexible button positioning and arrangements
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          Built with Cloudinary React Native SDK
        </Text>
      </View>
    </View>
  );

  if (currentScreen === 'videoLayer') {
    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar style="auto" />
        <VideoLayerDemo onBack={navigateHome} />
      </View>
    );
  }

  if (currentScreen === 'buttonLayout') {
    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar style="auto" />
        <ButtonLayoutDemo />
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar style="auto" />
      {currentScreen !== 'home' && (
        <TouchableOpacity style={styles.backButton} onPress={navigateHome}>
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
      )}
      {renderCurrentScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: getTopPadding(),
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  button: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  videoButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  videoLayerButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  buttonLayoutButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  fullScreenPlayerButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  buttonDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  footerContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 16,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
