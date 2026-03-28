import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    LayoutAnimation,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { usePackingList } from '../hooks/use.packing';
import { useTheme } from '../hooks/use.theme';

export const ItemScreen = () => {
    const { colors } = useTheme();

    const { items, dispatch, packedItems, totalItems, packingProgress } = usePackingList();

    const [isExpanded, setIsExpanded] = useState(false);
    const [newItem, setNewItem] = useState('');

    const toggleForm = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };

    const addItem = () => {
        if (!newItem.trim()) return;

        const itemBaru = {
            id: Date.now().toString(),
            name: newItem,
            checked: false,
        };
        dispatch({ type: 'ADD_ITEM', payload: itemBaru });
        setNewItem('');
        toggleForm();
    };

    const deleteItem = (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        dispatch({ type: 'DELETE_ITEM', payload: id });
    };

    const toggleItem = (id) => {
        dispatch({ type: 'TOGGLE_ITEM', payload: id });
    };

    const unvisitedData = items.filter((i) => !i.checked);
    const visitedData = items.filter((i) => i.checked);

    const sectionData = [
        {
            title: `Belum Packing (${unvisitedData.length})`,
            iconName: 'time',
            iconColor: '#F59E0B',
            data: unvisitedData,
        },
        {
            title: `Sudah Packing (${visitedData.length})`,
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
                            <Ionicons name="briefcase-outline" size={18} color="#4F46E5" />
                        </View>
                        <View>
                            <Text style={[styles.title, { color: colors.text }]}>
                                Barang Bawaan
                            </Text>
                            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                                Kelola checklist barang mudik
                            </Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View>
                            <Text style={[styles.statsValue, { color: colors.text }]}>
                                {packedItems}/{totalItems}
                            </Text>
                            <Text style={[styles.statsLabel, { color: colors.textMuted }]}>
                                Barang Dikemas
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={[styles.statsValue, { color: colors.text }]}>
                                {Math.round(packingProgress || 0)}%
                            </Text>
                            <Text style={[styles.statsLabel, { color: colors.textMuted }]}>
                                Selesai
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                        <View
                            style={[styles.progressFill, { width: `${packingProgress || 0}%` }]}
                        />
                    </View>
                </View>

                <SwipeListView
                    useSectionList
                    sections={sectionData}
                    keyExtractor={(item) => item.id.toString()}
                    rightOpenValue={-60}
                    disableRightSwipe
                    closeOnRowPress
                    swipeToOpenPercent={10}
                    swipeToClosePercent={10}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons
                                name="folder-open-outline"
                                size={40}
                                color={colors.textMuted}
                            />
                            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                                Belum ada list item
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
                                size={16}
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
                        return (
                            <View style={styles.itemWrapper}>
                                <TouchableOpacity
                                    style={[
                                        styles.itemCard,
                                        { backgroundColor: colors.card },
                                        item.checked && {
                                            backgroundColor: colors.background,
                                            elevation: 0,
                                            borderColor: colors.border,
                                        },
                                    ]}
                                    activeOpacity={1}
                                    onPress={() => {
                                        // Tutup swipe row sebelum item dipindah section
                                        if (rowMap[item.id]) {
                                            rowMap[item.id].closeRow();
                                        }
                                        toggleItem(item.id);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.itemText,
                                            { color: colors.text },
                                            item.checked && styles.itemChecked,
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                    <Ionicons
                                        name={item.checked ? 'checkmark-circle' : 'ellipse-outline'}
                                        size={22}
                                        color={item.checked ? '#10B981' : '#9CA3AF'}
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
                                    deleteItem(data.item.id);
                                }}
                            >
                                <Ionicons name="trash" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>

            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={25}>
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
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons
                                    name={isExpanded ? 'chevron-down' : 'add-circle'}
                                    size={15}
                                    color="#4F46E5"
                                />
                                <Text style={[styles.expandButtonText, { color: colors.primary }]}>
                                    {isExpanded ? 'Tutup Form' : 'Tambah Barang Bawaan'}
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
                                    placeholder="Nama barang (Cth: Baju, Charger...)"
                                    value={newItem}
                                    onChangeText={setNewItem}
                                    style={[
                                        styles.inputFull,
                                        {
                                            backgroundColor: colors.background,
                                            borderColor: colors.border,
                                            color: colors.text,
                                        },
                                    ]}
                                    placeholderTextColor={colors.textMuted}
                                    autoFocus={true}
                                    onSubmitEditing={addItem}
                                />

                                <TouchableOpacity
                                    style={[styles.saveButton, { backgroundColor: colors.primary }]}
                                    onPress={addItem}
                                >
                                    <Text style={styles.saveButtonText}>Simpan Barang</Text>
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

    row: {
        flexDirection: 'row',
        alignItems: 'center',
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
        marginTop: 16,
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
        marginTop: 12,
    },

    progressFill: {
        height: '100%',
        backgroundColor: '#4F46E5',
        borderRadius: 4,
    },

    itemWrapper: {
        paddingBottom: 10,
        paddingHorizontal: 10,
    },

    itemCard: {
        backgroundColor: '#fff',
        paddingHorizontal: 14,
        height: 52,
        borderRadius: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: 'transparent',
    },

    itemText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },

    itemChecked: {
        textDecorationLine: 'line-through',
        color: '#9CA3AF',
    },

    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },

    emptyText: {
        marginTop: 12,
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
        textAlign: 'center',
    },

    rowBack: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 1,
        paddingBottom: 1,
        paddingHorizontal: 11,
    },

    deleteButton: {
        width: 80,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EF4444',
        borderRadius: 14,
    },

    sectionHeader: {
        paddingVertical: 8,
        backgroundColor: '#F9FAFB',
        marginBottom: 8,
        marginHorizontal: 10,
    },

    sectionHeaderText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#9CA3AF',
        textTransform: 'uppercase',
    },

    formContainerWrapper: {
        alignItems: 'center',
        marginBottom: 10,
    },

    bottomSheet: {
        width: '85%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        elevation: 5,
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
