import { calculateTripCost, getBudgetStatus } from '../utils/calculator';

describe('Uji Logika Budget Mudik B-Planner', () => {
    test('Harus menghitung total biaya perjalanan dengan benar', () => {
        const total = calculateTripCost(100, 10, 10000, 50000, 50000, 0, 0);

        expect(total).toBe(200000);
    });

    test('Harus mendeteksi jika budget kelebihan (Over Budget)', () => {
        const cost = 2500000;
        const budget = 2000000;

        const status = getBudgetStatus(cost, budget);

        expect(status.percentage).toBe(125);
        expect(status.isOver).toBe(true);
    });

    test('Harus tetap aman jika biaya di bawah budget', () => {
        const status = getBudgetStatus(1000000, 2000000);
        expect(status.isOver).toBe(false);
    });
});
