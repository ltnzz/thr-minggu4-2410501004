import { useContext } from 'react';
import { VisitContext } from '../context/visit.context';

export const useVisits = () => {
    const { state, dispatch } = useContext(VisitContext);
    const { families } = state;

    const totalFamily = families.length;
    const visitedFamily = families.filter(f => f.visited).length;
    const visitProgress = totalFamily > 0 ? (visitedFamily / totalFamily) * 100 : 0;

    return { families, totalFamily, visitedFamily, visitProgress, dispatch };
};