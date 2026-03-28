import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Header } from '../components/header';
import { useBudget } from '../hooks/use.budget';
import { useState, useEffect, useRef } from 'react';
import { CustomTopNotification } from '../utils/notification';
import { useTheme } from '../hooks/use.theme';

export const BudgetScreen = () => {
    const { colors } = useTheme();

    const {
        budget,
        distance,
        consumption,
        fuel,
        fuelPrice,
        souvenir,
        toll,
        food,
        other,
        isBudgetAman,
        dispatch,
    } = useBudget();

    const [tempBudget, setTempBudget] = useState(budget);
    const [tempDistance, setTempDistance] = useState(distance);
    const [tempConsumption, setTempConsumption] = useState(consumption);
    const [tempFuel, setTempFuel] = useState(fuel);
    const [tempFuelPrice, setTempFuelPrice] = useState(fuelPrice);
    const [tempSouvenir, setTempSouvenir] = useState(souvenir);
    const [tempToll, setTempToll] = useState(toll);
    const [tempFood, setTempFood] = useState(food);
    const [tempOther, setTempOther] = useState(other);
    const [showNotif, setShowNotif] = useState(false);

    const prevIsBudgetAman = useRef(isBudgetAman);

    useEffect(() => {
        if (prevIsBudgetAman.current && !isBudgetAman) {
            setShowNotif(true);
        }
        prevIsBudgetAman.current = isBudgetAman;
    }, [isBudgetAman]);

    useEffect(() => {
        setTempBudget(budget);
        setTempDistance(distance);
        setTempConsumption(consumption);
        setTempFuel(fuel);
        setTempFuelPrice(fuelPrice);
        setTempSouvenir(souvenir);
        setTempToll(toll);
        setTempFood(food);
        setTempOther(other);
    }, [budget, distance, consumption, fuel, fuelPrice, souvenir, toll, food, other]);

    const formatRupiah = (n) => {
        const absN = Math.abs(n);
        let val =
            absN >= 1e6
                ? `${(absN / 1e6).toFixed(1)}jt`
                : absN >= 1e3
                  ? `${(absN / 1e3).toFixed(1)}k`
                  : absN;
        return (n < 0 ? '-Rp ' : 'Rp ') + val.toString().replace('.0', '');
    };

    const fuelNeeded = tempDistance / tempConsumption;
    const fuelToBuy = Math.max(fuelNeeded - tempFuel, 0);
    const fuelCost = Math.round(fuelToBuy * tempFuelPrice);
    const localTotalCost = tempSouvenir + tempToll + tempFood + tempOther + fuelCost;
    const localUsedPercent = (localTotalCost / tempBudget) * 100;
    const localRemainingBudget = tempBudget - localTotalCost;
    const avgSpeed = 80;
    const travelTime = tempDistance / avgSpeed;

    const formatTotal = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    const formatTime = (hours) => {
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);

        if (h === 0) return `${m} menit`;
        if (m === 0) return `${h} jam`;

        return `${h} jam ${m} menit`;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Header />

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: localUsedPercent >= 100 ? '#B91C1C' : '#16A34A',
                        },
                    ]}
                >
                    <View style={styles.rowAlignCenter}>
                        <Ionicons name="wallet-outline" size={20} color="#fff" />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.whiteBold}>Total Budget</Text>
                            <Text style={styles.whiteTextSmall}>
                                Rp {tempBudget.toLocaleString('id-ID')}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.budgetRow}>
                        <View style={styles.budgetBox}>
                            <Text style={styles.whiteTextSmall}>Total Biaya</Text>
                            <Text style={styles.whiteBold}>{formatRupiah(localTotalCost)}</Text>
                        </View>
                        <View style={styles.budgetBox}>
                            <Text style={styles.whiteTextSmall}>Sisa Budget</Text>
                            <Text
                                style={[
                                    styles.whiteBold,
                                    localUsedPercent >= 100 && { color: '#FECACA' },
                                ]}
                            >
                                {formatRupiah(localRemainingBudget)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.budgetStatus}>
                        <Text style={styles.budgetStatusText}>Budget terpakai</Text>

                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${Math.min(Math.max(localUsedPercent, 0), 100)}%`,
                                        backgroundColor:
                                            localUsedPercent >= 80 && localUsedPercent < 100
                                                ? '#FDE68A'
                                                : '#FFFFFF',
                                    },
                                ]}
                            />
                        </View>

                        <View style={{ width: 45, alignItems: 'flex-end' }}>
                            <Text
                                style={[styles.budgetStatusText, { fontVariant: ['tabular-nums'] }]}
                            >
                                {Math.round(localUsedPercent)}%
                            </Text>
                        </View>
                    </View>

                    {localUsedPercent >= 100 && (
                        <View
                            style={{
                                marginTop: 12,
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                padding: 8,
                                borderRadius: 8,
                            }}
                        >
                            <Ionicons name="alert-circle" size={16} color="#fff" />
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 11,
                                    marginLeft: 6,
                                    fontWeight: '700',
                                }}
                            >
                                Peringatan, budget Anda telah terlampaui!
                            </Text>
                        </View>
                    )}

                    {localUsedPercent < 100 && (
                        <View
                            style={{
                                marginTop: 12,
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                padding: 8,
                                borderRadius: 8,
                            }}
                        >
                            <Ionicons name="alert-circle" size={16} color="#fff" />
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 11,
                                    marginLeft: 6,
                                    fontWeight: '700',
                                }}
                            >
                                Budget Anda saat ini masih aman
                            </Text>
                        </View>
                    )}
                </View>

                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.row}>
                        <Ionicons name="wallet-sharp" size={20} color={colors.primary} />
                        <Text style={[styles.cardTitle, { color: colors.text }]}>Set Budget</Text>
                    </View>

                    <Text style={[styles.sliderLabel, { color: colors.text }]}>
                        Budget perjalanan: {formatRupiah(budget)}
                    </Text>

                    <Slider
                        minimumValue={500000}
                        maximumValue={10000000}
                        step={50000}
                        value={tempBudget}
                        onValueChange={setTempBudget}
                        onSlidingComplete={(val) => dispatch({ type: 'SET_BUDGET', payload: val })}
                        minimumTrackTintColor={colors.primary}
                        maximumTrackTintColor="#E5E7EB"
                        thumbTintColor={colors.primary}
                    />

                    <View style={styles.sliderRange}>
                        <Text style={[styles.rangeText, { color: colors.textMuted }]}>Rp 500k</Text>
                        <Text style={[styles.rangeText, { color: colors.textMuted }]}>Rp 10jt</Text>
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.row}>
                        <Ionicons name="car-outline" size={20} color={colors.primary} />
                        <Text style={[styles.cardTitle, { color: colors.text }]}>BBM</Text>
                        <Text style={[styles.smallText, { color: colors.textMuted }]}>
                            Bahan Bakar Minyak
                        </Text>
                    </View>

                    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.label, { color: colors.textMuted }]}>
                            BBM dibutuhkan
                        </Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {fuelNeeded.toFixed(1)} L
                        </Text>
                    </View>

                    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.label, { color: colors.textMuted }]}>
                            BBM saat ini
                        </Text>
                        <Text style={[styles.value, { color: colors.text }]}>{fuel} L</Text>
                    </View>

                    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.label, { color: colors.textMuted }]}>
                            BBM perlu isi
                        </Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {Math.max(fuelNeeded - fuel, 0).toFixed(1)} L
                        </Text>
                    </View>

                    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.label, { color: colors.textMuted }]}>Biaya BBM</Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {formatRupiah(fuelCost)}
                        </Text>
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.row}>
                        <Ionicons name="map-outline" size={20} color={colors.primary} />
                        <Text style={[styles.cardTitle, { color: colors.text }]}>
                            Biaya di Jalan
                        </Text>
                    </View>

                    <View style={styles.sliderBlock}>
                        <Text style={[styles.sliderLabel, { color: colors.text }]}>
                            Jarak ke kampung: {distance} km
                        </Text>

                        <Slider
                            minimumValue={50}
                            maximumValue={1000}
                            step={1}
                            value={tempDistance}
                            onValueChange={setTempDistance}
                            onSlidingComplete={(val) =>
                                dispatch({ type: 'SET_DISTANCE', payload: val })
                            }
                            minimumTrackTintColor="#3B82F6"
                            maximumTrackTintColor="#E5E7EB"
                            thumbTintColor="#3B82F6"
                        />

                        <View style={styles.sliderRange}>
                            <Text style={[styles.rangeText, { color: colors.textMuted }]}>
                                50 km
                            </Text>
                            <Text style={[styles.rangeText, { color: colors.textMuted }]}>
                                1000 km
                            </Text>
                        </View>
                    </View>

                    <View style={styles.sliderBlock}>
                        <Text style={[styles.sliderLabel, { color: colors.text }]}>
                            Konsumsi kendaraan: {consumption} km/L
                        </Text>

                        <Slider
                            minimumValue={5}
                            maximumValue={25}
                            step={1}
                            value={tempConsumption}
                            onValueChange={setTempConsumption}
                            onSlidingComplete={(val) =>
                                dispatch({ type: 'SET_CONSUMPTION', payload: val })
                            }
                            minimumTrackTintColor="#22C55E"
                            maximumTrackTintColor="#E5E7EB"
                            thumbTintColor="#22C55E"
                        />

                        <View style={styles.sliderRange}>
                            <Text style={[styles.rangeText, { color: colors.textMuted }]}>
                                5 km/L
                            </Text>
                            <Text style={[styles.rangeText, { color: colors.textMuted }]}>
                                25 km/L
                            </Text>
                        </View>
                    </View>

                    <View style={styles.sliderBlock}>
                        <Text style={[styles.sliderLabel, { color: colors.text }]}>
                            BBM saat ini: {fuel} L
                        </Text>

                        <Slider
                            minimumValue={0}
                            maximumValue={80}
                            step={1}
                            value={tempFuel}
                            onValueChange={setTempFuel}
                            onSlidingComplete={(val) =>
                                dispatch({ type: 'SET_FUEL', payload: val })
                            }
                            minimumTrackTintColor="#9333EA"
                            maximumTrackTintColor="#E5E7EB"
                            thumbTintColor="#9333EA"
                        />

                        <View style={styles.sliderRange}>
                            <Text style={[styles.rangeText, { color: colors.textMuted }]}>0 L</Text>
                            <Text style={[styles.rangeText, { color: colors.textMuted }]}>
                                80 L
                            </Text>
                        </View>
                    </View>

                    <View style={styles.sliderBlock}>
                        <Text style={[styles.sliderLabel, { color: colors.text }]}>
                            Harga BBM: Rp {formatRupiah(fuelPrice)}/L
                        </Text>

                        <Slider
                            minimumValue={10000}
                            maximumValue={20000}
                            step={500}
                            value={tempFuelPrice}
                            onValueChange={setTempFuelPrice}
                            onSlidingComplete={(val) =>
                                dispatch({ type: 'SET_FUEL_PRICE', payload: val })
                            }
                            minimumTrackTintColor="#F97316"
                            maximumTrackTintColor="#E5E7EB"
                            thumbTintColor="#F97316"
                        />

                        <View style={styles.sliderRange}>
                            <Text style={[styles.rangeText, { color: colors.textMuted }]}>
                                Rp 10k
                            </Text>
                            <Text style={[styles.rangeText, { color: colors.textMuted }]}>
                                Rp 20k
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.row}>
                        <Ionicons name="albums-outline" size={20} color={colors.primary} />
                        <Text style={[styles.cardTitle, { color: colors.text }]}>
                            Biaya lainnya
                        </Text>
                    </View>

                    <View style={styles.sliderGroup}>
                        <View style={styles.sliderHeader}>
                            <Text style={[styles.sliderLabel, { color: colors.text }]}>
                                Oleh-oleh
                            </Text>
                            <Text style={[styles.sliderValue, { color: '#9333EA' }]}>
                                {formatRupiah(souvenir)}
                            </Text>
                        </View>

                        <Slider
                            minimumValue={0}
                            maximumValue={2000000}
                            step={50000}
                            value={tempSouvenir}
                            onValueChange={setTempSouvenir}
                            onSlidingComplete={(val) =>
                                dispatch({ type: 'SET_SOUVENIR', payload: val })
                            }
                            minimumTrackTintColor="#9333EA"
                            maximumTrackTintColor="#E9D5FF"
                            thumbTintColor="#9333EA"
                        />

                        <View style={styles.sliderRange}>
                            <Text style={[styles.rangeText, { color: colors.textMuted }]}>0K</Text>
                            <Text style={[styles.rangeText, { color: colors.textMuted }]}>2jt</Text>
                        </View>
                    </View>

                    <View style={styles.sliderGroup}>
                        <View style={styles.sliderHeader}>
                            <Text style={[styles.sliderLabel, { color: colors.text }]}>Tol</Text>
                            <Text style={[styles.sliderValue, { color: '#2563EB' }]}>
                                {formatRupiah(toll)}
                            </Text>
                        </View>

                        <Slider
                            minimumValue={0}
                            maximumValue={2000000}
                            step={50000}
                            value={tempToll}
                            onValueChange={setTempToll}
                            onSlidingComplete={(val) =>
                                dispatch({ type: 'SET_TOLL', payload: val })
                            }
                            minimumTrackTintColor="#2563EB"
                            maximumTrackTintColor="#DBEAFE"
                            thumbTintColor="#2563EB"
                        />

                        <View style={styles.sliderRange}>
                            <Text style={[styles.rangeText, { color: colors.textMuted }]}>0K</Text>
                            <Text style={[styles.rangeText, { color: colors.textMuted }]}>2jt</Text>
                        </View>
                    </View>

                    <View style={styles.sliderGroup}>
                        <View style={styles.sliderHeader}>
                            <Text style={[styles.sliderLabel, { color: colors.text }]}>
                                Makan & Minum
                            </Text>
                            <Text style={[styles.sliderValue, { color: '#F59E0B' }]}>
                                {formatRupiah(food)}
                            </Text>
                        </View>

                        <Slider
                            minimumValue={0}
                            maximumValue={1000000}
                            step={50000}
                            value={tempFood}
                            onValueChange={setTempFood}
                            onSlidingComplete={(val) =>
                                dispatch({ type: 'SET_FOOD', payload: val })
                            }
                            minimumTrackTintColor="#F59E0B"
                            maximumTrackTintColor="#FEF3C7"
                            thumbTintColor="#F59E0B"
                        />

                        <View style={styles.sliderRange}>
                            <Text style={[styles.rangeText, { color: colors.textMuted }]}>0K</Text>
                            <Text style={[styles.rangeText, { color: colors.textMuted }]}>1jt</Text>
                        </View>
                    </View>

                    <View style={styles.sliderGroup}>
                        <View style={styles.sliderHeader}>
                            <Text style={[styles.sliderLabel, { color: colors.text }]}>
                                Lain-lain
                            </Text>
                            <Text style={[styles.sliderValue, { color: '#10B981' }]}>
                                {formatRupiah(other)}
                            </Text>
                        </View>

                        <Slider
                            minimumValue={0}
                            maximumValue={1000000}
                            step={50000}
                            value={tempOther}
                            onValueChange={setTempOther}
                            onSlidingComplete={(val) =>
                                dispatch({ type: 'SET_OTHER', payload: val })
                            }
                            minimumTrackTintColor="#10B981"
                            maximumTrackTintColor="#D1FAE5"
                            thumbTintColor="#10B981"
                        />

                        <View style={styles.sliderRange}>
                            <Text style={[styles.rangeText, { color: colors.textMuted }]}>0K</Text>
                            <Text style={[styles.rangeText, { color: colors.textMuted }]}>1jt</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.row}>
                        <Ionicons name="receipt-outline" size={20} color={colors.primary} />
                        <Text style={[styles.cardTitle, { color: colors.text }]}>
                            Rincian Pengeluaran
                        </Text>
                    </View>

                    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.label, { color: colors.textMuted }]}>BBM</Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {formatRupiah(fuelCost)}
                        </Text>
                    </View>

                    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.label, { color: colors.textMuted }]}>Oleh-oleh</Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {formatRupiah(souvenir)}
                        </Text>
                    </View>

                    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.label, { color: colors.textMuted }]}>Tol</Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {formatRupiah(toll)}
                        </Text>
                    </View>

                    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.label, { color: colors.textMuted }]}>
                            Makan & Minum
                        </Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {formatRupiah(food)}
                        </Text>
                    </View>

                    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.label, { color: colors.textMuted }]}>Lain-lain</Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {formatRupiah(other)}
                        </Text>
                    </View>
                </View>

                <View style={[styles.totalCard, { backgroundColor: colors.card }]}>
                    <View style={styles.totalHeader}>
                        <View
                            style={[styles.iconBox, { backgroundColor: colors.surfaceBudgetIcon }]}
                        >
                            <Ionicons name="calculator-outline" size={18} color={colors.primary} />
                        </View>

                        <Text style={[styles.totalTitle, { color: colors.text }]}>
                            Total Pengeluaran
                        </Text>
                    </View>

                    <Text style={[styles.totalValue, { color: colors.primary }]}>
                        {formatTotal(localTotalCost)}
                    </Text>

                    <Text style={[styles.totalSubtitle, { color: colors.textMuted }]}>
                        Total biaya perjalanan mudik
                    </Text>
                </View>

                <View
                    style={[styles.card, styles.arrivalCard, { backgroundColor: colors.primary }]}
                >
                    <View style={styles.row}>
                        <Ionicons name="time-outline" size={20} color="#fff" />
                        <Text style={styles.cardTitleWhite}>Estimasi Sampai</Text>
                    </View>

                    <Text style={styles.bigNumberWhite}>{formatTime(travelTime)}</Text>

                    <Text style={styles.subtitleWhite}>
                        Berdasarkan kecepatan rata-rata {avgSpeed} km/jam
                    </Text>
                </View>
            </ScrollView>

            <CustomTopNotification
                visible={showNotif}
                onClose={() => setShowNotif(false)}
                title={
                    <>
                        Budget Terlampaui! <Ionicons name="wallet" size={16} color="#EF4444" />
                    </>
                }
                message="Total estimasi pengeluaran Anda telah melebihi budget yang ditentukan."
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },

    scrollContent: {
        padding: 16,
    },

    sliderBlock: {
        marginTop: 14,
    },

    sliderRange: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    rangeText: {
        fontSize: 11,
        color: '#9CA3AF',
    },

    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 14,
        marginBottom: 14,
        elevation: 3,
    },

    arrivalCard: {
        backgroundColor: '#4F46E5',
        marginBottom: 20,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },

    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
    },

    cardTitleWhite: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },

    sliderGroup: {
        marginTop: 14,
    },

    sliderLabel: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '600',
    },

    sliderValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#4F46E5',
    },

    totalCard: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 16,
        marginBottom: 14,
        elevation: 3,
    },

    totalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    iconBox: {
        backgroundColor: '#E0E7FF',
        padding: 6,
        borderRadius: 8,
        marginRight: 8,
    },

    totalTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },

    totalValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#4F46E5',
        marginBottom: 4,
    },

    totalSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },

    bigNumberWhite: {
        fontSize: 26,
        fontWeight: '800',
        color: '#fff',
        marginTop: 6,
    },

    subtitleWhite: {
        fontSize: 12,
        color: '#E5E7EB',
        marginTop: 4,
    },

    smallText: {
        fontSize: 12,
        color: '#6B7280',
    },

    rowAlignCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    budgetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 14,
    },

    budgetBox: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 10,
        width: '48%',
    },

    whiteBold: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },

    whiteTextSmall: {
        color: '#ECFDF5',
        fontSize: 12,
    },

    budgetStatus: {
        marginTop: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },

    budgetStatusText: {
        fontSize: 12,
        color: '#ECFDF5',
    },

    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 6,
        marginHorizontal: 10,
    },

    progressFill: {
        height: 6,
        backgroundColor: '#fff',
        borderRadius: 6,
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },

    label: {
        fontSize: 13,
        color: '#6B7280',
    },

    value: {
        fontSize: 14,
        fontWeight: '600',
    },
});
