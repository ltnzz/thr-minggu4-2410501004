export const calculateTripCost = (distance, consumption, fuelPrice, toll, food, souvenir, other) => {
    const fuelNeeded = distance / consumption;
    const fuelCost = fuelNeeded * fuelPrice;
    const total = fuelCost + toll + food + souvenir + other;
    return Math.round(total);
};

export const getBudgetStatus = (totalCost, budget) => {
    const percentage = (totalCost / budget) * 100;
    return {
        percentage: Math.round(percentage),
        isOver: totalCost > budget
    };
};