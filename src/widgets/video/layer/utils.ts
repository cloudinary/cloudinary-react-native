import { Share, Platform, Dimensions } from 'react-native';
import type { CloudinaryVideo } from '@cloudinary/url-gen';
import { SubtitleOption, QualityOption, ButtonLayoutDirection } from './types';
import { SDKAnalyticsConstants } from '../../../internal/SDKAnalyticsConstants';

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
    // Create analytics object with feature 'G' for CLDVideoLayer
    const videoLayerAnalytics = {
      ...SDKAnalyticsConstants,
      feature: 'G',
    };

    let videoUrl: string;
    try {
      videoUrl = cldVideo.toURL({ trackedAnalytics: videoLayerAnalytics });
    } catch (analyticsError) {
      console.warn('CLDVideoLayer: Failed to generate URL with analytics, falling back:', analyticsError);
      videoUrl = cldVideo.toURL();
    }

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
          const languageCode = attributes.LANGUAGE.replace(/"/g, ''); // Remove quotes from language code
          const displayName = attributes.NAME.replace(/"/g, ''); // Remove quotes from display name
          let subtitleUrl = attributes.URI ? attributes.URI.replace(/"/g, '') : undefined;
          
          // Resolve relative URLs properly
          if (subtitleUrl && !subtitleUrl.startsWith('http')) {
            // Handle URLs that start with /
            if (subtitleUrl.startsWith('/')) {
              // Extract the base domain from the manifest URL
              const urlObj = new URL(manifestUrl);
              subtitleUrl = `${urlObj.protocol}//${urlObj.host}${subtitleUrl}`;
            } else {
              // For other relative URLs, use baseUrl
              subtitleUrl = baseUrl + subtitleUrl;
            }
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
 * Parses HLS manifest to extract quality levels/bitrates
 */
export const parseHLSQualityLevels = async (manifestUrl: string): Promise<QualityOption[]> => {
  try {
    const response = await fetch(manifestUrl);
    if (!response.ok) {
      console.warn('Failed to fetch HLS manifest for quality parsing:', response.status);
      return [];
    }
    
    const manifestText = await response.text();
    const qualityLevels: QualityOption[] = [];
    
    // Parse for stream variants with different qualities
    // Look for EXT-X-STREAM-INF tags that define different quality streams
    const lines = manifestText.split('\n');
    
    // Get base URL for resolving relative URLs
    const baseUrl = manifestUrl.substring(0, manifestUrl.lastIndexOf('/') + 1);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]?.trim();
      
      if (line?.startsWith('#EXT-X-STREAM-INF:')) {
        const attributes = parseM3U8Attributes(line);
        const streamUrl = lines[i + 1]?.trim(); // Next line contains the stream URL
        
        if (streamUrl && attributes.BANDWIDTH) {
          const bandwidth = parseInt(attributes.BANDWIDTH);
          const resolution = attributes.RESOLUTION;
          let qualityLabel = 'Auto';
          let qualityValue = 'auto';
          
          // Determine quality label based on resolution or bandwidth
          if (resolution) {
            const [width, height] = resolution.split('x').map(Number);
            
            // Standard quality mapping based on height (with safety check)
            if (height && height >= 1080) {
              qualityLabel = '1080p';
              qualityValue = '1080p';
            } else if (height && height >= 720) {
              qualityLabel = '720p';
              qualityValue = '720p';
            } else if (height && height >= 480) {
              qualityLabel = '480p';
              qualityValue = '480p';
            } else if (height && height >= 360) {
              qualityLabel = '360p';
              qualityValue = '360p';
            } else if (height && height >= 240) {
              qualityLabel = '240p';
              qualityValue = '240p';
            } else if (height) {
              qualityLabel = `${height}p`;
              qualityValue = `${height}p`;
            }
          } else {
            // Fallback to bandwidth-based labeling
            if (bandwidth >= 2000000) {
              qualityLabel = 'High';
              qualityValue = 'high';
            } else if (bandwidth >= 1000000) {
              qualityLabel = 'Medium';
              qualityValue = 'medium';
            } else {
              qualityLabel = 'Low';
              qualityValue = 'low';
            }
          }
          
          // Resolve relative stream URL
          let fullStreamUrl = streamUrl;
          if (!streamUrl.startsWith('http')) {
            fullStreamUrl = baseUrl + streamUrl;
          }
          
          // Only add if not already present (avoid duplicates)
          if (!qualityLevels.some(level => level.value === qualityValue)) {
            qualityLevels.push({
              value: qualityValue,
              label: qualityLabel,
              bandwidth,
              resolution,
              url: fullStreamUrl
            });
          }
        }
      }
    }
    
    // Sort by bandwidth (highest first) for better UX
    qualityLevels.sort((a, b) => (b.bandwidth || 0) - (a.bandwidth || 0));
    
    return qualityLevels;
  } catch (error) {
    console.warn('Failed to parse HLS quality levels:', error);
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
 * When generating URL from cldVideo, includes feature 'G' analytics for CLDVideoLayer
 */
export const getVideoUrl = (videoUrl: string | undefined, cldVideo: CloudinaryVideo): string => {
  // If videoUrl is provided directly, use it as-is
  if (videoUrl) {
    return videoUrl;
  }

  // Generate URL with CLDVideoLayer analytics (feature 'G')
  try {
    const videoLayerAnalytics = {
      ...SDKAnalyticsConstants,
      feature: 'G',
    };
    
    return cldVideo.toURL({ trackedAnalytics: videoLayerAnalytics });
  } catch (error) {
    console.error('CLDVideoLayer: Error generating video URL with analytics, falling back:', error);
    // Fallback to URL without analytics if there's an issue
    return cldVideo.toURL();
  }
};

// Constants for layout utility functions
const TOP_BUTTON_SIZE = Platform.select({ ios: 44, android: 48 });
const BUTTON_SPACING = Platform.select({ ios: 8, android: 6 });
const BUTTON_MARGIN = Platform.select({ ios: 4, android: 3 });
const TOP_PADDING_IOS = 60;
const TOP_PADDING_ANDROID = 30;
const TOP_PADDING_IOS_LANDSCAPE = 20;
const TOP_PADDING_ANDROID_LANDSCAPE = 6;
const BOTTOM_CONTROLS_PADDING = Platform.select({ ios: 15, android: 12 });
const BOTTOM_CONTROLS_PADDING_LANDSCAPE = Platform.select({ ios: 10, android: 8 });
const SEEKBAR_ALIGNMENT_OFFSET = Platform.select({ ios: 16, android: 14 });
const SEEKBAR_ALIGNMENT_OFFSET_LANDSCAPE = Platform.select({ ios: 12, android: 10 });
const SE_BUTTON_BOTTOM_OFFSET = Platform.select({ ios: 32, android: 28 });
const SE_BUTTON_BOTTOM_OFFSET_LANDSCAPE = Platform.select({ ios: 20, android: 18 });

/**
 * Helper function to determine if device is in landscape
 */
export const isLandscapeOrientation = () => {
  const { width, height } = Dimensions.get('window');
  return width > height;
};

/**
 * Get responsive top padding based on orientation
 */
export const getTopPadding = (isLandscape: boolean = false) => {
  if (Platform.OS === 'ios') {
    return isLandscape ? TOP_PADDING_IOS_LANDSCAPE : TOP_PADDING_IOS;
  }
  return isLandscape ? TOP_PADDING_ANDROID_LANDSCAPE : TOP_PADDING_ANDROID;
};

/**
 * Get responsive bottom controls padding
 */
export const getBottomControlsPadding = (isLandscape: boolean = false) => {
  return isLandscape ? BOTTOM_CONTROLS_PADDING_LANDSCAPE : BOTTOM_CONTROLS_PADDING;
};

/**
 * Get responsive seekbar alignment offset
 */
export const getSeekbarAlignmentOffset = (isLandscape: boolean = false) => {
  return isLandscape ? SEEKBAR_ALIGNMENT_OFFSET_LANDSCAPE : SEEKBAR_ALIGNMENT_OFFSET;
};

/**
 * Get responsive SE button bottom offset
 */
export const getSEButtonBottomOffset = (isLandscape: boolean = false) => {
  return isLandscape ? SE_BUTTON_BOTTOM_OFFSET_LANDSCAPE : SE_BUTTON_BOTTOM_OFFSET;
};

/**
 * Calculate button positions with automatic spacing and layout direction support
 */
export const calculateButtonPosition = (
  position: string,
  index: number,
  totalButtons: number,
  isLandscape: boolean = false,
  layoutDirection: ButtonLayoutDirection = ButtonLayoutDirection.VERTICAL
) => {
  const buttonSize = TOP_BUTTON_SIZE ?? 44;
  const spacing = BUTTON_SPACING ?? 8;
  const margin = BUTTON_MARGIN ?? 4;
  
  // Helper function to calculate horizontal layout
  const getHorizontalLayout = () => {
    const horizontalCenterOffset = ((totalButtons - 1) * (buttonSize + spacing)) / 2;
    return {
      marginLeft: (index * (buttonSize + spacing)) - horizontalCenterOffset,
    };
  };

  // Helper function to calculate vertical layout
  const getVerticalLayout = (baseOffset: number = 0) => {
    const verticalCenterOffset = ((totalButtons - 1) * (buttonSize + spacing)) / 2;
    return {
      marginTop: baseOffset + (index * (buttonSize + spacing)) - verticalCenterOffset,
    };
  };
  
  switch (position) {
    case 'SE':
      // For SE position, account for volume button
      const seBaseOffset = (getSEButtonBottomOffset(isLandscape) ?? 32) + (buttonSize + spacing);
      if (layoutDirection === 'horizontal') {
        return {
          bottom: seBaseOffset,
          ...getHorizontalLayout(),
        };
      }
      // Default to vertical stacking upward
      return {
        bottom: seBaseOffset + (index * (buttonSize + spacing)),
      };
    
    case 'SW':
      // For SW position
      const swBaseOffset = (getSEButtonBottomOffset(isLandscape) ?? 32);
      if (layoutDirection === 'horizontal') {
        return {
          bottom: swBaseOffset,
          ...getHorizontalLayout(),
        };
      }
      // Default to vertical stacking upward
      return {
        bottom: swBaseOffset + (index * (buttonSize + spacing)),
      };
    
    case 'S':
      // For South position
      const sBaseOffset = (getSEButtonBottomOffset(isLandscape) ?? 32);
      if (layoutDirection === 'vertical') {
        return {
          bottom: sBaseOffset + (index * (buttonSize + spacing)),
          alignSelf: 'center',
        };
      }
      // Default to horizontal stacking
      return {
        bottom: sBaseOffset,
        alignSelf: 'center',
        ...getHorizontalLayout(),
      };
    
    case 'NE':
    case 'NW':
      // For top positions
      const topBaseOffset = (getTopPadding(isLandscape) ?? 60) + (isLandscape ? 6 : 8);
      if (layoutDirection === 'horizontal') {
        return {
          top: topBaseOffset,
          ...getHorizontalLayout(),
        };
      }
      // Default to vertical stacking downward
      return {
        top: topBaseOffset + (index * (buttonSize + spacing)),
      };
    
    case 'N':
      // For North position
      const nBaseOffset = (getTopPadding(isLandscape) ?? 60) + (isLandscape ? 6 : 8);
      if (layoutDirection === 'vertical') {
        return {
          top: nBaseOffset + (index * (buttonSize + spacing)),
          alignSelf: 'center',
        };
      }
      // Default to horizontal stacking
      return {
        top: nBaseOffset,
        alignSelf: 'center',
        ...getHorizontalLayout(),
      };
    
    case 'E':
    case 'W':
      // For middle positions
      if (layoutDirection === 'horizontal') {
        return {
          top: '50%',
          marginTop: -22,
          ...getHorizontalLayout(),
        };
      }
      // Default to vertical stacking around center
      const centerOffset = ((totalButtons - 1) * (buttonSize + spacing)) / 2;
      return {
        top: '50%',
        marginTop: -22 + (index * (buttonSize + spacing)) - centerOffset,
      };
    
    default:
      return {};
  }
}; 