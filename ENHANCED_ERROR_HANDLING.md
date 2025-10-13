# Video Adapter Error Handling Improvements

This document describes the enhanced error handling for Cloudinary React Native SDK video adapters.

## Overview

The video adapters (`ExpoAVVideoAdapter`, `ExpoVideoAdapter`, and `FallbackVideoAdapter`) now provide improved error handling with detailed error messages and installation guidance when video libraries are not available.

## New Features

### Enhanced Error Messages

Instead of generic "module not available" errors, the adapters now provide:
- Specific adapter name in error messages
- Clear installation commands
- Detailed error context

### New Method: `getAvailabilityInfo()`

All video adapters now implement an optional `getAvailabilityInfo()` method that returns:

```typescript
{
  isAvailable: boolean;
  error?: string;
  installationCommand?: string;
}
```

### Example Usage

```typescript
import { VideoPlayerFactory } from 'cloudinary-react-native';

const adapter = VideoPlayerFactory.getAvailableAdapter();

// Check availability with detailed information
const info = adapter.getAvailabilityInfo?.();
if (!info?.isAvailable) {
  console.log(`Error: ${info.error}`);
  console.log(`Install with: ${info.installationCommand}`);
}
```

## Error Message Examples

### Before (Generic)
```
Error: expo-av is not available
```

### After (Detailed)
```
Error: ExpoAVVideoAdapter: Module not found: expo-av. Please install: "npx expo install expo-av"
```

## Benefits

1. **Better Developer Experience**: Clear error messages with actionable solutions
2. **Faster Debugging**: Specific adapter names and installation commands
3. **Production Safety**: Graceful error handling without silent failures
4. **Non-Breaking**: Existing code continues to work without changes

## Installation Commands by Adapter

| Adapter | Installation Command |
|---------|---------------------|
| ExpoAVVideoAdapter | `npx expo install expo-av` |
| ExpoVideoAdapter | `npx expo install expo-video` |
| FallbackVideoAdapter | `npx expo install expo-video expo-av` |

## Migration Guide

No migration is required. The new `getAvailabilityInfo()` method is optional and existing error handling continues to work as before, but with improved error messages.

### Optional: Enhanced Error Handling

You can optionally use the new method for better error handling:

```typescript
// Before
try {
  const videoComponent = adapter.renderVideo(props, ref);
} catch (error) {
  console.error('Video failed:', error.message);
}

// After (enhanced)
if (!adapter.isAvailable()) {
  const info = adapter.getAvailabilityInfo?.();
  if (info && !info.isAvailable) {
    console.error(`Video adapter error: ${info.error}`);
    console.log(`Fix with: ${info.installationCommand}`);
    return;
  }
}

const videoComponent = adapter.renderVideo(props, ref);
```