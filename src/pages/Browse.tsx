import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimeCard } from '../components/ui/AnimeCard';
import { fetchPopularAnime } from '../services/api';
import { LoadingScreen } from '../components/ui/LoadingScreen';

const ITEMS_PER_PAGE = 20;

export const Browse: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: popularAnime, isLoading } = useQuery(
    ['popularAnime', currentPage, i18n.language],
    () => fetchPopularAnime(i18n.language, currentPage, ITEMS_PER_PAGE),
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  const totalPages = Math.ceil((popularAnime?.meta?.count || 0) / ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {popularAnime?.data.map((anime) => (
          <AnimeCard
            key={anime.id}
            anime={anime}
            onClick={() => navigate(`/anime/${anime.id}`)}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNumber = currentPage - 2 + i;
          if (pageNumber > 0 && pageNumber <= totalPages) {
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === pageNumber
                    ? 'bg-primary-600'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {pageNumber}
              </button>
            );
          }
          return null;
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};