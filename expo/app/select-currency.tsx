import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,

} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import { Search, Check } from "lucide-react-native";

import Colors from "@/constants/colors";
import { playTapSound } from "@/utils/tapSound";
import { useApp } from "@/contexts/AppContext";
import { currencies } from "@/constants/currencies";

export default function SelectCurrencyScreen() {
  const { currency, updateCurrency, theme, tapSoundEnabled } = useApp();
  const [search, setSearch] = useState("");

  const filteredCurrencies = currencies.filter(
    (c) =>
      c.country.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectCurrency = async (code: string, symbol: string) => {
    playTapSound(tapSoundEnabled);
    await updateCurrency(code, symbol);
    router.back();
  };

  const currentColors = theme === "dark" ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={[styles.header, { borderBottomColor: currentColors.border }]}>
          <View style={[styles.searchContainer, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}>
            <Search color={currentColors.textSecondary} size={20} />
            <TextInput
              style={[styles.searchInput, { color: currentColors.text }]}
              value={search}
              onChangeText={setSearch}
              placeholder="Search country or currency..."
              placeholderTextColor={currentColors.textSecondary}
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredCurrencies.map((c) => (
            <TouchableOpacity
              key={c.code}
              style={[styles.currencyItem, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}
              onPress={() => handleSelectCurrency(c.code, c.symbol)}
              activeOpacity={0.7}
            >
              <View style={styles.currencyInfo}>
                <Text style={[styles.currencySymbol, { color: currentColors.text }]}>{c.symbol}</Text>
                <View>
                  <Text style={[styles.currencyCountry, { color: currentColors.text }]}>{c.country}</Text>
                  <Text style={[styles.currencyCode, { color: currentColors.textSecondary }]}>{c.code}</Text>
                </View>
              </View>
              {currency.code === c.code && (
                <Check color={currentColors.tint} size={24} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    paddingVertical: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  currencyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  currencyInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.text,
    width: 48,
  },
  currencyCountry: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 2,
  },
  currencyCode: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});
