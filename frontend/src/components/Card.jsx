import { useState } from 'react';
import { useResponsive, getCardSizeClasses } from '../config/mobile';
import { ButtonShonen, ButtonShojo, ButtonSeinen } from './Button';

function Card({ title, description, picture, correctGenre, hasAnswered, selectedGenre, onGenreSelect }) {
    const [zoomOpen, setZoomOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { isMobile, isTablet } = useResponsive();

    const isCorrect = hasAnswered && selectedGenre === correctGenre;
    const isWrong = hasAnswered && selectedGenre !== correctGenre;

        // Responsive classes from mobile config
        const sizes = getCardSizeClasses(isMobile, isTablet, hasAnswered);
        const cardWidthClass = sizes.width;
        const imageHeightClass = sizes.imageHeight;
        const paddingClass = sizes.padding;
        const gapClass = sizes.gap;
        const titleSizeClass = sizes.titleSize;
        const descriptionSizeClass = sizes.descSize;

    const handleImageError = (event) => {
        event.target.onerror = null;
        setImageError(true);
    };

    const retryImage = () => {
        setImageError(false);
    };

    return (
        <div className="card-scene">
            <div className={`card-tilt flex flex-col rounded-2xl ${cardWidthClass} bg-gradient-to-br from-[#0c1224] via-[#0f1a33] to-[#111827] border border-[#24305a]/60 shadow-2xl text-[#e5e7ff]`}>
                <figure className={`flex justify-center items-center overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#141a2f] to-[#0b1226] cursor-pointer group relative ${imageHeightClass}`}>
                    {!imageError ? (
                        <>
                            <img
                                src={picture}
                                alt={title || 'Visuel du manga'}
                                onError={handleImageError}
                                onClick={() => setZoomOpen(true)}
                                loading="eager"
                                decoding="async"
                                fetchPriority="high"
                                className="rounded-t-2xl object-cover w-full h-full group-hover:opacity-80 transition-opacity duration-75 cursor-pointer touch-none"
                            />
                            {!isMobile && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-75 pointer-events-none">
                                  <span className="text-white text-sm font-semibold drop-shadow">Cliquez pour agrandir</span>
                              </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3 w-full h-full px-4">
                            <span className="text-[#d1d5f0] text-center text-sm">Image non disponible 😞</span>
                            <button
                                onClick={retryImage}
                                className="px-4 py-2 bg-[#a78bfa] hover:bg-[#9370db] text-white font-semibold rounded-lg transition-colors text-sm"
                            >
                                Réessayer
                            </button>
                        </div>
                    )}
                </figure>

                {zoomOpen && (
                    <div
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setZoomOpen(false)}
                    >
                        <button
                            onClick={() => setZoomOpen(false)}
                            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-51"
                            aria-label="Fermer"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            src={picture}
                            alt={title || 'Visuel du manga agrandit'}
                            onError={handleImageError}
                            className="w-full h-full object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}
                <div className={`flex flex-col ${paddingClass} ${gapClass}`}>
                    <div className={`${titleSizeClass} font-bold text-[#cbd5ff] drop-shadow line-clamp-2`}>{title}</div>
                    <div className={`${descriptionSizeClass} text-[#d1d5f0] line-clamp-5 max-h-16 overflow-y-auto`}>{description}</div>
                    
                    {hasAnswered && (
                        <div className={`text-center ${isMobile ? 'text-xs' : 'text-lg'} font-bold py-2 rounded-lg ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {isCorrect ? '✓ Correct !' : '✗ Incorrect !'}
                            <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-normal mt-1`}>
                              {isCorrect ? 'C\'est bien du ' + correctGenre : 'C\'était du ' + correctGenre}
                            </div>
                        </div>
                    )}
                    
                    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row justify-between'} gap-2 pt-2`}>
                        <div onClick={() => onGenreSelect('Shonen')} className={hasAnswered ? 'pointer-events-none' : 'cursor-pointer'}>
                            <ButtonShonen 
                                label={hasAnswered && correctGenre === 'Shonen' ? '✓' : 'Shonen'} 
                                disabled={hasAnswered}
                                isCorrect={hasAnswered && correctGenre === 'Shonen'}
                                isSelected={selectedGenre === 'Shonen'}
                                isMobile={isMobile}
                            />
                        </div>
                        <div onClick={() => onGenreSelect('Shojo')} className={hasAnswered ? 'pointer-events-none' : 'cursor-pointer'}>
                            <ButtonShojo 
                                label={hasAnswered && correctGenre === 'Shojo' ? '✓' : 'Shojo'} 
                                disabled={hasAnswered}
                                isCorrect={hasAnswered && correctGenre === 'Shojo'}
                                isSelected={selectedGenre === 'Shojo'}
                                isMobile={isMobile}
                            />
                        </div>
                        <div onClick={() => onGenreSelect('Seinen')} className={hasAnswered ? 'pointer-events-none' : 'cursor-pointer'}>
                            <ButtonSeinen 
                                label={hasAnswered && correctGenre === 'Seinen' ? '✓' : 'Seinen'} 
                                disabled={hasAnswered}
                                isCorrect={hasAnswered && correctGenre === 'Seinen'}
                                isSelected={selectedGenre === 'Seinen'}
                                isMobile={isMobile}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
