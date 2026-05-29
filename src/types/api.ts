export type WebappUser = {
  id?: number;
  email?: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  address?: string | null;
  roles?: string[];
  isVerified?: boolean;
  avatarUrl?: string | null;
  createdAt?: string | null;
};

export type ServiceItem = {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  price?: number | string;
  status?: string;
  statusLabel?: string;
  isOrderable?: boolean;
  is_active?: boolean;
};

/** Client order from GET/POST/PATCH /api/client/orders — server owns price & status */
export type ClientOrder = {
  id: number;
  serviceId: number | null;
  serviceName: string | null;
  status: string;
  /** Read-only from API; never edited in the app (server uses 1). */
  quantity: number;
  notes: string | null;
  totalPrice: number;
  orderDate: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryDate?: string | null;
  canEdit: boolean;
  canCancel: boolean;
};

/** @deprecated Use ClientOrder */
export type OrderItem = ClientOrder;

export type ChatMessage = {
  id: number;
  senderType: 'user' | 'admin';
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type LoginResult = {
  token: string;
  user: WebappUser;
};

export type GoogleAuthResult = {
  token: string;
  user: WebappUser;
  isNewUser?: boolean;
};

export type RegisterResult = {
  user?: WebappUser;
  verification?: { web?: string; api?: string };
};
