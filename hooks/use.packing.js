import { useContext } from 'react';
import { PackingContext } from '../context/packing.context';

export const usePackingList = () => {
    const { state, dispatch } = useContext(PackingContext);
    const { items } = state;

    const totalItems = items.length;
    const packedItems = items.filter(item => item.checked).length;
    const packingProgress = totalItems > 0 ? (packedItems / totalItems) * 100 : 0;

    return { items, totalItems, packedItems, packingProgress, dispatch };
};