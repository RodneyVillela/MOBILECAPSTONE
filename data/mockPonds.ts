export type PondStatus = 'Healthy' | 'Disease' | 'Pending';

export type Pond = {
  id: string;
  name: string;
  stockedDate: string; // ISO
  status: PondStatus;
};

export const mockPonds: Pond[] = [
  {
    id: '1',
    name: 'Pond A (Coastal 1)',
    stockedDate: '2026-05-01T00:00:00.000Z',
    status: 'Healthy',
  },
  {
    id: '2',
    name: 'Pond B (Coastal 2)',
    stockedDate: '2026-04-10T00:00:00.000Z',
    status: 'Pending',
  },
  {
    id: '3',
    name: 'Pond C (Deep Tank)',
    stockedDate: '2026-03-15T00:00:00.000Z',
    status: 'Disease',
  },
];

