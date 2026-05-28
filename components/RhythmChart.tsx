import { useMemo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Defs, LinearGradient, Path, Stop, Svg, Line as SvgLine, Text as SvgText } from 'react-native-svg';
import { sumByDate } from '../store/useRecordStore';
import type { StudyRecord } from '../types';
import { getRecentDates } from '../utils/dateUtils';

const H_PAD = 16;
const PAD_TOP = 12;
const PAD_BOTTOM = 28;
const PAD_LEFT = 8;
const PAD_RIGHT = 8;
const CHART_HEIGHT = 110;
const SVG_HEIGHT = CHART_HEIGHT + PAD_TOP + PAD_BOTTOM;

type Props = {
  records: StudyRecord[];
};

// Catmull-Rom → Cubic Bezier 스무스 패스 생성
const buildPath = (pts: { x: number; y: number }[]): string => {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 2)];
    const p1 = pts[i - 1];
    const p2 = pts[i];
    const p3 = pts[Math.min(pts.length - 1, i + 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
};

export default function RhythmChart({ records }: Props) {
  const { width } = useWindowDimensions();
  const chartWidth = width - H_PAD * 2 - PAD_LEFT - PAD_RIGHT;

  const { dates, values, hasData } = useMemo(() => {
    const dates = getRecentDates(14);
    const sums = sumByDate(records);
    const values = dates.map((d) => sums[d] ?? 0);
    return { dates, values, hasData: values.some((v) => v > 0) };
  }, [records]);

  if (!hasData) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>아직 기록이 없어요</Text>
      </View>
    );
  }

  const maxVal = Math.max(...values, 60);
  const xStep = chartWidth / (dates.length - 1);

  const pts = values.map((v, i) => ({
    x: PAD_LEFT + i * xStep,
    y: PAD_TOP + CHART_HEIGHT - (v / maxVal) * CHART_HEIGHT,
  }));

  const linePath = buildPath(pts);

  // 그라디언트 채우기 경로 (라인 하단 닫기)
  const fillPath =
    linePath +
    ` L ${pts[pts.length - 1].x.toFixed(1)} ${(PAD_TOP + CHART_HEIGHT).toFixed(1)}` +
    ` L ${pts[0].x.toFixed(1)} ${(PAD_TOP + CHART_HEIGHT).toFixed(1)} Z`;

  // x축 레이블: 첫날, 7번째, 14번째
  const labelIndices = [0, 6, 13];
  const formatLabel = (dateStr: string) => {
    const [, m, d] = dateStr.split('-');
    return `${parseInt(m, 10)}/${parseInt(d, 10)}`;
  };

  // 가로 그리드선 3개
  const gridLines = [0.25, 0.5, 0.75].map(
    (r) => PAD_TOP + CHART_HEIGHT - r * CHART_HEIGHT
  );

  const svgWidth = chartWidth + PAD_LEFT + PAD_RIGHT;

  return (
    <View style={styles.container}>
      <Svg width={svgWidth} height={SVG_HEIGHT}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#F97316" stopOpacity="0.18" />
            <Stop offset="1" stopColor="#F97316" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* 그리드선 */}
        {gridLines.map((y, i) => (
          <SvgLine
            key={i}
            x1={PAD_LEFT}
            y1={y}
            x2={PAD_LEFT + chartWidth}
            y2={y}
            stroke="#E7E5E4"
            strokeWidth="1"
          />
        ))}

        {/* 그라디언트 채우기 */}
        <Path d={fillPath} fill="url(#grad)" />

        {/* 라인 */}
        <Path d={linePath} fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* x축 레이블 */}
        {labelIndices.map((idx) => (
          <SvgText
            key={idx}
            x={PAD_LEFT + idx * xStep}
            y={SVG_HEIGHT - 6}
            fontSize="11"
            fill="#A8A29E"
            textAnchor="middle"
          >
            {formatLabel(dates[idx])}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: H_PAD,
  },
  empty: {
    height: SVG_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#A8A29E',
  },
});
