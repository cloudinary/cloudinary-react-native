declare module 'cloudinary-video-analytics' {
  export interface CloudinaryVideoAnalyticsConfig {
    cloudName: string;
    publicId: string;
  }

  export class CloudinaryVideoAnalytics {
    constructor(config: CloudinaryVideoAnalyticsConfig);
    updateVideoDuration(duration: number): void;
    videoStarted(position: number): void;
    videoPlayed(position: number): void;
    videoPaused(position: number): void;
    videoCompleted(position: number): void;
  }

  // These are only available during test time (from __mocks__)
  export const videoStarted: jest.Mock;
  export const videoPlayed: jest.Mock;
  export const videoPaused: jest.Mock;
  export const videoCompleted: jest.Mock;
  export const updateVideoDuration: jest.Mock;
}
