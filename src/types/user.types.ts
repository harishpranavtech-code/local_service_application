export interface User {
  $id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "provider";
  avatar?: string;
  address?: string;
  city?: string;
  createdAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "customer" | "provider";
}

export interface LoginData {
  email: string;
  password: string;
}
