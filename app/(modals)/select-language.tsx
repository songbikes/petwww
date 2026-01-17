import { Colors } from '@/constants/Colors';
import { LANGUAGES } from '@/constants/Languages';
import { FontSize, Spacing } from '@/constants/Styles';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SelectLanguage() {
  const { i18n } = useTranslation();
  const router = useRouter();

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    router.back();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={LANGUAGES}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity 
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
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
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
