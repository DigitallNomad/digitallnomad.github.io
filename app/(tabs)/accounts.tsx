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
import { Plus, X } from "lucide-react-native";

import Colors from "@/constants/colors";
import { playTapSound } from "@/utils/tapSound";
import { useApp } from "@/contexts/AppContext";
import { useState } from "react";
import { Account, Transaction } from "@/types";

const iconMap: Record<string, any> = {
  wallet: require("lucide-react-native").Wallet,
  landmark: require("lucide-react-native").Landmark,
  "credit-card": require("lucide-react-native").CreditCard,
  piggybank: require("lucide-react-native").PiggyBank,
  building: require("lucide-react-native").Building2,
};

export default function AccountsScreen() {
  const insets = useSafeAreaInsets();
  const { accounts, transactions, currency, theme, tapSoundEnabled, removeAccount } = useApp();
  const currentColors = theme === "dark" ? Colors.dark : Colors.light;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [accountTransactions, setAccountTransactions] = useState<Transaction[]>([]);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [noTransactionsModalVisible, setNoTransactionsModalVisible] = useState(false);
  const [noTransactionsAccount, setNoTransactionsAccount] = useState<Account | null>(null);
  const [removeEmptyAccountModalVisible, setRemoveEmptyAccountModalVisible] = useState(false);
  const [emptyAccountToRemove, setEmptyAccountToRemove] = useState<Account | null>(null);

  const handleAddAccount = () => {
    playTapSound(tapSoundEnabled);
    router.push("/add-account");
  };



  const getAccountTransactions = (accountId: string) => {
    return transactions.filter((t) => t.accountId === accountId).length;
  };

  const handleAccountPress = (account: Account) => {
    playTapSound(tapSoundEnabled);

    const accountTxns = transactions.filter((t) => t.accountId === account.id);

    if (accountTxns.length === 0) {
      const defaultAccountIds = ["1", "2", "3"];
      if (defaultAccountIds.includes(account.id)) {
        setNoTransactionsAccount(account);
        setNoTransactionsModalVisible(true);
      } else {
        setEmptyAccountToRemove(account);
        setRemoveEmptyAccountModalVisible(true);
      }
      return;
    }

    setSelectedAccount(account);
    setAccountTransactions(accountTxns);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedAccount(null);
    setAccountTransactions([]);
  };

  const handleRemoveAccount = () => {
    if (!selectedAccount) return;
    playTapSound(tapSoundEnabled);
    setRemoveModalVisible(true);
  };

  const confirmRemoveAccount = async () => {
    if (!selectedAccount) return;
    playTapSound(tapSoundEnabled);
    try {
      await removeAccount(selectedAccount.id);
      setRemoveModalVisible(false);
      handleCloseModal();
      setSuccessModalVisible(true);
    } catch {
      Alert.alert("Error", "Failed to remove account");
    }
  };

  const cancelRemoveAccount = () => {
    playTapSound(tapSoundEnabled);
    setRemoveModalVisible(false);
  };

  const closeSuccessModal = () => {
    playTapSound(tapSoundEnabled);
    setSuccessModalVisible(false);
  };

  const closeNoTransactionsModal = () => {
    playTapSound(tapSoundEnabled);
    setNoTransactionsModalVisible(false);
    setNoTransactionsAccount(null);
  };

  const cancelRemoveEmptyAccount = () => {
    playTapSound(tapSoundEnabled);
    setRemoveEmptyAccountModalVisible(false);
    setEmptyAccountToRemove(null);
  };

  const confirmRemoveEmptyAccount = async () => {
    if (!emptyAccountToRemove) return;
    playTapSound(tapSoundEnabled);
    try {
      await removeAccount(emptyAccountToRemove.id);
      setRemoveEmptyAccountModalVisible(false);
      setEmptyAccountToRemove(null);
    } catch {
      Alert.alert("Error", "Failed to remove account");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={[styles.headerTitle, { color: currentColors.text }]}>Accounts</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddAccount}
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
          <View style={[styles.totalCard, { backgroundColor: currentColors.tint }]}>
            <Text style={styles.totalLabel}>Total Balance</Text>
            <Text style={styles.totalAmount}>
              {currency.symbol}
              {accounts
                .reduce((sum, acc) => sum + acc.balance, 0)
                .toFixed(2)}
            </Text>
            <Text style={styles.totalAccounts}>
              {accounts.length} {accounts.length === 1 ? "account" : "accounts"}
            </Text>
          </View>

          <View style={styles.accountsList}>
            {accounts.map((account) => {
              const Icon = iconMap[account.icon] || iconMap.wallet;
              const transactionCount = getAccountTransactions(account.id);

              return (
                <TouchableOpacity
                  key={account.id}
                  style={[styles.accountCard, { backgroundColor: currentColors.cardBackground }]}
                  activeOpacity={0.7}
                  onPress={() => handleAccountPress(account)}
                >
                  <View style={styles.accountHeader}>
                    <View
                      style={[
                        styles.accountIcon,
                        { backgroundColor: account.color + "20" },
                      ]}
                    >
                      <Icon color={account.color} size={24} />
                    </View>
                    <View style={styles.accountInfo}>
                      <Text style={[styles.accountName, { color: currentColors.text }]}>{account.name}</Text>
                      <Text style={[styles.accountTransactions, { color: currentColors.textSecondary }]}>
                        {transactionCount}{" "}
                        {transactionCount === 1 ? "transaction" : "transactions"}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.accountBalance, { color: currentColors.text }]}>
                    {currency.symbol}{account.balance.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
                <Text style={[styles.modalTitle, { color: currentColors.text }]}>
                  {selectedAccount?.name} Transactions
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    playTapSound(tapSoundEnabled);
                    handleCloseModal();
                  }}
                  style={[styles.closeButton, { backgroundColor: currentColors.cardBackground }]}
                  activeOpacity={0.7}
                >
                  <X color={currentColors.text} size={24} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <View style={[styles.table, { backgroundColor: currentColors.cardBackground }]}>
                    <View style={[styles.tableHeader, { backgroundColor: currentColors.tint }]}>
                      {selectedAccount && ["1", "2", "3"].includes(selectedAccount.id) && (
                        <Text style={[styles.tableHeaderCell, styles.descriptionColumn]}>Description</Text>
                      )}
                      <Text style={[styles.tableHeaderCell, styles.amountColumn]}>Amount</Text>
                      <Text style={[styles.tableHeaderCell, styles.dateColumn]}>Date</Text>
                      <Text style={[styles.tableHeaderCell, styles.categoryColumn]}>Category</Text>
                      <Text style={[styles.tableHeaderCell, styles.typeColumn]}>Transaction Type</Text>
                    </View>

                    {accountTransactions.map((transaction, index) => {
                      const category = require("@/constants/categories").allCategories.find(
                        (cat: any) => cat.id === transaction.category
                      );
                      const isLastRow = index === accountTransactions.length - 1;

                      return (
                        <View key={transaction.id} style={[styles.tableRow, { borderBottomColor: currentColors.border }, isLastRow && styles.lastTableRow]}>
                          {selectedAccount && ["1", "2", "3"].includes(selectedAccount.id) && (
                            <Text style={[styles.tableCell, styles.descriptionColumn, { color: currentColors.text }]}>
                              {transaction.description || "NIL"}
                            </Text>
                          )}
                          <Text style={[styles.tableCell, styles.amountColumn, {
                            color: transaction.type === "income" ? currentColors.income : currentColors.expense,
                            fontWeight: "600"
                          }]}>
                            {transaction.type === "income" ? "+" : "-"}{currency.symbol}{transaction.amount.toFixed(2)}
                          </Text>
                          <Text style={[styles.tableCell, styles.dateColumn, { color: currentColors.text }]}>
                            {new Date(transaction.date).toLocaleDateString()}
                          </Text>
                          <Text style={[styles.tableCell, styles.categoryColumn, { color: currentColors.text }]}>
                            {category?.name || "Unknown"}
                          </Text>
                          <Text style={[styles.tableCell, styles.typeColumn, { color: currentColors.text }]}>
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </ScrollView>

              <View style={[styles.modalFooter, { backgroundColor: currentColors.cardBackground, borderTopColor: currentColors.border }]}>
                {selectedAccount && !["1", "2", "3"].includes(selectedAccount.id) && (
                  <TouchableOpacity
                    style={[styles.removeAccountButton, { backgroundColor: currentColors.expense }]}
                    onPress={() => {
                      playTapSound(tapSoundEnabled);
                      handleRemoveAccount();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.removeAccountButtonText}>Remove This Account</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.closeModalButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}
                  onPress={() => {
                    playTapSound(tapSoundEnabled);
                    handleCloseModal();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.closeModalButtonText, { color: currentColors.text }]}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={removeModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={cancelRemoveAccount}
        >
          <View style={styles.removeModalOverlay}>
            <View style={[styles.removeModalContainer, { backgroundColor: currentColors.background }]}>
              <Text style={[styles.removeModalTitle, { color: currentColors.text }]}>Remove Account</Text>
              <Text style={[styles.removeModalMessage, { color: currentColors.textSecondary }]}>
                Do you want to remove &ldquo;{selectedAccount?.name}&rdquo;?{"\n\n"}This will not delete associated transactions.
              </Text>
              <View style={styles.removeModalButtons}>
                <TouchableOpacity
                  style={[styles.cancelRemoveButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}
                  onPress={cancelRemoveAccount}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.cancelRemoveButtonText, { color: currentColors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmRemoveButton, { backgroundColor: currentColors.expense }]}
                  onPress={confirmRemoveAccount}
                  activeOpacity={0.7}
                >
                  <Text style={styles.confirmRemoveButtonText}>Remove</Text>
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
                Account removed successfully
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

        <Modal
          visible={noTransactionsModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={closeNoTransactionsModal}
        >
          <View style={styles.noTransactionsModalOverlay}>
            <View style={[styles.noTransactionsModalContainer, { backgroundColor: currentColors.background }]}>
              <View style={[styles.noTransactionsIcon, { backgroundColor: currentColors.textSecondary + "20" }]}>
                <Text style={{ fontSize: 48 }}>📭</Text>
              </View>
              <Text style={[styles.noTransactionsModalTitle, { color: currentColors.text }]}>No Transactions</Text>
              <Text style={[styles.noTransactionsModalMessage, { color: currentColors.textSecondary }]}>
                No transactions found for {noTransactionsAccount?.name}
              </Text>
              <TouchableOpacity
                style={[styles.noTransactionsButton, { backgroundColor: currentColors.tint }]}
                onPress={closeNoTransactionsModal}
                activeOpacity={0.7}
              >
                <Text style={styles.noTransactionsButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={removeEmptyAccountModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={cancelRemoveEmptyAccount}
        >
          <View style={styles.removeEmptyAccountModalOverlay}>
            <View style={[styles.removeEmptyAccountModalContainer, { backgroundColor: currentColors.background }]}>
              <Text style={[styles.removeEmptyAccountModalTitle, { color: currentColors.text }]}>Remove Account</Text>
              <Text style={[styles.removeEmptyAccountModalMessage, { color: currentColors.textSecondary }]}>
                Do you want to remove &ldquo;{emptyAccountToRemove?.name}&rdquo;?
              </Text>
              <View style={styles.removeEmptyAccountModalButtons}>
                <TouchableOpacity
                  style={[styles.cancelRemoveEmptyAccountButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}
                  onPress={cancelRemoveEmptyAccount}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.cancelRemoveEmptyAccountButtonText, { color: currentColors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmRemoveEmptyAccountButton, { backgroundColor: currentColors.expense }]}
                  onPress={confirmRemoveEmptyAccount}
                  activeOpacity={0.7}
                >
                  <Text style={styles.confirmRemoveEmptyAccountButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
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
  totalCard: {
    backgroundColor: Colors.light.tint,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  totalAccounts: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  accountsList: {
    gap: 12,
  },
  accountCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  accountHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  accountIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  accountTransactions: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  accountBalance: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
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
    maxHeight: "80%",
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
    paddingVertical: 16,
  },
  table: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "left",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  lastTableRow: {
    borderBottomWidth: 0,
  },
  tableCell: {
    fontSize: 14,
    color: Colors.light.text,
    textAlign: "left",
  },
  descriptionColumn: {
    width: 140,
    marginRight: 12,
  },
  amountColumn: {
    width: 100,
    marginRight: 12,
  },
  dateColumn: {
    width: 100,
    marginRight: 12,
  },
  categoryColumn: {
    width: 100,
    marginRight: 12,
  },
  typeColumn: {
    width: 80,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  removeAccountButton: {
    backgroundColor: Colors.light.expense,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  removeAccountButtonText: {
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
  removeModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  removeModalContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  removeModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: "center",
  },
  removeModalMessage: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  removeModalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelRemoveButton: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cancelRemoveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  confirmRemoveButton: {
    flex: 1,
    backgroundColor: Colors.light.expense,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmRemoveButtonText: {
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
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
  noTransactionsModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noTransactionsModalContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 32,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  noTransactionsIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  noTransactionsModalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: "center",
  },
  noTransactionsModalMessage: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  noTransactionsButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: "center",
    minWidth: 120,
  },
  noTransactionsButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  removeEmptyAccountModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  removeEmptyAccountModalContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  removeEmptyAccountModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: "center",
  },
  removeEmptyAccountModalMessage: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  removeEmptyAccountModalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelRemoveEmptyAccountButton: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cancelRemoveEmptyAccountButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  confirmRemoveEmptyAccountButton: {
    flex: 1,
    backgroundColor: Colors.light.expense,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmRemoveEmptyAccountButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
