import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Anime } from '../../types/anime';

interface AnimeCardProps {
  anime: Anime;
  onClick: () => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onClick }) => {
  const rating = parseFloat(anime.attributes.averageRating || '0') / 20;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-lg bg-gray-900 cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img
          src={anime.attributes.posterImage.medium}
          alt={anime.attributes.canonicalTitle}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 p-4 w-full">
          <h3 className="text-white font-semibold line-clamp-2 mb-2">
            {anime.attributes.canonicalTitle}
          </h3>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};