const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

// API dates are calendar dates (YYYY-MM-DD); format in UTC so they never shift a day.
const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const numberFormatter = new Intl.NumberFormat('en-IN');

export const formatDate = (isoDate) => dateFormatter.format(new Date(isoDate));

export const formatNumber = (value) => numberFormatter.format(value);

export const getDurationInWeeks = (startDate, endDate) =>
  Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / MS_PER_WEEK));

export const getInitials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

export const pluralize = (count, singular, plural = `${singular}s`) =>
  count === 1 ? singular : plural;
