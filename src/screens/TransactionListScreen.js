import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../utils/firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import TransactionItem from '../components/TransactionItem';

export default function TransactionListScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [txns, setTxns]                   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [monthOptions, setMonthOptions]   = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    // subscribe to user's transactions, newest first
    const txnsRef = collection(db, 'users', user.uid, 'transactions');
    const q = query(txnsRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTxns(data);
        setLoading(false);

        // build a sorted list of "YYYY-MM" strings for the month picker
        const months = Array.from(
          new Set(
            data.map(t => {
              const d = new Date(t.date);
              return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            })
          )
        ).sort((a, b) => b.localeCompare(a));

        setMonthOptions(months);
        // default to the most recent month if none selected yet
        if (!selectedMonth && months.length) {
          setSelectedMonth(months[0]);
        }
      },
      error => {
        console.error(error);
        setLoading(false);
      }
    );

    return unsubscribe; // clean up on unmount
  }, [user.uid]);

  // filter transactions to only the selected month
  const displayed = txns.filter(t => {
    if (!selectedMonth) return true;
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return key === selectedMonth;
  });

  // show loader until data arrives
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* month picker at top */}
      <Picker
        selectedValue={selectedMonth}
        onValueChange={setSelectedMonth}
        style={styles.picker}
        accessibilityLabel="Select month"
      >
        {monthOptions.map(m => {
          const [year, mon] = m.split('-');
          const label = new Date(year, mon - 1).toLocaleString('default', {
            month: 'short',
            year: 'numeric'
          });
          return <Picker.Item key={m} label={label} value={m} />;
        })}
      </Picker>

      {/* show message if no txns, otherwise list */}
      {displayed.length === 0 ? (
        <View style={styles.center}>
          <Text>No transactions this month.</Text>
        </View>
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              item={item}
              onPress={() =>
                navigation.navigate('EditTransaction', { id: item.id, data: item })
              }
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
  picker: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  center: {
    flex:           1,
    justifyContent: 'center',
    alignItems:     'center',
  },
});
