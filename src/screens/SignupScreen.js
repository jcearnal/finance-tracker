import React, { useState, useContext } from 'react';
import { StyleSheet, TextInput, Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';

export default function SignupScreen({ navigation }) {
  const { signUp } = useContext(AuthContext);
  const [email, setEmail]       = useState('');      // hold email input
  const [password, setPassword] = useState('');      // hold password input
  const [error, setError]       = useState('');      // display auth errors

  // called when the user taps “Sign Up”
  const handleSignup = async () => {
    try {
      // trim whitespace and attempt Firebase signup
      await signUp(email.trim(), password);
      // on success, AuthContext listener will navigate to Home
    } catch (e) {
      setError(e.message);  // show any error message returned
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Page title */}
      <Text style={styles.title}>Create Account</Text>
      {/* show signup error if any */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Email field */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        accessibilityLabel="Email input"
        accessibilityHint="Enter your email address"
      />

      {/* Password field */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        accessibilityLabel="Password input"
        accessibilityHint="Enter your account password"
      />

      {/* Trigger signup */}
      <Button
        title="Sign Up"
        onPress={handleSignup}
        accessibilityLabel="Sign up"
        accessibilityHint="Creates a new account"
      />

      {/* Link back to login */}
      <Text
        style={styles.switchText}
        onPress={() => navigation.navigate('Login')}
        accessibilityRole="button"
        accessibilityLabel="Log in"
      >
        Already have an account? Log In
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,             
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,        
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,        
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  switchText: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',    
  },
});
