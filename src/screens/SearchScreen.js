import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../utils/firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import TransactionItem from '../components/TransactionItem';

export default function SearchScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [txns, setTxns]         = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);

  // Subscribe to transactions
  useEffect(() => {
    const txnsRef = collection(db, 'users', user.uid, 'transactions');
    const q        = query(txnsRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTxns(data);
        setFiltered(data);
        setLoading(false);
      },
      error => {
        console.error(error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user.uid]);

  // Filter based on search input
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(txns);
    } else {
      const lower = search.toLowerCase();
      setFiltered(
        txns.filter(item =>
          item.description.toLowerCase().includes(lower) ||
          item.category.toLowerCase().includes(lower) ||
          item.amount.toString().includes(lower)
        )
      );
    }
  }, [search, txns]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by description, category, or amount"
        value={search}
        onChangeText={setSearch}
        accessibilityLabel="Search input"
        accessibilityHint="Enter a term to search transactions"
      />

      {filtered.length === 0 ? (
        <View style={styles.center}>
          <Text>No matching transactions.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              item={item}
              onPress={() => navigation.navigate('EditTransaction', { id: item.id, data: item })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    margin: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});