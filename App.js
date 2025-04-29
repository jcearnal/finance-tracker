import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet }               from 'react-native';
import { NavigationContainer }                                from '@react-navigation/native';
import { createNativeStackNavigator }                         from '@react-navigation/native-stack';
import { SafeAreaProvider }                                   from 'react-native-safe-area-context';

import { AuthProvider, AuthContext }                          from './src/contexts/AuthContext';
import { CategoryProvider }                                   from './src/contexts/CategoryContext';

import LoginScreen           from './src/screens/LoginScreen';
import SignupScreen          from './src/screens/SignupScreen';
import HomeScreen            from './src/screens/HomeScreen';
import AddTransactionScreen  from './src/screens/AddTransactionScreen';
import TransactionListScreen from './src/screens/TransactionListScreen';
import SearchScreen          from './src/screens/SearchScreen';
import EditTransactionScreen from './src/screens/EditTransactionScreen';
import CategoriesScreen      from './src/screens/CategoriesScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, initializing } = useContext(AuthContext);

  // while we’re checking auth state, show a full-screen loader
  if (initializing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // once we know auth state, switch between protected vs. auth screens
  return (
    <Stack.Navigator>
      {user ? (
        <>
          {/* Protected routes for logged-in users */}
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Financial Planner' }} />
          <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: 'Add Transaction' }} />
          <Stack.Screen name="Transactions" component={TransactionListScreen} options={{ title: 'Transactions' }} />
          <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search Transactions' }} />
          <Stack.Screen name="EditTransaction" component={EditTransactionScreen} options={{ title: 'Edit Transaction' }} />
          <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Manage Categories' }} />
        </>
      ) : (
        <>
          {/* Login/Signup flow */}
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Sign Up' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    // wrap app in auth + category contexts
    <AuthProvider>
      <CategoryProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex:           1,
    justifyContent: 'center',
    alignItems:     'center',
  },
});
