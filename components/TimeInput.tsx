import { Minus, Plus } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QUICK = [10, 20, 30, 40, 60];
const STEP = 5;
const MIN = 5;
const MAX = 300;

type Props = {
  value: number;
  onChange: (minutes: number) => void;
};

export default function TimeInput({ value, onChange }: Props) {
  const handleQuick = (min: number) => onChange(min);

  const handleUp = () => onChange(Math.min(value + STEP, MAX));
  const handleDown = () => onChange(Math.max(value - STEP, MIN));

  return (
    <View style={styles.container}>
      {/* 퀵버튼 */}
      <View style={styles.quickRow}>
        {QUICK.map((q) => (
          <TouchableOpacity
            key={q}
            style={[styles.quickBtn, value === q && styles.quickBtnActive]}
            onPress={() => handleQuick(q)}
            activeOpacity={0.7}
          >
            <Text style={[styles.quickText, value === q && styles.quickTextActive]}>
              {q}분
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 스피너 */}
      <View style={styles.spinnerRow}>
        <TouchableOpacity
          style={styles.spinBtn}
          onPress={handleDown}
          activeOpacity={0.7}
          disabled={value <= MIN}
        >
          <Minus size={18} color={value <= MIN ? '#D6D3D1' : '#78716C'} strokeWidth={2} />
        </TouchableOpacity>

        <View style={styles.valueBox}>
          <Text style={styles.valueText}>{value}</Text>
          <Text style={styles.unitText}>분</Text>
        </View>

        <TouchableOpacity
          style={styles.spinBtn}
          onPress={handleUp}
          activeOpacity={0.7}
          disabled={value >= MAX}
        >
          <Plus size={18} color={value >= MAX ? '#D6D3D1' : '#78716C'} strokeWidth={2} />
        </TouchableOpacity>
      </View>
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
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
  },
  quickBtnActive: {
    backgroundColor: '#F97316',
  },
  quickText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C2410C',
  },
  quickTextActive: {
    color: '#FFFFFF',
  },
  spinnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  spinBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    minWidth: 80,
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1917',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#78716C',
  },
});
