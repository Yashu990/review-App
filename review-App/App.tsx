/**
 * Review Boost App - Main Entry Point (Connected to Backend)
 */

import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Alert,
  BackHandler,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import { DashboardScreen } from './screens/DashboardScreen';
import { QRCodesScreen } from './screens/QRCodesScreen';
import { ReviewsScreen } from './screens/ReviewsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { CustomerReviewScreen } from './screens/CustomerReviewScreen';
import { LoginScreen } from './screens/LoginScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { ReferralScreen } from './screens/ReferralScreen';
import { LegalScreen } from './screens/LegalScreen';
import { API_BASE } from './constants';

const COLORS = {
  primary: '#0066FF',
  white: '#FFFFFF',
};

// Types
export interface Business {
  id: string;
  name: string;
  ownerName: string;
  ownerPhone: string;
  googleReviewLink: string;
  email?: string;
  password?: string;
  logo?: string;
  referralCode?: string;
  referralCount?: number;
  plan?: string;
  businessType?: string;
  privacyTier?: string;
  qrStyle?: string;
  points?: number;
  credits?: number;
  createdAt?: string;
}

export interface PrivateReview {
  id: string;
  businessId: string;
  customerName: string;
  customerPhone: string;
  comment: string;
  rating: number;
  timestamp: number;
}

export function isTrialExpired(business?: Business): { expired: boolean; daysLeft: number } {
  if (!business || business.plan !== 'Free Trial') return { expired: false, daysLeft: 7 };
  
  const createdDate = business.createdAt ? new Date(business.createdAt) : new Date();
  const now = new Date();
  const diffTime = now.getTime() - createdDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, 7 - diffDays);
  
  return {
    expired: daysLeft <= 0,
    daysLeft: daysLeft
  };
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  
  // Data State
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [privateReviews, setPrivateReviews] = useState<PrivateReview[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  // Initial Sync from Backend
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const stored = await AsyncStorage.getItem('isLoggedIn');
        const storedBiz = await AsyncStorage.getItem('activeBusinessId');
        const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');

        // Only show onboarding if the user has NEVER completed it before
        if (hasOnboarded !== 'true') {
          setShowOnboarding(true); 
        }

        if (stored === 'true' && storedBiz) {
          setIsLoggedIn(true);
          setSelectedBusinessId(storedBiz);
          fetchData(storedBiz);
        }
      } catch (e) {
        console.error('Auth check error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleFinishOnboarding = async () => {
    setShowOnboarding(false);
    await AsyncStorage.setItem('hasOnboarded', 'true');
  };

  const fetchData = async (bizId: string) => {
    try {
      const bizRes = await fetch(`${API_BASE}/business/${bizId}`);
      if (bizRes.ok) {
        const data = await bizRes.json();
        setBusinesses([{ id: bizId, ...data }]);
        Alert.alert("Sync Complete", `Found ${data.credits ?? 0} Credits on Server.`);
      } else {
        Alert.alert("Sync Error", "Server returned an error. Check your connection.");
      }
      const revRes = await fetch(`${API_BASE}/reviews/business/${bizId}`);
      if (revRes.ok) {
        const data = await revRes.json();
        setPrivateReviews(data.map((r: any) => ({ ...r, id: r.id, timestamp: new Date(r.createdAt).getTime() })));
      }
    } catch (e) {
      console.log('Sync error:', e);
      Alert.alert("Sync Failed", "Could not connect to the server.");
    }
  };

  const handleRegisterBusiness = async (business: Business) => {
    try {
      const payload = {
        ...business,
        email: (business.email || '').toLowerCase().trim(),
      };
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        const bizId = String(data.business.id);
        setBusinesses([{ ...payload, id: bizId }]);
        setSelectedBusinessId(bizId);
        setIsLoggedIn(true);
        setCurrentScreen('dashboard');
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('activeBusinessId', bizId);
      } else {
        Alert.alert('Registration Failed', data.error || 'Please try again.');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not connect to server. Check your internet.');
    }
  };

  const handleLogin = async (email: string, pass: string) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password: pass }),
      });
      const data = await res.json();
      if (res.ok) {
        const bizId = String(data.business.id);
        setBusinesses([{ ...data.business, id: bizId }]);
        setSelectedBusinessId(bizId);
        setIsLoggedIn(true);
        setCurrentScreen('dashboard');
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('activeBusinessId', bizId);
        fetchData(bizId);
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid email or password.');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not connect to server. Check your internet.');
    }
  };

  const handleUpdateProfile = async (updatedBiz: Business) => {
    try {
      const res = await fetch(`${API_BASE}/business/${updatedBiz.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBiz),
      });
      if (res.ok) {
        setBusinesses([updatedBiz]);
      } else {
        throw new Error('Failed to update');
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setCurrentScreen('dashboard');
    await AsyncStorage.clear();
  };

  const handleReset = async () => {
    setIsLoggedIn(false);
    setCurrentScreen('dashboard');
    setShowOnboarding(true);
    await AsyncStorage.clear();
  };

  // ── Handle Hardware Back Button (Android) ──
  useEffect(() => {
    const backAction = () => {
      if (currentScreen !== 'dashboard' && currentScreen !== 'login') {
        setCurrentScreen('dashboard');
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [currentScreen]);

  const renderScreen = () => {
    if (isLoading) {
      return null;
    }

    if (showOnboarding) {
       return <OnboardingScreen onFinish={handleFinishOnboarding} />;
    }

    if (!isLoggedIn) {
      return <LoginScreen onRegister={handleRegisterBusiness} onLogin={handleLogin} />;
    }

    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen 
          business={businesses[0]}
          reviews={privateReviews} 
          onScreenChange={setCurrentScreen} 
          logo={businesses[0]?.logo}
          onRefresh={() => fetchData(selectedBusinessId!)}
        />;
      case 'qrcodes':
        return <QRCodesScreen 
          businesses={businesses}
          onSelectBusiness={(id) => {
            setSelectedBusinessId(id);
            setCurrentScreen('customer_review');
          }}
          onScreenChange={setCurrentScreen} 
        />;
      case 'reviews':
        return <ReviewsScreen 
          reviews={privateReviews} 
          businesses={businesses}
          onScreenChange={setCurrentScreen}
          onRefresh={() => fetchData(selectedBusinessId!)}
        />;
      case 'settings':
        return <SettingsScreen 
          business={businesses[0]} 
          onLogout={handleLogout}
          onReset={handleReset}
          onScreenChange={setCurrentScreen}
          onUpdateBusiness={handleUpdateProfile}
        />;
      case 'referral':
        return <ReferralScreen 
          business={businesses[0]}
          onScreenChange={setCurrentScreen}
        />;
      case 'customer_review':
        const activeBiz = businesses.find(b => b.id === selectedBusinessId) || businesses[0];
        
        // Safety check to prevent crash if businesses list is empty
        if (!activeBiz) {
          return <DashboardScreen onScreenChange={setCurrentScreen} reviews={privateReviews} />;
        }

        return <CustomerReviewScreen 
          businessName={activeBiz.name || 'Your Business'}
          googleReviewLink={activeBiz.googleReviewLink || ''}
          privacyTier={activeBiz.privacyTier || '5-star'}
          onGoBack={() => setCurrentScreen('qrcodes')}
          onSubmitPrivateReview={async (data) => {
            try {
              const res = await fetch(`${API_BASE}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, businessId: selectedBusinessId || activeBiz.id }),
              });
              if (res.ok) {
                Alert.alert('Success', 'Feedback sent successfully!');
                setCurrentScreen('qrcodes');
                fetchData(selectedBusinessId || activeBiz.id);
              }
            } catch (e) {
              Alert.alert('Error', 'Failed to send feedback');
            }
          }}
        />;
      case 'legal_privacy':
        return <LegalScreen type="privacy" onBack={() => setCurrentScreen('settings')} />;
      case 'legal_about':
        return <LegalScreen type="about" onBack={() => setCurrentScreen('settings')} />;
      default:
        return <DashboardScreen 
          business={businesses[0]}
          reviews={privateReviews} 
          onScreenChange={setCurrentScreen} 
          logo={businesses[0]?.logo}
        />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      {renderScreen()}
    </SafeAreaProvider>
  );
}

export default App;
