export interface Voucher {
  id: string;
  userId: string;
  points: number;
  value: number;
  createdAt: Date;
  status: 'pending' | 'used';
} 