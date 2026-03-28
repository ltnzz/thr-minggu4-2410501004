import { useContext } from 'react';
import { BudgetContext } from '../context/budget.context';

export const useBudget = () => {
    const { state, dispatch } = useContext(BudgetContext);

    const { budget, distance, consumption, fuel, fuelPrice, souvenir, toll, food, other } = state;

    const fuelNeeded = distance / consumption;
    const fuelToBuy = Math.max(fuelNeeded - fuel, 0);
    const fuelCost = Math.round(fuelToBuy * fuelPrice);
    const totalCost = souvenir + toll + food + other + fuelCost;
    const remainingBudget = budget - totalCost;
    const isBudgetAman = remainingBudget >= 0;
    const usedPercent = (totalCost / budget) * 100;

    return {
        ...state,
        totalCost,
        remainingBudget,
        isBudgetAman,
        usedPercent,
        fuelNeeded,
        fuelCost,
        fuelToBuy,
        dispatch,
    };
};
