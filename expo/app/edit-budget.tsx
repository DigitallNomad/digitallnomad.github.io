import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState, useMemo, useEffect } from "react";

import Colors from "@/constants/colors";
import { playTapSound } from "@/utils/tapSound";
import { useApp } from "@/contexts/AppContext";
import { expenseCategories } from "@/constants/categories";

export default function EditBudgetScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { budgets, updateBudget, tapSoundEnabled, theme, currency } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryId || null);
  const [amount, setAmount] = useState("");

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    if (categoryId) {
      const existingBudget = budgets.find(
        (b) => b.category === categoryId && b.month === currentMonth
      );
      if (existingBudget) {
        setAmount(existingBudget.limit.toString());
      }
    }
  }, [categoryId, budgets, currentMonth]);

  const handleSubmit = async () => {
    if (!selectedCategory || !amount) {
      return;
    }

    playTapSound(tapSoundEnabled);

    await updateBudget(selectedCategory, parseFloat(amount));
    router.back();
  };

  const canSubmit = selectedCategory && amount;

  const colors = Colors[theme];

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              playTapSound(tapSoundEnabled);
              router.back();
            }}
            activeOpacity={0.7}
          >
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Budget</Text>
          <View style={styles.headerRight} />
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.label}>Monthly Budget</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>{currency.symbol}</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {expenseCategories.map((category) => {
                const Icon = require("lucide-react-native")[
                  category.icon
                    .split("-")
                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join("")
                ];

                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id && styles.categoryButtonActive,
                      selectedCategory === category.id && {
                        backgroundColor: category.color + "20",
                        borderColor: category.color,
                      },
                    ]}
                    onPress={() => {
                      playTapSound(tapSoundEnabled);
                      setSelectedCategory(category.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: category.color + "20" },
                      ]}
                    >
                      <Icon color={category.color} size={20} />
                    </View>
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === category.id && {
                          color: category.color,
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              !canSubmit && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>Update Budget</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 40,
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
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryButton: {
    width: "48%",
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    borderWidth: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 13,
    color: colors.text,
    textAlign: "center",
  },
  footer: {
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  submitButton: {
    backgroundColor: colors.tint,
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
