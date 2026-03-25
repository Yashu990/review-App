import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { Business } from '../App';

const COLORS = {
  primary: '#0066FF',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#999999',
  darkGray: '#333333',
  lightBorder: '#E8E8E8',
};

interface LoginScreenProps {
  onRegister: (business: Business) => void;
  onLogin: (email: string, pass: string) => void;
}

export function LoginScreen({ onRegister, onLogin }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [bizName, setBizName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [link, setLink] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleAction = () => {
    if (isRegistering) {
      if (!bizName || !ownerName || !ownerPhone || !link || !regEmail || !regPassword) {
        Alert.alert('Incomplete Fields', 'Please provide ALL details including your account Email and Password.');
        return;
      }
      onRegister({
        id: Math.random().toString(36).substr(2, 9),
        name: bizName,
        ownerName: ownerName,
        ownerPhone: ownerPhone,
        googleReviewLink: link,
        email: regEmail,
        password: regPassword,
      });
    } else {
      if (loginEmail && loginPassword) {
        onLogin(loginEmail, loginPassword);
      } else {
        Alert.alert('Incomplete Fields', 'Please provide email and password.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>⭐</Text>
          </View>
          <Text style={styles.appTitle}>Review Boost!</Text>
          <Text style={styles.appSubtitle}>
            {isRegistering ? 'Create your business account.' : 'Login to your dashboard.'}
          </Text>
        </View>

        <View style={styles.formSection}>
          {isRegistering ? (
            <>
              <Text style={styles.sectionDivider}>Store Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Store / Business Name"
                placeholderTextColor={COLORS.mediumGray}
                value={bizName}
                onChangeText={setBizName}
              />
              <TextInput
                style={styles.input}
                placeholder="Google Review Page Link"
                placeholderTextColor={COLORS.mediumGray}
                value={link}
                onChangeText={setLink}
              />
              
              <Text style={styles.sectionDivider}>Owner Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Owner Full Name"
                placeholderTextColor={COLORS.mediumGray}
                value={ownerName}
                onChangeText={setOwnerName}
              />
              <TextInput
                style={styles.input}
                placeholder="Owner Phone Number"
                placeholderTextColor={COLORS.mediumGray}
                value={ownerPhone}
                onChangeText={setOwnerPhone}
                keyboardType="phone-pad"
              />

              <Text style={styles.sectionDivider}>Account Credentials (for Login)</Text>
              <TextInput
                style={styles.input}
                placeholder="Working Email Address"
                placeholderTextColor={COLORS.mediumGray}
                value={regEmail}
                onChangeText={setRegEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Create Password"
                placeholderTextColor={COLORS.mediumGray}
                value={regPassword}
                onChangeText={setRegPassword}
                secureTextEntry
              />
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={COLORS.mediumGray}
                value={loginEmail}
                onChangeText={setLoginEmail}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={COLORS.mediumGray}
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry
              />
            </>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleAction}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isRegistering ? 'Register & Start' : 'Log In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => setIsRegistering(!isRegistering)}
          >
            <Text style={styles.switchText}>
              {isRegistering ? 'Already have an account? Log In' : 'New business? Register Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
    paddingTop: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 40,
    color: '#FFD700',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.darkGray,
  },
  appSubtitle: {
    fontSize: 14,
    color: COLORS.mediumGray,
    marginTop: 8,
    textAlign: 'center',
  },
  formSection: {
    width: '100%',
  },
  sectionDivider: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    color: COLORS.darkGray,
    backgroundColor: COLORS.lightGray,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  switchText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
