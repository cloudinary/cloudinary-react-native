import React from 'react';
import { Platform, Text } from 'react-native';

// Web-safe icon component
interface IconProps {
  name: string;
  size: number;
  color: string;
  style?: any;
}

// Icon mapping for web fallbacks
const iconMap: { [key: string]: string } = {
  'play': '▶',
  'pause': '⏸',
  'volume-high': '🔊',
  'volume-mute': '🔇',
  'expand': '⛶',
  'contract': '⛶',
  'close': '✕',
  'share-social': '⤴',
  'chevron-back': '‹',
  'settings': '⚙',
  'checkmark': '✓',
  'captions': 'CC',
  'speedometer': '⚡',
};

export const Icon: React.FC<IconProps> = ({ name, size, color, style }) => {
  if (Platform.OS === 'web') {
    // Use text fallback on web
    const iconChar = iconMap[name] || '•';
    return (
      <Text style={[{ fontSize: size * 0.8, color }, style]}>
        {iconChar}
      </Text>
    );
  }

  // On native platforms, use Ionicons
  try {
    const { Ionicons } = require('@expo/vector-icons');
    return <Ionicons name={name as any} size={size} color={color} style={style} />;
  } catch (e) {
    // Fallback if Ionicons is not available
    const iconChar = iconMap[name] || '•';
    return (
      <Text style={[{ fontSize: size * 0.8, color }, style]}>
        {iconChar}
      </Text>
    );
  }
};

