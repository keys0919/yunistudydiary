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
    <View
      style={[
        styles.card,
        {
          shadowColor: accentColor,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.date}>{formatDate(record.date)}</Text>
          <Text style={[styles.duration, { color: accentColor }]}>
            {formatMinutes(record.minutes)}
          </Text>
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
    borderRadius: 18,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  accent: {
    width: 5,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
    color: '#A8A29E',
  },
  duration: {
    fontSize: 17,
    fontWeight: '700',
  },
  memo: {
    fontSize: 14,
    color: '#78716C',
    lineHeight: 21,
  },
});
