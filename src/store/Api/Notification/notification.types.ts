export type NotificationType =
  | "ACCOUNT_SUSPENDED"
  | "ACCOUNT_RESTORED"
  | "VERIFICATION_APPROVED"
  | "VERIFICATION_REJECTED"
  | "NEW_INTEREST_GUIDE"
  | "SYSTEM_ANNOUNCEMENT"
  | "MARKETPLACE_ORDER"
  | "SECURITY_ALERT";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string | null;
  createdAt: string;
  isRead: boolean;
}

export interface NotificationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationListResponse {
  items: NotificationItem[];
  meta: NotificationMeta;
}

export interface UnreadCountResponse {
  count: number;
}
