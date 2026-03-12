export interface Package {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  createdAt: Date;
}

export interface Order {
  id: number;
  userId: number;
  packageId: number;
  quantity: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}
