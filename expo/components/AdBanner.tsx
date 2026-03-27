import { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";

const AD_UNIT_ID = "ca-app-pub-2380681170791482/5248058130";

let BannerAd: any = null;
let BannerAdSize: any = null;

if (Platform.OS !== "web") {
  try {
    const ads = require("react-native-google-mobile-ads");
    BannerAd = ads.BannerAd;
    BannerAdSize = ads.BannerAdSize;
  } catch (e) {
    console.log("[AdBanner] react-native-google-mobile-ads not available:", e);
  }
}

export default function AdBanner() {
  const [adError, setAdError] = useState(false);

  if (Platform.OS === "web" || !BannerAd || !BannerAdSize) {
    return null;
  }

  if (adError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log("[AdBanner] Ad loaded successfully");
        }}
        onAdFailedToLoad={(error: any) => {
          console.log("[AdBanner] Ad failed to load:", error);
          setAdError(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
});
