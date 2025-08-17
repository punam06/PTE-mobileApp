import { useState, useEffect } from 'react';

export type OrientationType = 
  | 'portrait-primary'     // Portrait upright - Alarm Clock
  | 'landscape-primary'    // Landscape right-side up - Stopwatch  
  | 'portrait-secondary'   // Portrait upside down - Timer
  | 'landscape-secondary'; // Landscape left-side up - Weather

export const useOrientation = (): OrientationType => {
  const [orientation, setOrientation] = useState<OrientationType>('portrait-primary');

  // Keep track of device orientation
  const [deviceIsUpsideDown, setDeviceIsUpsideDown] = useState(false);

  // Handler for device orientation event
  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      // Beta is the front-to-back tilt in degrees, where front is positive
      const beta = event.beta || 0;
      
      // Gamma is the left-to-right tilt in degrees, where right is positive
      const gamma = event.gamma || 0;
      
      // Device is upside down when beta is negative and near -180 degrees
      // Or when beta is around 180 degrees
      const isUpsideDown = 
        (beta < -90 && beta > -180) || 
        (beta > 90 && beta < 180);
      
      setDeviceIsUpsideDown(isUpsideDown);
    };

    window.addEventListener('deviceorientation', handleDeviceOrientation);
    
    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

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
          // Portrait mode - check if the device is upside down
          setOrientation(deviceIsUpsideDown ? 'portrait-secondary' : 'portrait-primary');
        } else {
          // Landscape mode - we need to determine left-side up vs right-side up
          // This is approximate - we use deviceOrientation gamma angle
          const isLeftSideUp = deviceIsUpsideDown || // If completely upside down in landscape
            (window as any).orientation === 90; // Legacy orientation API
          
          setOrientation(isLeftSideUp ? 'landscape-secondary' : 'landscape-primary');
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

    // Event listeners for orientation and size changes
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    // Also update when device orientation changes (for upside down detection)
    window.addEventListener('deviceorientation', handleOrientationChange);
    
    // Standard screen orientation API
    if (window.screen && window.screen.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange);
    }

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('deviceorientation', handleOrientationChange);
      
      if (window.screen && window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      }
    };
  }, []);

  // Log orientation changes for debugging
  useEffect(() => {
    console.log(`Orientation changed: ${orientation}, Device upside down: ${deviceIsUpsideDown}`);
  }, [orientation, deviceIsUpsideDown]);

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
