/** Shown when ordering an inactive service (must match WEBAPP API message). */
export const MSG_SERVICE_INACTIVE =
  'This service is currently inactive and cannot be ordered.';

export type ServiceOrderableFields = {
  isOrderable?: boolean;
  status?: string;
};

export function isServiceOrderable(s: ServiceOrderableFields): boolean {
  return s.isOrderable === true || s.status === 'active';
}

export function serviceUnavailableLabel(s: {
  statusLabel?: string;
  status?: string;
}): string {
  if (s.statusLabel) {
    return s.statusLabel;
  }
  return s.status === 'inactive' ? 'Inactive' : 'Currently Unavailable';
}
