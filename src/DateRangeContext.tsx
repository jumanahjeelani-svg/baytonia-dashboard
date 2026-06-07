'use client';
import { createContext, useContext, useState } from 'react';

export type Range = 'last_7d' | 'last_30d' | 'last_6m' | 'last_year' | 'custom';

export interface DateRangeContextType {
  range: Range;
  startDate: string;
  endDate: string;
  label: string;
  setRange: (r: Range) => void;
  setCustomDates: (start: string, end: string) => void;
}

export const rangeLabels: Record<Range, string> = {
  last_7d: 'آخر 7 أيام',
  last_30d: 'آخر 30 يوم',
  last_6m: 'آخر 6 أشهر',
  last_year: 'هذا العام',
  custom: 'مخصص',
};

function getDateRange(range: Range): { start: string; end: string } {
  const today = new Date();
  const end = today.toISOString().slice(0, 10);
  let start = end;
  if (range === 'last_7d') {
    const d = new Date(today); d.setDate(d.getDate() - 7);
    start = d.toISOString().slice(0, 10);
  } else if (range === 'last_30d') {
    const d = new Date(today); d.setDate(d.getDate() - 30);
    start = d.toISOString().slice(0, 10);
  } else if (range === 'last_6m') {
    const d = new Date(today); d.setMonth(d.getMonth() - 6);
    start = d.toISOString().slice(0, 10);
  } else if (range === 'last_year') {
    const d = new Date(today); d.setFullYear(d.getFullYear() - 1);
    start = d.toISOString().slice(0, 10);
  }
  return { start, end };
}

const DateRangeContext = createContext<DateRangeContextType>({
  range: 'last_30d',
  startDate: '',
  endDate: '',
  label: 'آخر 30 يوم',
  setRange: () => {},
  setCustomDates: () => {},
});

export function DateRangeProvider({ children }: { children: React.ReactNode }) {
  const [range, setRangeState] = useState<Range>('last_30d');
  const [startDate, setStartDate] = useState(getDateRange('last_30d').start);
  const [endDate, setEndDate] = useState(getDateRange('last_30d').end);
  const [label, setLabel] = useState('آخر 30 يوم');

  function setRange(r: Range) {
    if (r === 'custom') return;
    const { start, end } = getDateRange(r);
    setRangeState(r);
    setStartDate(start);
    setEndDate(end);
    setLabel(rangeLabels[r]);
  }

  function setCustomDates(start: string, end: string) {
    setRangeState('custom');
    setStartDate(start);
    setEndDate(end);
    setLabel(`${start} → ${end}`);
  }

  return (
    <DateRangeContext.Provider value={{ range, startDate, endDate, label, setRange, setCustomDates }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  return useContext(DateRangeContext);
}
