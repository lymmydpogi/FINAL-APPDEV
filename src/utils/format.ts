export function formatPeso(value: number | string | null | undefined): string {
  const n = typeof value === 'string' ? parseFloat(value) : Number(value ?? 0);
  if (Number.isNaN(n)) {
    return '₱0.00';
  }
  return `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatChatTimestamp(iso?: string | null): string {
  if (!iso) {
    return '';
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatOrderDate(iso?: string | null): string {
  if (!iso) {
    return '—';
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatOrderStatus(status?: string | null): string {
  if (!status) {
    return 'Pending';
  }
  const s = status.replace(/_/g, ' ').toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function displayNameFromUser(user: {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
}): string {
  const first = (user.firstName ?? '').trim();
  const last = (user.lastName ?? '').trim();
  const combined = `${first} ${last}`.trim();
  return combined || (user.name ?? '').trim() || '';
}
