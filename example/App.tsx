import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Platform, 
  Dimensions,
  ScrollView,
  SafeAreaView,
  Image
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

// Local orientation hook to avoid import path issues
const useLocalOrientation = () => {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setIsLandscape(width > height);
    };

    // Set initial orientation
    updateOrientation();

    // Listen for orientation changes
    const subscription = Dimensions.addEventListener('change', updateOrientation);

    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  return { isLandscape };
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('home');
  const { isLandscape } = useLocalOrientation();

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
      <StatusBar style="light" backgroundColor="#000000" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        <View style={[styles.headerContainer, isLandscape && styles.headerContainerLandscape]}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, isLandscape && styles.titleLandscape]}>Cloudinary</Text>
            <Text style={[styles.titleAccent, isLandscape && styles.titleAccentLandscape]}>Video Studio</Text>
          </View>
          <Text style={[styles.subtitle, isLandscape && styles.subtitleLandscape]}>
            Professional video experiences for mobile
          </Text>
        </View>
        
        <View style={[styles.featuresContainer, isLandscape && styles.featuresContainerLandscape]}>
          {/* Main Features Grid - All 6 items with consistent large icons */}
          <View style={[styles.mainGridContainer, isLandscape && styles.mainGridContainerLandscape]}>
            <TouchableOpacity
              style={[
                styles.mainGridCard, 
                styles.primaryCard,
                isLandscape && styles.mainGridCardLandscape
              ]}
              onPress={() => navigateToScreen('video')}
              activeOpacity={0.7}
            >
              <View style={[
                styles.mainIconContainer, 
                styles.videoIcon,
                isLandscape && styles.mainIconContainerLandscape
              ]}>
                <Text style={[styles.mainIconText, isLandscape && styles.mainIconTextLandscape]}>▶</Text>
              </View>
              <Text style={[styles.mainTitle, isLandscape && styles.mainTitleLandscape]}>Advanced Video</Text>
              <Text style={[styles.mainSubtitle, isLandscape && styles.mainSubtitleLandscape]}>Native Video Player</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.mainGridCard, 
                styles.secondaryCard,
                isLandscape && styles.mainGridCardLandscape
              ]}
              onPress={() => navigateToScreen('videoLayer')}
              activeOpacity={0.7}
            >
              <View style={[
                styles.mainIconContainer, 
                styles.layerIcon,
                isLandscape && styles.mainIconContainerLandscape
              ]}>
                <Text style={[styles.mainIconText, isLandscape && styles.mainIconTextLandscape]}>⚡</Text>
              </View>
              <Text style={[styles.mainTitle, isLandscape && styles.mainTitleLandscape]}>Immersive Layer</Text>
              <Text style={[styles.mainSubtitle, isLandscape && styles.mainSubtitleLandscape]}>Cloudinary Active Layer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.mainGridCard, 
                styles.accentCard,
                isLandscape && styles.mainGridCardLandscape
              ]}
              onPress={() => navigateToScreen('buttonLayout')}
              activeOpacity={0.7}
            >
              <View style={[
                styles.mainIconContainer, 
                styles.interactiveIcon,
                isLandscape && styles.mainIconContainerLandscape
              ]}>
                <Text style={[styles.mainIconText, isLandscape && styles.mainIconTextLandscape]}>◉</Text>
              </View>
              <Text style={[styles.mainTitle, isLandscape && styles.mainTitleLandscape]}>Interactive UI</Text>
              <Text style={[styles.mainSubtitle, isLandscape && styles.mainSubtitleLandscape]}>Dynamic controls</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.mainGridCard, 
                styles.youtubeCard,
                isLandscape && styles.mainGridCardLandscape
              ]}
              onPress={() => navigateToScreen('youtubeLayer')}
              activeOpacity={0.7}
            >
              <View style={[
                styles.mainIconContainer, 
                styles.youtubeIcon,
                isLandscape && styles.mainIconContainerLandscape
              ]}>
                <Image 
                  source={require('./assets/youtube.png')} 
                  style={[styles.youtubeIconImage, isLandscape && { width: 50, height: 50 }]}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.mainTitle, isLandscape && styles.mainTitleLandscape]}>YouTube</Text>
              <Text style={[styles.mainSubtitle, isLandscape && styles.mainSubtitleLandscape]}>Seamless embed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.mainGridCard, 
                styles.netflixCard,
                isLandscape && styles.mainGridCardLandscape
              ]}
              onPress={() => navigateToScreen('netflixLayer')}
              activeOpacity={0.7}
            >
              <View style={[
                styles.mainIconContainer, 
                styles.netflixIcon,
                isLandscape && styles.mainIconContainerLandscape
              ]}>
                <Image 
                  source={require('./assets/netlfix.png')} 
                  style={[styles.netflixIconImage, isLandscape && { width: 50, height: 50 }]}
                  resizeMode="contain"
                />
              </View>
              <Text style={[
                styles.mainTitle, 
                styles.netflixGridTitle,
                isLandscape && styles.mainTitleLandscape
              ]}>Netflix</Text>
              <Text style={[
                styles.mainSubtitle, 
                styles.netflixGridSubtitle,
                isLandscape && styles.mainSubtitleLandscape
              ]}>Streaming</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.mainGridCard, 
                styles.tiktokCard,
                isLandscape && styles.mainGridCardLandscape
              ]}
              onPress={() => navigateToScreen('tiktokLayer')}
              activeOpacity={0.7}
            >
              <View style={[
                styles.mainIconContainer, 
                styles.tiktokIcon,
                isLandscape && styles.mainIconContainerLandscape
              ]}>
                <Image 
                  source={require('./assets/tiktok-seeklogo.png')} 
                  style={[styles.tiktokIconImage, isLandscape && { width: 50, height: 50 }]}
                  resizeMode="contain"
                />
              </View>
              <Text style={[
                styles.mainTitle, 
                styles.tiktokGridTitle,
                isLandscape && styles.mainTitleLandscape
              ]}>TikTok</Text>
              <Text style={[
                styles.mainSubtitle, 
                styles.tiktokGridSubtitle,
                isLandscape && styles.mainSubtitleLandscape
              ]}>Endless feed</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.footerContainer, isLandscape && styles.footerContainerLandscape]}>
          <Text style={[styles.footerText, isLandscape && styles.footerTextLandscape]}>
            Powered by Cloudinary React Native SDK
          </Text>
          <Text style={[styles.footerSubtext, isLandscape && styles.footerSubtextLandscape]}>
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
      <StatusBar style="light" backgroundColor="#000000" />
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
    backgroundColor: '#000000',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#000000',
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
  // Main Grid Container & Cards - New unified design
  mainGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  mainGridCard: {
    width: '48%',
    marginBottom: 20,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    minHeight: 160,
    justifyContent: 'center',
  },
  mainIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  mainIconText: {
    fontSize: 42,
    color: '#ffffff',
    fontWeight: '700',
  },
  mainTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 18,
  },
  mainSubtitle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
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
    backgroundColor: '#ffffff',
  },
  netflixIcon: {
    backgroundColor: '#1a1a1a',
  },
  tiktokIcon: {
    backgroundColor: '#ffffff',
  },
  // Netflix Special Styling
  netflixIconImage: {
    width: 60,
    height: 60,
  },
  // TikTok Special Styling
  tiktokIconImage: {
    width: 60,
    height: 60,
  },
  // YouTube Special Styling
  youtubeIconImage: {
    width: 60,
    height: 60,
  },
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
  // Landscape-specific styles
  headerContainerLandscape: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleLandscape: {
    fontSize: 28,
  },
  titleAccentLandscape: {
    fontSize: 28,
  },
  subtitleLandscape: {
    fontSize: 16,
    maxWidth: 300,
    textAlign: 'left',
    marginTop: 0,
  },
  featuresContainerLandscape: {
    paddingHorizontal: 32,
    paddingTop: 10,
    paddingBottom: 20,
  },
  mainGridContainerLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  mainGridCardLandscape: {
    width: '30%', // 3 cards per row in landscape
    marginBottom: 16,
    minHeight: 140,
    padding: 20,
  },
  mainIconContainerLandscape: {
    width: 70,
    height: 70,
    marginBottom: 16,
  },
  mainIconTextLandscape: {
    fontSize: 36,
  },
  mainTitleLandscape: {
    fontSize: 14,
  },
  mainSubtitleLandscape: {
    fontSize: 10,
  },
  footerContainerLandscape: {
    paddingHorizontal: 40,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerTextLandscape: {
    fontSize: 14,
    marginBottom: 0,
    textAlign: 'left',
  },
  footerSubtextLandscape: {
    fontSize: 12,
    textAlign: 'right',
  },
  footerContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#000000',
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
    backgroundColor: '#000000',
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