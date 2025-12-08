# 📱 MangaGuesser - Version Mobile Optimisée

## ✨ Améliorations Mobile

### Responsive Design
- **Mobile (<640px)** : Layout en colonne, boutons fullwidth, images optimisées
- **Tablet (640px-1024px)** : Layout intermédiaire, ajustement des proportions
- **Desktop (>1024px)** : Expérience complète avec effets 3D

### Optimisations
- ✅ Boutons tactiles agrandis (48x48px minimum sur mobile)
- ✅ Titre et textes redimensionnés automatiquement
- ✅ Cartes adaptées à la largeur de l'écran
- ✅ Disparition de la 3D perspective sur mobile (performance)
- ✅ Métabalises mobiles et thème couleur
- ✅ Métabalise app-capable pour PWA

### Hook personnalisé
Un hook `useResponsive()` détecte automatiquement le type d'appareil et adapte le layout en temps réel.

## 🎮 Fonctionnalités

- **Combo Streak** : Chaîne de bonnes réponses avec animations et particules
- **Score Tracking** : Suivi des tentatives et du meilleur combo
- **Feedback Instantané** : Fond animé en vert/rouge selon réponse
- **Mode Zooom** : Clic sur l'image pour agrandir

## 🚀 Déploiement

### En local
```bash
npm run dev
# Ouvrir http://localhost:5173
# Tester sur mobile avec devtools ou sur appareil réel avec l'IP locale
```

### Sur téléphone (même réseau)
```bash
# Récupérer l'IP locale (Windows)
ipconfig
# ou (Mac/Linux)
ifconfig

# Accéder depuis le téléphone
http://<IP>:5173
```

### Progressive Web App (PWA)
Pour transformer en PWA, ajouter au `manifest.json`:
```json
{
  "name": "MangaGuesser",
  "short_name": "Manga",
  "start_url": "/",
  "display": "fullscreen",
  "theme_color": "#0b1020",
  "background_color": "#0b1020"
}
```

## 📊 Breakpoints Tailwind

- `sm` : 640px (mobile → tablet)
- `md` : 768px
- `lg` : 1024px (tablet → desktop)
- `xl` : 1280px

Utilisés dans les classes (ex: `text-2xl sm:text-4xl`)

## 🔧 Architecture Mobile

```
src/
├── hooks/
│   └── useResponsive.js       ← Détecte taille écran
├── components/
│   ├── Card.jsx               ← Responsive avec isMobile props
│   └── Button.jsx             ← Boutons adaptatifs
├── App.jsx                    ← Layout principal responsive
└── index.css                  ← Media queries mobile
```

## 💡 Tips Développement

1. **DevTools Mobile** : F12 → Ctrl+Shift+M (toggle device toolbar)
2. **Tester tous les breakpoints** : 320px, 375px, 480px, 640px, 768px
3. **Vérifier touches** : Les boutons doivent être touchables (min 44x44px)
4. **Performance** : Combo animations optimisées sans lag sur mobile
5. **Zoom** : Éviter fixed transform 3D sur petit écran

## 🎯 Résultats Testés

- ✅ iPhone SE (375px)
- ✅ iPhone 12 (390px)
- ✅ iPad (768px)
- ✅ Android 6+ (480px - 1080px)
- ✅ Desktop (1920px+)
