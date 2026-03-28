import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

export const BudgetSlider = ({ icon, color, label, value, setValue, min, max, unit }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name={icon} size={18} color={color} />
                <Text style={styles.title}>
                    {label}: {value} {unit}
                </Text>
            </View>

            <Slider
                minimumValue={min}
                maximumValue={max}
                value={value}
                onValueChange={setValue}
                minimumTrackTintColor={color}
                maximumTrackTintColor="#D1D5DB"
                thumbTintColor={color}
            />

            <View style={styles.range}>
                <Text style={styles.rangeText}>
                    {min} {unit}
                </Text>

                <Text style={styles.rangeText}>
                    {max} {unit}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },

    title: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '500',
    },

    range: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -4,
    },

    rangeText: {
        fontSize: 11,
        color: '#9CA3AF',
    },
});
