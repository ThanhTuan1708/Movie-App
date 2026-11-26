import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MoviesProvider } from '../lib/MoviesProvider';

export default function RootLayout() {
  return (
    <MoviesProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#f5f5f5' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Movie App' }} />
        <Stack.Screen name="movie/[id]" options={{ title: 'Chi tiết phim' }} />
      </Stack>
    </MoviesProvider>
  );
}
