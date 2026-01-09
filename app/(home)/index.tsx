import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { StyleSheet, Text, View } from 'react-native'
import { SSOButton } from '../components/SSOButton'

export default function Page() {
  const { user } = useUser()

  return (
    <View style={styles.container}>
      <SignedIn>
        <Text style={styles.greeting}>Hello {user?.emailAddresses[0].emailAddress}</Text>
      </SignedIn>
      <SignedOut>
        <View style={styles.authContainer}>
          <Text style={styles.title}>Welcome to Pet</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
          <SSOButton provider="oauth_google" />
          <SSOButton provider="oauth_apple" />
          <SSOButton provider="oauth_facebook" />
        </View>
      </SignedOut>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  authContainer: {
    gap: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  greeting: {
    fontSize: 24,
    textAlign: 'center',
  },
})