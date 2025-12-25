/**
 * Mobile Configuration & Utilities
 * Centralise toutes les dépendances et configurations mobiles
 */

import useResponsive from '../hooks/useResponsive';
import { useTouchOptimization } from '../hooks/useTouchOptimization';
import hapticFeedback from '../utils/hapticFeedback';

export { useResponsive, useTouchOptimization, hapticFeedback };

/**
 * Mobile-specific size configurations
 */
export const MOBILE_SIZES = {
  card: {
    mobile: {
      width: 'w-[90vw]',
      maxWidth: 'max-w-sm',
      imageMini: 'h-[200px]',
      imageNormal: 'h-[280px]',
      padding: 'p-4',
      gap: 'gap-2',
      titleSize: 'text-xl',
      descSize: 'text-xs',
    },
    tablet: {
      width: 'w-[85vw]',
      maxWidth: 'max-w-2xl',
      imageMini: 'h-[280px]',
      imageNormal: 'h-[350px]',
      padding: 'p-6',
      gap: 'gap-3',
      titleSize: 'text-2xl',
      descSize: 'text-sm',
    },
    desktop: {
      width: 'w-auto',
      maxWidth: 'max-w-none',
      imageMini: 'h-[320px]',
      imageNormal: 'h-[400px]',
      padding: 'p-8',
      gap: 'gap-4',
      titleSize: 'text-3xl',
      descSize: 'text-base',
    },
  },

  button: {
    mobile: {
      width: 'w-full',
      height: 'h-12',
      fontSize: 'text-base',
    },
    tablet: {
      width: 'w-32',
      height: 'h-11',
      fontSize: 'text-sm',
    },
    desktop: {
      width: 'w-28',
      height: 'h-10',
      fontSize: 'text-sm',
    },
  },

  text: {
    mobile: {
      h1: 'text-2xl',
      subtitle: 'text-sm',
      small: 'text-xs',
    },
    tablet: {
      h1: 'text-3xl',
      subtitle: 'text-base',
      small: 'text-sm',
    },
    desktop: {
      h1: 'text-4xl',
      subtitle: 'text-lg',
      small: 'text-sm',
    },
  },
};

/**
 * Utility: Get responsive size class
 * @param {string} screenSize - 'mobile' | 'tablet' | 'desktop'
 * @param {string} category - 'card' | 'button' | 'text'
 * @param {string} property - size property name
 * @returns {string} Tailwind class
 */
export function getResponsiveSize(screenSize, category, property) {
  return MOBILE_SIZES[category]?.[screenSize]?.[property] || '';
}

/**
 * Utility: Get button size classes
 */
export function getButtonSizeClasses(isMobile) {
  if (isMobile) {
    return 'w-full h-12 text-base';
  }
  return 'w-28 h-10 text-sm';
}

/**
 * Utility: Get card size classes
 */
export function getCardSizeClasses(isMobile, isTablet, hasAnswered) {
  if (isMobile) {
    return {
      width: 'w-[85vw] max-w-sm',
      imageHeight: hasAnswered ? 'h-[180px]' : 'h-[250px]',
      padding: 'p-3',
      gap: 'gap-2',
      titleSize: 'text-lg',
      descSize: 'text-xs',
    };
  }
  if (isTablet) {
    return {
      width: 'w-[70vw] max-w-xl',
      imageHeight: hasAnswered ? 'h-[220px]' : 'h-[280px]',
      padding: 'p-5',
      gap: 'gap-2',
      titleSize: 'text-xl',
      descSize: 'text-sm',
    };
  }
  return {
    width: hasAnswered ? 'w-[540px]' : 'w-[600px]',
    imageHeight: hasAnswered ? 'h-[320px]' : 'h-[400px]',
    padding: 'p-8',
    gap: 'gap-4',
    titleSize: 'text-3xl',
    descSize: 'text-base',
  };
}

/**
 * Utility: Get app container responsive classes
 */
export function getAppContainerClasses(isMobile) {
  return {
    padding: isMobile ? 'px-2 sm:px-4 py-4' : 'px-8 py-8',
    gap: isMobile ? 'gap-4 sm:gap-6' : 'gap-6',
    titleSize: isMobile ? 'text-2xl' : 'text-4xl',
    subtitleSize: isMobile ? 'text-sm' : 'text-xl',
  };
}

export default {
  useResponsive,
  useTouchOptimization,
  hapticFeedback,
  MOBILE_SIZES,
  getResponsiveSize,
  getButtonSizeClasses,
  getCardSizeClasses,
  getAppContainerClasses,
};
