import { Colors } from '@/constants/Colors';
import { StyleSheet, Text, View } from 'react-native';

export default function CreateLocationModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Location</Text>
      {/* Form will go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
