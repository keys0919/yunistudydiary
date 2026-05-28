import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const QUICK = [10, 30, 60, 90, 120];

const quickLabel = (q: number): string => {
  if (q < 60) return `${q}분`;
  const h = Math.floor(q / 60);
  const m = q % 60;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
};

type Props = {
  value: number;
  onChange: (minutes: number) => void;
};

export default function TimeInput({ value, onChange }: Props) {
  const hourRef = useRef<TextInput>(null);
  const minRef = useRef<TextInput>(null);
  const [hourDisplay, setHourDisplay] = useState(String(Math.floor(value / 60)));
  const [minDisplay, setMinDisplay] = useState(String(value % 60));

  useEffect(() => {
    setHourDisplay(String(Math.floor(value / 60)));
    setMinDisplay(String(value % 60));
  }, [value]);

  const handleHourChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, '');
    setHourDisplay(clean);
    const h = parseInt(clean, 10);
    const m = parseInt(minDisplay, 10) || 0;
    if (!isNaN(h)) onChange(h * 60 + m);
  };

  const handleMinChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, '');
    setMinDisplay(clean);
    const h = parseInt(hourDisplay, 10) || 0;
    const m = parseInt(clean, 10);
    if (!isNaN(m) && m < 60) onChange(h * 60 + m);
  };

  const handleHourBlur = () => {
    const h = Math.max(0, parseInt(hourDisplay, 10) || 0);
    const m = parseInt(minDisplay, 10) || 0;
    setHourDisplay(String(h));
    const total = h * 60 + m;
    onChange(total < 1 ? 1 : total);
  };

  const handleMinBlur = () => {
    const raw = parseInt(minDisplay, 10);
    const h = parseInt(hourDisplay, 10) || 0;
    if (isNaN(raw) || raw < 0) {
      setMinDisplay('0');
      const total = h * 60;
      onChange(total < 1 ? 1 : total);
    } else if (raw >= 60) {
      const extraH = Math.floor(raw / 60);
      const newM = raw % 60;
      const newH = h + extraH;
      setHourDisplay(String(newH));
      setMinDisplay(String(newM));
      onChange(newH * 60 + newM);
    } else {
      setMinDisplay(String(raw));
      const total = h * 60 + raw;
      onChange(total < 1 ? 1 : total);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.quickRow}>
        {QUICK.map((q) => (
          <TouchableOpacity
            key={q}
            style={[styles.quickBtn, value === q && styles.quickBtnActive]}
            onPress={() => onChange(q)}
            activeOpacity={0.7}
          >
            <Text style={[styles.quickText, value === q && styles.quickTextActive]}>
              {quickLabel(q)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.valueRow}>
        <TouchableOpacity
          style={styles.inputGroup}
          onPress={() => hourRef.current?.focus()}
          activeOpacity={0.85}
        >
          <TextInput
            ref={hourRef}
            style={styles.valueInput}
            value={hourDisplay}
            onChangeText={handleHourChange}
            onBlur={handleHourBlur}
            keyboardType="number-pad"
            maxLength={2}
            selectTextOnFocus
            caretHidden={false}
          />
          <Text style={styles.unitText}>시간</Text>
        </TouchableOpacity>

        <Text style={styles.separator}>:</Text>

        <TouchableOpacity
          style={styles.inputGroup}
          onPress={() => minRef.current?.focus()}
          activeOpacity={0.85}
        >
          <TextInput
            ref={minRef}
            style={styles.valueInput}
            value={minDisplay}
            onChangeText={handleMinChange}
            onBlur={handleMinBlur}
            keyboardType="number-pad"
            maxLength={2}
            selectTextOnFocus
            caretHidden={false}
          />
          <Text style={styles.unitText}>분</Text>
        </TouchableOpacity>
      </View>

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
    gap: 6,
  },
  quickBtn: {
    flex: 1,
    paddingVertical: 10,
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
    fontSize: 11,
    fontWeight: '700',
    color: '#C2410C',
  },
  quickTextActive: {
    color: '#FFFFFF',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  valueInput: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: -2,
    textAlign: 'center',
    minWidth: 64,
    padding: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#F0EDE8',
  } as any,
  unitText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#78716C',
    marginBottom: 4,
  },
  separator: {
    fontSize: 36,
    fontWeight: '300',
    color: '#D6D0CB',
    marginBottom: 8,
  },
  hint: {
    textAlign: 'center',
    fontSize: 11,
    color: '#C2BDB8',
  },
});
