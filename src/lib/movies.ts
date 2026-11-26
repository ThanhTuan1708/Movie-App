export interface Movie {
  id: string;
  title: string;
  genre: string;
  year: number;
  rating: number;
  poster: string;
  isShowing: boolean;
  description?: string;
  duration?: number;
}

export type SortKey = 'rating' | 'year' | 'title';

export interface MovieFilter {
  query: string;
  genre: string; // 'Tất cả' = không lọc
  showingOnly: boolean;
  sort: SortKey;
}

export const ALL_GENRES = 'Tất cả';

/** Chuẩn hoá một bản ghi từ API; trả về null nếu thiếu dữ liệu bắt buộc. */
export function normalizeMovie(raw: unknown): Movie | null {
  if (typeof raw !== 'object' || raw === null) {
    return null;
  }
  const r = raw as Record<string, unknown>;
  const id = r.id !== undefined && r.id !== null ? String(r.id) : '';
  const title = typeof r.title === 'string' ? r.title.trim() : '';
  if (!id || !title) {
    return null;
  }
  const year = Number(r.year);
  const rating = Number(r.rating);
  return {
    id,
    title,
    genre: typeof r.genre === 'string' && r.genre.trim() ? r.genre.trim() : 'Khác',
    year: Number.isFinite(year) ? Math.trunc(year) : 0,
    rating: Number.isFinite(rating) ? Math.min(Math.max(rating, 0), 10) : 0,
    poster: typeof r.poster === 'string' ? r.poster : '',
    isShowing: r.isShowing === true || r.isShowing === 'true',
    description: typeof r.description === 'string' ? r.description : undefined,
    duration: Number.isFinite(Number(r.duration)) ? Number(r.duration) : undefined,
  };
}

export function parseMovies(data: unknown): Movie[] {
  if (!Array.isArray(data)) {
    throw new Error('Dữ liệu phim không hợp lệ.');
  }
  return data.map(normalizeMovie).filter((movie): movie is Movie => movie !== null);
}

export async function fetchMovies(url: string, signal?: AbortSignal): Promise<Movie[]> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Máy chủ trả về mã lỗi ${response.status}.`);
  }
  return parseMovies(await response.json());
}

export function getGenres(movies: Movie[]): string[] {
  const genres = Array.from(new Set(movies.map((movie) => movie.genre)));
  genres.sort((a, b) => a.localeCompare(b, 'vi'));
  return [ALL_GENRES, ...genres];
}

export function applyFilter(movies: Movie[], filter: MovieFilter): Movie[] {
  const query = filter.query.trim().toLocaleLowerCase('vi');
  const result = movies.filter(
    (movie) =>
      (filter.genre === ALL_GENRES || movie.genre === filter.genre) &&
      (!filter.showingOnly || movie.isShowing) &&
      (!query || movie.title.toLocaleLowerCase('vi').includes(query))
  );
  const sorted = [...result];
  switch (filter.sort) {
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating || a.title.localeCompare(b.title, 'vi'));
      break;
    case 'year':
      sorted.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title, 'vi'));
      break;
    case 'title':
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
      break;
  }
  return sorted;
}

export function formatRating(rating: number): string {
  return rating > 0 ? rating.toFixed(1) : 'N/A';
}
