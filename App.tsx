/**
 * ShopReviews Pro - Main App Navigation
 * Collect & analyze customer feedback
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DashboardScreen } from './screens/DashboardScreen';
import { QRCodesScreen } from './screens/QRCodesScreen';
import { ReviewsScreen } from './screens/ReviewsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const COLORS = {
  primary: '#0066FF',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#999999',
  darkGray: '#333333',
  lightBorder: '#E8E8E8',
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  const handleLogin = (email: string, password: string) => {
    // Simulate login - in real app, validate credentials with backend
    if (email && password) {
      setIsLoggedIn(true);
      setCurrentScreen('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('dashboard');
  };

  const handleScreenChange = (screen: string) => {
    setCurrentScreen(screen);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      {isLoggedIn ? (
        currentScreen === 'dashboard' ? (
          <DashboardScreen onLogout={handleLogout} onScreenChange={handleScreenChange} />
        ) : currentScreen === 'qrcodes' ? (
          <QRCodesScreen onLogout={handleLogout} onScreenChange={handleScreenChange} />
        ) : currentScreen === 'reviews' ? (
          <ReviewsScreen onLogout={handleLogout} onScreenChange={handleScreenChange} />
        ) : currentScreen === 'settings' ? (
          <SettingsScreen onLogout={handleLogout} onScreenChange={handleScreenChange} />
        ) : (
          <DashboardScreen onLogout={handleLogout} onScreenChange={handleScreenChange} />
        )
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </SafeAreaProvider>
  );
}

function LoginScreen({ onLogin }: { onLogin: (email: string, password: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin(email, password);
  };

  const handleGoogleLogin = () => {
    // Handle Google login
    console.log('Google login pressed');
  };

  const handleForgotPassword = () => {
    // Handle forgot password
    console.log('Forgot password pressed');
  };

  const handleSignUp = () => {
    // Handle sign up navigation
    console.log('Sign up pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>💬</Text>
          </View>
          <Text style={styles.appTitle}>ShopReviews Pro</Text>
          <Text style={styles.appSubtitle}>Collect & analyze customer feedback</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Email/Phone Input */}
          <TextInput
            style={styles.input}
            placeholder="Phone Number or Email"
            placeholderTextColor={COLORS.mediumGray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable
          />

          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.mediumGray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Login →</Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerSection}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signUpSection}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Legal Text */}
        <View style={styles.legalSection}>
          <Text style={styles.legalText}>
            By logging in, you agree to our{' '}
            <Text style={styles.legalLink}>Terms</Text> and{' '}
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </Text>
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 35,
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
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 8,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.mediumGray,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.darkGray,
    backgroundColor: COLORS.lightGray,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    textAlign: 'center',
  },
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.lightBorder,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: COLORS.mediumGray,
    fontWeight: '400',
  },
  googleButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EA4335',
    marginRight: 8,
  },
  googleText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  signUpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  signUpText: {
    fontSize: 14,
    color: COLORS.mediumGray,
    fontWeight: '400',
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  legalSection: {
    marginTop: 'auto',
  },
  legalText: {
    fontSize: 12,
    color: COLORS.mediumGray,
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    color: COLORS.mediumGray,
    textDecorationLine: 'underline',
  },
});

export default App;
