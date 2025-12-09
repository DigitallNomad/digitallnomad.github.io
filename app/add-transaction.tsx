import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar, ArrowLeft } from "lucide-react-native";

import Colors from "@/constants/colors";
import { playTapSound } from "@/utils/tapSound";
import { useApp } from "@/contexts/AppContext";
import { TransactionType } from "@/types";
import { format } from "@/utils/date";

export default function AddTransactionScreen() {
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const { accounts, transactions, categories, currency, theme, tapSoundEnabled, addTransaction, updateTransaction } = useApp();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>(accounts[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const currentColors = theme === "dark" ? Colors.dark : Colors.light;

  useEffect(() => {
    if (editId) {
      const transaction = transactions.find((t) => t.id === editId);
      if (transaction) {
        setType(transaction.type);
        setAmount(transaction.amount.toString());
        setDescription(transaction.description);
        setSelectedCategory(transaction.category);
        setSelectedAccount(transaction.accountId);
        setSelectedDate(new Date(transaction.date));
      }
    }
  }, [editId, transactions]);

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async () => {
    if (!amount || !selectedCategory || !selectedAccount) {
      return;
    }

    playTapSound(tapSoundEnabled);

    if (editId) {
      await updateTransaction(editId, {
        type,
        amount: parseFloat(amount),
        category: selectedCategory,
        accountId: selectedAccount,
        description: description || categories.find(c => c.id === selectedCategory)?.name || "Transaction",
        date: selectedDate,
      });
    } else {
      await addTransaction({
        type,
        amount: parseFloat(amount),
        category: selectedCategory,
        accountId: selectedAccount,
        description: description || categories.find(c => c.id === selectedCategory)?.name || "Transaction",
        date: selectedDate,
      });
    }

    router.back();
  };

  const handleTypeChange = (newType: TransactionType) => {
    playTapSound(tapSoundEnabled);
    setType(newType);
    setSelectedCategory(null);
  };

  const handleDatePress = () => {
    playTapSound(tapSoundEnabled);
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleDatePickerDismiss = () => {
    setShowDatePicker(false);
  };

  const canSubmit = amount && selectedCategory && selectedAccount;

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={[styles.header, { backgroundColor: currentColors.cardBackground, borderBottomColor: currentColors.border }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              playTapSound(tapSoundEnabled);
              router.back();
            }}
            activeOpacity={0.7}
          >
            <ArrowLeft color={currentColors.text} size={24} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: currentColors.text }]}>Add Transaction</Text>
          <View style={styles.headerRight} />
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border },
                type === "expense" && styles.typeButtonActive,
                type === "expense" && { backgroundColor: currentColors.expense, borderColor: currentColors.expense },
              ]}
              onPress={() => handleTypeChange("expense")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  { color: currentColors.text },
                  type === "expense" && styles.typeButtonTextActive,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border },
                type === "income" && styles.typeButtonActive,
                type === "income" && { backgroundColor: currentColors.income, borderColor: currentColors.income },
              ]}
              onPress={() => handleTypeChange("income")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  { color: currentColors.text },
                  type === "income" && styles.typeButtonTextActive,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: currentColors.text }]}>Amount</Text>
            <View style={[styles.amountInputContainer, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}>
              <Text style={[styles.currencySymbol, { color: currentColors.text }]}>{currency.symbol}</Text>
              <TextInput
                style={[styles.amountInput, { color: currentColors.text }]}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={currentColors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: currentColors.text }]}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border, color: currentColors.text }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add a note..."
              placeholderTextColor={currentColors.textSecondary}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: currentColors.text }]}>Category</Text>
            <View style={styles.categoryGrid}>
              {filteredCategories.map((category) => {
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
                      { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border },
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
                        { color: currentColors.text },
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

          <View style={styles.section}>
            <Text style={[styles.label, { color: currentColors.text }]}>Account</Text>
            <View style={styles.accountList}>
              {accounts.map((account) => {
                const iconName = (account.icon || "wallet")
                  .split("-")
                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join("");
                const Icon = require("lucide-react-native")[iconName] || require("lucide-react-native").Wallet;

                return (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.accountButton,
                      { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border },
                      selectedAccount === account.id && styles.accountButtonActive,
                      selectedAccount === account.id && {
                        backgroundColor: account.color + "15",
                        borderColor: account.color,
                      },
                    ]}
                    onPress={() => {
                      playTapSound(tapSoundEnabled);
                      setSelectedAccount(account.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.accountIconContainer,
                        { backgroundColor: account.color + "20" },
                      ]}
                    >
                      <Icon color={account.color} size={20} />
                    </View>
                    <View style={styles.accountDetails}>
                      <Text style={[styles.accountName, { color: currentColors.text }]}>{account.name}</Text>
                      <Text style={[styles.accountBalance, { color: currentColors.textSecondary }]}>
                        {currency.symbol}{account.balance.toFixed(2)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: currentColors.text }]}>Date</Text>
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}
              onPress={handleDatePress}
              activeOpacity={0.7}
            >
              <Calendar color={currentColors.text} size={20} />
              <Text style={[styles.dateButtonText, { color: currentColors.text }]}>{format(selectedDate)}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: currentColors.cardBackground, borderTopColor: currentColors.border }]}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: currentColors.tint },
              !canSubmit && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>{editId ? "Update Transaction" : "Add Transaction"}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {showDatePicker && (
        Platform.OS === "ios" ? (
          <View style={styles.datePickerModal}>
            <View style={[styles.datePickerContainer, { backgroundColor: currentColors.cardBackground }]}>
              <View style={[styles.datePickerHeader, { borderBottomColor: currentColors.border }]}>
                <Text style={[styles.datePickerTitle, { color: currentColors.text }]}>Select Date</Text>
              </View>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="inline"
                onChange={handleDateChange}
                maximumDate={new Date()}
                themeVariant={theme}
                style={styles.datePicker}
              />
              <View style={styles.datePickerFooter}>
                <TouchableOpacity
                  style={[styles.datePickerButton, { backgroundColor: currentColors.tint }]}
                  onPress={handleDatePickerDismiss}
                  activeOpacity={0.7}
                >
                  <Text style={styles.datePickerButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
            themeVariant={theme}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  typeSelector: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.light.cardBackground,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  typeButtonActive: {
    borderColor: "transparent",
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  typeButtonTextActive: {
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: Colors.light.text,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.light.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: "700",
    color: Colors.light.text,
    paddingVertical: 16,
  },
  input: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryButton: {
    width: "48%",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.border,
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
    color: Colors.light.text,
    textAlign: "center",
  },
  accountList: {
    gap: 12,
  },
  accountButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  accountButtonActive: {
    borderWidth: 2,
  },
  accountIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  footer: {
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  datePickerModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  datePickerContainer: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
  },
  datePickerHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    textAlign: "center",
  },
  datePicker: {
    width: "100%",
  },
  datePickerFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  datePickerButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
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
