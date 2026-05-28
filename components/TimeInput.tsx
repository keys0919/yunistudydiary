import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const QUICK = [10, 20, 30, 40, 60];
const MIN = 5;
const MAX = 300;

type Props = {
  value: number;
  onChange: (minutes: number) => void;
};

export default function TimeInput({ value, onChange }: Props) {
  const inputRef = useRef<TextInput>(null);
  const [display, setDisplay] = useState(String(value));

  useEffect(() => {
    setDisplay(String(value));
  }, [value]);

  const handleChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, '');
    setDisplay(clean);
    const n = parseInt(clean, 10);
    if (!isNaN(n) && n >= MIN && n <= MAX) onChange(n);
  };

  const handleBlur = () => {
    const n = parseInt(display, 10);
    if (isNaN(n) || n < MIN) {
      onChange(MIN);
      setDisplay(String(MIN));
    } else if (n > MAX) {
      onChange(MAX);
      setDisplay(String(MAX));
    } else {
      setDisplay(String(n));
    }
  };

  return (
    <View style={styles.container}>
      {/* 퀵 버튼 */}
      <View style={styles.quickRow}>
        {QUICK.map((q) => (
          <TouchableOpacity
            key={q}
            style={[styles.quickBtn, value === q && styles.quickBtnActive]}
            onPress={() => onChange(q)}
            activeOpacity={0.7}
          >
            <Text style={[styles.quickText, value === q && styles.quickTextActive]}>
              {q}분
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 숫자 탭하면 키보드 직접 입력 */}
      <TouchableOpacity
        style={styles.valueRow}
        onPress={() => inputRef.current?.focus()}
        activeOpacity={0.85}
      >
        <TextInput
          ref={inputRef}
          style={styles.valueInput}
          value={display}
          onChangeText={handleChange}
          onBlur={handleBlur}
          keyboardType="number-pad"
          maxLength={3}
          selectTextOnFocus
          caretHidden={false}
        />
        <Text style={styles.unitText}>분</Text>
      </TouchableOpacity>
      <Text style={styles.hint}>숫자를 탭하면 직접 입력할 수 있어요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: '#FEF0E0',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  quickBtnActive: {
    backgroundColor: '#F97316',
    borderColor: '#EA580C',
  },
  quickText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C2410C',
  },
  quickTextActive: {
    color: '#FFFFFF',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  valueInput: {
    fontSize: 52,
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: -2,
    textAlign: 'center',
    minWidth: 100,
    padding: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#F0EDE8',
  } as any,
  unitText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#78716C',
    marginBottom: 6,
  },
  hint: {
    textAlign: 'center',
    fontSize: 11,
    color: '#C2BDB8',
  },
});
