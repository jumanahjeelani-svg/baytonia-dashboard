'use client';
import { createContext, useContext, useState } from 'react';

type Range = 'last_7d' | 'last_30d' | 'last_6m' | 'last_year';

interface DateRangeContextType {
  range: Range;
  setRange: (r: Range) => void;
  label: string;
}

const labels: Record<Range, string> = {
  last_7d: 'آخر 7 أيام',
  last_30d: 'آخر 30 يوم',
  last_6m: 'آخر 6 أشهر',
  last_year: 'هذا العام',
};

const DateRangeContext = createContext<DateRangeContextType>({
  range: 'last_30d',
  setRange: () => {},
  label: 'آخر 30 يوم',
});

export function DateRangeProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<Range>('last_30d');
  return (
    <DateRangeContext.Provider value={{ range, setRange, label: labels[range] }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  return useContext(DateRangeContext);
}

export { labels };
export type { Range };
