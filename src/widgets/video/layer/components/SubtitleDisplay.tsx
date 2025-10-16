import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface SubtitleDisplayProps {
  text?: string;
  isLandscape?: boolean;
  visible?: boolean;
}

export const SubtitleDisplay: React.FC<SubtitleDisplayProps> = ({ 
  text, 
  isLandscape = false,
  visible = true 
}) => {
  if (!visible || !text) {
    return null;
  }

  return (
    <View style={[
      styles.container,
      isLandscape ? styles.containerLandscape : styles.containerPortrait
    ]}>
      <View style={styles.textContainer}>
        <Text style={styles.subtitleText}>
          {text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerPortrait: {
    bottom: 80, // Above bottom controls
  },
  containerLandscape: {
    bottom: 60, // Adjusted for landscape
  },
  textContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    maxWidth: '90%',
  },
  subtitleText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
