import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
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
import { CollectionRequest } from '../models/collection-request.model';

@Injectable({
    providedIn: 'root'
})
export class PointsService {
    private readonly TRANSACTIONS_KEY = 'points_transactions';
    private readonly VOUCHERS_KEY = 'vouchers';

    constructor(private store: Store) {
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

    calculatePoints(wasteType: string, weight: number): number {
        const pointsPerKg: Record<string, number> = {
            'plastique': 2,
            'verre': 1,
            'papier': 1,
            'metal': 5
        };
        return Math.floor((weight / 1000) * (pointsPerKg[wasteType] || 0));
    }

    calculateTotalPoints(request: CollectionRequest): number {
        return request.wasteItems.reduce((total, item) => {
            return total + this.calculatePoints(item.type, item.weight);
        }, 0);
    }

    getAvailableVouchers(points: number): Array<{points: number, value: number}> {
        const vouchers = [
            { points: 500, value: 350 },
            { points: 200, value: 120 },
            { points: 100, value: 50 }
        ];
        return vouchers.filter(voucher => points >= voucher.points);
    }

    addPointsTransaction(userId: string, collectionRequestId: string, wasteType: WasteType, weight: number, isValidated: boolean): Observable<PointsTransaction> {
        if (!isValidated) {
            return throwError(() => new Error('La collecte doit être validée pour attribuer des points'));
        }

        const pointsPerKg = POINTS_RATES[wasteType] || 0;
        const pointsEarned = Math.floor((weight / 1000) * pointsPerKg);

        const transaction: PointsTransaction = {
            id: crypto.randomUUID(),
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

    convertPointsToVoucher(userId: string, pointsToConvert: number): Observable<Voucher> {
        const voucherRate = VOUCHER_RATES.find(rate => rate.points === pointsToConvert);
        
        if (!voucherRate) {
            return throwError(() => new Error('Montant de points invalide pour la conversion'));
        }

        return this.getUserPoints(userId).pipe(
            map(availablePoints => {
                if (availablePoints < pointsToConvert) {
                    throw new Error('Points insuffisants');
                }

                const voucher: Voucher = {
                    id: crypto.randomUUID(),
                    userId,
                    points: pointsToConvert,
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
