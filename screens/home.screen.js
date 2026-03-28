import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/header';
import { useNavigation } from '@react-navigation/native';
import { useVisits } from '../hooks/use.visit';
import { usePackingList } from '../hooks/use.packing';
import { useBudget } from '../hooks/use.budget';
import { useState } from 'react';
import { useTheme } from '../hooks/use.theme';
import Animated from 'react-native-reanimated';
import { useRotation } from '../hooks/use.rotation';

export const HomeScreen = () => {
    const navigation = useNavigation();

    const [showResetModal, setShowResetModal] = useState(false);
    const { colors, isDarkMode, toggleTheme } = useTheme();

    const { animatedStyle: animatedIconStyle, toggleRotation } = useRotation();

    const {
        budget,
        totalCost,
        remainingBudget,
        isBudgetAman,
        distance,
        fuelNeeded,
        fuelCost,
        fuel,
        dispatch: budgetDispatch,
    } = useBudget();

    const {
        totalItems,
        packedItems,
        packingProgress,
        dispatch: packingDispatch,
    } = usePackingList();

    const { totalFamily, visitedFamily, visitProgress, dispatch: visitDispatch } = useVisits();

    const itemProgress = Math.round(packingProgress);
    const unpacketItems = totalItems - packedItems;
    const familyProgress = Math.round(visitProgress);
    const unvisitedFamily = totalFamily - visitedFamily;
    const isFuelEnough = fuel >= fuelNeeded;

    const formatRupiahK = (number) => {
        const isNegative = number < 0;
        const n = Math.abs(number);

        let formatted = '';

        if (n >= 1_000_000_000) {
            formatted = `${(n / 1_000_000_000).toFixed(1).replace('.0', '')}B`;
        } else if (n >= 1_000_000) {
            formatted = `${(n / 1_000_000).toFixed(1).replace('.0', '')}jt`;
        } else if (n >= 1_000) {
            formatted = `${(n / 1_000).toFixed(1).replace('.0', '')}k`;
        } else {
            formatted = `${n}`;
        }

        return isNegative ? `-Rp ${formatted}` : `Rp ${formatted}`;
    };
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Header />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View
                    style={[styles.card, { backgroundColor: isBudgetAman ? '#16A34A' : '#B91C1C' }]}
                >
                    <View>
                        <View style={styles.rowAlignCenter}>
                            <Ionicons name="wallet-outline" size={20} color="#fff" />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.whiteBold}>Total Budget</Text>
                                <Text style={styles.whiteTextSmall}>
                                    Rp {budget.toLocaleString('id-ID')}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.budgetRow}>
                            <View style={styles.budgetBox}>
                                <Text style={styles.whiteTextSmall}>Total Biaya</Text>
                                <Text style={styles.whiteBold}>{formatRupiahK(totalCost)}</Text>
                            </View>

                            <View style={styles.budgetBox}>
                                <Text style={styles.whiteTextSmall}>Sisa Budget</Text>
                                <Text
                                    style={[
                                        styles.whiteBold,
                                        !isBudgetAman && { color: '#FECACA', fontWeight: '900' },
                                    ]}
                                >
                                    {formatRupiahK(remainingBudget)}
                                </Text>
                            </View>
                        </View>

                        {isBudgetAman && (
                            <View style={styles.budgetStatus}>
                                <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
                                <Text style={[styles.budgetStatusText, { marginLeft: 6 }]}>
                                    Budget cukup untuk perjalanan mudik
                                </Text>
                            </View>
                        )}

                        {!isBudgetAman && (
                            <View
                                style={{
                                    marginTop: 14,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    padding: 12,
                                    borderRadius: 12,
                                }}
                            >
                                <Ionicons name="alert-circle" size={22} color="#fff" />
                                <View style={{ marginLeft: 10, flex: 1 }}>
                                    <Text
                                        style={{ color: '#fff', fontSize: 13, fontWeight: '800' }}
                                    >
                                        Budget Terlampaui!
                                    </Text>
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontSize: 11,
                                            opacity: 0.9,
                                            lineHeight: 16,
                                        }}
                                    >
                                        Anda kekurangan {formatRupiahK(Math.abs(remainingBudget))}{' '}
                                        dari total budget mudik.
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                <View style={[styles.rowBetween, { marginTop: 6, marginBottom: 10 }]}>
                    <Text
                        style={[
                            styles.sectionTitle,
                            { color: colors.text, marginTop: 0, marginBottom: 0 },
                        ]}
                    >
                        Dashboard Ringkasan
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            toggleTheme();
                            toggleRotation();
                        }}
                        style={[
                            styles.themeToggleBtn,
                            { backgroundColor: colors.card, borderColor: colors.border },
                        ]}
                    >
                        <Animated.View style={animatedIconStyle}>
                            <Ionicons
                                name={isDarkMode ? 'sunny' : 'moon'}
                                size={18}
                                color={isDarkMode ? '#FBBF24' : '#4F46E5'}
                            />
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                <TouchableHighlight
                    onPress={() => navigation.navigate('Budget')}
                    underlayColor={isDarkMode ? '#3730A3' : '#D1D9F5'}
                    style={[styles.card, { backgroundColor: colors.surfaceBudget }]}
                >
                    <View>
                        <View style={styles.rowAlignCenter}>
                            <View
                                style={[
                                    styles.iconCircle,
                                    { backgroundColor: colors.surfaceBudgetIcon },
                                ]}
                            >
                                <Ionicons name="car-outline" size={16} color="#2563EB" />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={[styles.cardTitle, { color: colors.text }]}>
                                    BBM & Biaya
                                </Text>
                                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                                    Estimasi perjalanan
                                </Text>
                            </View>

                            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                        </View>

                        <View style={styles.miniRow}>
                            <View style={[styles.miniBox, { backgroundColor: colors.miniBox }]}>
                                <Text style={styles.miniLabel}>Jarak</Text>
                                <Text style={[styles.miniValue, { color: colors.text }]}>
                                    {distance} KM
                                </Text>
                            </View>

                            <View style={[styles.miniBox, { backgroundColor: colors.miniBox }]}>
                                <Text style={styles.miniLabel}>BBM</Text>
                                <Text style={[styles.miniValue, { color: colors.text }]}>
                                    {fuelNeeded.toFixed(1)} L
                                </Text>
                            </View>

                            <View style={[styles.miniBox, { backgroundColor: colors.miniBox }]}>
                                <Text style={styles.miniLabel}>Biaya</Text>
                                <Text style={[styles.miniValue, { color: colors.text }]}>
                                    {formatRupiahK(fuelCost).replace('Rp ', '')}
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.rowAlignCenter, { marginTop: 10 }]}>
                            <Ionicons
                                name={isFuelEnough ? 'checkmark-circle' : 'warning'}
                                size={14}
                                color={isFuelEnough ? '#10B981' : '#E76F2E'}
                            />
                            <Text
                                style={[
                                    styles.warningText,
                                    { color: isFuelEnough ? '#10B981' : '#E76F2E' },
                                ]}
                            >
                                {isFuelEnough
                                    ? 'BBM aman untuk perjalanan'
                                    : 'Perlu isi BBM sebelum berangkat'}
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={() => navigation.navigate('Item')}
                    underlayColor={isDarkMode ? '#581C87' : '#E9D5FF'}
                    style={[styles.card, { backgroundColor: colors.surfacePacking }]}
                >
                    <View>
                        <View style={styles.rowAlignCenter}>
                            <View
                                style={[
                                    styles.iconCircle,
                                    { backgroundColor: colors.surfacePackingIcon },
                                ]}
                            >
                                <Ionicons name="briefcase-outline" size={16} color="#9333EA" />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={[styles.cardTitle, { color: colors.text }]}>
                                    Barang Bawaan
                                </Text>
                                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                                    Checklist packing
                                </Text>
                            </View>

                            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                        </View>

                        <View style={styles.progressSection}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.miniLabel}>Progress</Text>
                                <Text style={[styles.miniValue, { color: colors.text }]}>
                                    {packedItems}/{totalItems} items ({itemProgress}%)
                                </Text>
                            </View>

                            <View style={styles.progressBarBase}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        { width: `${itemProgress}%`, backgroundColor: '#9333EA' },
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={[styles.rowAlignCenter, { marginTop: 10 }]}>
                            <Ionicons
                                name={
                                    totalItems === 0
                                        ? 'information-circle-outline'
                                        : unpacketItems === 0
                                          ? 'checkmark-circle'
                                          : 'time-outline'
                                }
                                size={14}
                                color={
                                    totalItems === 0
                                        ? '#6B7280'
                                        : unpacketItems === 0
                                          ? '#10B981'
                                          : '#E76F2E'
                                }
                            />
                            <Text
                                style={[
                                    styles.warningText,
                                    {
                                        color:
                                            totalItems === 0
                                                ? '#6B7280'
                                                : unpacketItems === 0
                                                  ? '#10B981'
                                                  : '#E76F2E',
                                    },
                                ]}
                            >
                                {totalItems === 0
                                    ? 'Belum ada list barang'
                                    : unpacketItems === 0
                                      ? 'Semua barang sudah dipack!'
                                      : `${unpacketItems} Barang belum dipack`}
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={() => navigation.navigate('Family')}
                    underlayColor={isDarkMode ? '#78350F' : '#FDE68A'}
                    style={[styles.card, { backgroundColor: colors.surfaceFamily }]}
                >
                    <View>
                        <View style={styles.rowAlignCenter}>
                            <View
                                style={[
                                    styles.iconCircle,
                                    { backgroundColor: colors.surfaceFamilyIcon },
                                ]}
                            >
                                <Ionicons name="people-outline" size={16} color="#D97706" />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={[styles.cardTitle, { color: colors.text }]}>
                                    Kunjungan Keluarga
                                </Text>
                                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                                    Jadwal silaturahmi
                                </Text>
                            </View>

                            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                        </View>

                        <View style={styles.progressSection}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.miniLabel}>Progress</Text>
                                <Text style={[styles.miniValue, { color: colors.text }]}>
                                    {visitedFamily}/{totalFamily} keluarga ({familyProgress}%)
                                </Text>
                            </View>

                            <View style={styles.progressBarBase}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        { width: `${familyProgress}%`, backgroundColor: '#D97706' },
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={[styles.rowAlignCenter, { marginTop: 10 }]}>
                            <Ionicons
                                name={
                                    totalFamily === 0
                                        ? 'information-circle-outline'
                                        : unvisitedFamily === 0
                                          ? 'checkmark-circle'
                                          : 'calendar-outline'
                                }
                                size={14}
                                color={
                                    totalFamily === 0
                                        ? '#6B7280'
                                        : unvisitedFamily === 0
                                          ? '#10B981'
                                          : '#E76F2E'
                                }
                            />
                            <Text
                                style={[
                                    styles.warningText,
                                    {
                                        color:
                                            totalFamily === 0
                                                ? '#6B7280'
                                                : unvisitedFamily === 0
                                                  ? '#10B981'
                                                  : '#E76F2E',
                                    },
                                ]}
                            >
                                {totalFamily === 0
                                    ? 'Belum ada jadwal silaturahmi'
                                    : unvisitedFamily === 0
                                      ? 'Semua keluarga sudah dikunjungi!'
                                      : `${unvisitedFamily} keluarga belum dikunjungi`}
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>

                <View style={[styles.card, { backgroundColor: '#10B981', marginBottom: -10 }]}>
                    <View style={[styles.rowAlignCenter, { marginBottom: 4 }]}>
                        <Ionicons name="bulb-outline" size={16} color="#fff" />
                        <Text style={[styles.whiteBold, { marginLeft: 8 }]}>Tips Mudik</Text>
                    </View>

                    <Text style={[styles.whiteTextSmall, { lineHeight: 18 }]}>
                        Usahakan berangkat setelah subuh untuk menghindari puncak kemacetan... 🚗✨
                    </Text>
                </View>

                <View
                    style={{
                        backgroundColor: colors.card,
                        marginTop: 30,
                        padding: 20,
                        borderRadius: 20,
                        elevation: 4,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.resetButton, { marginTop: 0, marginBottom: 0 }]}
                        onPress={() => setShowResetModal(true)}
                    >
                        <Ionicons name="refresh-circle" size={22} color="#fff" />
                        <Text style={styles.resetButtonText}>Mulai Rencana Baru?</Text>
                    </TouchableOpacity>

                    <View
                        style={{
                            marginTop: 15,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" />
                        <Text
                            style={{
                                fontSize: 12,
                                color: colors.textMuted,
                                marginLeft: 5,
                                fontWeight: '500',
                            }}
                        >
                            Mengembalikan semua data ke nilai awal
                        </Text>
                    </View>
                </View>

                <Modal visible={showResetModal} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: colors.modalBg }]}>
                            <View style={styles.alertIconBg}>
                                <Ionicons name="trash-bin" size={32} color="#EF4444" />
                            </View>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                Hapus Semua Data?
                            </Text>
                            <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>
                                Tindakan ini akan menghapus seluruh data budget, daftar barang, dan
                                jadwal keluarga secara permanen.
                            </Text>

                            <View style={styles.modalActionRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.cancelBtn,
                                        { backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' },
                                    ]}
                                    onPress={() => setShowResetModal(false)}
                                >
                                    <Text
                                        style={[
                                            styles.cancelBtnText,
                                            { color: isDarkMode ? '#D1D5DB' : '#4B5563' },
                                        ]}
                                    >
                                        Batal
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.confirmBtn}
                                    onPress={() => {
                                        budgetDispatch({ type: 'RESET_BUDGET' });
                                        packingDispatch({ type: 'RESET_PACKING' });
                                        visitDispatch({ type: 'RESET_VISITS' });
                                        setShowResetModal(false);
                                    }}
                                >
                                    <Text style={styles.confirmBtnText}>Ya, Hapus</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },

    scrollContent: {
        padding: 16,
    },

    themeToggleBtn: {
        padding: 6,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    budgetStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 8,
        alignSelf: 'flex-start',
    },

    budgetStatusText: {
        color: '#ECFDF5',
        fontSize: 12,
        marginLeft: 6,
    },

    card: {
        padding: 14,
        borderRadius: 16,
        marginBottom: 10,
        elevation: 3,
    },

    sectionTitle: {
        fontWeight: 'bold',
        marginTop: 6,
        marginBottom: 10,
        color: '#1F2937',
        fontSize: 16,
    },

    rowAlignCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    whiteBold: {
        color: '#fff',
        fontWeight: 'bold',
    },

    whiteTextSmall: {
        color: '#fff',
        fontSize: 12,
    },

    budgetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },

    budgetBox: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 10,
        width: '48%',
    },

    iconCircle: {
        padding: 8,
        borderRadius: 10,
        marginRight: 12,
    },

    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
    },

    cardSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },

    miniRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    miniBox: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 10,
        width: '31%',
        alignItems: 'center',
    },

    miniLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        textTransform: 'uppercase',
    },

    miniValue: {
        fontWeight: '700',
        fontSize: 13,
        color: '#1F2937',
    },

    progressSection: {
        marginTop: 10,
    },

    progressBarBase: {
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        marginTop: 4,
    },

    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },

    warningText: {
        fontSize: 11,
        color: '#E76F2E',
        marginLeft: 6,
        fontWeight: '600',
    },

    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        padding: 18,
        backgroundColor: '#EF4444',
        borderRadius: 16,
        elevation: 6,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },

    resetButtonText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 15,
        marginLeft: 8,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },

    modalContent: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },

    alertIconBg: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
    },

    modalSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },

    modalActionRow: {
        flexDirection: 'row',
        gap: 12,
    },

    cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },

    cancelBtnText: {
        color: '#4B5563',
        fontWeight: '700',
    },

    confirmBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#EF4444',
        alignItems: 'center',
    },

    confirmBtnText: {
        color: '#fff',
        fontWeight: '700',
    },
});
