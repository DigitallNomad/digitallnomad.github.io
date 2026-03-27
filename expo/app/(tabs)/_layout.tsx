import { Tabs } from "expo-router";
import { Home, PieChart, Wallet, Target, Settings } from "lucide-react-native";
import React from "react";
import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { playTapSound } from "@/utils/tapSound";

export default function TabLayout() {
  const { theme, tapSoundEnabled } = useApp();
  const currentColors = theme === "dark" ? Colors.dark : Colors.light;

  const handleTabPress = () => {
    playTapSound(tapSoundEnabled);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: currentColors.tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: currentColors.cardBackground,
          borderTopColor: currentColors.border,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistics",
          tabBarIcon: ({ color, size }) => <PieChart color={color} size={size} />,
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: "Accounts",
          tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: "Budgets",
          tabBarIcon: ({ color, size }) => <Target color={color} size={size} />,
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
    </Tabs>
  );
}
