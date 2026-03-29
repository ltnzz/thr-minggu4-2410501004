import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useCallback, useRef } from 'react';

export const useRotation = (initialValue = 0, step = 360) => {
    const rotation = useSharedValue(initialValue);
    const targetRotation = useRef(initialValue);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const toggleRotation = useCallback(() => {
        targetRotation.current += step;
        rotation.value = withSpring(targetRotation.current);
    }, [step]);

    return { animatedStyle, toggleRotation };
};
