import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useRecordStore } from '../store/useRecordStore';
import { toDateString, today } from '../utils/dateUtils';
import TimeInput from './TimeInput';

type Props = {
  visible: boolean;
  onClose: () => void;
  initialDate?: string;
};

const formatDisplay = (dateStr: string): string => {
  const [y, m, d] = dateStr.split('-');
  return `${y}. ${parseInt(m, 10)}. ${parseInt(d, 10)}`;
};

const shiftDate = (dateStr: string, delta: number): string => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + delta);
  return toDateString(d);
};

export default function RecordModal({ visible, onClose, initialDate }: Props) {
  const addRecord = useRecordStore((s) => s.addRecord);

  const [date, setDate] = useState(initialDate ?? today());
  const [minutes, setMinutes] = useState(30);
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (visible) setDate(initialDate ?? today());
  }, [visible, initialDate]);

  const reset = () => {
    setDate(initialDate ?? today());
    setMinutes(30);
    setMemo('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = () => {
    if (minutes <= 0) return;
    addRecord({ date, minutes, memo: memo.trim() || undefined });
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.sheetWrapper}
        pointerEvents="box-none"
      >
        <View style={styles.sheet}>
          {/* 핸들바 */}
          <View style={styles.handle} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* 날짜 선택 */}
            <View style={styles.dateRow}>
              <TouchableOpacity
                onPress={() => setDate(shiftDate(date, -1))}
                style={styles.dateArrow}
                hitSlop={8}
              >
                <ChevronLeft size={18} color="#78716C" />
              </TouchableOpacity>
              <Text style={styles.dateText}>{formatDisplay(date)}</Text>
              <TouchableOpacity
                onPress={() => setDate(shiftDate(date, 1))}
                style={styles.dateArrow}
                hitSlop={8}
              >
                <ChevronRight size={18} color="#78716C" />
              </TouchableOpacity>
            </View>

            {/* 시간 입력 */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>공부 시간</Text>
              <TimeInput value={minutes} onChange={setMinutes} />
            </View>

            {/* 메모 */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>메모</Text>
              <TextInput
                style={styles.memoInput}
                value={memo}
                onChangeText={setMemo}
                placeholder="무엇을 공부했나요?"
                placeholderTextColor="#A8A29E"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* 저장 버튼 - 항상 하단 고정 */}
          <TouchableOpacity
            style={[styles.saveBtn, minutes <= 0 && styles.saveBtnDisabled]}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={minutes <= 0}
          >
            <Text style={styles.saveBtnText}>저장</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FEFCF9',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
    maxHeight: '92%',
  },
  scrollContent: {
    gap: 24,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D6D0CB',
    alignSelf: 'center',
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  dateArrow: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0EDE8',
  },
  dateText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1917',
    minWidth: 130,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A8A29E',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  memoInput: {
    borderWidth: 1,
    borderColor: '#EAE6E1',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: '#1C1917',
    minHeight: 80,
    backgroundColor: '#FAF8F4',
  },
  saveBtn: {
    backgroundColor: '#F97316',
    borderRadius: 16,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  saveBtnDisabled: {
    backgroundColor: '#E7E5E4',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
