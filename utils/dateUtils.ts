// "YYYY-MM-DD" 형식 반환
export const toDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const today = (): string => toDateString(new Date());

// 해당 월의 날짜 배열 생성 (달력 그리드용)
// 앞뒤 빈 칸은 null로 채움
export type CalendarDay = { dateStr: string; isCurrentMonth: boolean } | null;

export const buildCalendarGrid = (year: number, month: number): CalendarDay[] => {
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=일
  const daysInMonth = new Date(year, month, 0).getDate();

  const grid: CalendarDay[] = [];

  // 앞 빈칸
  for (let i = 0; i < firstDay; i++) {
    grid.push(null);
  }

  // 이번 달 날짜
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    grid.push({ dateStr, isCurrentMonth: true });
  }

  // 뒤 빈칸 (6행 고정: 42칸)
  while (grid.length < 42) {
    grid.push(null);
  }

  return grid;
};

// "2026년 5월" 형식
export const formatYearMonth = (year: number, month: number): string =>
  `${year}년 ${month}월`;

// 월 이동
export const addMonths = (year: number, month: number, delta: number) => {
  const date = new Date(year, month - 1 + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
};

// 오늘 year/month
export const todayYearMonth = (): { year: number; month: number } => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};

// 분 → "1h30분" / "1h" / "45분"
export const formatMinutes = (minutes: number): string => {
  if (minutes <= 0) return '0분';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}h`;
  return `${h}h${m}분`;
};

// 최근 N일 dateStr 배열 (오늘 포함, 오래된 순)
export const getRecentDates = (n: number): string[] => {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(toDateString(d));
  }
  return dates;
};
