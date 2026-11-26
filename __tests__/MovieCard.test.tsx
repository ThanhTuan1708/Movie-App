import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import MovieCard from '../src/components/MovieCard';
import { SAMPLE_MOVIES } from '../src/data/sampleMovies';

const movie = SAMPLE_MOVIES[2];

describe('MovieCard', () => {
  it('shows genre/year only in row layout', async () => {
    const row = await render(<MovieCard movie={movie} onSelect={jest.fn()} />);
    expect(row.getByText(`${movie.genre} | ${movie.year}`)).toBeTruthy();
    await row.unmount();

    const tile = await render(<MovieCard movie={movie} layout="tile" onSelect={jest.fn()} />);
    expect(tile.queryByText(`${movie.genre} | ${movie.year}`)).toBeNull();
  });

  it('selects the movie and toggles favorite independently', async () => {
    const onSelect = jest.fn();
    const onToggleFavorite = jest.fn();
    const { getByTestId, getByLabelText } = await render(
      <MovieCard movie={movie} onSelect={onSelect} onToggleFavorite={onToggleFavorite} />
    );

    await fireEvent.press(getByTestId(`fav-${movie.id}`));
    expect(onToggleFavorite).toHaveBeenCalledWith(movie.id);
    expect(onSelect).not.toHaveBeenCalled();

    await fireEvent.press(getByLabelText(movie.title));
    expect(onSelect).toHaveBeenCalledWith(movie.id);
  });
});
