import axios from 'axios';
import type { Anime, AnimeEpisode } from '../types/anime';

const api = axios.create({
  baseURL: 'https://kitsu.io/api/edge',
  headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
  },
});

interface SearchFilters {
  genres?: string[];
  year?: string;
  rating?: string;
  minScore?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    count: number;
  };
  links: {
    first: string;
    prev?: string;
    next?: string;
    last: string;
  };
}

export const searchAnime = async (
  query: string,
  filters: SearchFilters = {},
  page: number = 1,
  limit: number = 20,
  locale: string = 'en'
): Promise<PaginatedResponse<Anime>> => {
  const params: Record<string, any> = {
    'page[limit]': limit,
    'page[offset]': (page - 1) * limit,
    'fields[anime]': 'canonicalTitle,synopsis,posterImage,coverImage,averageRating,status,episodeCount,startDate,genres',
    'include': 'genres',
  };

  if (query) {
    params['filter[text]'] = query;
  }

  if (filters.genres?.length) {
    params['filter[categories]'] = filters.genres.join(',');
  }

  if (filters.year) {
    params['filter[seasonYear]'] = filters.year;
  }

  if (filters.rating) {
    params['filter[ageRating]'] = filters.rating;
  }

  if (filters.minScore) {
    params['filter[averageRating]'] = `${filters.minScore * 20}..`;
  }

  const response = await api.get('/anime', {
    params,
    headers: {
      'Accept-Language': locale,
    },
  });
  return response.data;
};

export const fetchTrendingAnime = async (locale: string = 'en'): Promise<Anime[]> => {
  const response = await api.get('/trending/anime', {
    params: {
      'fields[anime]': 'canonicalTitle,synopsis,posterImage,coverImage,averageRating,status,episodeCount,startDate,genres',
      'include': 'genres',
      'page[limit]': 20,
    },
    headers: {
      'Accept-Language': locale,
    },
  });
  return response.data.data;
};

export const fetchPopularAnime = async (locale: string = 'en'): Promise<Anime[]> => {
  const response = await api.get('/anime', {
    params: {
      'sort': '-averageRating',
      'fields[anime]': 'canonicalTitle,synopsis,posterImage,coverImage,averageRating,status,episodeCount,startDate,genres',
      'include': 'genres',
      'page[limit]': 20,
    },
    headers: {
      'Accept-Language': locale,
    },
  });
  return response.data.data;
};

export const fetchAnimeDetails = async (id: string, locale: string = 'en'): Promise<Anime> => {
  const response = await api.get(`/anime/${id}`, {
    params: {
      'include': 'episodes,genres',
      'fields[episodes]': 'canonicalTitle,synopsis,number,airdate,thumbnail',
    },
    headers: {
      'Accept-Language': locale,
    },
  });
  return response.data.data;
};

export const fetchAnimeEpisodes = async (id: string, locale: string = 'en'): Promise<AnimeEpisode[]> => {
  const response = await api.get(`/anime/${id}/episodes`, {
    params: {
      'page[limit]': 20,
      'sort': 'number',
    },
    headers: {
      'Accept-Language': locale,
    },
  });
  return response.data.data;
};