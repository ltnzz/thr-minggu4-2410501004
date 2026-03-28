import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TabNavigator } from './navigation/tab.navigation';
import { BudgetProvider } from './context/budget.context';
import { PackingProvider } from './context/packing.context';
import { VisitProvider } from './context/visit.context';
import { ThemeProvider } from './context/theme.context';

export default function App() {
    return (
        <ThemeProvider>
            <BudgetProvider>
                <PackingProvider>
                    <VisitProvider>
                        <GestureHandlerRootView style={{ flex: 1 }}>
                            <NavigationContainer>
                                <TabNavigator />
                            </NavigationContainer>
                        </GestureHandlerRootView>
                    </VisitProvider>
                </PackingProvider>
            </BudgetProvider>
        </ThemeProvider>
    );
}
