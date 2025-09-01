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
import TikTokLayerDemo from './TikTokLayerDemo';

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

type CurrentScreen = 'home' | 'video' | 'videoLayer' | 'buttonLayout' | 'youtubeLayer' | 'netflixLayer' | 'tiktokLayer';

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

  const navigateToTikTok = () => {
    setCurrentScreen('tiktokLayer');
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
      case 'tiktokLayer':
        return <TikTokLayerDemo onBack={navigateHome} />;
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
          {/* Hero Feature Card */}
          <TouchableOpacity
            style={[styles.heroCard, styles.primaryCard]}
            onPress={() => navigateToScreen('video')}
            activeOpacity={0.75}
          >
            <View style={styles.heroCardContent}>
              <View style={[styles.heroIconContainer, styles.videoIcon]}>
                <Text style={styles.heroIconText}>▶</Text>
              </View>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>Advanced Video Player</Text>
                <Text style={styles.heroSubtitle}>Smart playback & analytics</Text>
                <Text style={styles.heroDescription}>
                  Experience next-gen video playback with real-time analytics and intelligent controls.
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Grid Features */}
          <View style={styles.gridContainer}>
            <TouchableOpacity
              style={[styles.gridCard, styles.secondaryCard]}
              onPress={() => navigateToScreen('videoLayer')}
              activeOpacity={0.7}
            >
              <View style={[styles.gridIconContainer, styles.layerIcon]}>
                <Text style={styles.gridIconText}>⚡</Text>
              </View>
              <Text style={styles.gridTitle}>Immersive Layer</Text>
              <Text style={styles.gridSubtitle}>Full-screen experience</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridCard, styles.accentCard]}
              onPress={() => navigateToScreen('buttonLayout')}
              activeOpacity={0.7}
            >
              <View style={[styles.gridIconContainer, styles.interactiveIcon]}>
                <Text style={styles.gridIconText}>◉</Text>
              </View>
              <Text style={styles.gridTitle}>Interactive UI</Text>
              <Text style={styles.gridSubtitle}>Dynamic controls</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridCard, styles.youtubeCard]}
              onPress={() => navigateToScreen('youtubeLayer')}
              activeOpacity={0.7}
            >
              <View style={[styles.gridIconContainer, styles.youtubeIcon]}>
                <Text style={styles.gridIconText}>▣</Text>
              </View>
              <Text style={styles.gridTitle}>YouTube</Text>
              <Text style={styles.gridSubtitle}>Seamless embedding</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridCard, styles.netflixCard]}
              onPress={() => navigateToScreen('netflixLayer')}
              activeOpacity={0.7}
            >
              <View style={[styles.gridIconContainer, styles.netflixIcon]}>
                <Text style={styles.gridIconText}>N</Text>
              </View>
              <Text style={[styles.gridTitle, styles.netflixGridTitle]}>Netflix</Text>
              <Text style={[styles.gridSubtitle, styles.netflixGridSubtitle]}>Streaming experience</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridCard, styles.tiktokCard]}
              onPress={() => navigateToScreen('tiktokLayer')}
              activeOpacity={0.7}
            >
              <View style={[styles.gridIconContainer, styles.tiktokIcon]}>
                <Text style={styles.gridIconText}>🎵</Text>
              </View>
              <Text style={[styles.gridTitle, styles.tiktokGridTitle]}>TikTok</Text>
              <Text style={[styles.gridSubtitle, styles.tiktokGridSubtitle]}>Endless feed</Text>
            </TouchableOpacity>
          </View>
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

  if (currentScreen === 'tiktokLayer') {
    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar hidden />
        <TikTokLayerDemo onBack={navigateHome} />
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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  // Hero Card Styles
  heroCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 15,
  },
  heroCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 28,
  },
  heroIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  heroIconText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '700',
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 20,
    fontWeight: 'normal',
  },
  // Grid Container & Cards
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  gridIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  gridIconText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
  },
  gridSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  // Card Theme Colors
  primaryCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  accentCard: {
    backgroundColor: '#fefce8',
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  youtubeCard: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  netflixCard: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  tiktokCard: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#ff0050',
  },
  // Icon Colors
  videoIcon: {
    backgroundColor: '#6366f1',
  },
  layerIcon: {
    backgroundColor: '#06b6d4',
  },
  interactiveIcon: {
    backgroundColor: '#f59e0b',
  },
  youtubeIcon: {
    backgroundColor: '#ef4444',
  },
  netflixIcon: {
    backgroundColor: '#e50914',
  },
  tiktokIcon: {
    backgroundColor: '#ff0050',
  },
  // Netflix Special Styling
  netflixGridTitle: {
    color: '#ffffff',
  },
  netflixGridSubtitle: {
    color: '#cccccc',
  },
  tiktokGridTitle: {
    color: '#ffffff',
  },
  tiktokGridSubtitle: {
    color: '#cccccc',
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