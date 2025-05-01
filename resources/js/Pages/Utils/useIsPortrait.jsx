import { useState, useEffect } from 'react';

/**
 * React hook that detects whether the screen is in portrait orientation
 * @returns {boolean} True if the screen is in portrait orientation, false otherwise
 */
function useIsPortrait() {
  // Initialize with current orientation
  const [isPortrait, setIsPortrait] = useState(() => {
    // Check if window is defined (to handle SSR)
    if (typeof window === 'undefined') {
      return true; // Default value for SSR
    }
    
    // Compare window dimensions to determine orientation
    return window.innerHeight > window.innerWidth;
  });

  useEffect(() => {
    // Skip if window is not defined (SSR)
    if (typeof window === 'undefined') {
      return;
    }

    // Function to update state based on window dimensions
    const updateOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    // Listen for resize events
    window.addEventListener('resize', updateOrientation);
    
    // Some mobile devices also support orientationchange event
    window.addEventListener('orientationchange', updateOrientation);

    // Clean up event listeners
    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return isPortrait;
}

export default useIsPortrait;