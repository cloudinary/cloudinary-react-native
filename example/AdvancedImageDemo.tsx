import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, StatusBar, Platform } from 'react-native';
import { AdvancedImage } from 'cloudinary-react-native';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill, scale } from '@cloudinary/url-gen/actions/resize';
import { cartoonify, sepia, grayscale, pixelate, blur } from '@cloudinary/url-gen/actions/effect';
import { max } from '@cloudinary/url-gen/actions/roundCorners';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const cld = new Cloudinary({
  cloud: {
    cloudName: 'demo'
  },
  url: {
    secure: true
  }
});

interface Effect {
  id: string;
  title: string;
  description: string;
  transform: (image: any) => any;
}

const effects: Effect[] = [
  {
    id: 'original',
    title: 'Original',
    description: 'No effects applied',
    transform: (img) => img.resize(fill().width(800).height(600))
  },
  {
    id: 'cartoonify',
    title: 'Cartoonify',
    description: 'Transform to cartoon style',
    transform: (img) => img.resize(fill().width(800).height(600)).effect(cartoonify())
  },
  {
    id: 'sepia',
    title: 'Sepia',
    description: 'Vintage sepia tone effect',
    transform: (img) => img.resize(fill().width(800).height(600)).effect(sepia())
  },
  {
    id: 'grayscale',
    title: 'Grayscale',
    description: 'Black and white effect',
    transform: (img) => img.resize(fill().width(800).height(600)).effect(grayscale())
  },
  {
    id: 'pixelate',
    title: 'Pixelate',
    description: 'Retro pixel art effect',
    transform: (img) => img.resize(fill().width(800).height(600)).effect(pixelate())
  },
  {
    id: 'blur',
    title: 'Blur',
    description: 'Soft blur effect',
    transform: (img) => img.resize(fill().width(800).height(600)).effect(blur(500))
  },
];

export default function AdvancedImageDemo() {
  const [selectedEffect, setSelectedEffect] = useState('original');
  const scrollViewRef = useRef<ScrollView>(null);

  // Add mouse drag scrolling for web
  useEffect(() => {
    if (Platform.OS === 'web' && scrollViewRef.current) {
      const scrollElement = (scrollViewRef.current as any).getScrollableNode?.();
      if (scrollElement) {
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        const handleMouseDown = (e: MouseEvent) => {
          isDown = true;
          scrollElement.style.cursor = 'grabbing';
          startX = e.pageX - scrollElement.offsetLeft;
          scrollLeft = scrollElement.scrollLeft;
        };

        const handleMouseLeave = () => {
          isDown = false;
          scrollElement.style.cursor = 'grab';
        };

        const handleMouseUp = () => {
          isDown = false;
          scrollElement.style.cursor = 'grab';
        };

        const handleMouseMove = (e: MouseEvent) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - scrollElement.offsetLeft;
          const walk = (x - startX) * 2;
          scrollElement.scrollLeft = scrollLeft - walk;
        };

        scrollElement.addEventListener('mousedown', handleMouseDown);
        scrollElement.addEventListener('mouseleave', handleMouseLeave);
        scrollElement.addEventListener('mouseup', handleMouseUp);
        scrollElement.addEventListener('mousemove', handleMouseMove);

        return () => {
          scrollElement.removeEventListener('mousedown', handleMouseDown);
          scrollElement.removeEventListener('mouseleave', handleMouseLeave);
          scrollElement.removeEventListener('mouseup', handleMouseUp);
          scrollElement.removeEventListener('mousemove', handleMouseMove);
        };
      }
    }
  }, []);

  const currentEffect = effects.find(e => e.id === selectedEffect) || effects[0];
  const myImage = currentEffect.transform(cld.image('sample'));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Advanced Image</Text>
          <Text style={styles.subtitle}>Powerful transformations with Cloudinary</Text>
        </View>
      </View>

      {/* Image Display */}
      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <AdvancedImage 
            cldImg={myImage} 
            style={styles.image}
          />
        </View>
        <View style={styles.effectLabel}>
          <Text style={styles.effectTitle}>{currentEffect.title}</Text>
          <Text style={styles.effectDescription}>{currentEffect.description}</Text>
        </View>
      </View>

      {/* Effects Selector */}
      <View style={styles.effectsSection}>
        <Text style={styles.sectionTitle}>Image Effects</Text>
        <ScrollView 
          ref={scrollViewRef}
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.effectsScrollView}
          contentContainerStyle={styles.effectsScroll}
          scrollEnabled={true}
          nestedScrollEnabled={true}
        >
          {effects.map((effect) => (
            <TouchableOpacity
              key={effect.id}
              style={[
                styles.effectCard,
                selectedEffect === effect.id && styles.effectCardActive
              ]}
              onPress={() => setSelectedEffect(effect.id)}
            >
              <Text style={[
                styles.effectCardTitle,
                selectedEffect === effect.id && styles.effectCardTitleActive
              ]}>
                {effect.title}
              </Text>
              <Text style={[
                styles.effectCardDescription,
                selectedEffect === effect.id && styles.effectCardDescriptionActive
              ]}>
                {effect.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#000000',
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0d4',
    textAlign: 'center',
    opacity: 0.9,
  },
  imageContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  imageWrapper: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  effectLabel: {
    marginTop: 16,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  effectTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  effectDescription: {
    fontSize: 14,
    color: '#a0a0d4',
  },
  effectsSection: {
    paddingVertical: 20,
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  effectsScrollView: {
    flexGrow: 0,
    ...(Platform.OS === 'web' ? {
      overflowX: 'auto' as any,
      overflowY: 'hidden' as any,
      WebkitOverflowScrolling: 'touch' as any,
      scrollbarWidth: 'thin' as any,
      scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent' as any,
      cursor: 'grab' as any,
      userSelect: 'none' as any,
      touchAction: 'pan-x' as any,
    } : {}),
  },
  effectsScroll: {
    paddingHorizontal: 20,
    paddingBottom: 4,
    flexDirection: 'row',
    ...(Platform.OS === 'web' && {
      display: 'flex' as any,
    }),
  },
  effectCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: Platform.OS === 'web' ? 200 : 180,
    minWidth: Platform.OS === 'web' ? 200 : 180,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexShrink: 0,
  },
  effectCardActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  effectCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e0e0e0',
    marginBottom: 4,
  },
  effectCardTitleActive: {
    color: '#ffffff',
  },
  effectCardDescription: {
    fontSize: 12,
    color: '#a0a0d4',
    opacity: 0.8,
  },
  effectCardDescriptionActive: {
    color: '#e0e0ff',
    opacity: 1,
  },
});
