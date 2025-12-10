import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Plus, TrendingUp, TrendingDown, X } from "lucide-react-native";
import Colors from "@/constants/colors";
import { playTapSound } from "@/utils/tapSound";
import { useApp } from "@/contexts/AppContext";
import { allCategories } from "@/constants/categories";
import { format } from "@/utils/date";
import { useState } from "react";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    accounts,
    transactions,
    currency,
    theme,
    tapSoundEnabled,
    getTotalBalance,
    getMonthlyIncome,
    getMonthlyExpenses,
    deleteTransaction,
  } = useApp();

  const currentColors = theme === "dark" ? Colors.dark : Colors.light;
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const totalBalance = getTotalBalance();
  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlyExpenses();

  const recentTransactions = transactions.slice(0, 10);

  const handleAddTransaction = () => {
    playTapSound(tapSoundEnabled);
    router.push("/add-transaction");
  };

  const handleTransactionPress = (transaction: any) => {
    playTapSound(tapSoundEnabled);
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    playTapSound(tapSoundEnabled);
    setModalVisible(false);
    setSelectedTransaction(null);
  };

  const handleEdit = () => {
    if (!selectedTransaction) return;
    playTapSound(tapSoundEnabled);
    handleCloseModal();
    router.push({
      pathname: "/add-transaction",
      params: { 
        editId: selectedTransaction.id,
      },
    });
  };

  const handleDelete = () => {
    playTapSound(tapSoundEnabled);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedTransaction) return;
    try {
      await deleteTransaction(selectedTransaction.id);
      setDeleteModalVisible(false);
      handleCloseModal();
      setSuccessModalVisible(true);
    } catch {
      Alert.alert("Error", "Failed to delete transaction");
    }
  };

  const cancelDelete = () => {
    playTapSound(tapSoundEnabled);
    setDeleteModalVisible(false);
  };

  const closeSuccessModal = () => {
    playTapSound(tapSoundEnabled);
    setSuccessModalVisible(false);
  };



  const getCategoryInfo = (categoryId: string) => {
    return allCategories.find((cat) => cat.id === categoryId);
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View>
            <Text style={[styles.greeting, { color: currentColors.textSecondary }]}>Welcome back!</Text>
            <Text style={[styles.headerTitle, { color: currentColors.text }]}>ExpenseFox</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTransaction}
            activeOpacity={0.7}
          >
            <Plus color={currentColors.cardBackground} size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.balanceCard, { backgroundColor: currentColors.tint }]}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>
              {currency.symbol}{totalBalance.toFixed(2)}
            </Text>
            <View style={styles.balanceStats}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: "#E8F5E9" }]}>
                  <TrendingUp color={Colors.light.income} size={20} />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statLabel}>Income</Text>
                  <Text 
                    style={styles.statValue}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}
                  >
                    {currency.symbol}{monthlyIncome.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: "#FFEBEE" }]}>
                  <TrendingDown color={Colors.light.expense} size={20} />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statLabel}>Expenses</Text>
                  <Text 
                    style={styles.statValue}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}
                  >
                    {currency.symbol}{monthlyExpenses.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Recent Transactions</Text>

            </View>

            {recentTransactions.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: currentColors.cardBackground }]}>
                <Text style={[styles.emptyStateText, { color: currentColors.text }]}>No transactions yet</Text>
                <Text style={[styles.emptyStateSubtext, { color: currentColors.textSecondary }]}>
                  Tap the + button to add your first transaction
                </Text>
              </View>
            ) : (
              <View style={styles.transactionsList}>
                {recentTransactions.map((transaction) => {
                  const category = getCategoryInfo(transaction.category);
                  const CategoryIcon =
                    require("lucide-react-native")[
                      category?.icon
                        .split("-")
                        .map(
                          (word: string) =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join("") || "Circle"
                    ];

                  return (
                    <TouchableOpacity
                      key={transaction.id}
                      style={[
                        styles.transactionCard,
                        transaction.type === "income"
                          ? [
                              styles.incomeCard,
                              {
                                backgroundColor: theme === "dark" ? "#1A3A31" : "#F0FDF4",
                                borderLeftColor: currentColors.income,
                              },
                            ]
                          : [
                              styles.expenseCard,
                              {
                                backgroundColor: theme === "dark" ? "#3A1A1A" : "#FEF2F2",
                                borderLeftColor: theme === "dark" ? currentColors.border : "#9CA3AF",
                              },
                            ],
                      ]}
                      onPress={() => handleTransactionPress(transaction)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.transactionLeft}>
                        <View
                          style={[
                            styles.transactionIcon,
                            {
                              backgroundColor: category?.color
                                ? category.color + "20"
                                : "#E5E7EB",
                            },
                          ]}
                        >
                          <CategoryIcon
                            color={category?.color || Colors.light.textSecondary}
                            size={20}
                          />
                        </View>
                        <View>
                          <Text style={[styles.transactionTitle, { color: currentColors.text }]}>
                            {transaction.description}
                          </Text>
                          <Text style={[styles.transactionCategory, { color: currentColors.textSecondary }]}>
                            {category?.name} • {format(transaction.date)}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.transactionAmount,
                          {
                            color:
                              transaction.type === "income"
                                ? currentColors.income
                                : currentColors.expense,
                          },
                        ]}
                      >
                        {transaction.type === "income" ? "+" : "-"}{currency.symbol}
                        {transaction.amount.toFixed(2)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: currentColors.background, paddingBottom: Math.max(insets.bottom, 20) }]}>
              <View style={[styles.modalHeader, { backgroundColor: currentColors.cardBackground, borderBottomColor: currentColors.border }]}>
                <Text style={[styles.modalTitle, { color: currentColors.text }]}>Transaction Details</Text>
                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={[styles.closeButton, { backgroundColor: currentColors.cardBackground }]}
                  activeOpacity={0.7}
                >
                  <X color={currentColors.text} size={24} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                {selectedTransaction && (() => {
                  const category = getCategoryInfo(selectedTransaction.category);
                  const account = accounts.find((acc) => acc.id === selectedTransaction.accountId);
                  const accountName = account ? account.name : "Unknown";
                  const showDescription = selectedTransaction.description !== accountName;
                  const CategoryIcon = require("lucide-react-native")[category?.icon?.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join("") || "Circle"];

                  return (
                    <View style={styles.detailsContainer}>
                      <View style={[styles.detailsHeader, { backgroundColor: currentColors.cardBackground }]}>
                        <View style={[styles.detailsIcon, { backgroundColor: category?.color ? category.color + "20" : "#E5E7EB" }]}>
                          <CategoryIcon color={category?.color || currentColors.textSecondary} size={32} />
                        </View>
                        <View style={styles.detailsHeaderText}>
                          <Text style={[styles.detailsCategory, { color: currentColors.textSecondary }]}>{category?.name || "Unknown"}</Text>
                          <Text style={[styles.detailsAmount, { color: selectedTransaction.type === "income" ? currentColors.income : currentColors.expense }]}>
                            {selectedTransaction.type === "income" ? "+" : "-"}{currency.symbol}{selectedTransaction.amount.toFixed(2)}
                          </Text>
                        </View>
                      </View>

                      {showDescription && (
                        <View style={[styles.detailRow, { backgroundColor: currentColors.cardBackground }]}>
                          <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Description</Text>
                          <Text style={[styles.detailValue, { color: currentColors.text }]}>{selectedTransaction.description}</Text>
                        </View>
                      )}

                      <View style={[styles.detailRow, { backgroundColor: currentColors.cardBackground }]}>
                        <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Transaction Type</Text>
                        <Text style={[styles.detailValue, styles.detailBadge, { backgroundColor: selectedTransaction.type === "income" ? "#E8F5E9" : "#FFEBEE", color: selectedTransaction.type === "income" ? currentColors.income : currentColors.expense }]}>
                          {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}
                        </Text>
                      </View>

                      <View style={[styles.detailRow, { backgroundColor: currentColors.cardBackground }]}>
                        <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Account</Text>
                        <Text style={[styles.detailValue, { color: currentColors.text }]}>{accountName}</Text>
                      </View>

                      <View style={[styles.detailRow, { backgroundColor: currentColors.cardBackground }]}>
                        <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Date</Text>
                        <Text style={[styles.detailValue, { color: currentColors.text }]}>{format(selectedTransaction.date)}</Text>
                      </View>
                    </View>
                  );
                })()}
              </ScrollView>

              <View style={[styles.modalFooter, { backgroundColor: currentColors.cardBackground, borderTopColor: currentColors.border }]}>
                <TouchableOpacity
                  style={[styles.editButton, { backgroundColor: currentColors.tint }]}
                  onPress={handleEdit}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.deleteButton, { backgroundColor: currentColors.expense }]}
                  onPress={handleDelete}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.closeModalButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}
                  onPress={handleCloseModal}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.closeModalButtonText, { color: currentColors.text }]}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={deleteModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={cancelDelete}
        >
          <View style={styles.deleteModalOverlay}>
            <View style={[styles.deleteModalContainer, { backgroundColor: currentColors.background }]}>
              <Text style={[styles.deleteModalTitle, { color: currentColors.text }]}>Delete Transaction</Text>
              <Text style={[styles.deleteModalMessage, { color: currentColors.textSecondary }]}>
                Are you sure you want to delete this transaction? This action cannot be undone.
              </Text>
              <View style={styles.deleteModalButtons}>
                <TouchableOpacity
                  style={[styles.cancelButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}
                  onPress={cancelDelete}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.cancelButtonText, { color: currentColors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmDeleteButton, { backgroundColor: currentColors.expense }]}
                  onPress={confirmDelete}
                  activeOpacity={0.7}
                >
                  <Text style={styles.confirmDeleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={successModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={closeSuccessModal}
        >
          <View style={styles.successModalOverlay}>
            <View style={[styles.successModalContainer, { backgroundColor: currentColors.background }]}>
              <View style={[styles.successIcon, { backgroundColor: currentColors.income + "20" }]}>
                <Text style={{ fontSize: 48 }}>✓</Text>
              </View>
              <Text style={[styles.successModalTitle, { color: currentColors.text }]}>Success</Text>
              <Text style={[styles.successModalMessage, { color: currentColors.textSecondary }]}>
                Transaction deleted successfully
              </Text>
              <TouchableOpacity
                style={[styles.successButton, { backgroundColor: currentColors.income }]}
                onPress={closeSuccessModal}
                activeOpacity={0.7}
              >
                <Text style={styles.successButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
  greeting: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.text,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.tint,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  balanceCard: {
    backgroundColor: Colors.light.tint,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 24,
  },
  balanceStats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 12,
    borderRadius: 16,
    gap: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  incomeCard: {
    borderLeftWidth: 4,
  },
  expenseCard: {
    borderLeftWidth: 4,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 13,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "700",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.cardBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  detailsContainer: {
    gap: 16,
    paddingBottom: 24,
  },
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
  },
  detailsIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  detailsHeaderText: {
    flex: 1,
  },
  detailsCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  detailsAmount: {
    fontSize: 28,
    fontWeight: "700",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 15,
    color: Colors.light.text,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
  },
  detailBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: "hidden",
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
    gap: 12,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  editButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  deleteButton: {
    backgroundColor: Colors.light.expense,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  closeModalButton: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  closeModalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  deleteModalContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: "center",
  },
  deleteModalMessage: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  deleteModalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: Colors.light.expense,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmDeleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  successModalContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 32,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successModalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: "center",
  },
  successModalMessage: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  successButton: {
    backgroundColor: Colors.light.income,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: "center",
    minWidth: 120,
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
