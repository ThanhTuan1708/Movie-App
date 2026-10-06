import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import MovieCard, { Movie } from './Components/MovieCard';

const API_URL = 'https://6abb544eb2118ed7abb83e61.mockapi.io/MovieApp';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isGrid, setIsGrid] = useState<boolean>(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách phim:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSelectMovie = useCallback(
    (id: string) => {
      const selectedMovie = movies.find((m) => m.id === id);
      if (selectedMovie) {
        Alert.alert('Chi tiết phim', `Bạn đã chọn phim: ${selectedMovie.title}`);
      }
    },
    [movies]
  );

  const numColumns = isGrid ? 2 : 1;
  const layout = isGrid ? 'tile' : 'row';

  const renderMovieItem = useCallback(
    ({ item }: { item: Movie }) => (
      <View style={isGrid ? styles.gridCardContainer : styles.listCardContainer}>
        <MovieCard
          movie={item}
          layout={layout}
          onSelect={handleSelectMovie}
        />
      </View>
    ),
    [isGrid, layout, handleSelectMovie]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6200ee" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Movie App</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Dạng lưới</Text>
          <Switch
            value={isGrid}
            onValueChange={(value) => setIsGrid(value)}
            trackColor={{ false: '#767577', true: '#a78bfa' }}
            thumbColor={isGrid ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Đang tải danh sách phim...</Text>
        </View>
      ) : (
        <FlatList
          key={String(numColumns)}
          data={movies}
          numColumns={numColumns}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={isGrid ? styles.columnWrapper : undefined}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#6200ee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    color: '#ffffff',
    marginRight: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  listContainer: {
    padding: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  listCardContainer: {
    width: '100%',
  },
  gridCardContainer: {
    width: '48.5%',
  },
});