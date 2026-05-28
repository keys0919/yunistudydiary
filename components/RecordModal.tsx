import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
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

export default function RecordModal({ visible, onClose }: Props) {
  const addRecord = useRecordStore((s) => s.addRecord);

  const [date, setDate] = useState(today());
  const [minutes, setMinutes] = useState(30);
  const [memo, setMemo] = useState('');

  const reset = () => {
    setDate(today());
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

          {/* 저장 버튼 */}
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
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E7E5E4',
    alignSelf: 'center',
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  dateArrow: {
    padding: 6,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1917',
    minWidth: 120,
    textAlign: 'center',
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78716C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  memoInput: {
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#1C1917',
    minHeight: 80,
    backgroundColor: '#FAFAF9',
  },
  saveBtn: {
    backgroundColor: '#F97316',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  saveBtnDisabled: {
    backgroundColor: '#E7E5E4',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
