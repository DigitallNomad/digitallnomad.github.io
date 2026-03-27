import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Account, Transaction, Budget } from "@/types";
import { initializeTapSound, playSplashSound } from "@/utils/tapSound";

const STORAGE_KEYS = {
  ACCOUNTS: "@expensefox_accounts",
  TRANSACTIONS: "@expensefox_transactions",
  BUDGETS: "@expensefox_budgets",
  CURRENCY: "@expensefox_currency",
  THEME: "@expensefox_theme",
  TAP_SOUND: "@expensefox_tap_sound",
  FIRST_TIME: "@expensefox_first_time",
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "1",
      name: "Cash",
      balance: 0,
      icon: "wallet",
      color: "#6C63FF",
    },
    {
      id: "2",
      name: "Bank Account",
      balance: 0,
      icon: "landmark",
      color: "#10B981",
    },
    {
      id: "3",
      name: "Credit Card",
      balance: 0,
      icon: "credit-card",
      color: "#EF4444",
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currency, setCurrency] = useState<{ code: string; symbol: string }>({ code: "USD", symbol: "$" });
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [tapSoundEnabled, setTapSoundEnabled] = useState<boolean>(true);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initializeTapSound();
      await loadData();
    };
    init();
  }, []);
  
  useEffect(() => {
    if (!isLoading) {
      playSplashSound(tapSoundEnabled);
    }
  }, [isLoading, tapSoundEnabled]);

  const loadData = async () => {
    try {
      const [
        accountsData,
        transactionsData,
        budgetsData,
        currencyData,
        themeData,
        tapSoundData,
        firstTimeData,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCOUNTS),
        AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS),
        AsyncStorage.getItem(STORAGE_KEYS.BUDGETS),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENCY),
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
        AsyncStorage.getItem(STORAGE_KEYS.TAP_SOUND),
        AsyncStorage.getItem(STORAGE_KEYS.FIRST_TIME),
      ]);

      if (accountsData) {
        setAccounts(JSON.parse(accountsData));
      }
      if (transactionsData) {
        const parsed = JSON.parse(transactionsData);
        setTransactions(parsed.map((t: Transaction) => ({ ...t, date: new Date(t.date) })));
      }
      if (budgetsData) {
        setBudgets(JSON.parse(budgetsData));
      }
      if (currencyData) {
        setCurrency(JSON.parse(currencyData));
      }
      if (themeData) {
        setTheme(JSON.parse(themeData));
      }
      if (tapSoundData !== null) {
        setTapSoundEnabled(JSON.parse(tapSoundData));
      }
      if (firstTimeData !== null) {
        setIsFirstTime(JSON.parse(firstTimeData));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAccounts = useCallback(async (newAccounts: Account[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(newAccounts));
      setAccounts(newAccounts);
    } catch (error) {
      console.error("Error saving accounts:", error);
    }
  }, []);

  const saveTransactions = useCallback(async (newTransactions: Transaction[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    } catch (error) {
      console.error("Error saving transactions:", error);
    }
  }, []);

  const saveBudgets = useCallback(async (newBudgets: Budget[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(newBudgets));
      setBudgets(newBudgets);
    } catch (error) {
      console.error("Error saving budgets:", error);
    }
  }, []);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };

    const updatedTransactions = [newTransaction, ...transactions];
    await saveTransactions(updatedTransactions);

    const accountIndex = accounts.findIndex((acc) => acc.id === transaction.accountId);
    if (accountIndex !== -1) {
      const updatedAccounts = [...accounts];
      if (transaction.type === "income") {
        updatedAccounts[accountIndex].balance += transaction.amount;
      } else {
        updatedAccounts[accountIndex].balance -= transaction.amount;
      }
      await saveAccounts(updatedAccounts);
    }

    if (transaction.type === "expense") {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const budgetIndex = budgets.findIndex(
        (b) => b.category === transaction.category && b.month === currentMonth
      );
      if (budgetIndex !== -1) {
        const updatedBudgets = [...budgets];
        updatedBudgets[budgetIndex].spent += transaction.amount;
        await saveBudgets(updatedBudgets);
      }
    }
  }, [transactions, accounts, budgets, saveTransactions, saveAccounts, saveBudgets]);

  const updateTransaction = useCallback(async (transactionId: string, updatedData: Partial<Omit<Transaction, "id">>) => {
    const transaction = transactions.find((t) => t.id === transactionId);
    if (!transaction) return;

    const oldAmount = transaction.amount;
    const oldAccountId = transaction.accountId;
    const oldType = transaction.type;
    const oldCategory = transaction.category;

    const updatedTransaction = { ...transaction, ...updatedData };
    const updatedTransactions = transactions.map((t) => 
      t.id === transactionId ? updatedTransaction : t
    );
    await saveTransactions(updatedTransactions);

    if (updatedData.amount !== undefined || updatedData.accountId !== undefined || updatedData.type !== undefined) {
      const updatedAccounts = [...accounts];
      
      if (oldAccountId === updatedTransaction.accountId) {
        const accountIndex = updatedAccounts.findIndex((acc) => acc.id === oldAccountId);
        if (accountIndex !== -1) {
          if (oldType === "income") {
            updatedAccounts[accountIndex].balance -= oldAmount;
          } else {
            updatedAccounts[accountIndex].balance += oldAmount;
          }
          if (updatedTransaction.type === "income") {
            updatedAccounts[accountIndex].balance += updatedTransaction.amount;
          } else {
            updatedAccounts[accountIndex].balance -= updatedTransaction.amount;
          }
        }
      } else {
        const oldAccountIndex = updatedAccounts.findIndex((acc) => acc.id === oldAccountId);
        if (oldAccountIndex !== -1) {
          if (oldType === "income") {
            updatedAccounts[oldAccountIndex].balance -= oldAmount;
          } else {
            updatedAccounts[oldAccountIndex].balance += oldAmount;
          }
        }
        const newAccountIndex = updatedAccounts.findIndex((acc) => acc.id === updatedTransaction.accountId);
        if (newAccountIndex !== -1) {
          if (updatedTransaction.type === "income") {
            updatedAccounts[newAccountIndex].balance += updatedTransaction.amount;
          } else {
            updatedAccounts[newAccountIndex].balance -= updatedTransaction.amount;
          }
        }
      }
      await saveAccounts(updatedAccounts);
    }

    if (updatedData.category !== undefined || updatedData.amount !== undefined || updatedData.type !== undefined) {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const updatedBudgets = [...budgets];

      if (oldType === "expense") {
        const oldBudgetIndex = updatedBudgets.findIndex(
          (b) => b.category === oldCategory && b.month === currentMonth
        );
        if (oldBudgetIndex !== -1) {
          updatedBudgets[oldBudgetIndex].spent -= oldAmount;
        }
      }

      if (updatedTransaction.type === "expense") {
        const newBudgetIndex = updatedBudgets.findIndex(
          (b) => b.category === updatedTransaction.category && b.month === currentMonth
        );
        if (newBudgetIndex !== -1) {
          updatedBudgets[newBudgetIndex].spent += updatedTransaction.amount;
        }
      }

      await saveBudgets(updatedBudgets);
    }
  }, [transactions, accounts, budgets, saveTransactions, saveAccounts, saveBudgets]);

  const deleteTransaction = useCallback(async (transactionId: string) => {
    const transaction = transactions.find((t) => t.id === transactionId);
    if (!transaction) return;

    const updatedTransactions = transactions.filter((t) => t.id !== transactionId);
    await saveTransactions(updatedTransactions);

    const accountIndex = accounts.findIndex((acc) => acc.id === transaction.accountId);
    if (accountIndex !== -1) {
      const updatedAccounts = [...accounts];
      if (transaction.type === "income") {
        updatedAccounts[accountIndex].balance -= transaction.amount;
      } else {
        updatedAccounts[accountIndex].balance += transaction.amount;
      }
      await saveAccounts(updatedAccounts);
    }

    if (transaction.type === "expense") {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const budgetIndex = budgets.findIndex(
        (b) => b.category === transaction.category && b.month === currentMonth
      );
      if (budgetIndex !== -1) {
        const updatedBudgets = [...budgets];
        updatedBudgets[budgetIndex].spent -= transaction.amount;
        await saveBudgets(updatedBudgets);
      }
    }
  }, [transactions, accounts, budgets, saveTransactions, saveAccounts, saveBudgets]);

  const addAccount = useCallback(async (account: Omit<Account, "id">, createInitialTransaction = false) => {
    const newAccount: Account = {
      ...account,
      id: Date.now().toString(),
    };
    await saveAccounts([...accounts, newAccount]);

    if (createInitialTransaction && account.balance > 0) {
      const initialTransaction: Transaction = {
        id: (Date.now() + 1).toString(),
        amount: account.balance,
        category: "salary",
        description: account.name,
        type: "income",
        accountId: newAccount.id,
        date: new Date(),
      };
      const updatedTransactions = [initialTransaction, ...transactions];
      await saveTransactions(updatedTransactions);
    }

    return newAccount.id;
  }, [accounts, transactions, saveAccounts, saveTransactions]);

  const removeAccount = useCallback(async (accountId: string) => {
    const defaultAccountIds = ["1", "2", "3"];
    if (defaultAccountIds.includes(accountId)) {
      return;
    }
    const updatedAccounts = accounts.filter((acc) => acc.id !== accountId);
    await saveAccounts(updatedAccounts);
  }, [accounts, saveAccounts]);

  const updateCurrency = useCallback(async (code: string, symbol: string) => {
    try {
      const newCurrency = { code, symbol };
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENCY, JSON.stringify(newCurrency));
      setCurrency(newCurrency);
    } catch (error) {
      console.error("Error saving currency:", error);
    }
  }, []);

  const updateBudget = useCallback(async (category: string, limit: number) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const existingBudgetIndex = budgets.findIndex(
      (b) => b.category === category && b.month === currentMonth
    );

    const spent = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === category &&
          t.date.toISOString().slice(0, 7) === currentMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);

    if (existingBudgetIndex !== -1) {
      const updatedBudgets = [...budgets];
      updatedBudgets[existingBudgetIndex].limit = limit;
      updatedBudgets[existingBudgetIndex].spent = spent;
      await saveBudgets(updatedBudgets);
    } else {
      const newBudget: Budget = {
        id: Date.now().toString(),
        category: category as any,
        limit,
        spent,
        month: currentMonth,
      };
      await saveBudgets([...budgets, newBudget]);
    }
  }, [budgets, transactions, saveBudgets]);

  const getTotalBalance = useCallback(() => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }, [accounts]);

  const getMonthlyIncome = useCallback(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return transactions
      .filter((t) => t.type === "income" && t.date.toISOString().slice(0, 7) === currentMonth)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const getMonthlyExpenses = useCallback(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return transactions
      .filter((t) => t.type === "expense" && t.date.toISOString().slice(0, 7) === currentMonth)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const updateTheme = useCallback(async (newTheme: "light" | "dark") => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(newTheme));
      setTheme(newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  }, []);

  const updateTapSound = useCallback(async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TAP_SOUND, JSON.stringify(enabled));
      setTapSoundEnabled(enabled);
    } catch (error) {
      console.error("Error saving tap sound setting:", error);
    }
  }, []);

  const markAsReturningUser = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_TIME, JSON.stringify(false));
      setIsFirstTime(false);
    } catch (error) {
      console.error("Error saving first time status:", error);
    }
  }, []);

  const resetAllData = useCallback(async () => {
    try {
      const defaultAccounts: Account[] = [
        {
          id: "1",
          name: "Cash",
          balance: 0,
          icon: "wallet",
          color: "#6C63FF",
        },
        {
          id: "2",
          name: "Bank Account",
          balance: 0,
          icon: "landmark",
          color: "#10B981",
        },
        {
          id: "3",
          name: "Credit Card",
          balance: 0,
          icon: "credit-card",
          color: "#EF4444",
        },
      ];

      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCOUNTS,
        STORAGE_KEYS.TRANSACTIONS,
        STORAGE_KEYS.BUDGETS,
      ]);

      setAccounts(defaultAccounts);
      setTransactions([]);
      setBudgets([]);
    } catch (error) {
      console.error("Error resetting data:", error);
      throw error;
    }
  }, []);

  return useMemo(() => ({
    accounts,
    transactions,
    budgets,
    currency,
    theme,
    tapSoundEnabled,
    isFirstTime,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addAccount,
    removeAccount,
    updateBudget,
    updateCurrency,
    updateTheme,
    updateTapSound,
    markAsReturningUser,
    getTotalBalance,
    getMonthlyIncome,
    getMonthlyExpenses,
    resetAllData,
  }), [accounts, transactions, budgets, currency, theme, tapSoundEnabled, isFirstTime, isLoading, addTransaction, updateTransaction, deleteTransaction, addAccount, removeAccount, updateBudget, updateCurrency, updateTheme, updateTapSound, markAsReturningUser, getTotalBalance, getMonthlyIncome, getMonthlyExpenses, resetAllData]);
});
