export interface Profile {
  orders: string[];
  avatarUrl?: string;
  phoneNumber?: string;
}

export interface User {
  _id: string; // MongoDB id
  name: string;
  email: string;
  verified: boolean;
  language: string;
  currency: string;
  type: string;
  credits: number;
  totalOrders: number;
  lastGiftAtOrder?: number;
  metadata?: Record<string, any>;
  profile: Profile;
  createdAt: string;
  updatedAt: string;
}
