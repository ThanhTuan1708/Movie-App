import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Poster from './Poster';
import { formatRating, type Movie } from '../lib/movies';

export type { Movie } from '../lib/movies';

export interface MovieCardProps {
  movie: Movie;
  layout?: 'row' | 'tile';
  favorite?: boolean;
  onSelect: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  layout = 'row',
  favorite = false,
  onSelect,
  onToggleFavorite,
}) => {
  const isTile = layout === 'tile';

  return (
    <Pressable
      style={({ pressed }) => [styles.card, isTile && styles.cardTile, pressed && styles.pressed]}
      onPress={() => onSelect(movie.id)}
      accessibilityRole="button"
      accessibilityLabel={movie.title}
    >
      <View style={[styles.posterContainer, isTile && styles.posterContainerTile]}>
        <Poster
          uri={movie.poster}
          title={movie.title}
          compact={!isTile}
          style={isTile ? styles.posterTile : styles.poster}
        />
        {isTile && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingBadgeText}>⭐ {formatRating(movie.rating)}</Text>
          </View>
        )}
      </View>
      <View style={[styles.infoContainer, isTile && styles.infoContainerTile]}>
        <Text style={[styles.title, isTile && styles.titleTile]} numberOfLines={isTile ? 1 : 2}>
          {movie.title}
        </Text>
        {!isTile && (
          <Text style={styles.details}>
            {movie.genre} | {movie.year || '—'}
          </Text>
        )}
        {!isTile && <Text style={styles.ratingText}>⭐ {formatRating(movie.rating)}</Text>}
        <Text style={[styles.status, isTile && styles.statusTile]}>
          {movie.isShowing ? 'Đang chiếu ✅' : 'Ngừng chiếu ❌'}
        </Text>
      </View>
      {onToggleFavorite ? (
        <Pressable
          testID={`fav-${movie.id}`}
          onPress={() => onToggleFavorite(movie.id)}
          style={[styles.favButton, isTile && styles.favButtonTile]}
          accessibilityRole="button"
          accessibilityLabel={favorite ? `Bỏ yêu thích ${movie.title}` : `Yêu thích ${movie.title}`}
        >
          <Text style={[styles.favIcon, favorite && styles.favIconActive]}>
            {favorite ? '♥' : '♡'}
          </Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  cardTile: {
    flexDirection: 'column',
    padding: 0,
    marginBottom: 0,
    flex: 1,
    margin: 6,
  },
  pressed: {
    opacity: 0.8,
  },
  posterContainer: {
    position: 'relative',
  },
  posterContainerTile: {
    width: '100%',
  },
  poster: {
    width: 70,
    height: 100,
    borderRadius: 8,
  },
  posterTile: {
    width: '100%',
    aspectRatio: 2 / 3,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingBadgeText: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-around',
  },
  infoContainerTile: {
    marginLeft: 0,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    paddingRight: 28,
  },
  titleTile: {
    fontSize: 14,
    marginBottom: 4,
    paddingRight: 0,
  },
  details: {
    fontSize: 13,
    color: '#6b7280',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d97706',
  },
  status: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  statusTile: {
    fontSize: 12,
  },
  favButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favButtonTile: {
    top: 6,
    right: 6,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  favIcon: {
    fontSize: 22,
    color: '#9ca3af',
  },
  favIconActive: {
    color: '#e11d48',
  },
});

export default React.memo(MovieCard);
