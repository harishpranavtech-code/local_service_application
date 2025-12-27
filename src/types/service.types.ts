export interface Service {
  $id: string;
  providerId: string;
  providerName: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  location?: string;
  images?: string[];
  isActive: boolean;
  createdAt: string;
}

export interface CreateServiceData {
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  location?: string;
}
