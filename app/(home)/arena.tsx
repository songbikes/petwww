import { StyleSheet, Text, View } from 'react-native'

export default function Arena() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Arena</Text>
      <Text style={styles.subtitle}>Welcome to the Arena!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
})
