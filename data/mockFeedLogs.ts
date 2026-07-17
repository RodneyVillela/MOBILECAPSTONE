export type FeedLog = {
  id: string;
  pondId: string;
  amount: number; // kg
  time: string; // ISO
};

export const mockFeedLogs: FeedLog[] = [
  { id: 'f1', pondId: '1', amount: 12.5, time: '2026-07-12T10:15:00.000Z' },
  { id: 'f2', pondId: '2', amount: 9.0, time: '2026-07-12T12:30:00.000Z' },
  { id: 'f3', pondId: '3', amount: 14.0, time: '2026-07-12T09:05:00.000Z' },
  { id: 'f4', pondId: '1', amount: 8.0, time: '2026-07-11T11:20:00.000Z' },
];

