import React from 'react';
import { Platform, Text, StyleSheet } from 'react-native';

// Web-safe icon component
interface IconProps {
  name: string;
  size: number;
  color: string;
  style?: any;
}

// Try to import Ionicons (works on both native and web with Expo)
let Ionicons: any;
try {
  const vectorIcons = require('@expo/vector-icons');
  Ionicons = vectorIcons.Ionicons;
} catch (e) {
  // Ionicons not available, will use fallback
}

// Comprehensive icon mapping for web fallbacks using Unicode symbols
// Only used as last resort if @expo/vector-icons fails to load
const iconMap: { [key: string]: string } = {
  // Playback controls
  'play': '▶',
  'play-outline': '▶',
  'pause': '⏸',
  'pause-outline': '⏸',
  
  // Volume controls
  'volume-high': '🔊',
  'volume-high-outline': '🔊',
  'volume-mute': '🔇',
  'volume-mute-outline': '🔇',
  
  // Fullscreen
  'expand': '⛶',
  'expand-outline': '⛶',
  'contract': '⛶',
  'contract-outline': '⛶',
  
  // Navigation
  'close': '✕',
  'close-outline': '✕',
  'chevron-back': '‹',
  'chevron-back-outline': '‹',
  'arrow-back': '←',
  'arrow-back-outline': '←',
  
  // Social
  'share-social': '↗',
  'share-social-outline': '↗',
  'share-outline': '↗',
  'share': '↗',
  
  // Settings
  'settings': '⚙',
  'settings-outline': '⚙',
  'cog': '⚙',
  'cog-outline': '⚙',
  
  // Checkmark
  'checkmark': '✓',
  'checkmark-outline': '✓',
  
  // Captions
  'captions': 'CC',
  'captions-outline': 'CC',
  'closed-caption': 'CC',
  'closed-caption-outline': 'CC',
  'chatbox': '💬',
  'chatbox-outline': '💬',
  
  // Speed
  'speedometer': '⚡',
  'speedometer-outline': '⚡',
  
  // Common UI icons
  'star': '⭐',
  'star-outline': '⭐',
  'heart': '❤️',
  'heart-outline': '♡',
  'bookmark': '🔖',
  'bookmark-outline': '🔖',
  'download': '⬇',
  'download-outline': '⬇',
  'camera': '📷',
  'camera-outline': '📷',
  'image': '🖼',
  'image-outline': '🖼',
  'videocam': '📹',
  'videocam-outline': '📹',
  'thumbs-up': '👍',
  'thumbs-up-outline': '👍',
  'thumbs-down': '👎',
  'thumbs-down-outline': '👎',
  'help-circle': '❓',
  'help-circle-outline': '❓',
  'information-circle': 'ℹ️',
  'information-circle-outline': 'ℹ️',
  'warning': '⚠️',
  'warning-outline': '⚠️',
};

export const Icon: React.FC<IconProps> = ({ name, size, color, style }) => {
  // Try to use Ionicons if available (works on both native and web with Expo)
  if (Ionicons) {
    return <Ionicons name={name as any} size={size} color={color} style={style} />;
  }

  // Fallback to Unicode symbols if Ionicons is not available
  const iconChar = iconMap[name] || '•';
  return (
    <Text 
      style={[
        webIconStyles.icon,
        { 
          fontSize: size, 
          color,
          lineHeight: size,
        }, 
        style
      ]}
    >
      {iconChar}
    </Text>
  );
};

const webIconStyles = StyleSheet.create({
  icon: {
    fontFamily: Platform.OS === 'web' ? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' : undefined,
    textAlign: 'center',
    userSelect: 'none',
  } as any,
});

