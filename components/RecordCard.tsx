import { StyleSheet, Text, View } from 'react-native';
import type { StudyRecord } from '../types';
import { getCalendarColor } from '../utils/colorUtils';
import { formatMinutes } from '../utils/dateUtils';

type Props = {
  record: StudyRecord;
};

const formatDate = (dateStr: string): string => {
  const [y, m, d] = dateStr.split('-');
  return `${y}. ${parseInt(m, 10)}. ${parseInt(d, 10)}`;
};

export default function RecordCard({ record }: Props) {
  const accentColor = getCalendarColor(record.date);

  return (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.date}>{formatDate(record.date)}</Text>
          <Text style={styles.duration}>{formatMinutes(record.minutes)}</Text>
        </View>
        {record.memo ? (
          <Text style={styles.memo} numberOfLines={2}>
            {record.memo}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  body: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
    color: '#78716C',
  },
  duration: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
  },
  memo: {
    fontSize: 14,
    color: '#78716C',
    lineHeight: 20,
  },
});
