import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  Button,
  Text,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';
import Logo from '../../assets/logo.png';

export default function LoginScreen({ navigation }) {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // Clear auth error when inputs change
  useEffect(() => {
    setError('');
  }, [email, password]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      // on success, AuthContext will update and navigate you away
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <Text style={styles.title}>Welcome Back</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator style={{ marginVertical: 16 }} />
      ) : (
        <View style={styles.buttonContainer}>
          {/* always enabled so we can see errors / console.log */}
          <Button
            title="Log In"
            onPress={handleLogin}
          />
        </View>
      )}

      <Text
        style={styles.switchText}
        onPress={() => navigation.navigate('Signup')}
      >
        Don't have an account? Sign Up
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:           1,
    padding:        16,
    justifyContent: 'center',
  },
  logo: {
    width:        120,
    height:       120,
    alignSelf:   'center',
    marginBottom:24,
  },
  title: {
    fontSize:    24,
    textAlign:   'center',
    marginBottom:24,
  },
  input: {
    height:            48,
    borderColor:       '#ccc',
    borderWidth:       1,
    borderRadius:      4,
    marginBottom:     12,
    paddingHorizontal: 8,
  },
  error: {
    color:        'red',
    fontSize:     12,
    marginBottom: 8,
    textAlign:    'center',
  },
  buttonContainer: {
    marginVertical: 16,
  },
  switchText: {
    textAlign: 'center',
    color:     'blue',
  },
});
