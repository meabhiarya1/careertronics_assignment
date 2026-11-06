// "2026-03-15" -> "Mar 15, 2026"
// UTC is used so the date never shifts by a day because of the user's timezone.
export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
