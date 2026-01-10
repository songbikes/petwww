import { StyleSheet, Text, View } from 'react-native'

export default function Events() {
  return (
    <View style={styles.container}>
      <Text>Events</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
