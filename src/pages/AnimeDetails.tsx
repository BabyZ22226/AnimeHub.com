import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Play, Plus, Star, Calendar, Clock, Tag, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { fetchAnimeDetails } from '../services/api';

export const AnimeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showListModal, setShowListModal] = useState(false);
  const { lists, addAnimeToList } = useStore();

  const { data: anime, isLoading } = useQuery(['anime', id], () =>
    fetchAnimeDetails(id!)
  );

  if (isLoading || !anime) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const handleAddToList = (listId: string) => {
    addAnimeToList(listId, anime.id);
    setShowListModal(false);
  };

  const handleWatchNow = () => {
    navigate(`/watch/${anime.id}/1`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen">
      <div
        className="h-[50vh] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${anime.attributes.coverImage?.large || anime.attributes.posterImage.large})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-64 flex-shrink-0">
            <motion.img
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              src={anime.attributes.posterImage.large}
              alt={anime.attributes.canonicalTitle}
              className="w-full rounded-lg shadow-lg"
            />

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-5 h-5" />
                <span>Released: {formatDate(anime.attributes.startDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-5 h-5" />
                <span>Episodes: {anime.attributes.episodeCount}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Tag className="w-5 h-5" />
                <span>Status: {anime.attributes.status}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Users className="w-5 h-5" />
                <span>Age Rating: {anime.attributes.ageRating}</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4"
            >
              {anime.attributes.canonicalTitle}
            </motion.h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span>{(parseFloat(anime.attributes.averageRating) / 20).toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{anime.attributes.status}</span>
              <span>•</span>
              <span>{anime.attributes.episodeCount} {t('anime.episodes')}</span>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {anime.attributes.genres?.data.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                  >
                    {genre.attributes.name}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-gray-300 mb-8">{anime.attributes.synopsis}</p>

            <div className="flex gap-4">
              <button
                onClick={handleWatchNow}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Play className="w-5 h-5" />
                {t('anime.watchNow')}
              </button>

              <button
                onClick={() => setShowListModal(true)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Plus className="w-5 h-5" />
                {t('anime.addToList')}
              </button>
            </div>

            {anime.attributes.youtubeVideoId && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Trailer</h3>
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${anime.attributes.youtubeVideoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showListModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">{t('lists.myLists')}</h3>
            <div className="space-y-2">
              {lists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => handleAddToList(list.id)}
                  className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  {list.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};