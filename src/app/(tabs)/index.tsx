import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import MovieCard from '../../components/MovieCard';
import { useMovies } from '../../lib/MoviesProvider';
import { ALL_GENRES, applyFilter, getGenres, type Movie, type SortKey } from '../../lib/movies';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'rating', label: 'Điểm cao' },
  { key: 'year', label: 'Mới nhất' },
  { key: 'title', label: 'Tên A-Z' },
];

export default function MoviesScreen() {
  const { movies, loading, refreshing, source, error, reload, isFavorite, toggleFavorite } =
    useMovies();
  const [isGrid, setIsGrid] = useState(false);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState(ALL_GENRES);
  const [showingOnly, setShowingOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>('rating');

  const genres = useMemo(() => getGenres(movies), [movies]);
  const visible = useMemo(
    () => applyFilter(movies, { query, genre, showingOnly, sort }),
    [movies, query, genre, showingOnly, sort]
  );

  const handleSelectMovie = useCallback((id: string) => {
    router.push({ pathname: '/movie/[id]', params: { id } });
  }, []);

  const numColumns = isGrid ? 2 : 1;

  const renderMovieItem = useCallback(
    ({ item }: { item: Movie }) => (
      <View style={isGrid ? styles.gridCardContainer : styles.listCardContainer}>
        <MovieCard
          movie={item}
          layout={isGrid ? 'tile' : 'row'}
          favorite={isFavorite(item.id)}
          onSelect={handleSelectMovie}
          onToggleFavorite={toggleFavorite}
        />
      </View>
    ),
    [isGrid, isFavorite, handleSelectMovie, toggleFavorite]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Đang tải danh sách phim...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {source === 'offline' ? (
        <Pressable style={styles.offline} onPress={() => void reload()} accessibilityRole="button">
          <Text style={styles.offlineText}>
            Không kết nối được API ({error?.replace(/\.$/, '')}). Đang hiển thị dữ liệu mẫu — chạm để thử lại.
          </Text>
        </Pressable>
      ) : null}

      <View style={styles.toolbar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm phim theo tên..."
          placeholderTextColor="#9ca3af"
          style={styles.search}
          accessibilityLabel="Tìm phim theo tên"
        />
        <View style={styles.switchRow}>
          <View style={styles.switchItem}>
            <Switch
              value={showingOnly}
              onValueChange={setShowingOnly}
              trackColor={{ false: '#d1d5db', true: '#a78bfa' }}
              thumbColor={showingOnly ? '#6200ee' : '#f4f3f4'}
              accessibilityLabel="Chỉ phim đang chiếu"
            />
            <Text style={styles.switchLabel}>Đang chiếu</Text>
          </View>
          <View style={styles.switchItem}>
            <Switch
              value={isGrid}
              onValueChange={setIsGrid}
              trackColor={{ false: '#d1d5db', true: '#a78bfa' }}
              thumbColor={isGrid ? '#6200ee' : '#f4f3f4'}
              accessibilityLabel="Dạng lưới"
            />
            <Text style={styles.switchLabel}>Dạng lưới</Text>
          </View>
        </View>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {genres.map((item) => (
            <Chip key={item} label={item} active={item === genre} onPress={() => setGenre(item)} />
          ))}
        </ScrollView>
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sắp xếp:</Text>
          {SORTS.map((item) => (
            <Chip
              key={item.key}
              label={item.label}
              active={item.key === sort}
              onPress={() => setSort(item.key)}
              small
            />
          ))}
        </View>
      </View>

      <FlatList
        key={String(numColumns)}
        data={visible}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={renderMovieItem}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={isGrid ? styles.columnWrapper : undefined}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void reload(true)}
            colors={['#6200ee']}
            tintColor="#6200ee"
          />
        }
        ListEmptyComponent={<Text style={styles.empty}>Không có phim phù hợp</Text>}
      />
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
  small,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  small?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, small && styles.chipSmall, active && styles.chipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.chipText, small && styles.chipTextSmall, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  offline: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  offlineText: {
    color: '#92400e',
    fontSize: 12,
  },
  toolbar: {
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 8,
  },
  search: {
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: '#111827',
  },
  switchRow: {
    flexDirection: 'row',
    gap: 16,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchLabel: {
    color: '#374151',
    fontWeight: '500',
  },
  chips: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  sortLabel: {
    color: '#6b7280',
    fontSize: 13,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  chipText: {
    color: '#374151',
    fontWeight: '500',
  },
  chipTextSmall: {
    fontSize: 12,
  },
  chipTextActive: {
    color: '#ffffff',
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
    width: '50%',
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 40,
  },
});
