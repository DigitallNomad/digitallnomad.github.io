import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

let tapSound: Audio.Sound | null = null;
let welcomeSound: Audio.Sound | null = null;
let splashSound: Audio.Sound | null = null;
let isInitialized = false;

export async function initializeTapSound() {
  if (Platform.OS === "web" || isInitialized) {
    return;
  }

  try {
    console.log("[TapSound] Initializing audio mode...");
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
    });
    console.log("[TapSound] Audio mode configured");

    console.log("[TapSound] Loading tap sound file...");
    const { sound: tap } = await Audio.Sound.createAsync(
      { uri: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" },
      { shouldPlay: false, volume: 0.3 },
      (status) => {
        if (status.isLoaded) {
          console.log("[TapSound] Tap sound loaded successfully", status);
        }
      }
    );
    tapSound = tap;
    
    console.log("[TapSound] Loading welcome sound file...");
    const { sound: welcome } = await Audio.Sound.createAsync(
      { uri: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" },
      { shouldPlay: false, volume: 0.5 },
      (status) => {
        if (status.isLoaded) {
          console.log("[TapSound] Welcome sound loaded successfully", status);
        }
      }
    );
    welcomeSound = welcome;
    
    console.log("[TapSound] Loading splash sound file...");
    const { sound: splash } = await Audio.Sound.createAsync(
      require("../assets/sounds/splash.mp3"),
      { shouldPlay: false, volume: 0.5 },
      (status) => {
        if (status.isLoaded) {
          console.log("[TapSound] Splash sound loaded successfully", status);
        }
      }
    );
    splashSound = splash;
    
    isInitialized = true;
    console.log("[TapSound] Initialization complete");
  } catch (error) {
    console.error("[TapSound] Error initializing tap sound:", error);
  }
}

export async function playTapSound(enabled: boolean) {
  if (!enabled) {
    console.log("[TapSound] Sound disabled, skipping");
    return;
  }

  console.log("[TapSound] Playing tap sound, enabled:", enabled, "initialized:", isInitialized, "tapSound:", !!tapSound);

  if (Platform.OS !== "web") {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      console.log("[TapSound] Haptic feedback played");
    } catch (error) {
      console.error("[TapSound] Haptic feedback error:", error);
    }
  }

  if (Platform.OS !== "web" && tapSound) {
    try {
      const status = await tapSound.getStatusAsync();
      console.log("[TapSound] Sound status before play:", status);
      
      if (status.isLoaded) {
        await tapSound.setPositionAsync(0);
        await tapSound.playAsync();
        console.log("[TapSound] Sound played successfully");
      } else {
        console.error("[TapSound] Sound not loaded");
      }
    } catch (error) {
      console.error("[TapSound] Error playing tap sound:", error);
    }
  } else {
    console.log("[TapSound] Cannot play: Platform:", Platform.OS, "tapSound exists:", !!tapSound);
  }
}

export async function playWelcomeSound(enabled: boolean) {
  console.log("[WelcomeSound] called, enabled:", enabled, "Platform:", Platform.OS, "welcomeSound exists:", !!welcomeSound);

  if (!enabled) {
    console.log("[WelcomeSound] Sound disabled by user, skipping");
    return;
  }

  if (Platform.OS !== "web" && welcomeSound) {
    try {
      const status = await welcomeSound.getStatusAsync();
      console.log("[WelcomeSound] Sound status before play:", status);
      
      if (status.isLoaded) {
        console.log("[WelcomeSound] Sound loaded, playing now...");
        await welcomeSound.setPositionAsync(0);
        await welcomeSound.playAsync();
        console.log("[WelcomeSound] Sound played successfully");
      } else {
        console.error("[WelcomeSound] Sound not loaded");
      }
    } catch (error) {
      console.error("[WelcomeSound] Error playing sound:", error);
    }
  } else {
    console.log("[WelcomeSound] Cannot play: Platform:", Platform.OS, "welcomeSound exists:", !!welcomeSound);
  }
}

export async function unloadTapSound() {
  if (tapSound) {
    try {
      await tapSound.unloadAsync();
      tapSound = null;
      console.log("[TapSound] Tap sound unloaded");
    } catch (error) {
      console.error("[TapSound] Error unloading tap sound:", error);
    }
  }
  
  if (welcomeSound) {
    try {
      await welcomeSound.unloadAsync();
      welcomeSound = null;
      console.log("[TapSound] Welcome sound unloaded");
    } catch (error) {
      console.error("[TapSound] Error unloading welcome sound:", error);
    }
  }
  
  if (splashSound) {
    try {
      await splashSound.unloadAsync();
      splashSound = null;
      console.log("[TapSound] Splash sound unloaded");
    } catch (error) {
      console.error("[TapSound] Error unloading splash sound:", error);
    }
  }
  
  isInitialized = false;
}

export async function playSplashSound(enabled: boolean) {
  console.log("[SplashSound] called, enabled:", enabled, "Platform:", Platform.OS, "splashSound exists:", !!splashSound);

  if (!enabled) {
    console.log("[SplashSound] Sound disabled by user, skipping");
    return;
  }

  if (Platform.OS !== "web" && splashSound) {
    try {
      const status = await splashSound.getStatusAsync();
      console.log("[SplashSound] Sound status before play:", status);
      
      if (status.isLoaded) {
        console.log("[SplashSound] Sound loaded, playing now...");
        await splashSound.setPositionAsync(0);
        await splashSound.playAsync();
        console.log("[SplashSound] Sound played successfully");
      } else {
        console.error("[SplashSound] Sound not loaded");
      }
    } catch (error) {
      console.error("[SplashSound] Error playing sound:", error);
    }
  } else {
    console.log("[SplashSound] Cannot play: Platform:", Platform.OS, "splashSound exists:", !!splashSound);
  }
}
