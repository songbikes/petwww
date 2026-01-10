import { useSSO } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native'

interface SSOButtonProps {
  provider: 'oauth_apple' | 'oauth_google' | 'oauth_facebook'
  onSignInComplete?: () => void
}

export function SSOButton({ provider, onSignInComplete }: SSOButtonProps) {
  const { startSSOFlow } = useSSO()
  const router = useRouter()

  const providerNames = {
    oauth_apple: 'Apple',
    oauth_google: 'Google',
    oauth_facebook: 'Facebook',
  }

  const handleSSOSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: provider,
      })

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })
        onSignInComplete ? onSignInComplete() : router.replace('/')
      }
    } catch (err: any) {
      if (err.code === 'ERR_REQUEST_CANCELED') return
      Alert.alert('Error', err.message || 'An error occurred during sign-in')
      console.error('SSO error:', JSON.stringify(err, null, 2))
    }
  }

  return (
    <TouchableOpacity style={styles.button} onPress={handleSSOSignIn}>
      <Text style={styles.buttonText}>
        Sign in with {providerNames[provider]}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})