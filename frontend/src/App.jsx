import React, { useEffect, useState } from 'react';
import Card from './components/Card';
import { useResponsive, getAppContainerClasses } from './config/mobile';
import { LoadingState } from './utils/LoadingState';
import { ErrorState } from './utils/ErrorState';
import normalizeUrl from './utils/normalizeUrl';
import { getFeedbackClass } from './utils/feedbackClass';
import mangaDatabase from '../../backend/manga-db.json';


// --- APP PRINCIPALE ---
function App() {
    const { isMobile, isTablet } = useResponsive();
    const [manga, setMangaData] = useState(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [genre, setGenre] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [score, setScore] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [combo, setCombo] = useState(0);
    const [bestCombo, setBestCombo] = useState(0);
    const [lastMangaUrl, setLastMangaUrl] = useState(null);

    const fetchMangaData = async () => {
      setLoading(true);
      setError(null);
      setHasAnswered(false);
      setSelectedGenre(null);
      
      try {
        // Lecture directe depuis le fichier JSON (instantané, pas de requête réseau)
        if (!mangaDatabase.mangas || mangaDatabase.mangas.length === 0) {
          setError('Base de données vide. Veuillez lancer le script de scraping.');
          setLoading(false);
          return;
        }

        // Filtrer pour éviter le même manga
        let candidates = lastMangaUrl 
          ? mangaDatabase.mangas.filter(m => m.url !== lastMangaUrl)
          : mangaDatabase.mangas;
        
        if (candidates.length === 0) {
          candidates = mangaDatabase.mangas;
        }

        // Sélection aléatoire instantanée
        const randomIndex = Math.floor(Math.random() * candidates.length);
        const selectedManga = candidates[randomIndex];
        
        console.log('Manga sélectionné:', selectedManga.title);

        const normalizedPicture = normalizeUrl(selectedManga.picture);

        // Vérifier que le type est valide
        const validTypes = ['Shonen', 'Seinen', 'Shojo'];
        if (!selectedManga.type || !validTypes.includes(selectedManga.type)) {
          console.error('Type de manga invalide:', selectedManga.type);
          // Réessayer avec un autre manga
          fetchMangaData();
          return;
        }

        setMangaData({
          title: selectedManga.title,
          description: selectedManga.description,
          picture: normalizedPicture || 'https://via.placeholder.com/800x400?text=Image+indisponible',
          type: selectedManga.type
        });
        
        setGenre(selectedManga.type);
        setLastMangaUrl(selectedManga.url);

      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    const handleGenreSelect = (chosenGenre) => {
      if (hasAnswered) return; // Empêcher de répondre plusieurs fois
      
      setSelectedGenre(chosenGenre);
      setHasAnswered(true);
      setTotalAttempts(prev => prev + 1);
      
      // Vérifier si la réponse est correcte
      if (chosenGenre === genre) {
        setScore(prev => prev + 1);
        // Augmenter le combo
        const newCombo = combo + 1;
        setCombo(newCombo);
        // Mettre à jour le meilleur combo
        if (newCombo > bestCombo) {
          setBestCombo(newCombo);
        }
      } else {
        // Réinitialiser le combo si mauvaise réponse
        setCombo(0);
      }
    };

    useEffect(() => {
      fetchMangaData();
    }, []); //comme [] == on le fais que une fois.

  if (loading) {
    return <LoadingState message="Chargement du manga..." />;
  }
  if (error) {
    return <ErrorState message={error} />;
  }
  
  const isCorrect = hasAnswered && selectedGenre === genre;

  return (
    <div className={`feedback-wrap flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-[#0b1020] via-[#0a0f1a] to-[#05060a] text-[#e5e7ff] px-2 sm:px-4 py-4 ${getFeedbackClass(hasAnswered, isCorrect)}`}>
      <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-lg">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-semibold text-[#cbd5ff] drop-shadow text-center`}>Devine le Genre</h1>
        <div className={`flex flex-col items-center gap-2 ${isMobile ? 'text-sm' : 'text-xl'} font-semibold text-[#a78bfa]`}>
          <div>Score: {score} / {totalAttempts}</div>
          {combo > 0 && (
            <div className={`text-[#fbbf24] ${isMobile ? 'text-xs' : 'text-sm'}`}>
              🔥 Combo: {combo} {bestCombo > 0 && `(Meilleur: ${bestCombo})`}
            </div>
          )}
          {bestCombo > 0 && combo === 0 && (
            <div className={`text-[#d1d5f0] ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Meilleur combo: {bestCombo}
            </div>
          )}
        </div>
        <Card
          title={manga?.title || 'Titre indisponible'}
          description={manga?.description || 'Description indisponible'}
          picture={manga?.picture || 'https://via.placeholder.com/600x300?text=Manga'}
          correctGenre={genre}
          hasAnswered={hasAnswered}
          selectedGenre={selectedGenre}
          onGenreSelect={handleGenreSelect}
        />
        <button 
          onClick={fetchMangaData}
          disabled={loading || !hasAnswered}
          className={`${isMobile ? 'w-full px-4 py-3 text-sm' : 'px-6 py-2 text-base'} bg-[#a78bfa] hover:bg-[#9370db] disabled:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200`}
        >
          {loading ? 'Chargement...' : hasAnswered ? 'Manga suivant' : 'Choisissez un genre'}
        </button>
      </div>
    </div>
  );
}

export default App;