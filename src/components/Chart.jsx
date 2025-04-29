// src/components/Chart.jsx

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart, LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function Chart({ distribution, trendData }) {
  // Pie data drives slice size; legend shows Income vs Expense
  const pieData = [
    {
      name: 'Income',
      amount: distribution.income,
      color: '#2ecc71',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Expense',
      amount: distribution.expense,
      color: '#e74c3c',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  // Running balance for each of the last 6 months
  const balanceData = [];
  let cumulative = 0;
  trendData.forEach(d => {
    cumulative += d.income - d.expense;
    balanceData.push(cumulative);
  });

  // Shared config for all charts
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo:   '#fff',
    decimalPlaces:         2,
    color:                 (opacity = 1) => `rgba(0,0,0,${opacity})`,
    labelColor:            (opacity = 1) => `rgba(0,0,0,${opacity})`,
    style: { borderRadius: 8 },
  };

  return (
    <View>
      {/* This month's distribution */}
      <Text style={styles.title}>This Month</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={pieData}
          width={screenWidth - 32}
          height={180}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>
      <View style={styles.amountsContainer}>
        <Text style={styles.amountText}>Income: ${distribution.income.toFixed(2)}</Text>
        <Text style={styles.amountText}>Expense: ${distribution.expense.toFixed(2)}</Text>
      </View>

      {/* Line chart for income vs expense trends */}
      <Text style={[styles.title, { marginTop: 24 }]}>Last 6 Months</Text>
      <LineChart
        data={{
          labels: trendData.map(d => d.month),
          datasets: [
            {
              data:  trendData.map(d => d.income),
              color: (opacity = 1) => `rgba(46,204,113,${opacity})`,
            },
            {
              data:  trendData.map(d => d.expense),
              color: (opacity = 1) => `rgba(231,76,60,${opacity})`,
            },
          ],
          legend: ['Income', 'Expense'],
        }}
        width={screenWidth - 32}
        height={240}
        chartConfig={chartConfig}
        bezier
        fromZero
        yAxisLabel="$"
        style={{ borderRadius: 8 }}
      />

      {/* Bar chart for running balance; positive=green, negative=red */}
      <Text style={[styles.title, { marginTop: 24 }]}>Balance Trend</Text>
      <BarChart
        data={{
          labels: trendData.map(d => d.month),
          datasets: [
            {
              data:   balanceData,
              colors: balanceData.map(val =>
                (opacity = 1) =>
                  val >= 0
                    ? `rgba(46,204,113,${opacity})`
                    : `rgba(231,76,60,${opacity})`
              ),
            },
          ],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        fromZero
        showValuesOnTopOfBars
        withCustomBarColorFromData
        flatColor
        style={{ borderRadius: 8 }}
        yAxisLabel="$"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center', 
  },
  title: {
    fontSize:     18,
    fontWeight:   '600',
    textAlign:    'center',
    marginBottom: 8,
  },
  amountsContainer: {
    alignItems:  'center',
    marginTop:   8,
  },
  amountText: {
    fontSize:      14,
    marginVertical: 2,
    fontWeight:    '500',
  },
});
