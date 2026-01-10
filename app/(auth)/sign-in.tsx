import { SSOButton } from '@/components/SSOButton'
import { StyleSheet, View } from 'react-native'

export default function AuthScreen() {
  return (
    <View style={styles.container}>
      <SSOButton provider="oauth_apple" />
      <SSOButton provider="oauth_google" />
      <SSOButton provider="oauth_facebook" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
})