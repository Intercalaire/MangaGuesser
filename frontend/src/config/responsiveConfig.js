/**
 * Configuration responsive pour MangaGuesser
 * Définit les points de rupture et les tailles adaptatifs
 */

export const BREAKPOINTS = {
  mobile: 640,      // < 640px
  tablet: 1024,     // 640px - 1024px
  desktop: 1024,    // >= 1024px
};

export const SIZES = {
  // Carte
  card: {
    mobile: {
      width: '90vw',
      maxWidth: '24rem',      // max-w-96
      imageHeight: '280px',   // sans réponse: 200px avec réponse
      padding: 'p-4',
      gap: 'gap-2',
    },
    tablet: {
      width: '85vw',
      maxWidth: '42rem',      // max-w-2xl
      imageHeight: '350px',   // sans réponse: 280px avec réponse
      padding: 'p-6',
      gap: 'gap-3',
    },
    desktop: {
      width: '600px',         // 540px avec réponse
      imageHeight: '400px',   // 320px avec réponse
      padding: 'p-8',
      gap: 'gap-4',
    },
  },

  // Boutons
  button: {
    mobile: {
      width: 'w-full',
      height: 'h-12',
      fontSize: 'text-base',
      padding: 'px-4 py-3',
    },
    tablet: {
      width: 'w-32',
      height: 'h-11',
      fontSize: 'text-sm',
      padding: 'px-3 py-2',
    },
    desktop: {
      width: 'w-28',
      height: 'h-10',
      fontSize: 'text-sm',
      padding: 'px-2 py-1',
    },
  },

  // Textes
  text: {
    mobile: {
      title: 'text-2xl',
      subtitle: 'text-sm',
      description: 'text-xs',
    },
    tablet: {
      title: 'text-3xl',
      subtitle: 'text-base',
      description: 'text-sm',
    },
    desktop: {
      title: 'text-4xl',
      subtitle: 'text-lg',
      description: 'text-base',
    },
  },

  // Espacing
  spacing: {
    mobile: {
      containerGap: 'gap-4',
      mainPadding: 'px-2 sm:px-4 py-4',
    },
    tablet: {
      containerGap: 'gap-5',
      mainPadding: 'px-4 py-6',
    },
    desktop: {
      containerGap: 'gap-6',
      mainPadding: 'px-8 py-8',
    },
  },
};

/**
 * Hook personnalisé pour utiliser ces configurations
 * Usage:
 * const sizes = useResponsiveSizes();
 * className={sizes.button.width}
 */
export function getResponsiveSize(screenSize, category, property) {
  return SIZES[category]?.[screenSize]?.[property] || '';
}
