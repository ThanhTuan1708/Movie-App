import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

export interface Movie {
  id: string;
  title: string;
  genre: string;
  year: number;
  rating: number;
  poster: string;
  isShowing: boolean;
}

export interface MovieCardProps {
  movie: Movie;
  layout?: 'row' | 'tile';
  onSelect: (id: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  layout = 'row',
  onSelect,
}) => {
  const isTile = layout === 'tile';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.card, isTile && styles.cardTile]}
      onPress={() => onSelect(movie.id)}
    >
      <View style={[styles.posterContainer, isTile && styles.posterContainerTile]}>
        <Image
          source={{ uri: movie.poster || 'https://via.placeholder.com/100x150' }}
          style={[styles.poster, isTile && styles.posterTile]}
          resizeMode="cover"
        />
        {isTile && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingBadgeText}>
              ⭐ {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
            </Text>
          </View>
        )}
      </View>
      <View style={[styles.infoContainer, isTile && styles.infoContainerTile]}>
        <Text
          style={[styles.title, isTile && styles.titleTile]}
          numberOfLines={1}
        >
          {movie.title}
        </Text>
        {!isTile && (
          <Text style={styles.details}>
            {movie.genre} | {movie.year}
          </Text>
        )}
        {!isTile && (
          <Text style={styles.ratingText}>
            ⭐ {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
          </Text>
        )}
        <Text style={[styles.status, isTile && styles.statusTile]}>
          {movie.isShowing ? 'Đang chiếu ✅' : 'Ngừng chiếu ❌'}
        </Text>
      </View>
    </TouchableOpacity>
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
    backgroundColor: '#e0e0e0',
  },
  posterTile: {
    width: '100%',
    height: undefined,
    aspectRatio: 2 / 3,
    borderRadius: 0,
  },


  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
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
  },
  titleTile: {
    fontSize: 14,
    marginBottom: 4,
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
});

export default React.memo(MovieCard);