import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useQuery } from 'react-query';
import { fetchAnimeDetails } from '../services/api';
import { AnimeCard } from '../components/ui/AnimeCard';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export const Lists: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lists, addList, removeList, removeAnimeFromList } = useStore();
  const [newListName, setNewListName] = useState('');
  const [showNewListModal, setShowNewListModal] = useState(false);

  const animeQueries = lists.flatMap(list => 
    list.animes.map(animeId => 
      useQuery(['anime', animeId], () => fetchAnimeDetails(animeId))
    )
  );

  const isLoading = animeQueries.some(query => query.isLoading);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleCreateList = () => {
    if (newListName.trim()) {
      addList(newListName.trim());
      setNewListName('');
      setShowNewListModal(false);
    }
  };

  const handleDeleteList = (id: string) => {
    if (!['watching', 'completed', 'plan-to-watch'].includes(id) &&
        window.confirm(t('lists.confirmDelete'))) {
      removeList(id);
    }
  };

  const handleRemoveAnime = (listId: string, animeId: string) => {
    if (window.confirm(t('lists.confirmRemoveAnime'))) {
      removeAnimeFromList(listId, animeId);
    }
  };

  const getAnimeDetails = (animeId: string) => {
    const query = animeQueries.find(q => q.data?.id === animeId);
    return query?.data;
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t('lists.myLists')}</h1>
          <button
            onClick={() => setShowNewListModal(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t('lists.createNew')}
          </button>
        </div>

        <div className="space-y-8">
          {lists.map((list) => (
            <div key={list.id} className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{list.name}</h2>
                {!['watching', 'completed', 'plan-to-watch'].includes(list.id) && (
                  <button
                    onClick={() => handleDeleteList(list.id)}
                    className="text-red-500 hover:text-red-400 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              {list.animes.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {list.animes.map((animeId) => {
                    const anime = getAnimeDetails(animeId);
                    return anime ? (
                      <div key={animeId} className="relative group">
                        <AnimeCard
                          anime={anime}
                          onClick={() => navigate(`/anime/${animeId}`)}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveAnime(list.id, animeId);
                          }}
                          className="absolute top-2 right-2 bg-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <p className="text-gray-400">{t('lists.empty')}</p>
              )}
            </div>
          ))}
        </div>

        {showNewListModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-96">
              <h3 className="text-xl font-semibold mb-4">{t('lists.createNew')}</h3>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder={t('lists.namePlaceholder')}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg mb-4"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowNewListModal(false)}
                  className="px-4 py-2 bg-gray-700 rounded-lg"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleCreateList}
                  className="px-4 py-2 bg-primary-600 rounded-lg"
                >
                  {t('common.create')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};