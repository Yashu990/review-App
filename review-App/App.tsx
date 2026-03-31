/**
 * Review Boost App - Main Entry Point (Connected to Backend)
 */

import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Alert,
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
import { API_BASE } from './constants';

// Moved to constants.ts for central control

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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  
  // Data State
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [privateReviews, setPrivateReviews] = useState<PrivateReview[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  // Initial Sync from Backend instead of local only
  useEffect(() => {
    const checkAuthStatus = async () => {
      const stored = await AsyncStorage.getItem('isLoggedIn');
      const storedBiz = await AsyncStorage.getItem('activeBusinessId');
      const onboarded = await AsyncStorage.getItem('hasOnboarded');

      if (!onboarded) {
        setShowOnboarding(true);
      }

      if (stored === 'true' && storedBiz) {
        setIsLoggedIn(true);
        setSelectedBusinessId(storedBiz);
        fetchData(storedBiz);
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
      }
      const revRes = await fetch(`${API_BASE}/reviews/business/${bizId}`);
      if (revRes.ok) {
        const data = await revRes.json();
        setPrivateReviews(data.map((r: any) => ({ ...r, id: r.id, timestamp: new Date(r.createdAt).getTime() })));
      }
    } catch (e) {
      console.log('Sync error:', e);
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

  const renderScreen = () => {
    if (showOnboarding) {
       return <OnboardingScreen onFinish={handleFinishOnboarding} />;
    }

    // Customer Preview (internal review)
    if (currentScreen === 'customer_review' && selectedBusinessId) {
      const business = businesses[0];
      if (business) {
        return (
          <CustomerReviewScreen
            businessName={business.name}
            googleReviewLink={business.googleReviewLink}
            onSubmitPrivateReview={async (data) => {
               // Post feedback to real backend
               await fetch(`${API_BASE}/reviews`, {
                 method: 'POST',
                 headers: {'Content-Type': 'application/json'},
                 body: JSON.stringify({...data, businessId: business.id, customerPhone: data.number}),
               });
               fetchData(business.id); // Refresh owner list
            }}
            onGoBack={() => setCurrentScreen('qrcodes')}
          />
        );
      }
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
          onScreenChange={setCurrentScreen}
          onUpdateBusiness={handleUpdateProfile}
        />;
      default:
        return <DashboardScreen 
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
