import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarGrid from '../components/CalendarGrid';
import DayDetailSheet from '../components/DayDetailSheet';
import RecordModal from '../components/RecordModal';
import { useRecordStore, sumByDate } from '../store/useRecordStore';
import { addMonths, formatYearMonth, today, todayYearMonth } from '../utils/dateUtils';

const SLIDE_DIST = 380;

export default function CalendarScreen() {
  const { year: todayYear, month: todayMonth } = todayYearMonth();
  const [year, setYear] = useState(todayYear);
  const [month, setMonth] = useState(todayMonth);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const translateX = useRef(new Animated.Value(0)).current;
  const navRef = useRef({ year, month });
  navRef.current = { year, month };

  const navigateMonth = (delta: number) => {
    const dir = delta > 0 ? -1 : 1;
    Animated.timing(translateX, {
      toValue: dir * SLIDE_DIST,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      const { year: y, month: m } = navRef.current;
      const next = addMonths(y, m, delta);
      setYear(next.year);
      setMonth(next.month);
      translateX.setValue(-dir * SLIDE_DIST);
      Animated.spring(translateX, {
        toValue: 0,
        tension: 80,
        friction: 11,
        useNativeDriver: false,
      }).start();
    });
  };

  const swipePan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 12 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.2,
      onPanResponderMove: (_, gs) => {
        translateX.setValue(gs.dx * 0.35);
      },
      onPanResponderRelease: (_, gs) => {
        const shouldSwipe =
          Math.abs(gs.dx) > 50 || (Math.abs(gs.vx) > 0.5 && Math.abs(gs.dx) > 20);
        if (shouldSwipe) {
          navigateMonth(gs.dx < 0 ? 1 : -1);
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            tension: 120,
            friction: 14,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          tension: 120,
          friction: 14,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

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
          <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.navBtn} hitSlop={8}>
            <ChevronLeft size={20} color="#7C6A5F" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{formatYearMonth(year, month)}</Text>
          <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.navBtn} hitSlop={8}>
            <ChevronRight size={20} color="#7C6A5F" />
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
            <Clock size={18} color="#7C6A5F" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 캘린더 — 스와이프 영역 */}
      <View style={styles.calendarArea}>
        <Animated.View
          style={[styles.calendarSlide, { transform: [{ translateX }] }]}
          {...swipePan.panHandlers}
        >
          <CalendarGrid
            year={year}
            month={month}
            minutesByDate={minutesByDate}
            memoByDate={memoByDate}
            onDayPress={(dateStr) => setSelectedDate(dateStr)}
          />
        </Animated.View>
      </View>

      {/* 플로팅 기록 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => {
          setModalInitialDate(today());
          setModalVisible(true);
        }}
      >
        <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* 날짜 상세 시트 */}
      <DayDetailSheet
        visible={selectedDate !== null}
        dateStr={selectedDate}
        onClose={() => setSelectedDate(null)}
        onAddRecord={(dateStr) => {
          setSelectedDate(null);
          setModalInitialDate(dateStr);
          setModalVisible(true);
        }}
      />

      <RecordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        initialDate={modalInitialDate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9EF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EADDD1',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navBtn: {
    padding: 4,
  },
  monthTitle: {
    fontSize: 26,
    fontFamily: 'Black Han Sans',
    color: '#2B211B',
    minWidth: 120,
    textAlign: 'center',
    letterSpacing: 0,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  todayBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#FFE8D8',
    borderWidth: 1,
    borderColor: '#FFBE9D',
  },
  todayBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF8A5C',
  },
  historyBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#FFF3E3',
  },
  calendarArea: {
    flex: 1,
    overflow: 'hidden',
  },
  calendarSlide: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FF956B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFAA88',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
});
