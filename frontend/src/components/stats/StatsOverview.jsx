import { Activity, CalendarClock, Layers, Users } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { formatNumber } from '../../utils/format.js';
import { StatCard } from './StatCard.jsx';

const STAT_CARDS = [
  {
    id: 'total',
    label: 'Total batches',
    hint: 'Across all courses',
    icon: Layers,
    tone: 'indigo',
    getValue: (stats) => stats.totalBatches,
  },
  {
    id: 'ongoing',
    label: 'Ongoing',
    hint: 'Currently in session',
    icon: Activity,
    tone: 'emerald',
    getValue: (stats) => stats.byStatus.ongoing,
  },
  {
    id: 'upcoming',
    label: 'Upcoming',
    hint: 'Scheduled to start soon',
    icon: CalendarClock,
    tone: 'sky',
    getValue: (stats) => stats.byStatus.upcoming,
  },
  {
    id: 'learners',
    label: 'Learners enrolled',
    hint: 'Seats filled across batches',
    icon: Users,
    tone: 'violet',
    getValue: (stats) => stats.totalEnrolled,
  },
];

export function StatsOverview({ stats, isLoading, className }) {
  return (
    <section aria-label="Batch summary" className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>
      {STAT_CARDS.map(({ id, getValue, ...card }) => (
        <StatCard
          key={id}
          {...card}
          isLoading={isLoading}
          value={stats ? formatNumber(getValue(stats)) : undefined}
        />
      ))}
    </section>
  );
}
