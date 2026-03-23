export interface Plan {
  _id: string;
  name: string;
  volume: number;
  days: number;
  providerPrice: number;
  esimflyPrice: number;
  earnings?: number;
  collectionId: string;
  country: string;
  available?: boolean;
  availableCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
