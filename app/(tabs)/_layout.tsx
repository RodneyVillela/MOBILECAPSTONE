import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, theme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopWidth: 0.5,
          borderTopColor: theme.colors.border,
          elevation: 0,
          shadowOpacity: 0.08,
          shadowRadius: 10,
          backgroundColor: Colors[colorScheme ?? 'light'].surface,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="feed-monitor"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="clipboard.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="disease-detection"
        options={{
          title: 'Detect',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="camera.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="harvest-prediction"
        options={{
          title: 'Harvest',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="calendar" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="clipboard.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}