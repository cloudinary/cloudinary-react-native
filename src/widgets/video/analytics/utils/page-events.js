export const createPageTracker = (events, isMobile) => {
  if (isMobile) {
    return createMobilePageTracker(events);
  }

  return createDesktopPageTracker(events);
};

const createMobilePageTracker = ({ onPageViewStart, onPageViewEnd }) => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      onPageViewStart?.();
    } else if (document.visibilityState === 'hidden') {
      onPageViewEnd?.();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  if (document.visibilityState === 'visible') {
    onPageViewStart?.();
  }

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};

const createDesktopPageTracker = ({ onPageViewStart, onPageViewEnd }) => {
  const handlePageLoad = () => onPageViewStart?.();
  const handleBeforeUnload = () => onPageViewEnd?.();

  if (document.readyState === 'complete') {
    handlePageLoad();
  } else {
    window.addEventListener('load', handlePageLoad);
  }

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('load', handlePageLoad);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};
