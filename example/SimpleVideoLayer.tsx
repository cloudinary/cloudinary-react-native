import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { AdvancedVideo } from 'cloudinary-react-native';
import type { CloudinaryVideo } from '@cloudinary/url-gen';

interface SimpleVideoLayerProps {
  cldVideo: CloudinaryVideo;
  videoUrl?: string;
  onBack?: () => void;
  onShare?: () => void;
}

export const SimpleVideoLayer = ({
  cldVideo,
  videoUrl,
  onBack,
  onShare
}: SimpleVideoLayerProps) => {
  return (
    <View style={styles.container}>
      <AdvancedVideo
        cldVideo={cldVideo}
        videoUrl={videoUrl}
        videoStyle={StyleSheet.absoluteFill}
      />

      <View style={styles.overlay}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={onBack} style={styles.controlButton}>
            <Text style={styles.controlText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlText}>Mute</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.centerControls}>
          <TouchableOpacity style={styles.playButton}>
            <Text style={styles.playText}>▶️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity onPress={onShare} style={styles.controlButton}>
            <Text style={styles.controlText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topRow: {
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  centerControls: {
    alignSelf: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  controlButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  controlText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  playButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 20,
    borderRadius: 50,
  },
  playText: {
    fontSize: 24,
  },
}); 