import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
      cloudName: 'demo'
    },
    url: {
      secure: true
    }
  });

  function createMyVideoObject() {
    const myVideo = cld.video('samples/elephants')
    return myVideo
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
  const subtitlesButtonDemo = {
    subtitles: {
      enabled: true,
      defaultLanguage: 'off',
      languages: [
        { code: 'off', label: 'Off' },
        { code: 'en', label: 'English' },
        { code: 'es', label: 'Spanish' },
        { code: 'fr', label: 'French' },
        { code: 'de', label: 'German' },
      ],
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
      default:
        return {};
    }
  };

  const examples = [
    { id: 'horizontal', title: 'Horizontal Button Groups', description: 'Buttons arranged horizontally in corners' },
    { id: 'vertical', title: 'Vertical Button Groups', description: 'Buttons arranged vertically on sides' },
    { id: 'mixed', title: 'Mixed Layout Directions', description: 'Different layouts for different positions' },
    { id: 'subtitles', title: 'Subtitles Button', description: 'Interactive subtitles selection with language options' },
    { id: 'playbackSpeed', title: 'Playback Speed Button', description: 'Adjustable video playback speed controls' }
  ];

  return (
    <View style={styles.container}>
      {/* Back button */}
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      )}
      
      {/* Header with Example Selector */}
      <View style={styles.header}>
        <Text style={styles.title}> Active Layer Examples</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.examplesContainer}>
          {examples.map(example => (
            <TouchableOpacity
              key={example.id}
              style={[
                styles.exampleButton,
                currentExample === example.id && styles.activeExampleButton
              ]}
              onPress={() => setCurrentExample(example.id)}
            >
              <Text style={[
                styles.exampleButtonText,
                currentExample === example.id && styles.activeExampleButtonText
              ]}>
                {example.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.description}>
          {examples.find(ex => ex.id === currentExample)?.description}
        </Text>
      </View>

      {/* Video Player with Custom Buttons */}
      <View style={styles.videoContainer}>
        <CLDVideoLayer
          cldVideo={createMyVideoObject()}
          autoPlay={false}
          muted={true}
          showCenterPlayButton={true}
          fullScreen={{ enabled: true }}
          {...getVideoLayerProps()}
        />
      </View>

      {/* Code Example */}
      <View style={styles.codeContainer}>
        <Text style={styles.codeTitle}>Code Example:</Text>
        <ScrollView style={styles.codeScroll}>
          <Text style={styles.codeText}>
            {getCodeExample(currentExample)}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

const getCodeExample = (example: string) => {
  switch (example) {
    case 'horizontal':
      return `// Button groups with horizontal layout
<CLDVideoLayer
  cldVideo={cldVideo}
  buttonGroups={[
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
    }
  ]}
/>`;

    case 'vertical':
      return `// Button groups with vertical layout
<CLDVideoLayer
  cldVideo={cldVideo}
  buttonGroups={[
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
        }
      ]
    }
  ]}
/>`;

    case 'mixed':
      return `// Mixed layout directions
<CLDVideoLayer
  cldVideo={cldVideo}
  buttonGroups={[
    {
      position: ButtonPosition.N,
      layoutDirection: ButtonLayoutDirection.HORIZONTAL,
      buttons: [/* horizontal buttons */]
    },
    {
      position: ButtonPosition.S,
      layoutDirection: ButtonLayoutDirection.VERTICAL,
      buttons: [/* vertical buttons */]
    }
  ]}
/>`;

    case 'subtitles':
      return `// Subtitles button with language options
<CLDVideoLayer
  cldVideo={cldVideo}
  subtitles={{
    enabled: true,
    defaultLanguage: 'off',
    languages: [
      { code: 'off', label: 'Off' },
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Spanish' },
      { code: 'fr', label: 'French' },
      { code: 'de', label: 'German' },
    ],
    button: {
      position: ButtonPosition.SE,
      color: '#FF6B6B',
      size: 28,
    }
  }}
/>`;

    case 'playbackSpeed':
      return `// Playback speed button with multiple speeds
<CLDVideoLayer
  cldVideo={cldVideo}
  playbackSpeed={{
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
  }}
/>`;

    default:
      return '';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  examplesContainer: {
    marginBottom: 16,
  },
  exampleButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeExampleButton: {
    backgroundColor: '#2196F3',
  },
  exampleButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeExampleButtonText: {
    color: 'white',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: 'black',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  codeContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    maxHeight: 200,
  },
  codeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  codeScroll: {
    flex: 1,
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#444',
    lineHeight: 16,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
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
});
