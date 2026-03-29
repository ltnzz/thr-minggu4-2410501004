import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from '../screens/home.screen';
import { BudgetScreen } from '../screens/budget.screen';
import { FamilyScreen } from '../screens/family.screen';
import { ItemScreen } from '../screens/item.screen';
import { useTheme } from '../hooks/use.theme';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                },

                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    if (route.name === 'Budget') iconName = focused ? 'wallet' : 'wallet-outline';
                    if (route.name === 'Item') iconName = focused ? 'checkbox' : 'checkbox-outline';
                    if (route.name === 'Family') iconName = focused ? 'people' : 'people-outline';

                    return <Ionicons name={iconName} size={size} color={color} />;
                },

                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Budget" component={BudgetScreen} />
            <Tab.Screen name="Item" component={ItemScreen} />
            <Tab.Screen name="Family" component={FamilyScreen} />
        </Tab.Navigator>
    );
};
