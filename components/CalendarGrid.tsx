import { StyleSheet, Text, View } from 'react-native';
import { buildCalendarGrid } from '../utils/dateUtils';
import DayCell from './DayCell';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const WEEKDAY_COLORS = ['#EF4444', '#78716C', '#78716C', '#78716C', '#78716C', '#78716C', '#64748B'];

type Props = {
  year: number;
  month: number;
  minutesByDate: Record<string, number>;
  memoByDate: Record<string, boolean>;
  onDayPress?: (dateStr: string) => void;
};

export default function CalendarGrid({ year, month, minutesByDate, memoByDate, onDayPress }: Props) {
  const grid = buildCalendarGrid(year, month);
  const weeks: (typeof grid[number])[][] = Array.from({ length: 6 }, (_, i) =>
    grid.slice(i * 7, (i + 1) * 7)
  );

  return (
    <View style={styles.container}>
      {/* 요일 헤더 */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((d, i) => (
          <Text key={d} style={[styles.weekLabel, { color: WEEKDAY_COLORS[i] }]}>
            {d}
          </Text>
        ))}
      </View>

      {/* 6행 그리드 */}
      <View style={styles.grid}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.weekRow}>
            {week.map((day, di) =>
              day ? (
                <DayCell
                  key={day.dateStr}
                  dateStr={day.dateStr}
                  totalMinutes={minutesByDate[day.dateStr] ?? 0}
                  hasMemo={memoByDate[day.dateStr] ?? false}
                  onPress={onDayPress ? () => onDayPress(day.dateStr) : undefined}
                />
              ) : (
                <View key={`e-${wi}-${di}`} style={styles.emptyCell} />
              )
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingBottom: 88,
  },
  weekdayRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9E4',
    marginBottom: 2,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  grid: {
    flex: 1,
  },
  weekRow: {
    flex: 1,
    flexDirection: 'row',
  },
  emptyCell: {
    flex: 1,
  },
});
