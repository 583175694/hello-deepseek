import "~/global.css";

import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SessionProvider } from "../contexts/SessionContext";
import { MessageSquare, Database } from "lucide-react-native";

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();

  React.useEffect(() => {
    if (Platform.OS === "android") {
      setAndroidNavigationBar(isDarkColorScheme ? "dark" : "light");
    }
  }, [isDarkColorScheme]);

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <Tabs
          screenOptions={{
            tabBarStyle: {
              backgroundColor: isDarkColorScheme ? "#1a1a1a" : "#ffffff",
            },
            tabBarActiveTintColor: isDarkColorScheme ? "#ffffff" : "#000000",
            tabBarInactiveTintColor: isDarkColorScheme ? "#666666" : "#999999",
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Chat",
              tabBarIcon: ({ color, size }) => (
                <MessageSquare size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="knowledge"
            options={{
              title: "Knowledge",
              tabBarIcon: ({ color, size }) => (
                <Database size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
