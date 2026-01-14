import LogoIcon from '@/assets/images/logoIcon.svg'
import { Colors } from '@/constants/Colors'
import { api } from '@/convex/_generated/api'
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/clerk-expo'
import { useConvexAuth, useMutation } from 'convex/react'
import { Link, Tabs, useRouter } from 'expo-router'
import { CalendarSearch, Flame, Globe, MapPin } from 'lucide-react-native'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ActionSheetIOS, Alert, Image, Platform, Text, TouchableOpacity, View } from 'react-native'

export default function Layout() {
  const { user } = useUser()
  const { isAuthenticated } = useConvexAuth()
  const { t } = useTranslation()
  const storeUser = useMutation(api.users.store)
  const deleteConvexUser = useMutation(api.users.deleteCurrentUser)
  const { signOut } = useClerk()
  const router = useRouter()

  useEffect(() => {
    if (user && isAuthenticated) {
      storeUser({}).catch(err => {
        console.log("Store user failed:", err);
      });
    }
  }, [user, isAuthenticated])

  const handleProfilePress = () => {
    const options = [t('profile'), 'Sign Out', 'Delete Account', 'Cancel'];
    const destructiveButtonIndex = 2; // Delete Account
    const cancelButtonIndex = 3;

    const handleDeleteAccount = async () => {
      try {
        if (!user) return;
        
        // 1. Delete from Convex
        await deleteConvexUser({});
        
        // 2. Delete from Clerk
        await user.delete();
        
        // 3. Sign Out (Implicitly handled by user deletion usually, but helps cleanup)
        // await signOut(); // often not needed if user.delete() clears session, but safe to do
        
        router.replace('/(auth)/sign-in');
      } catch (error) {
        console.error("Error deleting account:", error);
        Alert.alert("Error", "Failed to delete account. Please try again.");
      }
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex,
          cancelButtonIndex,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            router.push('/(home)');
          } else if (buttonIndex === 1) {
            await signOut();
            router.replace('/(auth)/sign-in');
          } else if (buttonIndex === 2) {
             // Confirm deletion on iOS
             Alert.alert(
                "Delete Account",
                "Are you sure? This action cannot be undone.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: handleDeleteAccount }
                ]
             );
          }
        }
      );
    } else {
      Alert.alert(
        'Account',
        'Choose an action',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', onPress: async () => {
             await signOut();
             router.replace('/(auth)/sign-in');
          }},
          { text: 'Delete Account', style: 'destructive', onPress: () => {
             Alert.alert(
                "Delete Account",
                "Are you sure? This action cannot be undone.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: handleDeleteAccount }
                ]
             );
          }},
          { text: t('profile'), onPress: () => router.push('/(home)') },
        ]
      );
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        headerShown: true,
        headerTitle: '',
        headerStyle: {
          backgroundColor: Colors.light.background,
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.light.border,
          height: 120, // Increased height as requested
        },
        headerLeft: () => (
          <View style={{ marginLeft: 16 }}>
            <LogoIcon width={32} height={32} />
          </View>
        ),
        headerRight: () => (
          <View style={{ marginRight: 16 }}>
            <SignedOut>
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity style={{ 
                  backgroundColor: Colors.light.primary, 
                  paddingHorizontal: 14, 
                  paddingVertical: 8, 
                  borderRadius: 20 
                }}>
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </SignedOut>
            <SignedIn>
              <TouchableOpacity onPress={handleProfilePress}>
                <Image 
                  source={{ uri: user?.imageUrl }} 
                  style={{ width: 36, height: 36, borderRadius: 18 }} 
                />
              </TouchableOpacity>
            </SignedIn>
          </View>
        ),
        tabBarStyle: {
          backgroundColor: Colors.light.background,
          borderTopWidth: 1,
          borderTopColor: Colors.light.border,
          height: 90,
          paddingTop: 8,
          paddingBottom: 30,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="arena"
        options={{
          title: t('arena'),
          tabBarIcon: ({ color }) => <Flame color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: t('events'),
          tabBarIcon: ({ color }) => <CalendarSearch color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t('profile'),
          tabBarIcon: ({ color }) => (
            <View style={{ width: 24, height: 24 }}>
              <LogoIcon width="100%" height="100%" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: t('social'),
          tabBarIcon: ({ color }) => <Globe color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: t('maps'),
          tabBarIcon: ({ color }) => <MapPin color={color} size={24} />,
        }}
      />
    </Tabs>
  )
}
