import LogoIcon from '@/assets/images/logoIcon.svg'
import { Colors } from '@/constants/Colors'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, Tabs } from 'expo-router'
import { CalendarSearch, Flame, Globe, MapPin } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Image, Text, TouchableOpacity, View } from 'react-native'

export default function Layout() {
  const { user } = useUser()
  const { t } = useTranslation()

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
              <Link href="/(home)" asChild>
                <TouchableOpacity>
                  <Image 
                    source={{ uri: user?.imageUrl }} 
                    style={{ width: 36, height: 36, borderRadius: 18 }} 
                  />
                </TouchableOpacity>
              </Link>
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
