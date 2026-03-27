import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { expenseCategories } from "@/constants/categories";
import { useMemo } from "react";



export default function StatisticsScreen() {
  const insets = useSafeAreaInsets();
  const { transactions, currency, theme, getMonthlyExpenses, getMonthlyIncome } = useApp();
  const currentColors = theme === "dark" ? Colors.dark : Colors.light;

  const monthlyExpenses = getMonthlyExpenses();
  const monthlyIncome = getMonthlyIncome();

  const categoryBreakdown = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTransactions = transactions.filter(
      (t) => t.type === "expense" && t.date.toISOString().slice(0, 7) === currentMonth
    );

    const breakdown = expenseCategories.map((category) => {
      const amount = monthlyTransactions
        .filter((t) => t.category === category.id)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        category: category.name,
        amount,
        color: category.color,
        percentage: monthlyExpenses > 0 ? (amount / monthlyExpenses) * 100 : 0,
      };
    });

    return breakdown.filter((b) => b.amount > 0).sort((a, b) => b.amount - a.amount);
  }, [transactions, monthlyExpenses]);

  const maxAmount = categoryBreakdown.length > 0 ? categoryBreakdown[0].amount : 1;

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={[styles.headerTitle, { color: currentColors.text }]}>Statistics</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.summaryCard, { backgroundColor: currentColors.cardBackground }]}>
            <Text style={[styles.summaryTitle, { color: currentColors.text }]}>This Month</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: currentColors.textSecondary }]}>Income</Text>
                <Text style={[styles.summaryValue, { color: currentColors.income }]}>
                  {currency.symbol}{monthlyIncome.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: currentColors.textSecondary }]}>Expenses</Text>
                <Text style={[styles.summaryValue, { color: currentColors.expense }]}>
                  {currency.symbol}{monthlyExpenses.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: currentColors.textSecondary }]}>Balance</Text>
                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color:
                        monthlyIncome - monthlyExpenses >= 0
                          ? currentColors.income
                          : currentColors.expense,
                    },
                  ]}
                >
                  {currency.symbol}{(monthlyIncome - monthlyExpenses).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Spending by Category</Text>
            {categoryBreakdown.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: currentColors.cardBackground }]}>
                <Text style={[styles.emptyStateText, { color: currentColors.textSecondary }]}>No expenses this month</Text>
              </View>
            ) : (
              <View style={styles.categoryList}>
                {categoryBreakdown.map((item, index) => (
                  <View key={index} style={[styles.categoryItem, { backgroundColor: currentColors.cardBackground }]}>
                    <View style={styles.categoryHeader}>
                      <View style={styles.categoryInfo}>
                        <View
                          style={[
                            styles.categoryDot,
                            { backgroundColor: item.color },
                          ]}
                        />
                        <Text style={[styles.categoryName, { color: currentColors.text }]}>{item.category}</Text>
                      </View>
                      <View style={styles.categoryValues}>
                        <Text style={[styles.categoryAmount, { color: currentColors.text }]}>
                          {currency.symbol}{item.amount.toFixed(2)}
                        </Text>
                        <Text style={[styles.categoryPercentage, { color: currentColors.textSecondary }]}>
                          {item.percentage.toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.barContainer, { backgroundColor: currentColors.background }]}>
                      <View
                        style={[
                          styles.bar,
                          {
                            width: `${(item.amount / maxAmount) * 100}%`,
                            backgroundColor: item.color,
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  summaryCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
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
  categoryList: {
    gap: 16,
  },
  categoryItem: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.text,
  },
  categoryValues: {
    alignItems: "flex-end",
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  barContainer: {
    height: 8,
    backgroundColor: Colors.light.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  bar: {
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
    color: Colors.light.textSecondary,
  },
});
