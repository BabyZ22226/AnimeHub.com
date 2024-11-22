import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import ReactPlayer from 'react-player';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import { fetchAnimeDetails, fetchAnimeEpisodes } from '../services/api';
import { searchAnimeFlv, getEpisodeStreams } from '../services/animeflv';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export const Watch: React.FC = () => {
  const { id, episode } = useParams<{ id: string; episode: string }>();
  const navigate = useNavigate();
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const { data: anime, isLoading: isLoadingAnime } = useQuery(
    ['anime', id],
    () => fetchAnimeDetails(id!)
  );

  const { data: episodes, isLoading: isLoadingEpisodes } = useQuery(
    ['episodes', id],
    () => fetchAnimeEpisodes(id!)
  );

  useEffect(() => {
    const fetchVideoUrl = async () => {
      if (anime) {
        const animeFlvId = await searchAnimeFlv(anime.attributes.canonicalTitle);
        if (animeFlvId) {
          const streams = await getEpisodeStreams(animeFlvId, parseInt(episode!, 10));
          if (streams.length > 0) {
            setVideoUrl(streams[0].url);
          }
        }
      }
    };

    fetchVideoUrl();
  }, [anime, episode]);

  if (isLoadingAnime || isLoadingEpisodes) {
    return <LoadingScreen />;
  }

  if (!anime || !episodes) return null;

  const currentEpisodeNumber = parseInt(episode!, 10);
  const currentEpisode = episodes.find(ep => ep.attributes.number === currentEpisodeNumber);
  
  const handleEpisodeChange = (newEpisode: number) => {
    if (newEpisode >= 1 && newEpisode <= anime.attributes.episodeCount) {
      navigate(`/watch/${id}/${newEpisode}`);
      setShowEpisodeList(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="aspect-video w-full bg-gray-900 rounded-lg overflow-hidden">
          {videoUrl ? (
            <ReactPlayer
              url={videoUrl}
              width="100%"
              height="100%"
              controls
              playing
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Loading video...</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => handleEpisodeChange(currentEpisodeNumber - 1)}
            disabled={currentEpisodeNumber <= 1}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous Episode
          </button>

          <button
            onClick={() => setShowEpisodeList(!showEpisodeList)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <List className="w-5 h-5" />
            Episodes List
          </button>

          <button
            onClick={() => handleEpisodeChange(currentEpisodeNumber + 1)}
            disabled={currentEpisodeNumber >= anime.attributes.episodeCount}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Next Episode
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {currentEpisode && (
          <div className="mt-6">
            <h1 className="text-2xl font-bold mb-2">
              {anime.attributes.canonicalTitle} - Episode {currentEpisode.attributes.number}
            </h1>
            <p className="text-gray-400">{currentEpisode.attributes.synopsis}</p>
          </div>
        )}

        {showEpisodeList && (
          <div className="mt-6 bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Episodes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => handleEpisodeChange(ep.attributes.number)}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    ep.attributes.number === currentEpisodeNumber
                      ? 'bg-primary-600'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <div className="font-semibold">Episode {ep.attributes.number}</div>
                  <div className="text-sm text-gray-400 line-clamp-2">
                    {ep.attributes.canonicalTitle}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};