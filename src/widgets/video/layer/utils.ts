import { Share, Platform } from 'react-native';
import type { CloudinaryVideo } from '@cloudinary/url-gen';
import { SubtitleOption } from './types';

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

/**
 * Checks if a video URL is an HLS stream (ends with .m3u8)
 */
export const isHLSVideo = (videoUrl: string | undefined): boolean => {
  if (!videoUrl) return false;
  return videoUrl.toLowerCase().endsWith('.m3u8');
};

/**
 * Parses HLS manifest to extract subtitle tracks
 */
export const parseHLSManifest = async (manifestUrl: string): Promise<SubtitleOption[]> => {
  try {
    const response = await fetch(manifestUrl);
    if (!response.ok) {
      console.warn('Failed to fetch HLS manifest:', response.status);
      return [];
    }
    
    const manifestText = await response.text();
    const subtitleTracks: SubtitleOption[] = [];
    
    // Parse for subtitle tracks
    // Look for EXT-X-MEDIA tags with TYPE=SUBTITLES
    const lines = manifestText.split('\n');
    
    // Get base URL for resolving relative URLs
    const baseUrl = manifestUrl.substring(0, manifestUrl.lastIndexOf('/') + 1);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]?.trim();
      
      if (line?.startsWith('#EXT-X-MEDIA:') && line.includes('TYPE=SUBTITLES')) {
        const attributes = parseM3U8Attributes(line);
        
        if (attributes.LANGUAGE && attributes.NAME) {
          const languageCode = attributes.LANGUAGE;
          const displayName = attributes.NAME.replace(/"/g, ''); // Remove quotes
          let subtitleUrl = attributes.URI ? attributes.URI.replace(/"/g, '') : undefined;
          
          // Resolve relative URLs
          if (subtitleUrl && !subtitleUrl.startsWith('http')) {
            subtitleUrl = baseUrl + subtitleUrl;
          }
          
          // Only add if not already present
          if (!subtitleTracks.some(track => track.code === languageCode)) {
            subtitleTracks.push({
              code: languageCode,
              label: displayName,
              url: subtitleUrl
            });
          }
        }
      }
    }
    
    return subtitleTracks;
  } catch (error) {
    console.warn('Failed to parse HLS manifest:', error);
    return [];
  }
};

/**
 * Helper function to parse M3U8 attributes from a line
 */
const parseM3U8Attributes = (line: string): Record<string, string> => {
  const attributes: Record<string, string> = {};
  
  // Remove the tag part (everything before the first colon)
  const attributesPart = line.split(':', 2)[1];
  if (!attributesPart) return attributes;
  
  // Split by comma, but handle quoted values
  const pairs = attributesPart.match(/[A-Z-]+=(?:"[^"]*"|[^,]*)/g) || [];
  
  pairs.forEach(pair => {
    const [key, value] = pair.split('=', 2);
    if (key && value) {
      attributes[key.trim()] = value.trim();
    }
  });
  
  return attributes;
};

/**
 * Determines the final video URL to use, prioritizing videoUrl over generated URL
 */
export const getVideoUrl = (videoUrl: string | undefined, cldVideo: CloudinaryVideo): string => {
  return videoUrl || cldVideo.toURL();
}; 