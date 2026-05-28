import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { StudyRecord } from '../types';

type RecordStore = {
  records: StudyRecord[];
  addRecord: (data: Omit<StudyRecord, 'id' | 'createdAt'>) => void;
  deleteRecord: (id: string) => void;
  getByMonth: (year: number, month: number) => StudyRecord[];
  getRecent: (n: number) => StudyRecord[];
};

export const useRecordStore = create<RecordStore>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (data) => {
        const record: StudyRecord = {
          ...data,
          id: Math.random().toString(36).slice(2) + Date.now().toString(36),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ records: [record, ...state.records] }));
      },

      deleteRecord: (id) => {
        set((state) => ({ records: state.records.filter((r) => r.id !== id) }));
      },

      getByMonth: (year, month) => {
        const prefix = `${year}-${String(month).padStart(2, '0')}`;
        return get()
          .records.filter((r) => r.date.startsWith(prefix))
          .sort((a, b) => b.date.localeCompare(a.date));
      },

      getRecent: (n) => {
        return [...get().records]
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, n);
      },
    }),
    {
      name: 'chaeyun-diary-records',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// 날짜별 총 공부 시간 집계
export const sumByDate = (records: StudyRecord[]): Record<string, number> => {
  return records.reduce<Record<string, number>>((acc, r) => {
    acc[r.date] = (acc[r.date] ?? 0) + r.minutes;
    return acc;
  }, {});
};
