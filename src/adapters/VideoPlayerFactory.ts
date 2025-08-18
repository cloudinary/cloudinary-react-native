import { VideoPlayerAdapter, VideoPlayerType } from './types';
import { ExpoVideoAdapter } from './ExpoVideoAdapter';
import { ExpoAVVideoAdapter } from './ExpoAVVideoAdapter';
import { FallbackVideoAdapter } from './FallbackVideoAdapter';

// Log module import (but not during tests)
if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
  console.log('🏭 [Cloudinary] VideoPlayerFactory module imported successfully!');
}

// Re-export types for external use
export { VideoPlayerType } from './types';

export class VideoPlayerFactory {
  private static adapters: VideoPlayerAdapter[] = [];
  private static initialized = false;

  private static initializeAdapters(): void {
    if (this.initialized) return;

    this.adapters = [
      new ExpoVideoAdapter(),     // Try expo-video first (newer package)
      new ExpoAVVideoAdapter(),   // Fallback to expo-av
    ];

    this.initialized = true;
  }

  /**
   * Get the first available video player adapter
   */
  static getAvailableAdapter(): VideoPlayerAdapter {
    this.initializeAdapters();

    if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
      console.log('[Cloudinary VideoPlayerFactory] Checking available video adapters...');
    }
    
    // Find the first available adapter
    for (const adapter of this.adapters) {
      const adapterName = adapter.getAdapterName();
      const isAvailable = adapter.isAvailable();
      
      if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
        console.log(`[Cloudinary VideoPlayerFactory] Checking ${adapterName}: ${isAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
      }
      
      if (isAvailable) {
        if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
          console.log(`[Cloudinary VideoPlayerFactory] ✅ Selected adapter: ${adapterName}`);
        }
        return adapter;
      }
    }

    // If no adapter is available, return fallback
    if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
      console.log('[Cloudinary VideoPlayerFactory] ⚠️ No video adapters available, using fallback');
    }
    return new FallbackVideoAdapter('No video player library found. Install expo-video or expo-av.');
  }

  /**
   * Get a specific adapter by type
   */
  static getAdapterByType(type: VideoPlayerType): VideoPlayerAdapter {
    this.initializeAdapters();

    const adapter = this.adapters.find(adapter => adapter.getAdapterName() === type);
    if (adapter && adapter.isAvailable()) {
      return adapter;
    }

    throw new Error(`Adapter for ${type} is not available`);
  }

  /**
   * Get information about all available adapters
   */
  static getAvailableAdapters(): { name: string; available: boolean }[] {
    this.initializeAdapters();

    return this.adapters.map(adapter => ({
      name: adapter.getAdapterName(),
      available: adapter.isAvailable()
    }));
  }

  /**
   * Check if a specific video player type is available
   */
  static isAdapterAvailable(type: VideoPlayerType): boolean {
    this.initializeAdapters();

    const adapter = this.adapters.find(adapter => adapter.getAdapterName() === type);
    return adapter ? adapter.isAvailable() : false;
  }
}
