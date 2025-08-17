import { useState, useEffect } from 'react';

export type OrientationType = 
  | 'portrait-primary'     // Portrait upright - Alarm Clock
  | 'landscape-primary'    // Landscape right-side up - Stopwatch  
  | 'portrait-secondary'   // Portrait upside down - Timer
  | 'landscape-secondary'; // Landscape left-side up - Weather

export const useOrientation = (): OrientationType => {
  const [orientation, setOrientation] = useState<OrientationType>('portrait-primary');

  useEffect(() => {
    const updateOrientation = () => {
      // Check if screen orientation API is available
      if (window.screen && window.screen.orientation) {
        const orientationType = window.screen.orientation.type as OrientationType;
        setOrientation(orientationType);
      } else {
        // Fallback for browsers without screen.orientation API
        const { innerWidth, innerHeight } = window;
        if (innerHeight > innerWidth) {
          // Portrait mode - we'll default to primary for now
          // In a real app, you might use accelerometer data to detect upside down
          setOrientation('portrait-primary');
        } else {
          // Landscape mode - default to primary
          setOrientation('landscape-primary');
        }
      }
    };

    // Initial check
    updateOrientation();

    // Listen for orientation changes
    const handleOrientationChange = () => {
      // Small delay to ensure the orientation has fully changed
      setTimeout(updateOrientation, 100);
    };

    // Event listeners
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    if (window.screen && window.screen.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange);
    }

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
      
      if (window.screen && window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      }
    };
  }, []);

  return orientation;
};

// Helper function to get feature name based on orientation
export const getFeatureFromOrientation = (orientation: OrientationType): string => {
  switch (orientation) {
    case 'portrait-primary':
      return 'alarm';
    case 'landscape-primary':
      return 'stopwatch';
    case 'portrait-secondary':
      return 'timer';
    case 'landscape-secondary':
      return 'weather';
    default:
      return 'alarm';
  }
};
