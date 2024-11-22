import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { HeroCarousel } from '../components/ui/HeroCarousel';
import { AnimeCard } from '../components/ui/AnimeCard';
import { fetchTrendingAnime, fetchPopularAnime } from '../services/api';
import type { Anime } from '../types/anime';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: trendingAnime = [] } = useQuery('trending', fetchTrendingAnime);
  const { data: popularAnime = [] } = useQuery('popular', fetchPopularAnime);

  const handleAnimeClick = (anime: Anime) => {
    navigate(`/anime/${anime.id}`);
  };

  return (
    <div className="min-h-screen">
      <HeroCarousel animes={trendingAnime.slice(0, 5)} onAnimeClick={handleAnimeClick} />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {trendingAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} onClick={() => handleAnimeClick(anime)} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Popular Anime</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {popularAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} onClick={() => handleAnimeClick(anime)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};