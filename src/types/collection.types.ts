export interface Collection {
  _id: string;
  name: string;
  country: string;
  expirationDate?: string;
  createdBy: string;
  assignedAgency?: string;
  plans: string[]; // or Plan[] if you populate
  createdAt?: string;
  updatedAt?: string;
}
