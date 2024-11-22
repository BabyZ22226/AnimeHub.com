import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www3.animeflv.net';

interface AnimeEpisodeStream {
  url: string;
  server: string;
}

export const searchAnimeFlv = async (title: string): Promise<string | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/browse?q=${encodeURIComponent(title)}`);
    const $ = cheerio.load(response.data);
    const firstResult = $('.Title').first();
    if (firstResult.length) {
      const href = firstResult.parent().attr('href');
      return href ? href.split('/').pop() || null : null;
    }
    return null;
  } catch (error) {
    console.error('Error searching anime:', error);
    return null;
  }
};

export const getEpisodeStreams = async (animeId: string, episode: number): Promise<AnimeEpisodeStream[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/ver/${animeId}-${episode}`);
    const $ = cheerio.load(response.data);
    
    const streams: AnimeEpisodeStream[] = [];
    $('.RTbl.Dl').find('a').each((_, element) => {
      const server = $(element).text().trim();
      const url = $(element).attr('href');
      if (url && server) {
        streams.push({ url, server });
      }
    });
    
    return streams;
  } catch (error) {
    console.error('Error getting episode streams:', error);
    return [];
  }
};