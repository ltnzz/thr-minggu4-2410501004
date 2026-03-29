import { createContext, useReducer, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const VisitContext = createContext();

const initialState = {
    families: [],
};

const visitReducer = (state, action) => {
    switch (action.type) {
        case 'RESTORE_VISITS':
            return { ...state, families: action.payload };
        case 'ADD_FAMILY':
            return { ...state, families: [...state.families, action.payload] };
        case 'TOGGLE_VISIT':
            return {
                ...state,
                families: state.families.map((f) =>
                    f.id === action.payload ? { ...f, visited: !f.visited } : f,
                ),
            };
        case 'DELETE_FAMILY':
            return {
                ...state,
                families: state.families.filter((f) => f.id !== action.payload),
            };
        case 'RESET_VISITS':
            return { ...state, families: [] };
        default:
            return state;
    }
};

export const VisitProvider = ({ children }) => {
    const [state, dispatch] = useReducer(visitReducer, initialState);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await AsyncStorage.getItem('@mudik_visits');
                if (data) dispatch({ type: 'RESTORE_VISITS', payload: JSON.parse(data) });
            } catch (error) {
                console.error('Failed to load visit data', error);
            } finally {
                setIsLoaded(true);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        try {
            AsyncStorage.setItem('@mudik_visits', JSON.stringify(state.families));
        } catch (error) {
            console.error('Failed to save visit data', error);
        }
    }, [state.families, isLoaded]);

    const contextValue = useMemo(() => ({ state, dispatch }), [state]);

    return <VisitContext.Provider value={contextValue}>{children}</VisitContext.Provider>;
};
