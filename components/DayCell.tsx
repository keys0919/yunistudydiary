import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCalendarCellColor, getCalendarColor } from '../utils/colorUtils';
import { today } from '../utils/dateUtils';

type Props = {
  dateStr: string;
  totalMinutes: number;
  hasMemo: boolean;
  onPress?: () => void;
};

const todayStr = today();

const formatCellTime = (minutes: number): string => {
  if (minutes <= 0) return '';
  if (minutes < 60) return `${minutes}분`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h${m}분`;
};

export default function DayCell({ dateStr, totalMinutes, hasMemo, onPress }: Props) {
  const day = parseInt(dateStr.split('-')[2], 10);
  const accentColor = getCalendarColor(dateStr);
  const isToday = dateStr === todayStr;

  const bgColor = getCalendarCellColor(dateStr, totalMinutes);
  const cellTime = formatCellTime(totalMinutes);
  const isDeep = totalMinutes > 60;

  return (
    <TouchableOpacity
      style={[styles.cell, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* 날짜 원형 (오늘은 오렌지 배경) */}
      <View style={[styles.circle, isToday && styles.circleToday]}>
        <Text
          style={[
            styles.dayText,
            isToday && styles.dayTextToday,
            isDeep && !isToday && styles.dayTextBold,
          ]}
        >
          {day}
        </Text>
      </View>

      {/* 공부시간 */}
      {cellTime !== '' && (
        <Text style={[styles.timeText, isToday && styles.timeTextToday]}>{cellTime}</Text>
      )}

      {/* 메모 도트 */}
      {hasMemo && <View style={[styles.dot, { backgroundColor: accentColor }]} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
    marginVertical: 2,
    borderRadius: 12,
    gap: 2,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleToday: {
    backgroundColor: '#FF956B',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#3C3530',
  },
  dayTextToday: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  dayTextBold: {
    fontWeight: '600',
    color: '#3C3530',
  },
  timeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#8C7B71',
    letterSpacing: -0.2,
  },
  timeTextToday: {
    color: '#D97048',
  },
  dot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.85,
  },
});
