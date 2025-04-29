# Personal Finance Tracker

A React Native app for tracking your income and expenses on the go. Users can sign up, log in, add/edit/delete transactions, view monthly summaries, visualize spending trends, manage custom categories, and search/filter past transactions. All data is persisted securely in Firebase Firestore under each authenticated user's account.

![app_screenshot](https://via.placeholder.com/400x800.png?text=Finance+Tracker+Screenshot)

## Features

- **User Authentication**  
  Email/password sign-up and log-in via Firebase Auth, with persistent sessions across restarts.

- **Add/Edit/Delete Transactions**  
  Record amounts, descriptions, categories, dates, and type (income/expense). Edit or remove entries at any time.

- **Custom Categories**  
  Manage your own categories (add, rename, delete) in Firestore under `users/{uid}/categories`, used throughout the app.

- **Monthly Summary**  
  Calculates opening balance (carry-over), current month's income, expense, and closing balance automatically.

- **Charts & Data Visualization**  
  - Pie chart for this month's income vs. expense distribution  
  - Line chart for income and expense trends over the last 6 months  
  - Bar chart for running balance trend over the last 6 months

- **Transaction List & Month Filter**  
  Browse all transactions in a sortable list, filterable by month via a dropdown.

- **Search & Filter**  
  Find past transactions by description, category, or amount in real time.

- **Protected Routes & Logout**  
  Secure screens behind auth state; logout clears session and returns to the login screen.

## Technologies Used

- **React Native** (Expo) for cross-platform mobile UI  
- **Firebase Authentication** for secure email/password auth  
- **Firebase Firestore** for real-time, user-isolated data storage  
- **react-native-chart-kit** for charts  
- **@react-native-picker/picker** for dropdowns  
- **@react-native-community/datetimepicker** for date selection  
- **React Navigation** for screen management  
- **react-native-safe-area-context** for notch/home-indicator support  

## Project Dependencies

```bash
expo
react
react-native
@react-navigation/native
@react-navigation/native-stack
firebase
react-native-chart-kit
@react-native-picker/picker
@react-native-community/datetimepicker
react-native-safe-area-context
```

## Authentication

Users must sign up with a valid email and password, then log in to access the main app. Firebase's onAuthStateChanged listener ensures auth state is tracked and routes are protected. Logging out via the "Logout" button clears the session.

## Setup and Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/finance-tracker.git
cd finance-tracker
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Configure Firebase

Create a Firebase project and enable Authentication (Email/Password) and Firestore.

Copy your Firebase config into src/utils/firebase.js:

```javascript
import { initializeApp } from 'firebase/app';

export const app = initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // …
});
```

4. Run on device or simulator

```bash
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) or press i/a to launch a simulator.

## Usage

### Sign Up
Create a new account with email and password.

### Log In
Enter your credentials to access the dashboard.

### Add Transaction
Tap Add Transaction, fill in details, then save.

### Manage Categories
From the home menu, tap Manage Categories to add, rename, or delete categories.

### View Summary & Charts
See your current month's totals and dynamic charts on the home screen.

### Browse Transactions
Tap Transactions to see all entries; use the month picker to filter.

### Search
Tap Search Transactions to filter by description, category, or amount.

### Edit/Delete
Tap any transaction in the list to update or remove it.

### Logout
Tap Logout to end your session and return to the login screen.

## Contributing

Contributions are welcome! Feel free to fork the repo, make improvements, and submit a pull request. Please:

- Follow the existing code style and folder structure.
- Comment your changes succinctly.
- Test on both iOS and Android.