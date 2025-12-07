import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AppProvider, useApp } from "@/contexts/AppContext";
import Colors from "@/constants/colors";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isFirstTime, isLoading, theme } = useApp();
  const segments = useSegments();
  const router = useRouter();
  const currentColors = theme === "dark" ? Colors.dark : Colors.light;

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(tabs)";

    if (isFirstTime && inAuthGroup) {
      router.replace("/welcome");
    } else if (!isFirstTime && segments[0] === "welcome") {
      router.replace("/(tabs)");
    }

    SplashScreen.hideAsync();
  }, [isFirstTime, segments, isLoading, router]);

  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerBackTitle: "Back" }}>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="add-transaction" 
          options={{ 
            presentation: "modal",
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="add-account" 
          options={{ 
            presentation: "modal",
            title: "Add Account",
            headerStyle: {
              backgroundColor: currentColors.background,
            },
            headerTintColor: currentColors.text,
          }} 
        />
        <Stack.Screen 
          name="set-budget" 
          options={{ 
            presentation: "modal",
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="edit-budget" 
          options={{ 
            presentation: "modal",
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="select-currency" 
          options={{ 
            presentation: "modal",
            title: "Select Currency",
            headerStyle: {
              backgroundColor: currentColors.background,
            },
            headerTintColor: currentColors.text,
          }} 
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProvider>
          <RootLayoutNav />
        </AppProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
