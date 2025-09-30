export interface SimCard {
  _id: string;
  iccid: string;
  userId: string | null;
  providerId: string | null;
  orderId: string | null;
  comment: string;
  reserved: boolean;
  expirationDate: string;
}
export {};
