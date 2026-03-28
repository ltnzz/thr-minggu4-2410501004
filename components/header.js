import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const Header = () => {
    return (
        <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
        >
            <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>B'Planner</Text>
                <Text style={styles.headerSubtitle}>28 Ramadhan</Text>
            </View>

            <View style={styles.rightSection}>
                <View>
                    <Text style={styles.profileName}>Halo, Latanza</Text>
                    <Text style={styles.profileStatus}>Siap Mudik?</Text>
                </View>

                <View style={styles.profileCircle}>
                    <Text style={styles.profileInitial}>L</Text>
                </View>
            </View>

            <View style={styles.decorCircle1} />
            <View style={styles.decorCircle2} />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        paddingHorizontal: 20,
        paddingVertical: 30,

        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,

        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,

        overflow: 'hidden',
    },

    headerLeft: {
        gap: 4,
    },

    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#fff',
    },

    headerSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
    },

    profileCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#fff',

        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },

    profileInitial: {
        fontWeight: '800',
        color: '#4F46E5',
    },

    decorCircle1: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.08)',
        top: -40,
        right: -20,
    },

    decorCircle2: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.08)',
        bottom: -20,
        left: 40,
    },

    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    profileName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'right',
    },

    profileStatus: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'right',
    },
});
