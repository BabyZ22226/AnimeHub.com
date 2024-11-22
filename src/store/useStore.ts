import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AnimeList {
  id: string;
  name: string;
  animes: string[];
}

interface UserState {
  lists: AnimeList[];
  addList: (name: string) => void;
  removeList: (id: string) => void;
  addAnimeToList: (listId: string, animeId: string) => void;
  removeAnimeFromList: (listId: string, animeId: string) => void;
}

export const useStore = create<UserState>()(
  persist(
    (set) => ({
      lists: [
        { id: 'watching', name: 'Watching', animes: [] },
        { id: 'completed', name: 'Completed', animes: [] },
        { id: 'plan-to-watch', name: 'Plan to Watch', animes: [] },
      ],
      addList: (name) =>
        set((state) => ({
          lists: [
            ...state.lists,
            { id: Date.now().toString(), name, animes: [] },
          ],
        })),
      removeList: (id) =>
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
        })),
      addAnimeToList: (listId, animeId) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? { ...list, animes: [...new Set([...list.animes, animeId])] }
              : list
          ),
        })),
      removeAnimeFromList: (listId, animeId) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? { ...list, animes: list.animes.filter((id) => id !== animeId) }
              : list
          ),
        })),
    }),
    {
      name: 'anime-lists',
    }
  )
);