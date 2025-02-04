export interface PointsRate {
    plastique: 2;
    verre: 1;
    papier: 1;
    metal: 5;
}

export interface VoucherRate {
    points: number;
    value: number;
}

export interface Voucher {
    id: string;
    userId: string;
    points: number;
    value: number;
    createdAt: Date;
    status: 'pending' | 'used';
}

export interface PointsTransaction {
    id: string;
    userId: string;
    collectionRequestId: string;
    wasteType: keyof PointsRate;
    weight: number;
    pointsEarned: number;
    createdAt: Date;
}

export const POINTS_RATES: PointsRate = {
    plastique: 2,
    verre: 1,
    papier: 1,
    metal: 5
};

export const VOUCHER_RATES: VoucherRate[] = [
    { points: 100, value: 50 },
    { points: 200, value: 120 },
    { points: 500, value: 350 }
];
