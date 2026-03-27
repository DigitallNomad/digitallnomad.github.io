import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,

} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Plus, AlertCircle } from "lucide-react-native";

import Colors, { categoryColors } from "@/constants/colors";
import { playTapSound } from "@/utils/tapSound";
import { useApp } from "@/contexts/AppContext";
import { expenseCategories } from "@/constants/categories";
import { useMemo } from "react";

export default function BudgetsScreen() {
  const insets = useSafeAreaInsets();
  const { budgets, transactions, currency, theme, tapSoundEnabled } = useApp();
  const currentColors = theme === "dark" ? Colors.dark : Colors.light;

  const currentMonth = new Date().toISOString().slice(0, 7);

  const budgetData = useMemo(() => {
    return expenseCategories.map((category) => {
      const budget = budgets.find(
        (b) => b.category === category.id && b.month === currentMonth
      );

      const spent = transactions
        .filter(
          (t) =>
            t.type === "expense" &&
            t.category === category.id &&
            t.date.toISOString().slice(0, 7) === currentMonth
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const limit = budget?.limit || 0;
      const percentage = limit > 0 ? (spent / limit) * 100 : 0;
      const remaining = limit - spent;

      const categoryColor = categoryColors[category.id as keyof typeof categoryColors] || category.color || "#95A5A6";

      return {
        category: category.name,
        categoryId: category.id,
        color: categoryColor,
        spent,
        limit,
        remaining,
        percentage,
        hasLimit: limit > 0,
        isOverBudget: spent > limit && limit > 0,
      };
    });
  }, [budgets, transactions, currentMonth]);

  const handleSetBudget = () => {
    playTapSound(tapSoundEnabled);
    router.push("/set-budget");
  };

  const activeBudgets = budgetData.filter((b) => b.hasLimit);
  const totalBudget = activeBudgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = activeBudgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={[styles.headerTitle, { color: currentColors.text }]}>Budgets</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleSetBudget}
            activeOpacity={0.7}
          >
            <Plus color={currentColors.cardBackground} size={22} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {activeBudgets.length > 0 && (
            <View style={[styles.summaryCard, { backgroundColor: currentColors.tint }]}>
              <Text style={styles.summaryTitle}>This Month</Text>
              <View style={styles.summaryProgress}>
                <View style={styles.summaryLabels}>
                  <Text style={styles.summaryLabel}>Spent</Text>
                  <Text style={styles.summaryLabel}>Budget</Text>
                </View>
                <View style={styles.summaryValues}>
                  <Text style={styles.summarySpent}>
                    {currency.symbol}{totalSpent.toFixed(2)}
                  </Text>
                  <Text style={styles.summaryBudget}>
                    {currency.symbol}{totalBudget.toFixed(2)}
                  </Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: "rgba(255, 255, 255, 0.2)" }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
                        backgroundColor:
                          totalSpent > totalBudget
                            ? "#FFFFFF"
                            : "#FFFFFF",
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Budget by Category</Text>
            <View style={styles.budgetsList}>
              {budgetData
                .filter((b) => b.hasLimit)
                .map((budget) => (
                  <TouchableOpacity 
                    key={budget.categoryId} 
                    style={[styles.budgetCard, { backgroundColor: currentColors.cardBackground }]}
                    activeOpacity={0.7}
                    onPress={() => {
                      playTapSound(tapSoundEnabled);
                      router.push({
                        pathname: "/edit-budget",
                        params: { categoryId: budget.categoryId }
                      });
                    }}
                  >
                    {budget.isOverBudget && (
                      <View style={styles.warningBadge}>
                        <AlertCircle
                          color={currentColors.danger}
                          size={14}
                        />
                        <Text style={[styles.warningText, { color: currentColors.danger }]}>Over budget</Text>
                      </View>
                    )}
                    <View style={styles.budgetHeader}>
                      <View style={styles.budgetInfo}>
                        <View
                          style={[
                            styles.categoryDot,
                            { backgroundColor: budget.color },
                          ]}
                        />
                        <Text style={[styles.budgetCategory, { color: currentColors.text }]}>
                          {budget.category}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.budgetRemaining,
                          {
                            color: budget.isOverBudget
                              ? currentColors.danger
                              : currentColors.success,
                          },
                        ]}
                      >
                        {budget.isOverBudget ? "+" : ""}{currency.symbol}
                        {Math.abs(budget.remaining).toFixed(2)}{" "}
                        {budget.isOverBudget ? "over" : "left"}
                      </Text>
                    </View>
                    <View style={styles.budgetAmount}>
                      <Text style={[styles.budgetSpent, { color: currentColors.text }]}>
                        {currency.symbol}{budget.spent.toFixed(2)}
                      </Text>
                      <Text style={[styles.budgetLimit, { color: currentColors.textSecondary }]}>
                        of {currency.symbol}{budget.limit.toFixed(2)}
                      </Text>
                    </View>
                    <View style={[styles.progressBarSmall, { backgroundColor: currentColors.background }]}>
                      <View
                        style={[
                          styles.progressFillSmall,
                          {
                            width: `${Math.min(budget.percentage, 100)}%`,
                            backgroundColor: budget.isOverBudget
                              ? currentColors.danger
                              : budget.percentage > 80
                              ? currentColors.warning
                              : budget.color,
                          },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                ))}

              {activeBudgets.length === 0 && (
                <View style={[styles.emptyState, { backgroundColor: currentColors.cardBackground }]}>
                  <Text style={[styles.emptyStateText, { color: currentColors.text }]}>No budgets set</Text>
                  <Text style={[styles.emptyStateSubtext, { color: currentColors.textSecondary }]}>
                    Tap the + button to create your first budget
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.tint,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  summaryCard: {
    backgroundColor: Colors.light.tint,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 16,
  },
  summaryProgress: {
    gap: 8,
  },
  summaryLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  summaryValues: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summarySpent: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  summaryBudget: {
    fontSize: 24,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.7)",
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 16,
  },
  budgetsList: {
    gap: 12,
  },
  budgetCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  warningBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.danger + "15",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.danger,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  budgetInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  budgetCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  budgetRemaining: {
    fontSize: 14,
    fontWeight: "600",
  },
  budgetAmount: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginBottom: 10,
  },
  budgetSpent: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
  },
  budgetLimit: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  progressBarSmall: {
    height: 8,
    backgroundColor: Colors.light.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFillSmall: {
    height: "100%",
    borderRadius: 4,
  },
  emptyState: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
});
