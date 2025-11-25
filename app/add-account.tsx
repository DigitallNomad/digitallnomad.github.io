import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,

} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState, useMemo } from "react";

import Colors from "@/constants/colors";
import { playTapSound } from "@/utils/tapSound";
import { useApp } from "@/contexts/AppContext";

const accountIcons = [
  { id: "wallet", name: "Wallet" },
  { id: "landmark", name: "Bank" },
  { id: "credit-card", name: "Credit Card" },
  { id: "piggybank", name: "Savings" },
  { id: "building", name: "Investment" },
];

const accountColors = [
  "#6C63FF",
  "#10B981",
  "#EF4444",
  "#F59E0B",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

export default function AddAccountScreen() {
  const { addAccount, currency, tapSoundEnabled, theme } = useApp();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("wallet");
  const [selectedColor, setSelectedColor] = useState(accountColors[0]);

  const handleSubmit = async () => {
    if (!name || !balance) {
      return;
    }

    playTapSound(tapSoundEnabled);

    const balanceAmount = parseFloat(balance);

    await addAccount(
      {
        name,
        balance: balanceAmount,
        icon: selectedIcon,
        color: selectedColor,
      },
      true
    );

    router.back();
  };

  const canSubmit = name && balance;

  const colors = Colors[theme];

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.label}>Account Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., My Bank Account"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Initial Balance</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>{currency.symbol}</Text>
              <TextInput
                style={styles.amountInput}
                value={balance}
                onChangeText={setBalance}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Icon</Text>
            <View style={styles.iconGrid}>
              {accountIcons.map((icon) => {
                const Icon = require("lucide-react-native")[
                  icon.id === "piggybank"
                    ? "PiggyBank"
                    : icon.id === "landmark"
                    ? "Landmark"
                    : icon.id === "credit-card"
                    ? "CreditCard"
                    : icon.id === "building"
                    ? "Building2"
                    : "Wallet"
                ];

                return (
                  <TouchableOpacity
                    key={icon.id}
                    style={[
                      styles.iconButton,
                      selectedIcon === icon.id && styles.iconButtonActive,
                      selectedIcon === icon.id && {
                        backgroundColor: selectedColor + "20",
                        borderColor: selectedColor,
                      },
                    ]}
                    onPress={() => {
                      playTapSound(tapSoundEnabled);
                      setSelectedIcon(icon.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <Icon
                      color={
                        selectedIcon === icon.id
                          ? selectedColor
                          : colors.textSecondary
                      }
                      size={28}
                    />
                    <Text
                      style={[
                        styles.iconText,
                        selectedIcon === icon.id && {
                          color: selectedColor,
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {icon.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorGrid}>
              {accountColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorButtonActive,
                  ]}
                  onPress={() => {
                    playTapSound(tapSoundEnabled);
                    setSelectedColor(color);
                  }}
                  activeOpacity={0.7}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              !canSubmit && styles.submitButtonDisabled,
              { backgroundColor: selectedColor },
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>Add Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.border,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: colors.border,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
    paddingVertical: 16,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  iconButton: {
    width: "30%",
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.border,
  },
  iconButtonActive: {
    borderWidth: 2,
  },
  iconText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "transparent",
  },
  colorButtonActive: {
    borderColor: colors.text,
    borderWidth: 3,
  },
  footer: {
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
