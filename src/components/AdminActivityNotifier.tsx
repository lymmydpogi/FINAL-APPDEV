import { useAdminActivityAlerts } from '../hooks/useAdminActivityAlerts';
import { useAuth } from '../hooks/useAuth';

/** Global poll for admin catalog/order changes → activity banners. */
export default function AdminActivityNotifier() {
  const { isAuthenticated } = useAuth();
  useAdminActivityAlerts(isAuthenticated);
  return null;
}
