export type DocumentationType = "galang_donasi" | "penyaluran";

export interface DonationPublic {
  id: string;
  displayName: string;
  amount: number;
  message: string | null;
  createdAt: string;
}

export interface DonationCreateInput {
  donorName: string;
  donorEmail?: string;
  isAnonymous?: boolean;
  amount: number;
  message?: string;
}

export interface DonationStats {
  totalAmount: number;
  donorCount: number;
  verifiedCount: number;
}

export interface PrayerPublic {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface PrayerCreateInput {
  name: string;
  message: string;
}

export interface DocumentationPublic {
  id: string;
  title: string;
  description: string;
  type: DocumentationType;
  imageUrl: string;
  eventDate: string;
  createdAt: string;
}

export interface DocumentationCreateInput {
  title: string;
  description: string;
  type: DocumentationType;
  imageUrl: string;
  eventDate: string;
}

export interface PaymentInitiateResponse {
  orderId: string;
  donationId: string;
  snapToken: string;
  redirectUrl?: string;
}

export interface MidtransNotificationPayload {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
  transaction_time?: string;
  [key: string]: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
