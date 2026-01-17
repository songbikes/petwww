import { Colors } from '@/constants/Colors';
import { SUPPORTED_LANGUAGES } from '@/constants/Languages';
import { FontSize, Spacing } from '@/constants/Styles';
import { api } from '@/convex/_generated/api';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import { ChevronRight, LogOut, Trash2, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  
  const deleteConvexUser = useMutation(api.users.deleteCurrentUser);

  const currentLanguageLabel = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language)?.label || i18n.language;

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(home)/social');
      Toast.show({
        type: 'success',
        text1: 'Signed out successfully',
      });
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!user) return;
      await deleteConvexUser({});
      await user.delete();
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert("Error", "Failed to delete account. Please try again.");
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDeleteAccount }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        
        <TouchableOpacity 
           style={styles.row} 
           onPress={() => router.push('/(modals)/select-language')}
        >
          <Text style={styles.rowLabel}>{t('common.change_language')}</Text>
          <View style={styles.rowRight}>
             <Text style={styles.rowValue}>{currentLanguageLabel}</Text>
             <ChevronRight size={20} color={Colors.light.tabIconDefault} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
           style={styles.row} 
           onPress={() => router.push('/(home)')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <User size={20} color={Colors.light.text} />
            <Text style={styles.rowLabel}>{t('tabs.profile')}</Text>
          </View>
          <ChevronRight size={20} color={Colors.light.tabIconDefault} />
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { marginTop: 20 }]}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.row} onPress={handleSignOut}>
           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
             <LogOut size={20} color={Colors.light.text} />
             <Text style={styles.rowLabel}>Sign Out</Text>
           </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]} onPress={confirmDelete}>
           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
             <Trash2 size={20} color={Colors.light.red} />
             <Text style={[styles.rowLabel, { color: Colors.light.red }]}>Delete Account</Text>
           </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  section: {
    marginTop: Spacing.md,
    backgroundColor: Colors.light.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.light.border,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.light.tabIconDefault,
    marginLeft: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.light.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.backgroundSubtle, // slightly lighter separator
  },
  rowLabel: {
    fontSize: FontSize.md,
    color: Colors.light.text,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowValue: {
    fontSize: FontSize.md,
    color: Colors.light.tabIconDefault,
  }
});
