import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

const PALETTE = ['#4c1d95', '#1e3a8a', '#065f46', '#7c2d12', '#831843', '#134e4a', '#3f3f46'];

function colorFor(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) {
    hash = (hash * 31 + title.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

interface PosterProps {
  uri: string;
  title: string;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}

/** Hiển thị poster; nếu không có ảnh hoặc ảnh lỗi thì vẽ poster minh hoạ theo tên phim. */
export default function Poster({ uri, title, style, compact }: PosterProps) {
  const [failed, setFailed] = useState(false);
  const showImage = !!uri && !failed;

  return (
    <View style={[styles.box, { backgroundColor: colorFor(title) }, style]}>
      {showImage ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onError={() => setFailed(true)}
          accessibilityLabel={`Poster ${title}`}
        />
      ) : (
        <Text style={[styles.title, compact && styles.compactTitle]} numberOfLines={compact ? 3 : 4}>
          🎬{'\n'}
          {title}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  title: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center',
  },
  compactTitle: {
    fontSize: 10,
  },
});
