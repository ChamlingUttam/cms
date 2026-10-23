export type DateFilter = 'all' | 'today' | 'week' | 'month' | 'custom';

export function getKathmanduDate(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const part = (type: string) =>
    parts.find((item) => item.type === type)?.value ?? '';

  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function shiftDate(date: string, days: number) {
  const [year, month, day] = date.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));

  return [
    shifted.getUTCFullYear(),
    String(shifted.getUTCMonth() + 1).padStart(2, '0'),
    String(shifted.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-NP', {
    dateStyle: 'medium',
    timeZone: 'Asia/Kathmandu',
  }).format(new Date(`${date}T00:00:00+05:45`));
}

export function formatImageDate(date: string) {
  return new Intl.DateTimeFormat('en-NP', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kathmandu',
  }).format(new Date(date));
}

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
