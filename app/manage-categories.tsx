import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react-native";

import Colors from "@/constants/colors";
import { playTapSound } from "@/utils/tapSound";
import { useApp } from "@/contexts/AppContext";
import { TransactionType } from "@/types";

const AVAILABLE_ICONS = [
  "shopping-cart", "coffee", "pizza", "utensils", "car", "plane", 
  "home", "briefcase", "laptop", "book-open", "heart", "gift",
  "music", "camera", "phone", "wifi", "battery", "zap",
  "mail", "map-pin", "clock", "calendar", "dollar-sign", "trending-up"
];

const AVAILABLE_COLORS = [
  "#F97316", "#EF4444", "#EC4899", "#A855F7", "#8B5CF6",
  "#6366F1", "#3B82F6", "#0EA5E9", "#06B6D4", "#14B8A6",
  "#10B981", "#22C55E", "#84CC16", "#EAB308", "#F59E0B"
];

export default function ManageCategoriesScreen() {
  const { categories, theme, tapSoundEnabled, addCategory, deleteCategory } = useApp();
  const currentColors = theme === "dark" ? Colors.dark : Colors.light;

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState<TransactionType>("expense");
  const [newCategoryIcon, setNewCategoryIcon] = useState(AVAILABLE_ICONS[0]);
  const [newCategoryColor, setNewCategoryColor] = useState(AVAILABLE_COLORS[0]);

  const handleOpenAddModal = () => {
    playTapSound(tapSoundEnabled);
    setNewCategoryName("");
    setNewCategoryType("expense");
    setNewCategoryIcon(AVAILABLE_ICONS[0]);
    setNewCategoryColor(AVAILABLE_COLORS[0]);
    setAddModalVisible(true);
  };

  const handleCloseAddModal = () => {
    playTapSound(tapSoundEnabled);
    setAddModalVisible(false);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      return;
    }

    playTapSound(tapSoundEnabled);
    await addCategory({
      name: newCategoryName.trim(),
      type: newCategoryType,
      icon: newCategoryIcon,
      color: newCategoryColor,
    });
    setAddModalVisible(false);
  };

  const handleOpenDeleteModal = (categoryId: string) => {
    playTapSound(tapSoundEnabled);
    setSelectedCategory(categoryId);
    setDeleteModalVisible(true);
  };

  const handleCloseDeleteModal = () => {
    playTapSound(tapSoundEnabled);
    setDeleteModalVisible(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    playTapSound(tapSoundEnabled);
    await deleteCategory(selectedCategory);
    setDeleteModalVisible(false);
    setSelectedCategory(null);
  };

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

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
          <Text style={[styles.headerTitle, { color: currentColors.text }]}>Manage Categories</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: currentColors.tint }]}
            onPress={handleOpenAddModal}
            activeOpacity={0.7}
          >
            <Plus color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.textSecondary }]}>EXPENSE CATEGORIES</Text>
            <View style={styles.categoriesList}>
              {expenseCategories.map((category) => {
                const Icon = require("lucide-react-native")[
                  category.icon
                    .split("-")
                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join("")
                ];

                return (
                  <View
                    key={category.id}
                    style={[styles.categoryCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}
                  >
                    <View style={styles.categoryLeft}>
                      <View style={[styles.categoryIcon, { backgroundColor: category.color + "20" }]}>
                        <Icon color={category.color} size={20} />
                      </View>
                      <Text style={[styles.categoryName, { color: currentColors.text }]}>
                        {category.name}
                      </Text>
                    </View>
                    {category.isCustom && (
                      <TouchableOpacity
                        style={[styles.deleteButton, { backgroundColor: currentColors.expense + "20" }]}
                        onPress={() => handleOpenDeleteModal(category.id)}
                        activeOpacity={0.7}
                      >
                        <Trash2 color={currentColors.expense} size={18} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.textSecondary }]}>INCOME CATEGORIES</Text>
            <View style={styles.categoriesList}>
              {incomeCategories.map((category) => {
                const Icon = require("lucide-react-native")[
                  category.icon
                    .split("-")
                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join("")
                ];

                return (
                  <View
                    key={category.id}
                    style={[styles.categoryCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}
                  >
                    <View style={styles.categoryLeft}>
                      <View style={[styles.categoryIcon, { backgroundColor: category.color + "20" }]}>
                        <Icon color={category.color} size={20} />
                      </View>
                      <Text style={[styles.categoryName, { color: currentColors.text }]}>
                        {category.name}
                      </Text>
                    </View>
                    {category.isCustom && (
                      <TouchableOpacity
                        style={[styles.deleteButton, { backgroundColor: currentColors.expense + "20" }]}
                        onPress={() => handleOpenDeleteModal(category.id)}
                        activeOpacity={0.7}
                      >
                        <Trash2 color={currentColors.expense} size={18} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseAddModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: currentColors.background }]}>
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>Add Custom Category</Text>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.inputSection}>
                <Text style={[styles.label, { color: currentColors.text }]}>Category Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border, color: currentColors.text }]}
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  placeholder="Enter category name"
                  placeholderTextColor={currentColors.textSecondary}
                />
              </View>

              <View style={styles.inputSection}>
                <Text style={[styles.label, { color: currentColors.text }]}>Type</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border },
                      newCategoryType === "expense" && { backgroundColor: currentColors.expense, borderColor: currentColors.expense },
                    ]}
                    onPress={() => {
                      playTapSound(tapSoundEnabled);
                      setNewCategoryType("expense");
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        { color: currentColors.text },
                        newCategoryType === "expense" && { color: "#FFFFFF" },
                      ]}
                    >
                      Expense
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border },
                      newCategoryType === "income" && { backgroundColor: currentColors.income, borderColor: currentColors.income },
                    ]}
                    onPress={() => {
                      playTapSound(tapSoundEnabled);
                      setNewCategoryType("income");
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        { color: currentColors.text },
                        newCategoryType === "income" && { color: "#FFFFFF" },
                      ]}
                    >
                      Income
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputSection}>
                <Text style={[styles.label, { color: currentColors.text }]}>Icon</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconsGrid}>
                  {AVAILABLE_ICONS.map((iconName) => {
                    const Icon = require("lucide-react-native")[
                      iconName
                        .split("-")
                        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join("")
                    ];

                    return (
                      <TouchableOpacity
                        key={iconName}
                        style={[
                          styles.iconButton,
                          { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border },
                          newCategoryIcon === iconName && { backgroundColor: newCategoryColor + "20", borderColor: newCategoryColor },
                        ]}
                        onPress={() => {
                          playTapSound(tapSoundEnabled);
                          setNewCategoryIcon(iconName);
                        }}
                        activeOpacity={0.7}
                      >
                        <Icon color={newCategoryIcon === iconName ? newCategoryColor : currentColors.text} size={20} />
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={styles.inputSection}>
                <Text style={[styles.label, { color: currentColors.text }]}>Color</Text>
                <View style={styles.colorsGrid}>
                  {AVAILABLE_COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorButton,
                        { backgroundColor: color },
                        newCategoryColor === color && styles.colorButtonSelected,
                      ]}
                      onPress={() => {
                        playTapSound(tapSoundEnabled);
                        setNewCategoryColor(color);
                      }}
                      activeOpacity={0.7}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}
                onPress={handleCloseAddModal}
                activeOpacity={0.7}
              >
                <Text style={[styles.cancelButtonText, { color: currentColors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: currentColors.tint }]}
                onPress={handleAddCategory}
                disabled={!newCategoryName.trim()}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseDeleteModal}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={[styles.deleteModalContainer, { backgroundColor: currentColors.background }]}>
            <Text style={[styles.deleteModalTitle, { color: currentColors.text }]}>Delete Category</Text>
            <Text style={[styles.deleteModalMessage, { color: currentColors.textSecondary }]}>
              Are you sure you want to delete this category? This action cannot be undone.
            </Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.cancelDeleteButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}
                onPress={handleCloseDeleteModal}
                activeOpacity={0.7}
              >
                <Text style={[styles.cancelDeleteButtonText, { color: currentColors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmDeleteButton, { backgroundColor: currentColors.expense }]}
                onPress={handleDeleteCategory}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmDeleteButtonText}>Delete</Text>
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
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  categoriesList: {
    gap: 12,
  },
  categoryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  modalContent: {
    maxHeight: "70%",
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 2,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  iconsGrid: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 4,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  colorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: "transparent",
  },
  colorButtonSelected: {
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {},
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  deleteModalContainer: {
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  deleteModalMessage: {
    fontSize: 15,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  deleteModalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelDeleteButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  cancelDeleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  confirmDeleteButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmDeleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
