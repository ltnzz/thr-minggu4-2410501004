import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useCallback } from 'react';

export const useRotation = (initialValue = 0, step = 360) => {
    const rotation = useSharedValue(initialValue);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const toggleRotation = useCallback(() => {
        rotation.value = withSpring(rotation.value + step);
    }, [step]);

    return { animatedStyle, toggleRotation };
};
