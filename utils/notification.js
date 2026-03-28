import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useTheme } from '../hooks/use.theme';

export const CustomTopNotification = ({ visible, onClose, title, message }) => {
    const { colors } = useTheme();

    useEffect(() => {
        if (!visible) return;

        const timerId = setTimeout(() => {
            onClose();
        }, 4000);

        return () => clearTimeout(timerId);
    }, [visible, onClose]);

    return visible ? (
        <View style={styles.overlay} pointerEvents="box-none">
            <View
                style={[styles.popupContainer, { backgroundColor: colors.modalBg }]}
                pointerEvents="auto"
            >
                <View style={styles.iconBg}>
                    <Ionicons name="alert-circle" size={24} color="#EF4444" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={20} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 999,
        elevation: 999,
    },

    popupContainer: {
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },

    iconBg: {
        backgroundColor: '#FEF2F2',
        padding: 8,
        borderRadius: 12,
        marginRight: 12,
    },

    textContainer: {
        flex: 1,
    },

    title: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 2,
    },

    message: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 16,
    },

    closeButton: {
        padding: 4,
    },
});
