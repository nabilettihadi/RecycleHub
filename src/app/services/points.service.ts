import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
    PointsTransaction, 
    Voucher, 
    POINTS_RATES, 
    VOUCHER_RATES 
} from '../models/points.model';
import { WasteType } from '../models/collection-request.model';
import { WasteItem } from '../models/collection-request.model';

@Injectable({
    providedIn: 'root'
})
export class PointsService {
    private readonly TRANSACTIONS_KEY = 'points_transactions';
    private readonly VOUCHERS_KEY = 'vouchers';

    private readonly POINTS_RATES = {
        plastique: 2,
        verre: 1,
        papier: 1,
        metal: 5
    };

    private readonly CONVERSION_RATES = [
        { points: 100, amount: 50 },
        { points: 200, amount: 120 },
        { points: 500, amount: 350 }
    ];

    constructor() {
        this.initializeStorage();
    }

    private initializeStorage(): void {
        if (!localStorage.getItem(this.TRANSACTIONS_KEY)) {
            localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.VOUCHERS_KEY)) {
            localStorage.setItem(this.VOUCHERS_KEY, JSON.stringify([]));
        }
    }

    calculatePoints(wasteItems: WasteItem[]): number {
        return wasteItems.reduce((total, item) => {
            const rate = this.POINTS_RATES[item.type as keyof typeof this.POINTS_RATES];
            return total + (rate * item.weight / 1000); // Convertir en kg
        }, 0);
    }

    addPointsTransaction(userId: string, collectionRequestId: string, wasteType: WasteType, weight: number, isValidated: boolean): Observable<PointsTransaction> {
        if (!isValidated) {
            return throwError(() => new Error('Collection must be validated to award points'));
        }
        const pointsEarned = this.calculatePoints([{ type: wasteType, weight } as WasteItem]);        
        // Award points only if the collection is validated
        if (isValidated) {
            const transaction: PointsTransaction = {
                id: Date.now().toString(),
                userId,
                collectionRequestId,
                wasteType,
                weight,
                pointsEarned,
                createdAt: new Date()
            };
            
            const transactions = this.getTransactions();
            transactions.push(transaction);
            localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions));

            return of(transaction);
        }
        
        const transaction: PointsTransaction = {
            id: Date.now().toString(),
            userId,
            collectionRequestId,
            wasteType,
            weight,
            pointsEarned,
            createdAt: new Date()
        };

        const transactions = this.getTransactions();
        transactions.push(transaction);
        localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions));

        return of(transaction);
    }

    getUserPoints(userId: string): Observable<number> {
        const transactions = this.getTransactions()
            .filter(t => t.userId === userId);

        const vouchers = this.getVouchers()
            .filter(v => v.userId === userId);

        const earnedPoints = transactions.reduce((sum, t) => sum + t.pointsEarned, 0);
        const usedPoints = vouchers.reduce((sum, v) => sum + v.points, 0);

        return of(earnedPoints - usedPoints);
    }

    convertPoints(points: number): number {
        if (points >= 500) return 350;
        if (points >= 200) return 120;
        if (points >= 100) return 50;
        return 0;
    }

    convertPointsToVoucher(userId: string, points: number): Observable<Voucher> {        
        if (points < 100) {
            return throwError(() => new Error('Minimum 100 points required for voucher conversion'));
        }
        const voucherRate = VOUCHER_RATES.find(rate => rate.points === points);
        
        if (!voucherRate) {
            return throwError(() => new Error('Invalid points amount for voucher conversion'));
        }

        return this.getUserPoints(userId).pipe(
            map(availablePoints => {
                if (availablePoints < points) {
                    throw new Error('Insufficient points');
                }

                const voucher: Voucher = {
                    id: Date.now().toString(),
                    userId,
                    points: voucherRate.points,
                    value: voucherRate.value,
                    createdAt: new Date(),
                    status: 'pending'
                };

                const vouchers = this.getVouchers();
                vouchers.push(voucher);
                localStorage.setItem(this.VOUCHERS_KEY, JSON.stringify(vouchers));

                return voucher;
            })
        );
    }

    getUserVouchers(userId: string): Observable<Voucher[]> {
        const vouchers = this.getVouchers()
            .filter(v => v.userId === userId);
        return of(vouchers);
    }

    useVoucher(voucherId: string): Observable<Voucher> {
        const vouchers = this.getVouchers();
        const voucherIndex = vouchers.findIndex(v => v.id === voucherId);

        if (voucherIndex === -1) {
            return throwError(() => new Error('Voucher not found'));
        }

        if (vouchers[voucherIndex].status === 'used') {
            return throwError(() => new Error('Voucher already used'));
        }

        vouchers[voucherIndex].status = 'used';
        localStorage.setItem(this.VOUCHERS_KEY, JSON.stringify(vouchers));

        return of(vouchers[voucherIndex]);
    }

    private getTransactions(): PointsTransaction[] {
        return JSON.parse(localStorage.getItem(this.TRANSACTIONS_KEY) || '[]');
    }

    private getVouchers(): Voucher[] {
        return JSON.parse(localStorage.getItem(this.VOUCHERS_KEY) || '[]');
    }
}
