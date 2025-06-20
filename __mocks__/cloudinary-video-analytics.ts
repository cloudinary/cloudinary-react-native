export const videoStarted = jest.fn();
export const videoPlayed = jest.fn();
export const videoPaused = jest.fn();
export const videoCompleted = jest.fn();
export const updateVideoDuration = jest.fn();

export const CloudinaryVideoAnalytics = jest.fn().mockImplementation((config: any) => ({
  config,
  videoStarted,
  videoPlayed,
  videoPaused,
  videoCompleted,
  updateVideoDuration,
}));
