import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    LayoutAnimation,
    Linking,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Header } from '../components/header';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useVisits } from '../hooks/use.visit';
import { useTheme } from '../hooks/use.theme';

export const FamilyScreen = () => {
    const { colors } = useTheme();

    const { families, dispatch, visitedFamily, totalFamily, visitProgress } = useVisits();

    const [isExpanded, setIsExpanded] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [relation, setRelation] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');

    const toggleForm = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };

    const addFamily = () => {
        if (!name.trim() || !address.trim()) return;

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        const newFamily = {
            id: Date.now().toString(),
            name,
            address,
            relation,
            phone,
            notes,
            visited: false,
        };

        dispatch({ type: 'ADD_FAMILY', payload: newFamily });
        setName('');
        setAddress('');
        setRelation('');
        setPhone('');
        setNotes('');
    };

    const deleteFamily = (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        dispatch({ type: 'DELETE_FAMILY', payload: id });
    };

    const callFamily = (phoneNumber) => {
        if (phoneNumber) Linking.openURL(`tel:${phoneNumber}`);
    };

    const unvisitedData = families.filter((f) => !f.visited);
    const visitedData = families.filter((f) => f.visited);

    const sectionData = [
        {
            title: `Belum Dikunjungi (${unvisitedData.length})`,
            iconName: 'time',
            iconColor: '#F59E0B',
            data: unvisitedData,
        },
        {
            title: `Sudah Dikunjungi (${visitedData.length})`,
            iconName: 'checkmark-circle',
            iconColor: '#10B981',
            data: visitedData,
        },
    ].filter((section) => section.data.length > 0);

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <Header />

            <View style={styles.container}>
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.row}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="people-outline" size={18} color="#4F46E5" />
                        </View>
                        <View>
                            <Text style={[styles.title, { color: colors.text }]}>
                                Kunjungan Keluarga
                            </Text>
                            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                                Jadwal silaturahmi
                            </Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View>
                            <Text style={[styles.statsValue, { color: colors.text }]}>
                                {visitedFamily}/{totalFamily}
                            </Text>
                            <Text style={[styles.statsLabel, { color: colors.textMuted }]}>
                                Keluarga Dikunjungi
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={[styles.statsValue, { color: colors.text }]}>
                                {Math.round(visitProgress || 0)}%
                            </Text>
                            <Text style={[styles.statsLabel, { color: colors.textMuted }]}>
                                Selesai
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                        <View style={[styles.progressFill, { width: `${visitProgress || 0}%` }]} />
                    </View>
                </View>

                <SwipeListView
                    useSectionList
                    sections={sectionData}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    rightOpenValue={-60}
                    disableRightSwipe={true}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons
                                name="folder-open-outline"
                                size={40}
                                color={colors.textMuted}
                            />
                            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                                Belum ada list keluarga untuk dikunjungi
                            </Text>
                        </View>
                    }
                    renderSectionHeader={({ section }) => (
                        <View
                            style={[
                                styles.sectionHeader,
                                {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: colors.background,
                                },
                            ]}
                        >
                            <Ionicons
                                name={section.iconName}
                                size={14}
                                color={section.iconColor}
                                style={{ marginRight: 6 }}
                            />
                            <Text style={[styles.sectionHeaderText, { color: colors.textMuted }]}>
                                {section.title}
                            </Text>
                        </View>
                    )}
                    renderItem={(data, rowMap) => {
                        const { item } = data;
                        const initial = item.name ? item.name.charAt(0).toUpperCase() : '?';

                        return (
                            <View style={styles.itemWrapper}>
                                <TouchableOpacity
                                    style={[
                                        styles.itemCard,
                                        {
                                            backgroundColor: colors.card,
                                            borderColor: colors.border,
                                        },
                                        item.visited && {
                                            backgroundColor: colors.background,
                                            borderColor: colors.border,
                                        },
                                    ]}
                                    activeOpacity={1}
                                    onPress={() => {
                                        if (rowMap[item.id]) {
                                            rowMap[item.id].closeRow();
                                        }
                                        dispatch({ type: 'TOGGLE_VISIT', payload: item.id });
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.avatar,
                                            item.visited && styles.avatarVisited,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.avatarText,
                                                item.visited && styles.avatarTextVisited,
                                            ]}
                                        >
                                            {initial}
                                        </Text>
                                    </View>

                                    <View style={styles.itemInfo}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginBottom: 2,
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.itemName,
                                                    { color: colors.text },
                                                    item.visited && styles.strikethrough,
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {item.name}
                                            </Text>
                                            {item.relation ? (
                                                <View style={styles.relationBadge}>
                                                    <Text style={styles.relationText}>
                                                        {item.relation}
                                                    </Text>
                                                </View>
                                            ) : null}
                                        </View>

                                        <View
                                            style={{ flexDirection: 'row', alignItems: 'center' }}
                                        >
                                            <Ionicons
                                                name="location-outline"
                                                size={10}
                                                color="#6B7280"
                                            />
                                            <Text
                                                style={[
                                                    styles.itemAddress,
                                                    { color: colors.textMuted },
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {item.address}
                                            </Text>
                                        </View>

                                        {item.phone ? (
                                            <TouchableOpacity
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginTop: 2,
                                                }}
                                                onPress={() => callFamily(item.phone)}
                                            >
                                                <Ionicons
                                                    name="call-outline"
                                                    size={10}
                                                    color="#4F46E5"
                                                />
                                                <Text
                                                    style={[
                                                        styles.itemAddress,
                                                        {
                                                            color: '#4F46E5',
                                                            fontWeight: '600',
                                                            marginLeft: 4,
                                                        },
                                                    ]}
                                                    numberOfLines={1}
                                                >
                                                    {item.phone}
                                                </Text>
                                            </TouchableOpacity>
                                        ) : null}

                                        {item.notes ? (
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginTop: 2,
                                                }}
                                            >
                                                <Ionicons
                                                    name="document-text-outline"
                                                    size={10}
                                                    color="#D97706"
                                                />
                                                <Text
                                                    style={[
                                                        styles.itemAddress,
                                                        {
                                                            color: '#D97706',
                                                            fontStyle: 'italic',
                                                            marginLeft: 4,
                                                        },
                                                    ]}
                                                    numberOfLines={1}
                                                >
                                                    {item.notes}
                                                </Text>
                                            </View>
                                        ) : null}
                                    </View>

                                    <Ionicons
                                        name={item.visited ? 'checkmark-circle' : 'ellipse-outline'}
                                        size={20}
                                        color={item.visited ? '#10B981' : '#D1D5DB'}
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                    renderHiddenItem={(data, rowMap) => (
                        <View style={styles.rowBack}>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => {
                                    if (rowMap[data.item.id]) {
                                        rowMap[data.item.id].closeRow();
                                    }
                                    deleteFamily(data.item.id);
                                }}
                            >
                                <Ionicons name="trash" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={25}
            >
                <View style={styles.formContainerWrapper}>
                    <View
                        style={[
                            styles.bottomSheet,
                            { backgroundColor: colors.card, borderColor: colors.border },
                            !isExpanded && styles.bottomSheetCollapsed,
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.expandButton}
                            onPress={toggleForm}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.handleBar, { backgroundColor: colors.border }]} />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Ionicons
                                    name={isExpanded ? 'chevron-down' : 'add-circle'}
                                    size={15}
                                    color="#4F46E5"
                                />
                                <Text style={[styles.expandButtonText, { color: colors.primary }]}>
                                    {isExpanded ? 'Tutup Form' : 'Tambah Kunjungan Baru'}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {isExpanded && (
                            <ScrollView
                                style={styles.formContent}
                                bounces={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                <TextInput
                                    placeholder="Nama Lengkap"
                                    value={name}
                                    onChangeText={setName}
                                    style={[
                                        styles.inputFull,
                                        {
                                            backgroundColor: colors.background,
                                            borderColor: colors.border,
                                            color: colors.text,
                                        },
                                    ]}
                                    placeholderTextColor={colors.textMuted}
                                />
                                <TextInput
                                    placeholder="Alamat Lengkap"
                                    value={address}
                                    onChangeText={setAddress}
                                    style={[
                                        styles.inputFull,
                                        {
                                            marginTop: 6,
                                            backgroundColor: colors.background,
                                            borderColor: colors.border,
                                            color: colors.text,
                                        },
                                    ]}
                                    placeholderTextColor={colors.textMuted}
                                />
                                <View style={styles.rowSpacing}>
                                    <TextInput
                                        placeholder="Hubungan"
                                        value={relation}
                                        onChangeText={setRelation}
                                        style={[
                                            styles.inputHalf,
                                            {
                                                marginRight: 6,
                                                backgroundColor: colors.background,
                                                borderColor: colors.border,
                                                color: colors.text,
                                            },
                                        ]}
                                        placeholderTextColor={colors.textMuted}
                                    />
                                    <TextInput
                                        placeholder="No. Telepon"
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                        style={[
                                            styles.inputHalf,
                                            {
                                                backgroundColor: colors.background,
                                                borderColor: colors.border,
                                                color: colors.text,
                                            },
                                        ]}
                                        placeholderTextColor={colors.textMuted}
                                    />
                                </View>
                                <TextInput
                                    placeholder="Catatan Tambahan"
                                    value={notes}
                                    onChangeText={setNotes}
                                    style={[
                                        styles.inputFull,
                                        {
                                            marginTop: 6,
                                            backgroundColor: colors.background,
                                            borderColor: colors.border,
                                            color: colors.text,
                                        },
                                    ]}
                                    placeholderTextColor={colors.textMuted}
                                />

                                <TouchableOpacity
                                    style={[styles.saveButton, { backgroundColor: colors.primary }]}
                                    onPress={addFamily}
                                >
                                    <Text style={styles.saveButtonText}>Simpan Kunjungan</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },

    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    rowSpacing: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },

    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#E0E7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },

    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
    },

    subtitle: {
        fontSize: 11,
        color: '#6B7280',
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 14,
        marginBottom: 8,
    },

    statsValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },

    statsLabel: {
        fontSize: 11,
        color: '#6B7280',
        marginTop: 2,
    },

    progressBar: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },

    progressFill: {
        height: '100%',
        backgroundColor: '#4F46E5',
        borderRadius: 4,
    },

    itemWrapper: {
        paddingBottom: 8,
        paddingHorizontal: 10,
    },

    itemCard: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },

    itemCardVisited: {
        backgroundColor: '#F9FAFB',
        borderColor: '#E5E7EB',
    },

    itemInfo: {
        flex: 1,
        marginRight: 10,
        marginLeft: 10,
    },

    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },

    strikethrough: {
        textDecorationLine: 'line-through',
        color: '#9CA3AF',
    },

    itemAddress: {
        fontSize: 11,
        color: '#6B7280',
        flexShrink: 1,
        marginLeft: 4,
    },

    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },

    emptyText: {
        marginTop: 10,
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
        textAlign: 'center',
    },

    rowBack: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingBottom: 8,
        paddingHorizontal: 10,
    },

    deleteButton: {
        width: 75,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EF4444',
        borderRadius: 12,
    },

    sectionHeader: {
        paddingVertical: 6,
        backgroundColor: '#F9FAFB',
        marginBottom: 6,
        marginHorizontal: 10,
    },

    sectionHeaderText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#9CA3AF',
        textTransform: 'uppercase',
    },

    relationBadge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 6,
    },

    relationText: {
        fontSize: 9,
        color: '#4F46E5',
        fontWeight: '700',
    },

    avatar: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
    },

    avatarVisited: {
        backgroundColor: '#E5E7EB',
    },

    avatarText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#D97706',
    },

    avatarTextVisited: {
        color: '#9CA3AF',
    },

    bottomSheet: {
        width: '85%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingBottom: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },

    formContainerWrapper: {
        alignItems: 'center',
        marginBottom: 10,
    },

    bottomSheetCollapsed: {
        paddingBottom: 5,
    },

    expandButton: {
        paddingTop: 8,
        paddingBottom: 8,
        alignItems: 'center',
    },

    handleBar: {
        width: 35,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 0,
        marginBottom: 6,
    },

    expandButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4F46E5',
        marginLeft: 6,
    },

    formContent: {
        marginTop: 6,
        maxHeight: 250,
    },

    inputFull: {
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 12,
        height: 38,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        fontSize: 12,
    },

    inputHalf: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 12,
        height: 38,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        fontSize: 12,
    },

    saveButton: {
        backgroundColor: '#4F46E5',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 8,
    },

    saveButtonText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 13,
    },
});
