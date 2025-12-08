# 📱 Architecture Mobile - MangaGuesser

## Structure Centralisée

Tous les configurations et utilitaires mobiles sont maintenant centralisés dans `/src/config/mobile.js`.

### 📂 Imports Recommandés

**Au lieu de :**
```javascript
import useResponsive from './hooks/useResponsive';
import hapticFeedback from './utils/hapticFeedback';
```

**Utiliser :**
```javascript
import { useResponsive, hapticFeedback, getCardSizeClasses } from './config/mobile';
```

## 📋 Fichiers Clés

### `/src/config/mobile.js` ⭐ NOUVEAU
**Fichier central pour toutes les dépendances mobiles**

Exports:
- `useResponsive` - Hook pour détecter device type
- `useTouchOptimization` - Hook pour optimiser le touch
- `hapticFeedback` - Objet avec vibrations mobiles
- `MOBILE_SIZES` - Configuration des tailles responsive
- `getResponsiveSize()` - Utility pour récupérer les tailles
- `getButtonSizeClasses()` - Tailles de boutons responsive
- `getCardSizeClasses()` - Tailles de carte responsive
- `getAppContainerClasses()` - Tailles du conteneur app

### `/src/hooks/useResponsive.js`
Détecte automatiquement:
- `isMobile` (< 640px)
- `isTablet` (640px - 1024px)
- `screenSize` (string: 'mobile' | 'tablet' | 'desktop')

### `/src/hooks/useTouchOptimization.js`
Optimise l'expérience tactile:
- Désactive le zoom double-tap
- Désactive les gestes pinch
- Améliore la performance mobile

### `/src/utils/hapticFeedback.js`
Vibrations mobiles (optionnel):
- `hapticFeedback.light()` - Léger
- `hapticFeedback.medium()` - Modéré
- `hapticFeedback.strong()` - Fort
- `hapticFeedback.success()` - Succès (pattern)
- `hapticFeedback.error()` - Erreur (pattern)
- `hapticFeedback.combo(n)` - Combo (pattern montant)

## 🔧 Utilisation dans les Composants

### App.jsx
```jsx
import { useResponsive, getAppContainerClasses } from './config/mobile';

function App() {
  const { isMobile, isTablet } = useResponsive();
  const containerClasses = getAppContainerClasses(isMobile);
  
  return (
    <div className={`px-2 sm:px-4 py-4 ${containerClasses.gap}`}>
      {/* ... */}
    </div>
  );
}
```

### Card.jsx
```jsx
import { useResponsive, getCardSizeClasses } from '../config/mobile';

function Card({ title, hasAnswered }) {
  const { isMobile, isTablet } = useResponsive();
  const sizes = getCardSizeClasses(isMobile, isTablet, hasAnswered);
  
  return (
    <div className={sizes.width}>
      <img className={sizes.imageHeight} />
      <h2 className={sizes.titleSize}>{title}</h2>
    </div>
  );
}
```

### Button.jsx
```jsx
import { getButtonSizeClasses } from '../config/mobile';

function BaseButton({ isMobile }) {
  const sizeClass = getButtonSizeClasses(isMobile);
  
  return (
    <button className={`${sizeClass} font-semibold`}>
      Click me
    </button>
  );
}
```

## 📏 Configuration des Tailles

### MOBILE_SIZES.card

```javascript
{
  mobile: {     // < 640px
    width: 'w-[90vw]',
    maxWidth: 'max-w-sm',
    imageMini: 'h-[200px]',
    imageNormal: 'h-[280px]',
  },
  tablet: {     // 640px - 1024px
    width: 'w-[85vw]',
    maxWidth: 'max-w-2xl',
    imageMini: 'h-[280px]',
    imageNormal: 'h-[350px]',
  },
  desktop: {    // > 1024px
    width: 'w-auto',
    maxWidth: 'max-w-none',
    imageMini: 'h-[320px]',
    imageNormal: 'h-[400px]',
  }
}
```

## ✅ Avantages

✅ **Centralisé** - Un seul fichier pour les configs mobiles
✅ **DRY** - Pas de duplication entre composants
✅ **Maintenable** - Modifier une taille = une seule place
✅ **Cohérent** - Même logique partout
✅ **Performant** - Imports consolidés
✅ **Évolutif** - Facile d'ajouter de nouvelles configs

## 🔄 Migration Checklist

- [x] Créé `/src/config/mobile.js`
- [x] Centralisé `useResponsive`
- [x] Centralisé `useTouchOptimization`
- [x] Centralisé `hapticFeedback`
- [x] Ajouté fonctions utility
- [x] Mis à jour App.jsx
- [x] Mis à jour Card.jsx
- [x] Mis à jour Button.jsx
- [x] Tous les imports corrigés
- [x] Dépendances vérifiées

## 🚀 Prochaines Étapes

1. Importer `useResponsive` depuis `config/mobile`
2. Utiliser `getCardSizeClasses()` au lieu de logique inline
3. Utiliser `getButtonSizeClasses()` pour les boutons
4. Ajouter `useTouchOptimization()` dans App.jsx si besoin
5. Optionnel: Ajouter haptic feedback aux clics

## 📞 Support

**Erreur:** "Cannot find module '../config/mobile'"
→ Vérifier le chemin relatif depuis votre composant

**Erreur:** "useResponsive is not exported from mobile"
→ Vérifier que c'est bien exporté dans mobile.js

---

**État:** ✅ Complètement centralisé et fonctionnel
