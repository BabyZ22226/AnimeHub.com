export interface Anime {
  id: string;
  type: string;
  attributes: {
    canonicalTitle: string;
    synopsis: string;
    posterImage: {
      tiny: string;
      small: string;
      medium: string;
      large: string;
      original: string;
    };
    coverImage?: {
      tiny: string;
      small: string;
      large: string;
      original: string;
    };
    averageRating: string;
    status: string;
    episodeCount: number;
    startDate: string;
    genres?: {
      data: Array<{
        id: string;
        attributes: {
          name: string;
        };
      }>;
    };
    episodes?: {
      data: AnimeEpisode[];
    };
  };
}

export interface AnimeEpisode {
  id: string;
  type: string;
  attributes: {
    canonicalTitle: string;
    synopsis: string;
    number: number;
    airdate: string;
    thumbnail?: {
      original: string;
      small: string;
    };
  };
}