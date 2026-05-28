import { StyleSheet, Text, View } from 'react-native';
import { getCalendarColor, getIntensity, hexToRgba } from '../utils/colorUtils';
import { today } from '../utils/dateUtils';

type Props = {
  dateStr: string;
  totalMinutes: number;
  hasMemo: boolean;
  size: number;
};

const todayStr = today();

export default function DayCell({ dateStr, totalMinutes, hasMemo, size }: Props) {
  const day = parseInt(dateStr.split('-')[2], 10);
  const color = getCalendarColor(dateStr);
  const opacity = getIntensity(totalMinutes);
  const isToday = dateStr === todayStr;

  return (
    <View
      style={[
        styles.cell,
        {
          width: size,
          height: Math.round(size * 1.15),
          backgroundColor: opacity > 0 ? hexToRgba(color, opacity) : 'transparent',
          borderWidth: isToday ? 1.5 : 0,
          borderColor: isToday ? hexToRgba(color !== '#FDBA74' ? color : '#F97316', 0.7) : 'transparent',
        },
      ]}
    >
      <Text style={[styles.dayText, isToday && styles.todayText]}>{day}</Text>
      {hasMemo && (
        <View style={[styles.dot, { backgroundColor: hexToRgba(color, 0.85) }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1C1917',
  },
  todayText: {
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
