const STATUS_STYLES = {
  Running: { badge: 'bg-green-50 text-green-600', dot: 'bg-green-500' },
  Upcoming: { badge: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
  Completed: { badge: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
};

export function StatusBadge({ status }) {
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.Completed;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles.badge}`}
    >
      <span className={`size-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}
