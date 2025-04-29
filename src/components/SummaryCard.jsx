import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SummaryCard({ opening, income, expense, balance }) {
  return (
    <View style={styles.card}>
      {/* Opening balance carried over */}
      <View style={styles.row}>
        <Text style={styles.label}>Opening:</Text>
        <Text style={styles.value}>${opening.toFixed(2)}</Text>
      </View>

      {/* This month’s income, formatted to two decimals */}
      <View style={styles.row}>
        <Text style={styles.label}>Income:</Text>
        <Text style={styles.value}>${income.toFixed(2)}</Text>
      </View>

      {/* This month’s expense, formatted to two decimals */}
      <View style={styles.row}>
        <Text style={styles.label}>Expense:</Text>
        <Text style={styles.value}>${expense.toFixed(2)}</Text>
      </View>

      {/* Closing balance = opening + (income - expense) */}
      <View style={[styles.row, styles.balanceRow]}>
        <Text style={styles.label}>Closing:</Text>
        <Text style={styles.value}>${balance.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius:    8,
    padding:         16,
    marginBottom:    24,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.1,
    shadowRadius:    4,
    elevation:       3,
  },
  row: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    marginBottom:    8,
  },
  label: {
    fontSize:   16,
    fontWeight: '600',
  },
  value: {
    fontSize:   16,
    fontWeight: '600',
  },
  balanceRow: {
    borderTopWidth: 1,
    borderColor:    '#eee',
    paddingTop:     8,
    marginTop:      8,
  },
});