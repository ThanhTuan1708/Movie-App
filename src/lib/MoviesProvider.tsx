import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import { SAMPLE_MOVIES } from '../data/sampleMovies';
import { fetchMovies, type Movie } from './movies';

const FAVORITES_KEY = 'movie-app/favorites/v1';

type Source = 'api' | 'offline';

interface MoviesContextValue {
  movies: Movie[];
  loading: boolean;
  refreshing: boolean;
  source: Source;
  error: string | null;
  reload: (isRefresh?: boolean) => Promise<void>;
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  getMovie: (id: string) => Movie | undefined;
}

const MoviesContext = createContext<MoviesContextValue | null>(null);

interface LoadResult {
  movies: Movie[];
  source: Source;
  error: string | null;
}

/** Tải phim từ API; nếu lỗi thì trả về dữ liệu mẫu kèm thông báo lỗi. */
async function loadMovies(): Promise<LoadResult> {
  try {
    return { movies: await fetchMovies(API_URL), source: 'api', error: null };
  } catch (e) {
    return {
      movies: SAMPLE_MOVIES,
      source: 'offline',
      error: e instanceof Error ? e.message : 'Lỗi không xác định.',
    };
  }
}

export function MoviesProvider({ children }: { children: React.ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [source, setSource] = useState<Source>('api');
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const favoritesLoaded = useRef(false);

  const applyResult = useCallback((result: LoadResult) => {
    setMovies(result.movies);
    setSource(result.source);
    setError(result.error);
    setLoading(false);
    setRefreshing(false);
  }, []);

  const reload = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      applyResult(await loadMovies());
    },
    [applyResult]
  );

  useEffect(() => {
    loadMovies().then(applyResult);
    AsyncStorage.getItem(FAVORITES_KEY)
      .then((raw) => {
        const saved = raw ? JSON.parse(raw) : [];
        if (Array.isArray(saved)) {
          setFavorites(saved.map(String));
        }
      })
      .catch((e) => console.warn('Không đọc được danh sách yêu thích', e))
      .finally(() => {
        favoritesLoaded.current = true;
      });
  }, [applyResult]);

  useEffect(() => {
    if (!favoritesLoaded.current) {
      return;
    }
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)).catch((e) =>
      console.warn('Không lưu được danh sách yêu thích', e)
    );
  }, [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    favoritesLoaded.current = true;
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const value = useMemo<MoviesContextValue>(
    () => ({
      movies,
      loading,
      refreshing,
      source,
      error,
      reload,
      favorites,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite,
      getMovie: (id) => movies.find((movie) => movie.id === id),
    }),
    [movies, loading, refreshing, source, error, reload, favorites, toggleFavorite]
  );

  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
}

export function useMovies(): MoviesContextValue {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error('useMovies must be used inside <MoviesProvider>');
  }
  return context;
}
