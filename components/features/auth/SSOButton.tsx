import AppleLogo from '@/assets/images/AppleLogo.svg'
import FacebookLogo from '@/assets/images/FacebookLogo.svg'
import GoogleLogo from '@/assets/images/GoogleLogo.svg'
import { Colors } from '@/constants/Colors'
import { BorderRadius, FontSize, Spacing } from '@/constants/Styles'
import { useSSO } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native'

interface SSOButtonProps {
  provider: 'oauth_apple' | 'oauth_google' | 'oauth_facebook'
  onSignInComplete?: () => void
}

const providerConfig = {
  oauth_apple: {
    name: 'Apple',
    Icon: AppleLogo,
  },
  oauth_google: {
    name: 'Google',
    Icon: GoogleLogo,
  },
  oauth_facebook: {
    name: 'Facebook',
    Icon: FacebookLogo,
  },
}

export function SSOButton({ provider, onSignInComplete }: SSOButtonProps) {
  const { startSSOFlow } = useSSO()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const config = providerConfig[provider]
  const { Icon, name } = config

  const handleSSOSignIn = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: provider,
      })

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })
        onSignInComplete ? onSignInComplete() : router.replace('/')
      }
    } catch (err: any) {
      if (err.code === 'ERR_REQUEST_CANCELED' || err.code === 'ERR_WEB_BROWSER_ALREADY_OPEN') return
      Alert.alert('Error', err.message || 'An error occurred during sign-in')
      console.error('SSO error:', JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Pressable
      disabled={isLoading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: Colors.light.background,
          borderColor: Colors.light.border,
          borderWidth: 1,
          opacity: pressed || isLoading ? 0.7 : 1,
        },
      ]}
      onPress={handleSSOSignIn}
    >
      <View style={styles.iconContainer}>
        {isLoading 
          ? <ActivityIndicator size="small" color={Colors.light.text} /> 
          : <Icon width={44} height={44} />
        }
      </View>
      <Text style={[styles.buttonText, { color: Colors.light.text }]}>
        {isLoading 
          ? 'Connecting...' 
          : `Continue with ${name}`
        }
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: BorderRadius.round,
    position: 'relative',
    height: 50,
  },
  iconContainer: {
    position: 'absolute',
    left: Spacing.md,
  },
  buttonText: {
    fontSize: FontSize.md,
    fontWeight: '500',
    marginLeft: 24,
  },
})
