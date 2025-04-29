import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../utils/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import SummaryCard from '../components/SummaryCard';
import Chart from '../components/Chart';

export default function HomeScreen({ navigation }) {
  const { user, logOut } = useContext(AuthContext);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to user's transactions in ascending order
    const ref = collection(db, 'users', user.uid, 'transactions');
    const q = query(ref, orderBy('date', 'asc'));
    const unsub = onSnapshot(
      q,
      snapshot => {
        setTxns(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      error => {
        console.error(error);
        setLoading(false);
      }
    );
    return unsub;
  }, [user.uid]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // Compute balances for summary card
  const now = new Date();
  const curM = now.getMonth(), curY = now.getFullYear();
  const monthStart = new Date(curY, curM, 1);

  const opening = txns
    .filter(t => new Date(t.date) < monthStart)
    .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);

  const thisMonth = txns.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === curM && d.getFullYear() === curY;
  });
  const income = thisMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const closing = opening + income - expense;

  // Prepare data for chart
  const trendData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(curY, curM - i, 1);
    const label = d.toLocaleString('default', { month: 'short' });
    const monthTxns = txns.filter(t => {
      const dt = new Date(t.date);
      return dt.getMonth() === d.getMonth() && dt.getFullYear() === d.getFullYear();
    });
    const inc = monthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = monthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    trendData.push({ month: label, income: inc, expense: exp });
  }

  return (
    // Skip top safe inset so nav bar sits flush under the header
    <SafeAreaView style={styles.flex} edges={['left', 'right', 'bottom']}>
      {/* Main navigation buttons */}
      <View style={styles.navBar}>
        <Button title="Add"    onPress={() => navigation.navigate('AddTransaction')} />
        <Button title="List"   onPress={() => navigation.navigate('Transactions')} />
        <Button title="Search" onPress={() => navigation.navigate('Search')} />
        <Button title="Logout" color="red" onPress={() => logOut()} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Monthly summary */}
        <SummaryCard
          opening={opening}
          income={income}
          expense={expense}
          balance={closing}
        />
        {/* Income/expense charts */}
        <Chart distribution={{ income, expense }} trendData={trendData} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  navBar: {
    flexDirection:   'row',
    justifyContent:  'space-around',
    paddingVertical: 8,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderColor:     '#ddd',
  },
  container: {
    padding:       16,
    paddingBottom: 32,
  },
  center: {
    flex:           1,
    justifyContent: 'center',
    alignItems:     'center',
  },
});