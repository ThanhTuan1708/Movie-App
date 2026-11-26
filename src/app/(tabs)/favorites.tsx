import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import MovieCard from '../../components/MovieCard';
import { useMovies } from '../../lib/MoviesProvider';

export default function FavoritesScreen() {
  const { movies, favorites, toggleFavorite } = useMovies();
  const items = movies.filter((movie) => favorites.includes(movie.id));

  const open = useCallback((id: string) => {
    router.push({ pathname: '/movie/[id]', params: { id } });
  }, []);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MovieCard movie={item} favorite onSelect={open} onToggleFavorite={toggleFavorite} />
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyText}>Chưa có phim yêu thích.{'\n'}Chạm ♡ trên một phim để lưu.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 10,
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
    color: '#d1d5db',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    lineHeight: 20,
  },
});
