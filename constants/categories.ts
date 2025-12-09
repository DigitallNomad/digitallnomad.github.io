import { Category } from "@/types";
import { categoryColors } from "./colors";

export const defaultExpenseCategories: Category[] = [
  { id: "food", name: "Food & Dining", icon: "utensils", color: categoryColors.food, type: "expense", isCustom: false },
  { id: "transport", name: "Transport", icon: "car", color: categoryColors.transport, type: "expense", isCustom: false },
  { id: "shopping", name: "Shopping", icon: "shopping-bag", color: categoryColors.shopping, type: "expense", isCustom: false },
  { id: "entertainment", name: "Entertainment", icon: "film", color: categoryColors.entertainment, type: "expense", isCustom: false },
  { id: "health", name: "Health", icon: "heart-pulse", color: categoryColors.health, type: "expense", isCustom: false },
  { id: "bills", name: "Bills & Utilities", icon: "file-text", color: categoryColors.bills, type: "expense", isCustom: false },
  { id: "groceries", name: "Groceries", icon: "shopping-cart", color: categoryColors.groceries, type: "expense", isCustom: false },
  { id: "education", name: "Education", icon: "book-open", color: categoryColors.education, type: "expense", isCustom: false },
  { id: "travel", name: "Travel", icon: "plane", color: categoryColors.travel, type: "expense", isCustom: false },
  { id: "other", name: "Other", icon: "more-horizontal", color: categoryColors.other, type: "expense", isCustom: false },
];

export const defaultIncomeCategories: Category[] = [
  { id: "salary", name: "Salary", icon: "briefcase", color: "#10B981", type: "income", isCustom: false },
  { id: "freelance", name: "Freelance", icon: "laptop", color: "#3B82F6", type: "income", isCustom: false },
  { id: "investment", name: "Investment", icon: "trending-up", color: "#8B5CF6", type: "income", isCustom: false },
  { id: "other-income", name: "Other Income", icon: "dollar-sign", color: "#6366F1", type: "income", isCustom: false },
];

export const defaultCategories = [...defaultExpenseCategories, ...defaultIncomeCategories];

export const expenseCategories = defaultExpenseCategories;
export const incomeCategories = defaultIncomeCategories;
export const allCategories = defaultCategories;
