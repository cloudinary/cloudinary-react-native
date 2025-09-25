import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions } from 'react-native';
import { CLDVideoLayer } from '../src/widgets/video/layer/CLDVideoLayer';
import { ButtonPosition, ButtonLayoutDirection } from '../src/widgets/video/layer/types';
import { Cloudinary } from '@cloudinary/url-gen';

interface ActiveLayerLayoutDemoProps {
  onNavigateToYouTube?: () => void;
  onBack?: () => void;
}

export const ActiveLayerLayoutDemo: React.FC<ActiveLayerLayoutDemoProps> = ({ onNavigateToYouTube, onBack }) => {
  const [currentExample, setCurrentExample] = useState('horizontal');

  // Create a sample video
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'mobiledemoapp'
    },
    url: {
      secure: true
    }
  });

  function createMyVideoObject() {
    const myVideo = cld.video('fzsu0bo1m21oxoxwsznm');
    return myVideo;
  }

  // Example 1: Button Groups with Horizontal Layout
  const horizontalButtonGroups = [
    {
      position: ButtonPosition.NE,
      layoutDirection: ButtonLayoutDirection.HORIZONTAL,
      buttons: [
        {
          icon: 'star',
          position: ButtonPosition.NE,
          onPress: () => console.log('Star pressed'),
          color: '#FFD700'
        },
        {
          icon: 'heart',
          position: ButtonPosition.NE,
          onPress: () => console.log('Heart pressed'),
          color: '#FF69B4'
        }
      ]
    },
    {
      position: ButtonPosition.SE,
      layoutDirection: ButtonLayoutDirection.HORIZONTAL,
      buttons: [
        {
          icon: 'bookmark',
          position: ButtonPosition.SE,
          onPress: () => console.log('Bookmark pressed'),
          color: '#32CD32'
        },
        {
          icon: 'download',
          position: ButtonPosition.SE,
          onPress: () => console.log('Download pressed'),
          color: '#1E90FF'
        }
      ]
    }
  ];

  // Example 2: Button Groups with Vertical Layout
  const verticalButtonGroups = [
    {
      position: ButtonPosition.E,
      layoutDirection: ButtonLayoutDirection.VERTICAL,
      buttons: [
        {
          icon: 'camera',
          position: ButtonPosition.E,
          onPress: () => console.log('Camera pressed'),
          color: '#FF6347'
        },
        {
          icon: 'image',
          position: ButtonPosition.E,
          onPress: () => console.log('Image pressed'),
          color: '#9370DB'
        },
        {
          icon: 'videocam',
          position: ButtonPosition.E,
          onPress: () => console.log('Video pressed'),
          color: '#20B2AA'
        }
      ]
    },
    {
      position: ButtonPosition.W,
      layoutDirection: ButtonLayoutDirection.VERTICAL,
      buttons: [
        {
          icon: 'thumbs-up',
          position: ButtonPosition.W,
          onPress: () => console.log('Like pressed'),
          color: '#32CD32'
        },
        {
          icon: 'thumbs-down',
          position: ButtonPosition.W,
          onPress: () => console.log('Dislike pressed'),
          color: '#FF4500'
        }
      ]
    }
  ];

  // Example 3: Mixed Layout Directions
  const mixedLayoutGroups = [
    {
      position: ButtonPosition.N,
      layoutDirection: ButtonLayoutDirection.HORIZONTAL,
      buttons: [
        {
          icon: 'settings',
          position: ButtonPosition.N,
          onPress: () => console.log('Settings pressed'),
          color: '#808080'
        },
        {
          icon: 'help-circle',
          position: ButtonPosition.N,
          onPress: () => console.log('Help pressed'),
          color: '#4169E1'
        }
      ]
    },
    {
      position: ButtonPosition.S,
      layoutDirection: ButtonLayoutDirection.VERTICAL,
      buttons: [
        {
          icon: 'information-circle',
          position: ButtonPosition.S,
          onPress: () => console.log('Info pressed'),
          color: '#4682B4'
        },
        {
          icon: 'warning',
          position: ButtonPosition.S,
          onPress: () => console.log('Warning pressed'),
          color: '#FFA500'
        }
      ]
    }
  ];

  // Example 4: Subtitles Button Demo
  // For HLS videos, subtitles are automatically detected from the manifest
  // No need to specify languages manually - they will be dynamically loaded
  const subtitlesButtonDemo = {
    subtitles: {
      enabled: true,
      defaultLanguage: 'off',
      button: {
        position: ButtonPosition.SE,
        color: '#FF6B6B',
        size: 28,
      }
    }
  };

  // Example 5: Playback Speed Button Demo
  const playbackSpeedDemo = {
    playbackSpeed: {
      enabled: true,
      defaultSpeed: 1.0,
      speeds: [
        { value: 0.25, label: '0.25×' },
        { value: 0.5, label: '0.5×' },
        { value: 0.75, label: '0.75×' },
        { value: 1.0, label: '1.0×' },
        { value: 1.25, label: '1.25×' },
        { value: 1.5, label: '1.5×' },
        { value: 2.0, label: '2.0×' },
      ],
      button: {
        position: ButtonPosition.NE,
        color: '#4CAF50',
        size: 28,
      }
    }
  };

  // Example 6: Quality Selection Demo
  // For HLS videos, quality levels are automatically detected from the manifest
  // No need to specify quality levels manually - they will be dynamically loaded
  const qualitySelectionDemo = {
    quality: {
      enabled: true,
      defaultQuality: 'auto',
      button: {
        position: ButtonPosition.SE,
        color: '#9C27B0',
        size: 28,
      }
    }
  };

  const getVideoLayerProps = () => {
    switch (currentExample) {
      case 'horizontal':
        return {
          buttonGroups: horizontalButtonGroups
        };
      case 'vertical':
        return {
          buttonGroups: verticalButtonGroups
        };
      case 'mixed':
        return {
          buttonGroups: mixedLayoutGroups
        };
      case 'subtitles':
        return subtitlesButtonDemo;
      case 'playbackSpeed':
        return playbackSpeedDemo;
      case 'quality':
        return qualitySelectionDemo;
      default:
        return {};
    }
  };

  const examples = [
    { id: 'horizontal', title: 'Horizontal Layout', description: 'Side-by-side button arrangements for compact interfaces' },
    { id: 'vertical', title: 'Vertical Layout', description: 'Stacked button arrangements for enhanced accessibility' },
    { id: 'mixed', title: 'Hybrid Layouts', description: 'Strategic combination of horizontal and vertical groupings' },
    { id: 'subtitles', title: 'Subtitle Controls', description: 'Professional multi-language subtitle management' },
    { id: 'playbackSpeed', title: 'Speed Controls', description: 'Granular playback speed adjustment for optimal viewing' },
    { id: 'quality', title: 'Quality Selection', description: 'Adaptive bitrate streaming with manual quality selection' }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Professional Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.brandSection}>
            <Text style={styles.brandTitle}>Cloudinary Video SDK</Text>
            <Text style={styles.brandSubtitle}>Interactive Button Layout Showcase</Text>
          </View>
          
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Professional Example Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.examplesContainer}
          contentContainerStyle={styles.examplesContent}
        >
          {examples.map((example, index) => (
            <TouchableOpacity
              key={example.id}
              style={[
                styles.exampleCard,
                currentExample === example.id && styles.activeExampleCard
              ]}
              onPress={() => setCurrentExample(example.id)}
            >
              <View style={styles.exampleNumber}>
                <Text style={[
                  styles.exampleNumberText,
                  currentExample === example.id && styles.activeExampleNumberText
                ]}>
                  {index + 1}
                </Text>
              </View>
              <View style={styles.exampleContent}>
                <Text style={[
                  styles.exampleTitle,
                  currentExample === example.id && styles.activeExampleTitle
                ]}>
                  {example.title}
                </Text>
                <Text style={[
                  styles.exampleDescription,
                  currentExample === example.id && styles.activeExampleDescription
                ]}>
                  {example.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Enhanced Video Player */}
      <View style={styles.videoContainer}>
        <View style={styles.videoWrapper}>
          <CLDVideoLayer
            cldVideo={createMyVideoObject()}
            videoUrl='https://res.cloudinary.com/demo/video/upload/sp_sd:subtitles_((code_en-US;file_outdoors.vtt);(code_es;file_outdoors-es.vtt))/sea_turtle.m3u8'
            autoPlay={false}
            muted={true}
            showCenterPlayButton={true}
            fullScreen={{ enabled: true }}
            {...getVideoLayerProps()}
          />
        </View>
        
        {/* Feature Indicator */}
        <View style={styles.featureIndicator}>
          <Text style={styles.featureTitle}>
            {examples.find(ex => ex.id === currentExample)?.title}
          </Text>
          <Text style={styles.featureDescription}>
            {examples.find(ex => ex.id === currentExample)?.description}
          </Text>
        </View>
      </View>
    </View>
  );
};



const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    backgroundColor: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  brandSection: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  brandSubtitle: {
    fontSize: 16,
    color: '#a0a0d4',
    fontWeight: '500',
    opacity: 0.9,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  examplesContainer: {
    flexGrow: 0,
  },
  examplesContent: {
    paddingLeft: 4,
  },
  exampleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: SCREEN_WIDTH * 0.7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeExampleCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366f1',
    transform: [{ scale: 1.02 }],
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  exampleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exampleNumberText: {
    color: '#a0a0d4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeExampleNumberText: {
    color: '#ffffff',
  },
  exampleContent: {
    flex: 1,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e0e0e0',
    marginBottom: 4,
  },
  activeExampleTitle: {
    color: '#ffffff',
  },
  exampleDescription: {
    fontSize: 12,
    color: '#a0a0d4',
    opacity: 0.8,
    lineHeight: 16,
  },
  activeExampleDescription: {
    color: '#e0e0ff',
    opacity: 1,
  },
  videoContainer: {
    flex: 1,
    margin: 20,
    marginTop: 16,
  },
  videoWrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
  featureIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#a0a0d4',
    lineHeight: 18,
  },
});
