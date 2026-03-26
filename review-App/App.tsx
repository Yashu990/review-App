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

// TO DEPLOY LIVE: Replace this IP with your server URL (e.g., https://your-app.herokuapp.com/api)
const API_BASE = 'http://192.168.1.21:5000/api';

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
      if (stored === 'true' && storedBiz) {
        setIsLoggedIn(true);
        setSelectedBusinessId(storedBiz);
        fetchData(storedBiz);
      }
    };
    checkAuthStatus();
  }, []);

  const fetchData = async (bizId: string) => {
    try {
      // 1. Fetch Business Profile
      const bizRes = await fetch(`${API_BASE}/business/${bizId}`);
      if (bizRes.ok) {
        const data = await bizRes.json();
        // Since the backend returns {name, googleReviewLink}, we merge it
        setBusinesses([{ id: bizId, ...data }]);
      }

      // 2. Fetch Reviews from Backend
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
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(business),
      });
      if (res.ok) {
        const data = await res.json();
        const bizId = data.business.id;
        setBusinesses([ { ...business, id: bizId } ]);
        setSelectedBusinessId(bizId);
        setIsLoggedIn(true);
        setCurrentScreen('dashboard');
        
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('activeBusinessId', bizId);
      } else {
        Alert.alert('Error', 'Registration failed. Email might be taken.');
      }
    } catch (e) { Alert.alert('Error', 'Could not connect to server.'); }
  };

  const handleLogin = async (email: string, pass: string) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      
      if (res.ok) {
        const data = await res.json();
        const bizId = data.business.id;
        setBusinesses([{ ...data.business, id: bizId }]);
        setSelectedBusinessId(bizId);
        setIsLoggedIn(true);
        setCurrentScreen('dashboard');
        
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('activeBusinessId', bizId);
        fetchData(bizId);
      } else {
        Alert.alert('Login Failed', 'Invalid email or password.');
      }
    } catch (e) { Alert.alert('Error', 'Could not connect to backend.'); }
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
            onGoBack={() => setCurrentScreen('dashboard')}
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
