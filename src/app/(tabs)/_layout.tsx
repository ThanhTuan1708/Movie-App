import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import { useMovies } from '../../lib/MoviesProvider';

export default function TabsLayout() {
  const { favorites } = useMovies();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: '#6200ee',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Movie App',
          tabBarLabel: 'Phim',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film-outline" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Phim yêu thích',
          tabBarLabel: 'Yêu thích',
          tabBarBadge: favorites.length > 0 ? favorites.length : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}
