# CLDVideoLayer

A comprehensive video player component with customizable controls, overlay buttons, and advanced features for React Native applications using Cloudinary videos.

## Features

- **Full Video Controls**: Play/pause, seek, volume, playback speed
- **Flexible Button Positioning**: Place buttons anywhere on the video overlay
- **Horizontal/Vertical Button Layouts**: Control how multiple buttons are arranged
- **Share Functionality**: Built-in sharing capabilities
- **Playback Speed Control**: Customizable playback speeds (0.5x, 1x, 1.25x, 1.5x, 2x, etc.)
- **Subtitle Support**: Automatic HLS subtitle parsing and custom subtitle languages
- **Quality Selection**: Automatic HLS quality detection and manual quality selection
- **Full Screen Support**: Landscape-optimized full screen mode
- **Auto-hide Controls**: Controls automatically fade after 3 seconds
- **Responsive Design**: Adapts to portrait and landscape orientations
- **Bottom Button Bar**: Additional button bar positioned below the seekbar

## Basic Usage

```tsx
import { CLDVideoLayer, ButtonPosition } from './path/to/CLDVideoLayer';
import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
  cloud: { cloudName: 'your-cloud-name' },
  url: { secure: true }
});

function MyVideoPlayer() {
  const myVideo = cld.video('your-video-id');
  
  return (
    <CLDVideoLayer
      cldVideo={myVideo}
      onBack={() => navigation.goBack()}
      backButtonPosition={ButtonPosition.NW}
      shareButtonPosition={ButtonPosition.NE}
    />
  );
}
```

## Button Positioning

### Available Positions

```tsx
enum ButtonPosition {
  NE = 'NE', // North East (top-right)
  NW = 'NW', // North West (top-left)
  N = 'N',   // North (top-center)
  SE = 'SE', // South East (bottom-right)
  SW = 'SW', // South West (bottom-left)
  S = 'S',   // South (bottom-center)
  E = 'E',   // East (middle-right)
  W = 'W'    // West (middle-left)
}
```

### Single Button Example

```tsx
<CLDVideoLayer
  cldVideo={myVideo}
  backButtonPosition={ButtonPosition.NW}
  shareButtonPosition={ButtonPosition.NE}
/>
```

## Button Groups (Multiple Buttons)

### Vertical Layout (Default)

```tsx
<CLDVideoLayer
  cldVideo={myVideo}
  buttonGroups={[
    {
      position: ButtonPosition.SE,
      layoutDirection: ButtonLayoutDirection.VERTICAL, // Default
      buttons: [
        {
          icon: 'heart-outline',
          position: ButtonPosition.SE,
          color: '#FF1493',
          onPress: () => Alert.alert('Liked!')
        },
        {
          icon: 'bookmark-outline',
          position: ButtonPosition.SE,
          color: '#FF6B6B',
          onPress: () => Alert.alert('Bookmarked!')
        }
      ]
    }
  ]}
/>
```

### Horizontal Layout

```tsx
<CLDVideoLayer
  cldVideo={myVideo}
  buttonGroups={[
    {
      position: ButtonPosition.N,
      layoutDirection: ButtonLayoutDirection.HORIZONTAL,
      buttons: [
        {
          icon: 'settings-outline',
          position: ButtonPosition.N,
          onPress: () => openSettings()
        },
        {
          icon: 'information-circle-outline',
          position: ButtonPosition.N,
          onPress: () => showInfo()
        }
      ]
    }
  ]}
/>
```

## Share Button

### Default Share Behavior

```tsx
// Uses built-in share functionality
<CLDVideoLayer
  cldVideo={myVideo}
  shareButtonPosition={ButtonPosition.NE}
/>
```

### Custom Share Handler

```tsx
<CLDVideoLayer
  cldVideo={myVideo}
  shareButtonPosition={ButtonPosition.NE}
  onShare={() => {
    // Custom share logic
    Share.share({
      message: 'Check out this video!',
      url: 'https://your-video-url.com'
    });
  }}
/>
```

## Playback Speed Control

```tsx
<CLDVideoLayer
  cldVideo={myVideo}
  playbackSpeed={{
    enabled: true,
    defaultSpeed: 1.0,
    speeds: [
      { value: 0.5, label: '0.5×' },
      { value: 1.0, label: 'Normal' },
      { value: 1.25, label: '1.25×' },
      { value: 1.5, label: '1.5×' },
      { value: 2.0, label: '2×' }
    ],
    button: {
      icon: 'speedometer-outline',
      color: '#00BFFF'
    }
  }}
/>
```

## Subtitles

### Manual Subtitle Configuration

```tsx
<CLDVideoLayer
  cldVideo={myVideo}
  subtitles={{
    enabled: true,
    defaultLanguage: 'en',
    languages: [
      { code: 'off', label: 'Off' },
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Spanish' },
      { code: 'fr', label: 'French' },
      { code: 'ar', label: 'Arabic' }
    ],
    button: {
      icon: 'text-outline',
      color: '#FFD700'
    }
  }}
/>
```

### Automatic HLS Subtitle Detection

For HLS videos (.m3u8), subtitles are automatically detected from the manifest:

```tsx
// Subtitles will be automatically parsed from HLS manifest
<CLDVideoLayer
  cldVideo={hlsVideo} // HLS video with embedded subtitles
  subtitles={{
    enabled: true,
    defaultLanguage: 'off'
  }}
/>
```

## Quality Selection

### Manual Quality Configuration

```tsx
<CLDVideoLayer
  cldVideo={myVideo}
  quality={{
    enabled: true,
    defaultQuality: 'auto',
    qualities: [
      { value: 'auto', label: 'Auto' },
      { value: '1080p', label: '1080p HD' },
      { value: '720p', label: '720p' },
      { value: '480p', label: '480p' },
      { value: '360p', label: '360p' }
    ],
    button: {
      icon: 'settings-outline',
      color: '#00FF00'
    }
  }}
/>
```

### Automatic HLS Quality Detection

For HLS videos, quality levels are automatically detected:

```tsx
// Quality levels will be automatically parsed from HLS manifest
<CLDVideoLayer
  cldVideo={hlsVideo}
  quality={{
    enabled: true,
    defaultQuality: 'auto'
  }}
/>
```

## Full Screen Support

```tsx
<CLDVideoLayer
  cldVideo={myVideo}
  fullScreen={{
    enabled: true,
    landscapeOnly: true, // Force landscape in full screen
    button: {
      icon: 'expand-outline',
      position: ButtonPosition.SE,
      color: '#FFFFFF'
    },
    onEnterFullScreen: () => {
      // Custom logic for entering full screen
      console.log('Entering full screen');
      // Example: Lock orientation
      // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    },
    onExitFullScreen: () => {
      // Custom logic for exiting full screen
      console.log('Exiting full screen');
      // Example: Unlock orientation
      // ScreenOrientation.unlockAsync();
    }
  }}
/>
```

## Seekbar Customization

```tsx
<CLDVideoLayer
  cldVideo={myVideo}
  seekBar={{
    height: 30,
    width: '90%', // or specific pixel value like 300
    color: '#FF0000',
    timePosition: TimePosition.BELOW // or ABOVE, NONE
  }}
/>
```

## Bottom Button Bar

Add a button bar positioned below the seekbar:

```tsx
<CLDVideoLayer
  cldVideo={myVideo}
  bottomButtonBar={{
    enabled: true,
    buttons: [
      {
        icon: 'download-outline',
        color: 'white',
        size: 20,
        text: 'Download',
        textColor: 'white',
        onPress: () => downloadVideo()
      },
      {
        icon: 'star-outline',
        color: '#FFD700',
        size: 20,
        text: 'Rate',
        onPress: () => rateVideo()
      },
      {
        icon: 'share-social-outline',
        color: '#00BFFF',
        size: 20,
        onPress: () => shareToSocial()
      }
    ],
    style: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderRadius: 25,
      paddingHorizontal: 20,
      paddingVertical: 12,
      marginHorizontal: 20,
      marginBottom: 10
    }
  }}
/>
```

## Title and Subtitle

```tsx
<CLDVideoLayer
  cldVideo={myVideo}
  title="My Amazing Video"
  subtitle="Educational Content"
  titleLeftOffset={100} // Custom positioning offset
/>
```

## Complete Advanced Example

```tsx
<CLDVideoLayer
  cldVideo={myVideo}
  onBack={() => navigation.goBack()}
  backButtonPosition={ButtonPosition.NW}
  shareButtonPosition={ButtonPosition.NE}
  showCenterPlayButton={true}
  
  // Custom seekbar
  seekBar={{
    height: 25,
    color: '#FF6B6B',
    timePosition: TimePosition.BELOW
  }}
  
  // Full screen support
  fullScreen={{
    enabled: true,
    landscapeOnly: true,
    onEnterFullScreen: () => lockOrientation(),
    onExitFullScreen: () => unlockOrientation()
  }}
  
  // Playback speed control
  playbackSpeed={{
    enabled: true,
    defaultSpeed: 1.0,
    speeds: [
      { value: 0.5, label: '0.5×' },
      { value: 1.0, label: 'Normal' },
      { value: 1.5, label: '1.5×' },
      { value: 2.0, label: '2×' }
    ]
  }}
  
  // Subtitle support
  subtitles={{
    enabled: true,
    defaultLanguage: 'off'
  }}
  
  // Quality selection
  quality={{
    enabled: true,
    defaultQuality: 'auto'
  }}
  
  // Multiple button groups
  buttonGroups={[
    {
      position: ButtonPosition.SE,
      layoutDirection: ButtonLayoutDirection.VERTICAL,
      buttons: [
        {
          icon: 'heart-outline',
          position: ButtonPosition.SE,
          color: '#FF1493',
          onPress: () => likeVideo()
        },
        {
          icon: 'bookmark-outline',
          position: ButtonPosition.SE,
          color: '#FF6B6B',
          onPress: () => bookmarkVideo()
        }
      ]
    }
  ]}
  
  // Bottom button bar
  bottomButtonBar={{
    enabled: true,
    buttons: [
      {
        icon: 'download-outline',
        text: 'Download',
        onPress: () => downloadVideo()
      },
      {
        icon: 'star-outline',
        text: 'Rate',
        color: '#FFD700',
        onPress: () => rateVideo()
      }
    ],
    style: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8
    }
  }}
  
  // Title and subtitle
  title="Advanced Video Demo"
  subtitle="With all features enabled"
  titleLeftOffset={80}
/>
```

## Props Reference

| Prop | Type | Description |
|------|------|-------------|
| `cldVideo` | `CloudinaryVideo` | Cloudinary video object (required) |
| `videoUrl` | `string` | Alternative video URL |
| `autoPlay` | `boolean` | Auto-play video on load |
| `muted` | `boolean` | Start video muted |
| `onBack` | `() => void` | Back button handler |
| `onShare` | `() => void` | Custom share handler |
| `hideControls` | `boolean` | Hide all video controls |
| `showCenterPlayButton` | `boolean` | Show large center play button (default: true) |
| `backButtonPosition` | `ButtonPosition` | Position of back button |
| `shareButtonPosition` | `ButtonPosition` | Position of share button |
| `seekBar` | `SeekbarConfig` | Seekbar customization options |
| `fullScreen` | `FullScreenConfig` | Full screen configuration |
| `playbackSpeed` | `PlaybackSpeedConfig` | Playback speed options |
| `subtitles` | `SubtitlesConfig` | Subtitle configuration |
| `quality` | `QualityConfig` | Quality selection configuration |
| `buttonGroups` | `ButtonGroupConfig[]` | Multiple button groups with layout control |
| `bottomButtonBar` | `BottomButtonBarConfig` | Bottom button bar configuration |
| `title` | `string` | Video title displayed in top-left |
| `subtitle` | `string` | Video subtitle displayed below title |
| `titleLeftOffset` | `number` | Custom left offset for title positioning |

## Button Layout Directions

- **VERTICAL** (default): Buttons stack vertically (top to bottom or bottom to top)
- **HORIZONTAL**: Buttons arrange side by side (left to right)

## Responsive Design

The component automatically adapts to:
- **Portrait/Landscape orientation changes**
- **Different screen sizes**
- **Platform differences (iOS/Android)**
- **Safe area considerations**

## HLS Video Support

For HLS videos (.m3u8 files), the component automatically:
- **Detects available subtitle tracks** from the manifest
- **Parses quality levels** and bitrates
- **Enables adaptive streaming** with manual override options
