import { VideoPlayerAdapter, VideoPlayerType } from './types';
import { ExpoVideoAdapter } from './ExpoVideoAdapter';
import { ExpoAVVideoAdapter } from './ExpoAVVideoAdapter';
import { FallbackVideoAdapter } from './FallbackVideoAdapter';

// Re-export types for external use
export { VideoPlayerType } from './types';

export class VideoPlayerFactory {
  private static adapters: VideoPlayerAdapter[] = [];
  private static initialized = false;

  private static initializeAdapters(): void {
    if (this.initialized) return;

    this.adapters = [
      new ExpoAVVideoAdapter(),   // Try expo-av first (more stable for this use case)
      new ExpoVideoAdapter(),     // Fallback to expo-video
    ];

    this.initialized = true;
  }

  /**
   * Get the first available video player adapter
   */
  static getAvailableAdapter(): VideoPlayerAdapter {
    this.initializeAdapters();

    console.log('VideoPlayerFactory - Checking adapters...');
    // Find the first available adapter
    for (const adapter of this.adapters) {
      const adapterName = adapter.getAdapterName();
      const isAvailable = adapter.isAvailable();
      console.log(`VideoPlayerFactory - ${adapterName}: ${isAvailable ? 'Available' : 'Not Available'}`);
      
      if (isAvailable) {
        console.log(`VideoPlayerFactory - Using adapter: ${adapterName}`);
        return adapter;
      }
    }

    // If no adapter is available, return fallback
    console.log('VideoPlayerFactory - No adapters available, using fallback');
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
