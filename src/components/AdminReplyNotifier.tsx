import { useAdminReplyNotifier } from '../hooks/useAdminReplyNotifier';

/** Polls for admin chat replies and refreshes header badges. */
export default function AdminReplyNotifier() {
  useAdminReplyNotifier();
  return null;
}
