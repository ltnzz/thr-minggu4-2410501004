import { createContext, useReducer, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PackingContext = createContext();

const initialState = {
    items: [],
};

const packingReducer = (state, action) => {
    switch (action.type) {
        case 'RESTORE_PACKING':
            return { ...state, items: action.payload };
        case 'ADD_ITEM':
            return { ...state, items: [...state.items, action.payload] };
        case 'TOGGLE_ITEM':
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload ? { ...item, checked: !item.checked } : item,
                ),
            };
        case 'DELETE_ITEM':
            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.payload),
            };
        default:
            return state;
    }
};

export const PackingProvider = ({ children }) => {
    const [state, dispatch] = useReducer(packingReducer, initialState);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await AsyncStorage.getItem('@mudik_packing');
                if (data) dispatch({ type: 'RESTORE_PACKING', payload: JSON.parse(data) });
            } catch (error) {
                console.error('Failed to load packing data', error);
            }
        };
        load();
    }, []);

    useEffect(() => {
        try {
            AsyncStorage.setItem('@mudik_packing', JSON.stringify(state.items));
        } catch (error) {
            console.error('Failed to save packing data', error);
        }
    }, [state.items]);

    const contextValue = useMemo(() => ({ state, dispatch }), [state]);

    return <PackingContext.Provider value={contextValue}>{children}</PackingContext.Provider>;
};
