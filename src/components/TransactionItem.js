import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

export default function TransactionItem({ item, onPress }) {
  // format ISO date string to locale date
  const date = new Date(item.date).toLocaleDateString();

  return (
    // tap row to edit/delete this transaction
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.row}>
        {/* show plus or minus with two-decimal formatting */}
        <Text
          style={[
            styles.amount,
            item.type === 'income' ? styles.income : styles.expense
          ]}
        >
          {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      {/* transaction details */}
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.category}>{item.category}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  amount: {
    fontSize: 16,
    fontWeight: '600'
  },
  income: {
    color: 'green'  // income in green
  },
  expense: {
    color: 'red'    // expense in red
  },
  date: {
    fontSize: 14,
    color: '#666'
  },
  description: {
    marginTop: 4,
    fontSize: 14
  },
  category: {
    marginTop: 2,
    fontSize: 12,
    color: '#888'
  }
});
