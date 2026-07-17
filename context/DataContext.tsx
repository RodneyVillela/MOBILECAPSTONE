import React, { createContext, useContext, useMemo, useState } from 'react';

import type { FeedLog, Pond } from '@/types';
import { mockFeedLogs } from '@/data/mockFeedLogs';
import { mockPonds } from '@/data/mockPonds';

export type ScanHistoryEntry = {
  id: string;
  imageUri: string;
  label: string;
  confidence: number;
  timestamp: string;
};

type DataContextValue = {
  ponds: Pond[];
  feedLogs: FeedLog[];
  scanHistory: ScanHistoryEntry[];
  addFeedLog: (entry: Omit<FeedLog, 'id'>) => void;
  addScanHistoryEntry: (entry: Omit<ScanHistoryEntry, 'id'>) => void;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [ponds] = useState<Pond[]>(mockPonds);
  const [feedLogs, setFeedLogs] = useState<FeedLog[]>(mockFeedLogs);
  const [scanHistory, setScanHistory] = useState<ScanHistoryEntry[]>([]);

  const addFeedLog = (entry: Omit<FeedLog, 'id'>) => {
    const id = `feed_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    setFeedLogs((prev) => [...prev, { id, ...entry }]);
  };

  const addScanHistoryEntry = (entry: Omit<ScanHistoryEntry, 'id'>) => {
    const id = `scan_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    setScanHistory((prev) => [{ id, ...entry }, ...prev]);
  };

  const value = useMemo<DataContextValue>(
    () => ({ ponds, feedLogs, scanHistory, addFeedLog, addScanHistoryEntry }),
    [ponds, feedLogs, scanHistory]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

