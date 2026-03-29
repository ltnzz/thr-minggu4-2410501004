import { createContext, useReducer, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BudgetContext = createContext();

const initialState = {
    budget: 2000000,
    distance: 50,
    consumption: 12,
    fuel: 20,
    fuelPrice: 12000,
    souvenir: 500000,
    toll: 150000,
    food: 200000,
    other: 100000,
};

const budgetReducer = (state, action) => {
    switch (action.type) {
        case 'RESTORE_BUDGET':
            return { ...state, ...action.payload };
        case 'SET_BUDGET':
            return { ...state, budget: action.payload };
        case 'SET_DISTANCE':
            return { ...state, distance: action.payload };
        case 'SET_CONSUMPTION':
            return { ...state, consumption: action.payload };
        case 'SET_FUEL':
            return { ...state, fuel: action.payload };
        case 'SET_FUEL_PRICE':
            return { ...state, fuelPrice: action.payload };
        case 'SET_SOUVENIR':
            return { ...state, souvenir: action.payload };
        case 'SET_TOLL':
            return { ...state, toll: action.payload };
        case 'SET_FOOD':
            return { ...state, food: action.payload };
        case 'SET_OTHER':
            return { ...state, other: action.payload };
        case 'RESET_BUDGET':
            return initialState;
        default:
            return state;
    }
};

export const BudgetProvider = ({ children }) => {
    const [state, dispatch] = useReducer(budgetReducer, initialState);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await AsyncStorage.getItem('@mudik_budget');
                if (data) dispatch({ type: 'RESTORE_BUDGET', payload: JSON.parse(data) });
            } catch (error) {
                console.error('Failed to load budget data', error);
            } finally {
                setIsLoaded(true);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        try {
            AsyncStorage.setItem('@mudik_budget', JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save budget data', error);
        }
    }, [state, isLoaded]);

    const contextValue = useMemo(() => ({ state, dispatch }), [state]);

    return <BudgetContext.Provider value={contextValue}>{children}</BudgetContext.Provider>;
};
