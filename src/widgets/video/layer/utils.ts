import { Share, Platform } from 'react-native';
import type { CloudinaryVideo } from '@cloudinary/url-gen';

/**
 * Formats time in milliseconds to MM:SS format
 */
export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Default share handler for video
 */
export const handleDefaultShare = async (cldVideo: CloudinaryVideo): Promise<void> => {
  try {
    const videoUrl = cldVideo.toURL();
    await Share.share({
      message: Platform.OS === 'ios' ? '' : videoUrl,
      url: videoUrl,
    });
  } catch (error) {
    console.warn('Failed to share video:', error);
  }
};

/**
 * Validates seek position to ensure it's within bounds
 */
export const validateSeekPosition = (
  seekPosition: number,
  duration: number,
  bufferMs: number = 100
): number => {
  return Math.max(0, Math.min(seekPosition, duration - bufferMs));
};

/**
 * Checks if two positions are significantly different
 */
export const hasSignificantPositionDifference = (
  position1: number,
  position2: number,
  threshold: number = 100
): boolean => {
  return Math.abs(position1 - position2) > threshold;
};

/**
 * Calculates touch position relative to seekbar
 */
export const calculateSeekProgress = (
  touchX: number,
  seekbarWidth: number
): number => {
  return Math.max(0, Math.min(1, touchX / seekbarWidth));
}; 