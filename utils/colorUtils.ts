// 디자인 시스템 warm 팔레트 5색
export const WARM_PALETTE = [
  '#F59E0B', // Amber
  '#F97316', // Coral
  '#FB7185', // Rose
  '#FDBA74', // Peach
  '#EAB308', // Marigold
] as const;

// 공부 시간 → opacity (0 / 0.25 / 0.5 / 0.75 / 1.0)
export const getIntensity = (minutes: number): number => {
  if (minutes === 0) return 0;
  if (minutes <= 30) return 0.25;
  if (minutes <= 60) return 0.5;
  if (minutes <= 90) return 0.75;
  return 1.0;
};

// hex 색상 → rgba 문자열
export const hexToRgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// 날짜 → 시드 기반 색상 (year+month로 시드, 요일/날짜 규칙성 없음)
export const getCalendarColor = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number);

  // 월별 시드: 매달 다른 오프셋 생성
  const monthSeed = (year * 12 + month) * 7;
  // 날짜별 인덱스: 5개 색상 순환, 7의 배수 피하기 위해 월 오프셋 적용
  const index = (monthSeed + day * 3) % WARM_PALETTE.length;

  return WARM_PALETTE[index];
};
