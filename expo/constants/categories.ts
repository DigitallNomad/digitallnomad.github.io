import { Category } from "@/types";
import { categoryColors } from "./colors";

export const expenseCategories: Category[] = [
  { id: "food", name: "Food & Dining", icon: "utensils", color: categoryColors.food, type: "expense" },
  { id: "transport", name: "Transport", icon: "car", color: categoryColors.transport, type: "expense" },
  { id: "shopping", name: "Shopping", icon: "shopping-bag", color: categoryColors.shopping, type: "expense" },
  { id: "entertainment", name: "Entertainment", icon: "film", color: categoryColors.entertainment, type: "expense" },
  { id: "health", name: "Health", icon: "heart-pulse", color: categoryColors.health, type: "expense" },
  { id: "bills", name: "Bills & Utilities", icon: "file-text", color: categoryColors.bills, type: "expense" },
  { id: "groceries", name: "Groceries", icon: "shopping-cart", color: categoryColors.groceries, type: "expense" },
  { id: "education", name: "Education", icon: "book-open", color: categoryColors.education, type: "expense" },
  { id: "travel", name: "Travel", icon: "plane", color: categoryColors.travel, type: "expense" },
  { id: "other", name: "Other", icon: "more-horizontal", color: categoryColors.other, type: "expense" },
];

export const incomeCategories: Category[] = [
  { id: "salary", name: "Salary", icon: "briefcase", color: "#10B981", type: "income" },
  { id: "freelance", name: "Freelance", icon: "laptop", color: "#3B82F6", type: "income" },
  { id: "investment", name: "Investment", icon: "trending-up", color: "#8B5CF6", type: "income" },
  { id: "other", name: "Other Income", icon: "dollar-sign", color: "#6366F1", type: "income" },
];

export const allCategories = [...expenseCategories, ...incomeCategories];
