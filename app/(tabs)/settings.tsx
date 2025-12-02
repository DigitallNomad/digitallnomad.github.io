import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Globe, RotateCcw, Moon, Sun, Volume2, VolumeX, Shield, FileText } from "lucide-react-native";
import { useState } from "react";

import Colors from "@/constants/colors";
import { playTapSound } from "@/utils/tapSound";
import { useApp } from "@/contexts/AppContext";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const {
    currency,
    theme,
    tapSoundEnabled,
    updateTheme,
    updateTapSound,
    resetAllData,
  } = useApp();

  const currentColors = theme === "dark" ? Colors.dark : Colors.light;
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleSelectCurrency = () => {
    playTapSound(tapSoundEnabled);
    router.push("/select-currency");
  };

  const handleReset = () => {
    playTapSound(tapSoundEnabled);
    setResetModalVisible(true);
  };

  const confirmReset = async () => {
    try {
      await resetAllData();
      setResetModalVisible(false);
      setSuccessModalVisible(true);
    } catch (error) {
      setResetModalVisible(false);
    }
  };

  const cancelReset = () => {
    playTapSound(tapSoundEnabled);
    setResetModalVisible(false);
  };

  const closeSuccessModal = () => {
    playTapSound(tapSoundEnabled);
    setSuccessModalVisible(false);
  };

  const handleToggleTheme = () => {
    playTapSound(tapSoundEnabled);
    updateTheme(theme === "light" ? "dark" : "light");
  };

  const handleToggleTapSound = (value: boolean) => {
    playTapSound(value);
    updateTapSound(value);
  };

  const handleOpenPrivacyPolicy = async () => {
    await playTapSound(tapSoundEnabled);
    Linking.openURL("https://sites.google.com/view/expensefox-legal/privacy-policy");
  };

  const handleOpenTerms = async () => {
    await playTapSound(tapSoundEnabled);
    Linking.openURL("https://sites.google.com/view/expensefox-legal/terms-and-conditions");
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.headerTitle, { color: currentColors.text }]}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.textSecondary }]}>
            APPEARANCE
          </Text>
          <View style={[styles.card, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleToggleTheme}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: currentColors.tint + "20" }]}>
                  {theme === "light" ? (
                    <Sun color={currentColors.tint} size={22} />
                  ) : (
                    <Moon color={currentColors.tint} size={22} />
                  )}
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: currentColors.text }]}>
                    Theme
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: currentColors.textSecondary }]}>
                    {theme === "light" ? "Light Mode" : "Dark Mode"}
                  </Text>
                </View>
              </View>
              <Switch
                value={theme === "dark"}
                onValueChange={handleToggleTheme}
                trackColor={{ false: currentColors.border, true: currentColors.tint }}
                thumbColor="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.textSecondary }]}>
            PREFERENCES
          </Text>
          <View style={[styles.card, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleSelectCurrency}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: "#10B981" + "20" }]}>
                  <Globe color="#10B981" size={22} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: currentColors.text }]}>
                    Currency
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: currentColors.textSecondary }]}>
                    {currency.code} ({currency.symbol})
                  </Text>
                </View>
              </View>
              <Text style={[styles.settingValue, { color: currentColors.textSecondary }]}>
                {currency.symbol}
              </Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: currentColors.border }]} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: "#6C63FF" + "20" }]}>
                  {tapSoundEnabled ? (
                    <Volume2 color="#6C63FF" size={22} />
                  ) : (
                    <VolumeX color="#6C63FF" size={22} />
                  )}
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: currentColors.text }]}>
                    Tap Feedback
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: currentColors.textSecondary }]}>
                    Sound & vibration on tap
                  </Text>
                </View>
              </View>
              <Switch
                value={tapSoundEnabled}
                onValueChange={handleToggleTapSound}
                trackColor={{ false: currentColors.border, true: currentColors.tint }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.textSecondary }]}>
            LEGAL
          </Text>
          <View style={[styles.card, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleOpenPrivacyPolicy}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: "#3B82F6" + "20" }]}>
                  <Shield color="#3B82F6" size={22} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: currentColors.text }]}>
                    Privacy Policy
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: currentColors.textSecondary }]}>
                    View our privacy policy
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: currentColors.border }]} />

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleOpenTerms}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: "#8B5CF6" + "20" }]}>
                  <FileText color="#8B5CF6" size={22} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: currentColors.text }]}>
                    Terms & Conditions
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: currentColors.textSecondary }]}>
                    Read our terms of service
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.textSecondary }]}>
            DATA
          </Text>
          <View style={[styles.card, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: "#EF4444" + "20" }]}>
                  <RotateCcw color="#EF4444" size={22} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: currentColors.text }]}>
                    Reset All Data
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: currentColors.textSecondary }]}>
                    Clear all transactions and accounts
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.appInfo}>
          <Text style={[styles.appName, { color: currentColors.textSecondary }]}>
            ExpenseFox Budget Tracker
          </Text>
          <Text style={[styles.appVersion, { color: currentColors.textSecondary }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={resetModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={cancelReset}
      >
        <View style={styles.resetModalOverlay}>
          <View style={[styles.resetModalContainer, { backgroundColor: currentColors.background }]}>
            <Text style={[styles.resetModalTitle, { color: currentColors.text }]}>Reset All Data</Text>
            <Text style={[styles.resetModalMessage, { color: currentColors.textSecondary }]}>
              Are you sure you want to reset everything? This will:{"\n\n"}• Clear all transactions{"\n"}• Reset all account balances to $0{"\n"}• Clear all budgets{"\n\n"}This action cannot be undone.
            </Text>
            <View style={styles.resetModalButtons}>
              <TouchableOpacity
                style={[styles.cancelResetButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }]}
                onPress={cancelReset}
                activeOpacity={0.7}
              >
                <Text style={[styles.cancelResetButtonText, { color: currentColors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmResetButton, { backgroundColor: currentColors.expense }]}
                onPress={confirmReset}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmResetButtonText}>Reset</Text>
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
              All data has been reset successfully
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
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 14,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginLeft: 78,
  },
  appInfo: {
    alignItems: "center",
    marginTop: 24,
    paddingVertical: 24,
  },
  appName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 13,
  },
  resetModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  resetModalContainer: {
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
  resetModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: "center",
  },
  resetModalMessage: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  resetModalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelResetButton: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cancelResetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  confirmResetButton: {
    flex: 1,
    backgroundColor: Colors.light.expense,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmResetButtonText: {
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
});
