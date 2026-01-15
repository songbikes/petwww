import '@/i18n'; // Initialize i18n
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack } from "expo-router";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

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
            options={{ presentation: 'modal', title: 'New Event' }} 
          />
          <Stack.Screen 
            name="(modals)/create-post" 
            options={{ presentation: 'modal', title: 'New Post' }} 
          />
          <Stack.Screen 
            name="(modals)/create-location" 
            options={{ presentation: 'modal', title: 'Add Location' }} 
          />
          <Stack.Screen 
            name="settings/index" 
            options={{ title: 'Settings', headerBackTitle: 'Back' }} 
          />
          <Stack.Screen 
            name="(auth)/sign-in" 
            options={{ 
              presentation: 'formSheet',
              title: 'Sign In',
              sheetGrabberVisible: true,
              sheetAllowedDetents: [0.7, 1.0],
            }} 
          />
        </Stack>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}