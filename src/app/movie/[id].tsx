import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import Poster from '../../components/Poster';
import { useMovies } from '../../lib/MoviesProvider';
import { formatRating } from '../../lib/movies';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getMovie, isFavorite, toggleFavorite } = useMovies();
  const movie = getMovie(String(id));

  if (!movie) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.muted}>Không tìm thấy phim.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Quay lại</Text>
        </Pressable>
      </View>
    );
  }

  const favorite = isFavorite(movie.id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: movie.title }} />
      <View style={styles.hero}>
        <Poster uri={movie.poster} title={movie.title} style={styles.poster} />
        <View style={styles.heroInfo}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.meta}>
            {movie.genre} · {movie.year || '—'}
            {movie.duration ? ` · ${movie.duration} phút` : ''}
          </Text>
          <Text style={styles.rating}>⭐ {formatRating(movie.rating)} / 10</Text>
          <View style={[styles.badge, movie.isShowing ? styles.badgeOn : styles.badgeOff]}>
            <Text style={[styles.badgeText, movie.isShowing ? styles.badgeTextOn : styles.badgeTextOff]}>
              {movie.isShowing ? 'Đang chiếu' : 'Ngừng chiếu'}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.section}>Nội dung</Text>
      <Text style={styles.description}>
        {movie.description?.trim() || 'Chưa có mô tả cho phim này.'}
      </Text>

      <Pressable
        style={[styles.button, favorite && styles.buttonOutline]}
        onPress={() => toggleFavorite(movie.id)}
        accessibilityRole="button"
      >
        <Text style={[styles.buttonText, favorite && styles.buttonTextOutline]}>
          {favorite ? '♥ Đã yêu thích — bỏ yêu thích' : '♡ Thêm vào yêu thích'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  muted: {
    color: '#6b7280',
  },
  link: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  hero: {
    flexDirection: 'row',
    gap: 14,
  },
  poster: {
    width: 130,
    aspectRatio: 2 / 3,
    borderRadius: 12,
  },
  heroInfo: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  meta: {
    color: '#6b7280',
  },
  rating: {
    color: '#d97706',
    fontWeight: '700',
    fontSize: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeOn: {
    backgroundColor: '#dcfce7',
  },
  badgeOff: {
    backgroundColor: '#fee2e2',
  },
  badgeText: {
    fontWeight: '600',
    fontSize: 12,
  },
  badgeTextOn: {
    color: '#166534',
  },
  badgeTextOff: {
    color: '#991b1b',
  },
  section: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  description: {
    color: '#374151',
    lineHeight: 21,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#6200ee',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e11d48',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  buttonTextOutline: {
    color: '#e11d48',
  },
});
