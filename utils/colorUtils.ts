export const calendarColors = {
  peach: {
    light: '#FFECE3',
    medium: '#FFD2BF',
    deep: '#FFB79A',
  },
  apricot: {
    light: '#FFF0D2',
    medium: '#FFE0A3',
    deep: '#F8C96F',
  },
  butter: {
    light: '#FFF6D1',
    medium: '#FFE99A',
    deep: '#F3D35F',
  },
  mint: {
    light: '#E8F7EC',
    medium: '#C9EFD4',
    deep: '#A5E1B7',
  },
  sky: {
    light: '#E7F5FB',
    medium: '#C9E9F5',
    deep: '#A8D9EB',
  },
  lavender: {
    light: '#F1EAFE',
    medium: '#DDCEF8',
    deep: '#C5ADEE',
  },
} as const;

export const baseColors = {
  appBackground: '#FFF9EF',
  surface: '#FFFFFF',
  surfaceWarm: '#FFF3E3',
  textPrimary: '#2B211B',
  textSecondary: '#7C6A5F',
  textTertiary: '#B9A99D',
  border: '#EADDD1',
  actionPrimary: '#FF956B',
  actionSecondary: '#FFE8D8',
} as const;

type CalendarDepth = 'none' | 'light' | 'medium' | 'deep';
type CalendarColorKey = keyof typeof calendarColors;

const colorKeys: CalendarColorKey[] = ['peach', 'apricot', 'butter', 'mint', 'sky', 'lavender'];

export function getStudyDepth(minutes: number): CalendarDepth {
  if (minutes <= 0) return 'none';
  if (minutes <= 30) return 'light';
  if (minutes <= 60) return 'medium';
  return 'deep';
}

export function getCalendarColorKey(date: string): CalendarColorKey {
  const [y, m, d] = date.split('-').map(Number);
  // 연속된 날짜에서 hash 차이가 1씩만 나는 문제 방지 — Murmur finalizer 사용
  let h = (y * 366 + m * 31 + d) | 0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) | 0;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) | 0;
  h ^= h >>> 16;
  return colorKeys[Math.abs(h) % colorKeys.length];
}

export function getCalendarCellColor(date: string, minutes: number): string {
  const depth = getStudyDepth(minutes);
  if (depth === 'none') return 'transparent';
  const key = getCalendarColorKey(date);
  return calendarColors[key][depth];
}

// accent 색 (deep) — 상세 시트, 도트 등에 사용
export function getCalendarColor(dateStr: string): string {
  return calendarColors[getCalendarColorKey(dateStr)].deep;
}

export const hexToRgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
