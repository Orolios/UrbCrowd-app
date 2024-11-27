import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tabText,
        tabBarInactiveTintColor: Colors.text,
        tabBarActiveBackgroundColor: Colors.tab,
        tabBarInactiveBackgroundColor: Colors.tab,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={focused ? Colors.tabText : Colors.text}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: "mapa",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "map" : "map-outline"} color={focused ? Colors.tabText : Colors.text} />
          ),
        }}
      />
    </Tabs>
  );
}
