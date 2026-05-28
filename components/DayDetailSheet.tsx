import { Plus } from 'lucide-react-native';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useRecordStore } from '../store/useRecordStore';
import { getCalendarColor } from '../utils/colorUtils';
import { formatMinutes } from '../utils/dateUtils';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const formatDetailDate = (dateStr: string): string => {
  const [, m, d] = dateStr.split('-').map(Number);
  const dayName = DAYS[new Date(dateStr).getDay()];
  return `${m}월 ${d}일 ${dayName}요일`;
};

type Props = {
  visible: boolean;
  dateStr: string | null;
  onClose: () => void;
  onAddRecord: (dateStr: string) => void;
};

export default function DayDetailSheet({ visible, dateStr, onClose, onAddRecord }: Props) {
  const records = useRecordStore((s) => s.records);

  if (!dateStr) return null;

  const dayRecords = records
    .filter((r) => r.date === dateStr)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const totalMinutes = dayRecords.reduce((sum, r) => sum + r.minutes, 0);
  const accentColor = getCalendarColor(dateStr);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        <View style={styles.handle} />

        {/* 날짜 */}
        <Text style={styles.dateText}>{formatDetailDate(dateStr)}</Text>

        {dayRecords.length === 0 ? (
          /* 기록 없음 */
          <View style={styles.emptyBlock}>
            <Text style={styles.emptyText}>기록이 없어요</Text>
          </View>
        ) : (
          <>
            {/* 총 공부시간 */}
            <View style={[styles.totalRow, { borderLeftColor: accentColor }]}>
              <Text style={styles.totalLabel}>총 공부시간</Text>
              <Text style={[styles.totalValue, { color: accentColor }]}>
                {formatMinutes(totalMinutes)}
              </Text>
            </View>

            {/* 개별 기록 */}
            <ScrollView
              style={styles.recordScroll}
              showsVerticalScrollIndicator={false}
            >
              {dayRecords.map((r) => (
                <View key={r.id} style={styles.recordItem}>
                  <Text style={styles.recordDuration}>{formatMinutes(r.minutes)}</Text>
                  {r.memo ? (
                    <Text style={styles.recordMemo}>{r.memo}</Text>
                  ) : null}
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* 기록 추가 버튼 */}
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: accentColor }]}
          onPress={() => onAddRecord(dateStr)}
          activeOpacity={0.85}
        >
          <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.addBtnText}>기록 추가</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FEFCF9',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D6D0CB',
    alignSelf: 'center',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1917',
    letterSpacing: -0.3,
  },
  emptyBlock: {
    paddingVertical: 28,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#A8A29E',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 14,
    borderLeftWidth: 4,
    borderRadius: 2,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78716C',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  recordScroll: {
    maxHeight: 180,
  },
  recordItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDE8',
    gap: 4,
  },
  recordDuration: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
  },
  recordMemo: {
    fontSize: 14,
    color: '#78716C',
    lineHeight: 20,
  },
  addBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
