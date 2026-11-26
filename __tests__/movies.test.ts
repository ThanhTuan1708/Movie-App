import { describe, expect, it } from '@jest/globals';
import { SAMPLE_MOVIES } from '../src/data/sampleMovies';
import {
  ALL_GENRES,
  applyFilter,
  formatRating,
  getGenres,
  normalizeMovie,
  parseMovies,
  type MovieFilter,
} from '../src/lib/movies';

const base: MovieFilter = { query: '', genre: ALL_GENRES, showingOnly: false, sort: 'rating' };

describe('normalizeMovie / parseMovies', () => {
  it('coerces API values and clamps the rating', () => {
    expect(
      normalizeMovie({ id: 7, title: ' Avatar ', genre: '', year: '2009', rating: 12, isShowing: 'true' })
    ).toEqual({
      id: '7',
      title: 'Avatar',
      genre: 'Khác',
      year: 2009,
      rating: 10,
      poster: '',
      isShowing: true,
      description: undefined,
      duration: undefined,
    });
  });

  it('drops records without id or title and rejects non-arrays', () => {
    expect(parseMovies([{ id: 1 }, { title: 'X' }, { id: 2, title: 'Ok' }]).map((m) => m.id)).toEqual(['2']);
    expect(() => parseMovies({ message: 'Not found' })).toThrow();
  });
});

describe('applyFilter', () => {
  it('sorts by rating desc by default', () => {
    const ratings = applyFilter(SAMPLE_MOVIES, base).map((m) => m.rating);
    expect(ratings).toEqual([...ratings].sort((a, b) => b - a));
  });

  it('filters by genre, showing status and title', () => {
    const anim = applyFilter(SAMPLE_MOVIES, { ...base, genre: 'Hoạt hình' });
    expect(anim.every((m) => m.genre === 'Hoạt hình')).toBe(true);

    const showing = applyFilter(SAMPLE_MOVIES, { ...base, showingOnly: true });
    expect(showing.length).toBeGreaterThan(0);
    expect(showing.every((m) => m.isShowing)).toBe(true);

    expect(applyFilter(SAMPLE_MOVIES, { ...base, query: 'DUNE' }).map((m) => m.id)).toEqual(['s3']);
  });

  it('sorts by year desc and by title', () => {
    const years = applyFilter(SAMPLE_MOVIES, { ...base, sort: 'year' }).map((m) => m.year);
    expect(years).toEqual([...years].sort((a, b) => b - a));
    const titles = applyFilter(SAMPLE_MOVIES, { ...base, sort: 'title' }).map((m) => m.title);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b, 'vi')));
  });
});

describe('helpers', () => {
  it('lists genres with the "all" option first', () => {
    const genres = getGenres(SAMPLE_MOVIES);
    expect(genres[0]).toBe(ALL_GENRES);
    expect(new Set(genres).size).toBe(genres.length);
  });

  it('formats rating', () => {
    expect(formatRating(8.06)).toBe('8.1');
    expect(formatRating(0)).toBe('N/A');
  });
});
