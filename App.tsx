import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ColorPickerAnimation from './components/ColorPickerAnimation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <View style={styles.container}>
      <ColorPickerAnimation />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
