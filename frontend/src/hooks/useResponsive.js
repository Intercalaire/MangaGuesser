import { useState, useEffect } from 'react';

function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 640) {
        setIsMobile(true);
        setIsTablet(false);
        setScreenSize('mobile');
      } else if (width < 1024) {
        setIsMobile(false);
        setIsTablet(true);
        setScreenSize('tablet');
      } else {
        setIsMobile(false);
        setIsTablet(false);
        setScreenSize('desktop');
      }
    };

    // Appeler une fois au montage
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, isTablet, screenSize };
}

export default useResponsive;
