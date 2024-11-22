import React, { useEffect } from 'react';
import { Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Anime } from '../../types/anime';

interface HeroCarouselProps {
  animes: Anime[];
  onAnimeClick: (anime: Anime) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ animes, onAnimeClick }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === animes.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [animes.length]);

  const currentAnime = animes[currentIndex];

  if (!currentAnime) return null;

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAnime.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${currentAnime.attributes.coverImage?.large || currentAnime.attributes.posterImage.large})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={currentAnime.id}
        className="absolute bottom-0 left-0 p-8 text-white max-w-2xl"
      >
        <h2 className="text-4xl font-bold mb-4">{currentAnime.attributes.canonicalTitle}</h2>
        <p className="text-lg mb-6 line-clamp-3">{currentAnime.attributes.synopsis}</p>
        <button
          onClick={() => onAnimeClick(currentAnime)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <Play className="w-5 h-5" />
          Watch Now
        </button>
      </motion.div>

      <div className="absolute bottom-4 right-4 flex gap-2">
        {animes.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};