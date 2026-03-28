import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export const useRotation = (initialValue = 0, step = 360) => {
    const rotation = useSharedValue(initialValue);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const toggleRotation = () => {
        rotation.value = withSpring(rotation.value + step);
    };

    return { animatedStyle, toggleRotation };
};
