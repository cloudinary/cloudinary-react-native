// VideoAnalyticsAdapter.ts
import { CloudinaryVideoAnalytics } from 'cloudinary-video-analytics';

interface VideoAnalyticsConfig {
  cloudName: string;
  publicId: string;
}

export default class VideoAnalyticsAdapter {
  private analytics: CloudinaryVideoAnalytics;
  private videoStarted = false;
  private durationSent = false;

  constructor({ cloudName, publicId }: VideoAnalyticsConfig) {
    this.analytics = new CloudinaryVideoAnalytics({
      cloudName,
      publicId,
    });
  }

  setVideoDuration(duration: number): void {
    if (!this.durationSent && duration > 0) {
      this.analytics.updateVideoDuration(duration);
      this.durationSent = true;
    }
  }

  onPlay(position: number): void {
    if (!this.videoStarted) {
      this.analytics.videoStarted(position);
      this.videoStarted = true;
    }
    this.analytics.videoPlayed(position);
  }

  onPause(position: number): void {
    this.analytics.videoPaused(position);
  }

  onComplete(position: number): void {
    this.analytics.videoCompleted(position);
  }
}
