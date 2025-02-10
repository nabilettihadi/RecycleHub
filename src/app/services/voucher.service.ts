import { Injectable } from '@angular/core';
import { Voucher } from '../models/voucher.model';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private readonly VOUCHERS_KEY = 'vouchers';

  constructor() {}

  createVoucher(userId: string, points: number, value: number): Voucher {
    const voucher: Voucher = {
      id: crypto.randomUUID(),
      userId,
      points,
      value,
      createdAt: new Date(),
      status: 'pending'
    };
    
    this.saveVoucher(voucher);
    return voucher;
  }

  private saveVoucher(voucher: Voucher): void {
    const vouchers = this.getVouchers();
    vouchers.push(voucher);
    localStorage.setItem(this.VOUCHERS_KEY, JSON.stringify(vouchers));
  }

  getVouchers(): Voucher[] {
    const vouchers = localStorage.getItem(this.VOUCHERS_KEY);
    return vouchers ? JSON.parse(vouchers) : [];
  }
} 