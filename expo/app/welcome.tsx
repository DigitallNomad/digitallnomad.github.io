import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,

} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect, useRef } from "react";

import Colors from "@/constants/colors";
import { playTapSound, playWelcomeSound } from "@/utils/tapSound";
import { useApp } from "@/contexts/AppContext";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { markAsReturningUser, tapSoundEnabled } = useApp();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const sloganOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(50)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log("[Welcome] Screen mounted, tapSoundEnabled:", tapSoundEnabled);
    playWelcomeSound(tapSoundEnabled);
    
    Animated.sequence([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(sloganOpacity, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(buttonTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleGetStarted = async () => {
    playTapSound(tapSoundEnabled);
    await markAsReturningUser();
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>🦊</Text>
          </View>
          <Text style={styles.appName}>ExpenseFox</Text>
        </Animated.View>

        <Animated.View style={[styles.sloganContainer, { opacity: sloganOpacity }]}>
          <Text style={styles.slogan}>Track Smart, Spend Smarter</Text>
          <Text style={styles.subSlogan}>Your personal finance companion</Text>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslateY }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.tint,
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 72,
  },
  appName: {
    fontSize: 42,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  sloganContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  slogan: {
    fontSize: 24,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 32,
  },
  subSlogan: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
  },
  getStartedButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.tint,
    letterSpacing: 0.5,
  },
});
