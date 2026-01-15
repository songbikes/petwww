import { Colors } from '@/constants/Colors';
import { FontSize, Spacing } from '@/constants/Styles';
import { Check, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LANGUAGES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'zh-Hans', label: '简体中文' },
  { code: 'zh-Hant', label: '繁體中文' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'th', label: 'ไทย' },
  { code: 'ko', label: '한국어' },
  { code: 'ja', label: '日本語' },
];

export function LanguagePickerComponent() {
  const { i18n, t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setModalVisible(false);
  };

  const currentLabel = LANGUAGES.find(l => l.code === i18n.language)?.label || i18n.language;

  return (
    <View>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>{t('change_language')}</Text>
        <Text style={styles.currentLanguage}>{currentLabel}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{t('change_language')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <X color={Colors.light.text} size={24} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.languageOption,
                    i18n.language === item.code && styles.selectedOption
                  ]} 
                  onPress={() => changeLanguage(item.code)}
                >
                  <Text style={[
                    styles.languageText,
                    i18n.language === item.code && styles.selectedText
                  ]}>
                    {item.label}
                  </Text>
                  {i18n.language === item.code && (
                    <Check size={20} color={Colors.light.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: Spacing.md,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.light.text,
  },
  currentLanguage: {
    fontSize: FontSize.sm,
    color: Colors.light.tabIconDefault,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  closeButton: {
    position: 'absolute',
    right: Spacing.lg,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.border,
  },
  selectedOption: {
    backgroundColor: Colors.light.background, // Can add a tint if desired
  },
  languageText: {
    fontSize: FontSize.md,
    color: Colors.light.text,
  },
  selectedText: {
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
});
