import { Colors } from '@/constants/Colors';
import { SUPPORTED_LANGUAGES } from '@/constants/Languages';
import { FontSize, Spacing } from '@/constants/Styles';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SelectLanguage() {
  const { i18n } = useTranslation();
  const router = useRouter();

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    router.back();
  };

  return (
    <View style={styles.container}>
      {SUPPORTED_LANGUAGES.map((item) => (
        <TouchableOpacity 
          key={item.code}
          style={[
            styles.option,
            i18n.language === item.code && styles.selectedOption
          ]} 
          onPress={() => changeLanguage(item.code)}
        >
          <Text style={[
            styles.text,
            i18n.language === item.code && styles.selectedText
          ]}>
            {item.label}
          </Text>
          {i18n.language === item.code && (
            <Check size={20} color={Colors.light.primary} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    paddingTop: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.border,
  },
  selectedOption: {
    backgroundColor: Colors.light.background,
  },
  text: {
    fontSize: FontSize.md,
    color: Colors.light.text,
  },
  selectedText: {
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
});
