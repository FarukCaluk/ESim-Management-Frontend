export interface User {
  _id: string;
  email: string;
  role: string;
}

export interface CreateUserPayload {
  email?: string;
  password?: string;
  role?: string;
}
