import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <ChevronLeft size={22} color="#1C1917" />
        </TouchableOpacity>
        <Text style={styles.title}>기록</Text>
        <View style={{ width: 34 }} />
      </View>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Phase 6에서 구현됩니다</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBF5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 17, fontWeight: '600', color: '#1C1917' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { fontSize: 14, color: '#A8A29E' },
});
