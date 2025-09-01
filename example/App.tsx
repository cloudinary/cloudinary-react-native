import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Platform, 
  Dimensions,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AdvancedVideoDemo from './AdvancedVideoDemo';
import VideoLayerDemo from './VideoLayerDemo';
import { ActiveLayerLayoutDemo } from './ActiveLayerLayoutDemo';
import YouTubeLayerDemo from './YouTubeLayerDemo';
import NetflixLayerDemo from './NetflixLayerDemo';

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

type CurrentScreen = 'home' | 'video' | 'videoLayer' | 'buttonLayout' | 'youtubeLayer' | 'netflixLayer';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('home');

  const navigateToScreen = (screen: CurrentScreen) => {
    setCurrentScreen(screen);
  };

  const navigateHome = () => {
    setCurrentScreen('home');
  };

  const navigateToYouTube = () => {
    setCurrentScreen('youtubeLayer');
  };

  const navigateToNetflix = () => {
    setCurrentScreen('netflixLayer');
  };



  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'video':
        return <AdvancedVideoDemo />;
      case 'videoLayer':
        return <VideoLayerDemo onBack={navigateHome} />;
      case 'buttonLayout':
        return <ActiveLayerLayoutDemo onNavigateToYouTube={navigateToYouTube} onBack={navigateHome} />;
      case 'youtubeLayer':
        return <YouTubeLayerDemo onBack={navigateHome} />;
      case 'netflixLayer':
        return <NetflixLayerDemo onBack={navigateHome} />;
      default:
        return renderHomeScreen();
    }
  };

  const renderHomeScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1a1a2e" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Cloudinary</Text>
            <Text style={styles.titleAccent}>Video Studio</Text>
          </View>
          <Text style={styles.subtitle}>
            Professional video experiences for mobile
          </Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <TouchableOpacity
            style={[styles.featureCard, styles.primaryCard]}
            onPress={() => navigateToScreen('video')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, styles.videoIcon]}>
                <Text style={styles.iconText}>▶</Text>
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>Advanced Video Player</Text>
                <Text style={styles.cardSubtitle}>Smart playback & analytics</Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>
              Experience next-gen video playback with real-time analytics, adaptive streaming, and intelligent controls.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, styles.secondaryCard]}
            onPress={() => navigateToScreen('videoLayer')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, styles.layerIcon]}>
                <Text style={styles.iconText}>⚡</Text>
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>Immersive Video Layer</Text>
                <Text style={styles.cardSubtitle}>Full-screen experience</Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>
              Cinematic full-screen video with elegant overlay controls and seamless user interactions.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, styles.accentCard]}
            onPress={() => navigateToScreen('buttonLayout')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, styles.interactiveIcon]}>
                <Text style={styles.iconText}>◉</Text>
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>Interactive Components</Text>
                <Text style={styles.cardSubtitle}>Dynamic controls</Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>
              Explore advanced interactive layer components with custom controls and responsive layouts.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, styles.youtubeCard]}
            onPress={() => navigateToScreen('youtubeLayer')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, styles.youtubeIcon]}>
                <Text style={styles.iconText}>▣</Text>
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>YouTube Integration</Text>
                <Text style={styles.cardSubtitle}>Seamless embedding</Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>
              Professional YouTube video integration with custom branding and enhanced user experience.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, styles.netflixCard]}
            onPress={() => navigateToScreen('netflixLayer')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, styles.netflixIcon]}>
                <Text style={styles.iconText}>N</Text>
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={[styles.cardTitle, styles.netflixCardTitle]}>Netflix Integration</Text>
                <Text style={[styles.cardSubtitle, styles.netflixCardSubtitle]}>Streaming experience</Text>
              </View>
            </View>
            <Text style={[styles.cardDescription, styles.netflixCardDescription]}>
              Authentic Netflix-style streaming interface with advanced playback controls and Netflix branding.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Powered by Cloudinary React Native SDK
          </Text>
          <Text style={styles.footerSubtext}>
            Built for developers, designed for users
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
        <ActiveLayerLayoutDemo onNavigateToYouTube={navigateToYouTube} onBack={navigateHome} />
      </View>
    );
  }

  if (currentScreen === 'youtubeLayer') {
    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar hidden />
        <YouTubeLayerDemo onBack={navigateHome} />
      </View>
    );
  }

  if (currentScreen === 'netflixLayer') {
    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar hidden />
        <NetflixLayerDemo onBack={navigateHome} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#1a1a2e" />
      {currentScreen !== 'home' && (
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={navigateHome}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      )}
      {renderCurrentScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: -1,
  },
  titleAccent: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6366f1',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  featureCard: {
    marginBottom: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryCard: {
    backgroundColor: '#ffffff',
    borderLeftWidth: 6,
    borderLeftColor: '#6366f1',
  },
  secondaryCard: {
    backgroundColor: '#f8fafc',
    borderLeftWidth: 6,
    borderLeftColor: '#06b6d4',
  },
  accentCard: {
    backgroundColor: '#fefce8',
    borderLeftWidth: 6,
    borderLeftColor: '#eab308',
  },
  youtubeCard: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 6,
    borderLeftColor: '#ef4444',
  },
  netflixCard: {
    backgroundColor: '#1a1a1a',
    borderLeftWidth: 6,
    borderLeftColor: '#e50914',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  videoIcon: {
    backgroundColor: '#6366f1',
  },
  layerIcon: {
    backgroundColor: '#06b6d4',
  },
  interactiveIcon: {
    backgroundColor: '#eab308',
  },
  youtubeIcon: {
    backgroundColor: '#ef4444',
  },
  netflixIcon: {
    backgroundColor: '#e50914',
  },
  netflixCardTitle: {
    color: '#ffffff',
  },
  netflixCardSubtitle: {
    color: '#cccccc',
  },
  netflixCardDescription: {
    color: '#aaaaaa',
  },
  iconText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 22,
    fontWeight: 'normal',
  },
  footerContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  footerText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    fontWeight: 'normal',
  },
  backButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#1a1a2e',
  },
  backButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});