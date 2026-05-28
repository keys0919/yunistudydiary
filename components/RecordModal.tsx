import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Alert,
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
import type { StudyRecord } from '../types';
import { useRecordStore } from '../store/useRecordStore';
import { toDateString, today } from '../utils/dateUtils';
import TimeInput from './TimeInput';

type Props = {
  visible: boolean;
  onClose: () => void;
  initialDate?: string;
  editRecord?: StudyRecord;
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

export default function RecordModal({ visible, onClose, initialDate, editRecord }: Props) {
  const addRecord = useRecordStore((s) => s.addRecord);
  const updateRecord = useRecordStore((s) => s.updateRecord);
  const deleteRecord = useRecordStore((s) => s.deleteRecord);

  const isEdit = !!editRecord;

  const [date, setDate] = useState(editRecord?.date ?? initialDate ?? today());
  const [minutes, setMinutes] = useState(editRecord?.minutes ?? 30);
  const [memo, setMemo] = useState(editRecord?.memo ?? '');

  useEffect(() => {
    if (visible) {
      if (editRecord) {
        setDate(editRecord.date);
        setMinutes(editRecord.minutes);
        setMemo(editRecord.memo ?? '');
      } else {
        setDate(initialDate ?? today());
        setMinutes(30);
        setMemo('');
      }
    }
  }, [visible, initialDate, editRecord]);

  const reset = () => {
    setDate(initialDate ?? today());
    setMinutes(30);
    setMemo('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDelete = () => {
    Alert.alert('기록 삭제', '이 기록을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          deleteRecord(editRecord!.id);
          handleClose();
        },
      },
    ]);
  };

  const handleSave = () => {
    if (minutes <= 0) return;
    if (isEdit) {
      updateRecord(editRecord!.id, { date, minutes, memo: memo.trim() || undefined });
    } else {
      addRecord({ date, minutes, memo: memo.trim() || undefined });
    }
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
          {/* 핸들바 + 삭제 */}
          <View style={styles.handleRow}>
            <View style={{ width: 34 }} />
            <View style={styles.handle} />
            {isEdit ? (
              <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn} hitSlop={8}>
                <Trash2 size={18} color="#EF4444" />
              </TouchableOpacity>
            ) : (
              <View style={{ width: 34 }} />
            )}
          </View>

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
            <Text style={styles.saveBtnText}>{isEdit ? '수정' : '저장'}</Text>
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
  handleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D6D0CB',
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
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
