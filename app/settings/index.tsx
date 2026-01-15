import { LanguagePickerComponent } from '@/components/features/settings/LanguagePicker';
import { Colors } from '@/constants/Colors';
import { FontSize, Spacing } from '@/constants/Styles';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('change_language')}</Text> 
      {/* Note: In a real Settings screen, this might be a list item leading to a detail view, 
          but for now we place the picker directly here */}
      <LanguagePickerComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: Colors.light.background,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    color: Colors.light.text,
  }
});
