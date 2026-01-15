import LogoIcon from '@/assets/images/logoIcon.svg'
import { Colors } from '@/constants/Colors'
import { api } from '@/convex/_generated/api'
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/clerk-expo'
import { useConvexAuth, useMutation } from 'convex/react'
import { Link, Tabs, useRouter } from 'expo-router'
import { CalendarSearch, CircleUserRound, Earth, MapPin, Plus, Settings, UsersRound } from 'lucide-react-native'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ActionSheetIOS, Alert, Image, Platform, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'

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
            router.replace('/(home)/social');
            Toast.show({
              type: 'success',
              text1: 'Signed out successfully',
            });
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
             router.replace('/(home)/social');
             Toast.show({
              type: 'success',
              text1: 'Signed out successfully',
            });
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
      screenOptions={({ route }) => ({
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
        headerRight: () => {
          const showCreateButton = ['events', 'social', 'maps'].includes(route.name);
          const handleCreatePress = () => {
            if (route.name === 'events') router.push('/(modals)/create-event');
            if (route.name === 'social') router.push('/(modals)/create-post');
            if (route.name === 'maps') router.push('/(modals)/create-location');
          };
          
          return (
            <View style={{ marginRight: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <SignedIn>
                {showCreateButton && (
                  <TouchableOpacity onPress={handleCreatePress}>
                    <Plus color={Colors.light.text} size={28} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleProfilePress}>
                  <Settings color={Colors.light.text} size={28} />
                </TouchableOpacity>
              </SignedIn>
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
            </View>
          );
        },
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
      })}
    >
      <Tabs.Screen
        name="arena"
        options={{
          title: t('tour'),
          tabBarIcon: ({ color }) => <Earth color={color} size={24} />,
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
        name="social"
        options={{
          title: t('social'),
          tabBarIcon: ({ color }) => <UsersRound color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: t('maps'),
          tabBarIcon: ({ color }) => <MapPin color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t('profile'),
          tabBarIcon: ({ color }) => user?.imageUrl ? (
            <Image 
              source={{ uri: user.imageUrl }} 
              style={{ width: 24, height: 24, borderRadius: 12 }} 
            />
          ) : (
            <CircleUserRound color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  )
}
