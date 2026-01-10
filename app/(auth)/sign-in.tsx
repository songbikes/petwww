import Logo from '@/assets/images/logoIcon.svg'
import { SSOButton } from '@/components/SSOButton'
import { Colors } from '@/constants/Colors'
import { FontSize, Spacing } from '@/constants/Styles'
import { StyleSheet, Text, View } from 'react-native'

export default function AuthScreen() {
  return (
    <View style={styles.container}>
      <View style={{ gap: Spacing.lg, alignItems: 'center' }}>
        <Logo width={128} height={128} />
        <Text style={{fontSize:FontSize.md }} >Please sign in with one of the providers below</Text>
      </View>
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
    padding: Spacing.md,
    gap: Spacing.lg,
    backgroundColor: Colors.light.background,
  },
    logo: {
        alignSelf: 'center',
  },
})