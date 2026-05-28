import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarGrid from '../components/CalendarGrid';
import RecordModal from '../components/RecordModal';
import { useRecordStore, sumByDate } from '../store/useRecordStore';
import { addMonths, formatYearMonth, todayYearMonth } from '../utils/dateUtils';

export default function CalendarScreen() {
  const { year: todayYear, month: todayMonth } = todayYearMonth();
  const [year, setYear] = useState(todayYear);
  const [month, setMonth] = useState(todayMonth);
  const [modalVisible, setModalVisible] = useState(false);

  const records = useRecordStore((s) => s.records);

  const { minutesByDate, memoByDate } = useMemo(() => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const monthRecords = records.filter((r) => r.date.startsWith(prefix));
    const minutes = sumByDate(monthRecords);
    const memo: Record<string, boolean> = {};
    monthRecords.forEach((r) => {
      if (r.memo?.trim()) memo[r.date] = true;
    });
    return { minutesByDate: minutes, memoByDate: memo };
  }, [records, year, month]);

  const handlePrevMonth = () => {
    const prev = addMonths(year, month, -1);
    setYear(prev.year);
    setMonth(prev.month);
  };

  const handleNextMonth = () => {
    const next = addMonths(year, month, 1);
    setYear(next.year);
    setMonth(next.month);
  };

  const handleToday = () => {
    setYear(todayYear);
    setMonth(todayMonth);
  };

  const isCurrentMonth = year === todayYear && month === todayMonth;

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navBtn} hitSlop={8}>
            <ChevronLeft size={20} color="#78716C" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{formatYearMonth(year, month)}</Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navBtn} hitSlop={8}>
            <ChevronRight size={20} color="#78716C" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          {!isCurrentMonth && (
            <TouchableOpacity onPress={handleToday} style={styles.todayBtn}>
              <Text style={styles.todayBtnText}>오늘</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => router.push('/history')}
            style={styles.historyBtn}
            hitSlop={8}
          >
            <Clock size={18} color="#78716C" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 캘린더 */}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <CalendarGrid
          year={year}
          month={month}
          minutesByDate={minutesByDate}
          memoByDate={memoByDate}
        />
      </ScrollView>

      {/* 플로팅 기록 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>

      <RecordModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navBtn: {
    padding: 4,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1917',
    minWidth: 100,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  todayBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
  },
  todayBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C2410C',
  },
  historyBtn: {
    padding: 6,
  },
  scroll: {
    paddingTop: 4,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
