import { Colors } from '@/constants/Colors';
import '@/i18n'; // Initialize i18n
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack } from "expo-router";
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftWidth: 0,
        borderRadius: 25,
        backgroundColor: Colors.light.black,
        height: 50,
        width: '90%',
        marginTop: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.white,
        textAlign: 'center'
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftWidth: 0,
        borderRadius: 25,
        backgroundColor: Colors.light.red,
        height: 50,
        width: '90%',
        marginTop: 10,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.white,
        textAlign: 'center'
      }}
    />
  )
};

// Reusable configuration for FormSheet modals
const modalScreenOptions = {
  presentation: 'formSheet' as const,
  sheetGrabberVisible: true,
  sheetAllowedDetents: [0.9, 1.0],
};

export default function RootLayout() {
  return (
    <ClerkProvider 
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Stack>
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="(modals)/create-event" 
            options={{ 
              ...modalScreenOptions,
              title: 'New Event',
            }} 
          />
          <Stack.Screen 
            name="(modals)/create-post" 
            options={{ 
              ...modalScreenOptions,
              title: 'New Post',
            }} 
          />
          <Stack.Screen 
            name="(modals)/create-location" 
            options={{ 
              ...modalScreenOptions,
              title: 'Add Location',
            }} 
          />
          <Stack.Screen 
            name="settings/index" 
            options={{ title: 'Settings', headerBackTitle: 'Back' }} 
          />
          <Stack.Screen 
            name="(auth)/sign-in" 
            options={{ 
              ...modalScreenOptions,
              title: 'Sign In',
              sheetAllowedDetents: [0.7, 1.0], // Custom override for Sign In
            }} 
          />
        </Stack>
        <Toast config={toastConfig} topOffset={140} />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}