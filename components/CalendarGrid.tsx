import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { buildCalendarGrid } from '../utils/dateUtils';
import DayCell from './DayCell';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const H_PADDING = 16;

type Props = {
  year: number;
  month: number;
  minutesByDate: Record<string, number>;
  memoByDate: Record<string, boolean>;
};

export default function CalendarGrid({ year, month, minutesByDate, memoByDate }: Props) {
  const { width } = useWindowDimensions();
  const cellSize = Math.floor((width - H_PADDING * 2) / 7);
  const grid = buildCalendarGrid(year, month);

  return (
    <View style={styles.container}>
      {/* 요일 헤더 */}
      <View style={styles.weekRow}>
        {WEEKDAYS.map((d) => (
          <Text key={d} style={[styles.weekLabel, { width: cellSize }]}>
            {d}
          </Text>
        ))}
      </View>

      {/* 날짜 그리드 */}
      <View style={styles.grid}>
        {grid.map((day, i) =>
          day ? (
            <DayCell
              key={day.dateStr}
              dateStr={day.dateStr}
              totalMinutes={minutesByDate[day.dateStr] ?? 0}
              hasMemo={memoByDate[day.dateStr] ?? false}
              size={cellSize}
            />
          ) : (
            <View
              key={`empty-${i}`}
              style={{ width: cellSize, height: Math.round(cellSize * 1.15), margin: 1 }}
            />
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: H_PADDING,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekLabel: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#A8A29E',
    paddingVertical: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
