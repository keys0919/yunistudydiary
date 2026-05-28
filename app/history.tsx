import { router } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecordCard from '../components/RecordCard';
import RhythmChart from '../components/RhythmChart';
import { useRecordStore } from '../store/useRecordStore';
import { addMonths, formatMinutes, formatYearMonth, todayYearMonth } from '../utils/dateUtils';

type Tab = 'records' | 'analysis';

export default function HistoryScreen() {
  const { year: todayYear, month: todayMonth } = todayYearMonth();
  const [year, setYear] = useState(todayYear);
  const [month, setMonth] = useState(todayMonth);
  const [tab, setTab] = useState<Tab>('records');

  const records = useRecordStore((s) => s.records);

  const monthRecords = useMemo(() => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    return records
      .filter((r) => r.date.startsWith(prefix))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [records, year, month]);

  const stats = useMemo(() => {
    const totalMinutes = monthRecords.reduce((s, r) => s + r.minutes, 0);
    const uniqueDays = new Set(monthRecords.map((r) => r.date)).size;
    const avgMinutes = uniqueDays > 0 ? Math.round(totalMinutes / uniqueDays) : 0;
    return { totalMinutes, uniqueDays, avgMinutes };
  }, [monthRecords]);

  const handlePrev = () => {
    const p = addMonths(year, month, -1);
    setYear(p.year);
    setMonth(p.month);
  };

  const handleNext = () => {
    const n = addMonths(year, month, 1);
    setYear(n.year);
    setMonth(n.month);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <ChevronLeft size={22} color="#1C1917" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>기록</Text>
        <View style={{ width: 34 }} />
      </View>

      {/* 공통 월 내비게이션 */}
      <View style={styles.monthNav}>
        <TouchableOpacity onPress={handlePrev} style={styles.navBtn} hitSlop={8}>
          <ChevronLeft size={18} color="#78716C" />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{formatYearMonth(year, month)}</Text>
        <TouchableOpacity onPress={handleNext} style={styles.navBtn} hitSlop={8}>
          <ChevronRight size={18} color="#78716C" />
        </TouchableOpacity>
      </View>

      {/* 탭 */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, tab === 'records' && styles.tabActive]}
          onPress={() => setTab('records')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, tab === 'records' && styles.tabTextActive]}>
            기록
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'analysis' && styles.tabActive]}
          onPress={() => setTab('analysis')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, tab === 'analysis' && styles.tabTextActive]}>
            분석
          </Text>
        </TouchableOpacity>
      </View>

      {/* 탭 컨텐츠 */}
      {tab === 'records' ? (
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {monthRecords.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>이 달의 기록이 없어요</Text>
            </View>
          ) : (
            monthRecords.map((r) => <RecordCard key={r.id} record={r} />)
          )}
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.analysisContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 라인 그래프 (항상 최근 14일) */}
          <View style={styles.chartSection}>
            <Text style={styles.sectionLabel}>최근 14일 흐름</Text>
            <RhythmChart records={records} />
          </View>

          {/* 월별 집계 */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatMinutes(stats.totalMinutes)}</Text>
              <Text style={styles.statLabel}>총 공부시간</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.uniqueDays}일</Text>
              <Text style={styles.statLabel}>공부한 날</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatMinutes(stats.avgMinutes)}</Text>
              <Text style={styles.statLabel}>하루 평균</Text>
            </View>
          </View>
        </ScrollView>
      )}
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
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1917',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  navBtn: { padding: 4 },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
    minWidth: 100,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
    backgroundColor: '#F5F5F4',
    borderRadius: 12,
    padding: 3,
    gap: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A8A29E',
  },
  tabTextActive: {
    fontWeight: '600',
    color: '#1C1917',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyState: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#A8A29E',
  },
  analysisContent: {
    paddingBottom: 40,
    gap: 20,
  },
  chartSection: {
    gap: 8,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A8A29E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1917',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#A8A29E',
    textAlign: 'center',
  },
});
