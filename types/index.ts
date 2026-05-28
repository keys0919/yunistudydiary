export type StudyRecord = {
  id: string;
  date: string;       // "YYYY-MM-DD"
  minutes: number;
  memo?: string;
  createdAt: string;  // ISO 8601
};
