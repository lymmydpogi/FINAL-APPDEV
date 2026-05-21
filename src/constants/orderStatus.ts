export const ORDER_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected',
} as const;

export type OrderStatusValue = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export type OrderPermissionFields = {
  status: string;
  canEdit?: boolean;
  canCancel?: boolean;
};

export function canModifyOrder(order: OrderPermissionFields): boolean {
  return order.canEdit === true || order.status === ORDER_STATUS.PENDING;
}

export function canCancelOrder(order: OrderPermissionFields): boolean {
  return order.canCancel === true || order.status === ORDER_STATUS.PENDING;
}
