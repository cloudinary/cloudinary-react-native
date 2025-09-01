import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ImageStyle>;
}

// PNG Icons (using Image component)
export const TikTokMusicIcon: React.FC<IconProps> = ({ width = 24, height = 24, style }) => (
  <Image
    source={require('../assets/TikTok/tiktok_music.imageset/music animation.png')}
    style={[{ width, height }, style]}
    resizeMode="contain"
  />
);

export const TikTokMoreIcon: React.FC<IconProps> = ({ width = 24, height = 24, style }) => (
  <Image
    source={require('../assets/TikTok/tiktok_more.imageset/icon_more.png')}
    style={[{ width, height }, style]}
    resizeMode="contain"
  />
);

// SVG Icons (simplified versions for React Native)
export const TikTokLikeIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = '#fff' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={color}
    />
  </Svg>
);

export const TikTokCommentsIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = '#fff' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z"
      fill={color}
    />
  </Svg>
);

export const TikTokShareIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = '#fff' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
      fill={color}
    />
  </Svg>
);

export const TikTokHomeIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = '#fff' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
      fill={color}
    />
  </Svg>
);

export const TikTokDiscoverIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = '#fff' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
      fill={color}
    />
  </Svg>
);

export const TikTokInboxIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = '#fff' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z"
      fill={color}
    />
  </Svg>
);

export const TikTokProfileIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = '#fff' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      fill={color}
    />
  </Svg>
);

export const TikTokPlusIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = '#fff' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
      fill={color}
    />
  </Svg>
);
