import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Keyboard,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { Business } from '../App';
import { API_BASE } from '../constants';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// ── Google Sign-In Config placeholder ────────────────────────────────────────
// Once you get your WEB_CLIENT_ID from Firebase Console -> Project Settings
// Add it here. This is REQUIRED for both Android/iOS to work.
GoogleSignin.configure({ webClientId: '939259415099-5cbviptldnlgqncpe10dd6j9g7j88sv5.apps.googleusercontent.com' });

const { width, height } = Dimensions.get('window');

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
  const [view, setView] = useState<'initial' | 'login' | 'register'>('initial');
  const [regStep, setRegStep] = useState(0); 
  // 0: Welcome Location, 1: Search, 2: Basic Account, 3: Business Type, 4: Private/Google toggle, 5: QR Selection

  // Registration Data
  const [bizName, setBizName] = useState('');
  const [link, setLink] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [bizType, setBizType] = useState('Both'); // In Person, Remotely, Both
  const [privacyTier, setPrivacyTier] = useState('5-star'); // 5-star, 4-star
  const [qrStyle, setQrStyle] = useState('default');

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Search State (moved to top to avoid hook violation)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [ownerPhone, setOwnerPhone] = useState('');
  const searchTimeout = React.useRef<any>(null); // For debouncing

  useEffect(() => {
    const onBackPress = () => {
      if (view === 'register') {
        if (regStep === 7) {
          setRegStep(1); // Manual -> Search
          return true;
        } else if (regStep > 0) {
          setRegStep(prev => prev - 1);
          return true;
        } else {
          setView('initial');
          return true;
        }
      } else if (view === 'login') {
        setView('initial');
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [view, regStep]);

  const handleFinalRegister = () => {
    onRegister({
      id: Math.random().toString(36).substr(2, 9),
      name: bizName || 'New Business',
      ownerName: ownerName || 'Owner',
      ownerPhone: ownerPhone || 'N/A', 
      googleReviewLink: link || 'https://google.com',
      email: regEmail,
      password: regPassword,
      businessType: bizType,
      privacyTier: privacyTier,
      qrStyle: qrStyle,
    } as any);
  };

  const nextRegStep = () => setRegStep(regStep + 1);
  const prevRegStep = () => setRegStep(Math.max(0, regStep - 1));

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = (userInfo as any).data?.idToken || (userInfo as any).idToken;

      if (!idToken) throw new Error('No ID Token found. Please check Google Console configuration.');

      const response = await fetch(`${API_BASE}/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (data.newUser) {
        setRegEmail(data.email);
        setView('register');
        setRegStep(0); // Show "Help us find location" first
        Alert.alert('Google Verified', 'Verified! help us find your business on the map. 🚀');
      } else if (data.business) {
        onRegister(data.business); // Effectively logs them in
      } else if (data.error) {
        throw new Error(data.error); 
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Already in progress
      } else {
        console.error('Google Error:', error);
        Alert.alert('Google Sign-In Error', `Details: ${error.message || error.code || 'Unknown Error'}. \n\nPlease ensure your SHA-1 is saved in your Google Cloud Console and your Web Client ID is correct.`);
      }
    }
  };

  // ──── MAIN VIEWS ────

  if (view === 'initial') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.initialContent}>
            <View style={styles.illustrationWrap}>
               <View style={styles.storePlaceholder}>
                  <Text style={{fontSize: 80}}>🏪</Text>
                  <View style={styles.miniPeople}>
                    <Text style={{fontSize: 20}}>👤</Text>
                    <Text style={{fontSize: 20}}>👤</Text>
                  </View>
                  <View style={styles.miniStars}><Text style={{fontSize: 14}}>⭐⭐⭐⭐⭐</Text></View>
               </View>
            </View>
            <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin}>
               <View style={styles.googleIconBox}><Text style={styles.googleTextIcon}>G</Text></View>
               <Text style={styles.googleBtnText}>Sign in with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emailBtn} onPress={() => setView('login')}><Text style={styles.emailBtnText}>Sign in with Email</Text></TouchableOpacity>
            <TouchableOpacity style={styles.newBizBtn} onPress={() => { setView('register'); setRegStep(0); }}><Text style={styles.newBizText}>New business? Register Now</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (view === 'login') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.appTitle}>Log In</Text>
          <Text style={{color: '#888', marginTop: 10}}>Welcome back! Please enter your details.</Text>
          <View style={{height: 40}} />
          
          <Text style={styles.settingLabel}>Email Address</Text>
          <TextInput 
            style={[styles.input, {borderColor: '#ccc'}]} 
            placeholder="example@mail.com" 
            placeholderTextColor="#999"
            value={loginEmail} 
            onChangeText={setLoginEmail} 
            autoCapitalize="none" 
          />
          
          <Text style={styles.settingLabel}>Password</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput 
              style={[styles.input, {flex: 1, borderColor: '#ccc'}]} 
              placeholder="Min. 8 characters" 
              placeholderTextColor="#999"
              value={loginPassword} 
              onChangeText={setLoginPassword} 
              secureTextEntry={!showPassword} 
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{position: 'absolute', right: 15, top: 18}}>
              <Text style={{color: COLORS.primary, fontWeight: 'bold'}}>{showPassword ? 'HIDE' : 'SHOW'}</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.blackBtn} onPress={() => onLogin(loginEmail, loginPassword)}>
            <Text style={styles.whiteBtnText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{alignSelf: 'center', marginTop: 25}} onPress={() => setView('register')}>
            <Text style={{color: COLORS.primary, fontWeight: '700'}}>Don't have an account? <Text style={{textDecorationLine: 'underline'}}>Register Now</Text></Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.backBtnWrapper, {alignSelf: 'center', marginTop: 15}]} onPress={() => setView('initial')} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            <Text style={styles.backBtnText}>← Go Back</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ──── REGISTRATION STEPS ────

  // 0: Help us find your location
  if (regStep === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtnWrapper} onPress={() => setView('initial')} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Registration</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.onboardTitle}>Help us find your{'\n'}business location on{'\n'}Google map</Text>
          <Text style={styles.onboardSub}>Adding your business location on Google Map, will unlock your access to your business reputation page.</Text>
          <View style={styles.illustMiddle}><Text style={{fontSize: 100}}>📍</Text></View>
          <TouchableOpacity style={styles.blackBtn} onPress={nextRegStep}>
             <Text style={styles.whiteBtnText}>📍 Find Your Business</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }



  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    // Clear previous timeout
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (text.length > 2) {
      setIsSearching(true);
      
      // Start a 600ms timer
      searchTimeout.current = setTimeout(async () => {
        try {
          console.log(`[Search] Querying: ${text}...`);
          const res = await fetch(`${API_BASE}/business/search-places`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: text }),
          });
          const data = await res.json();
          
          if (res.ok && Array.isArray(data)) {
            setSearchResults(data);
          } else {
            setSearchResults([]);
            console.error('[Search] Error Response:', data);
          }
        } catch (e: any) {
          console.error('[Search] Networking Error:', e);
          setSearchResults([]);
          // IMPORTANT: This Alert tells you WHY the phone couldn't talk to the server
          Alert.alert('Network Error', `Could not connect to server. \n\nDetails: ${e.message}. \n\nPlease try using your Mobile Data (Jio/Airtel) if your WiFi blocks port 7500.`);
        } finally {
          setIsSearching(false);
        }
      }, 600);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleSelectBiz = (res: any) => {
    setBizName(res.name);
    setLink(res.link);
    setSearchResults([]);
    setSearchQuery(res.name);
    Keyboard.dismiss();
  };

  // 1: Name & Map Search
  if (regStep === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtnWrapper} onPress={prevRegStep} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Name of your Business</Text>
        </View>
        <View style={{padding: 20}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput 
              style={[styles.input, {flex: 1}]} 
              placeholder="Search business name..." 
              value={searchQuery} 
              onChangeText={handleSearch} 
            />
            {isSearching && (
              <ActivityIndicator style={{position: 'absolute', right: 15}} color="#000" />
            )}
          </View>
          
          {(isSearching || searchResults.length > 0) && (
            <View style={styles.suggestionBox}>
               {isSearching ? (
                 <View style={{padding: 15}}><Text style={{color: '#999'}}>Searching Google Maps...</Text></View>
               ) : (
                 searchResults.map((res, i) => (
                   <TouchableOpacity key={i} style={styles.suggestionItem} onPress={() => handleSelectBiz(res)}>
                      <Text style={styles.suggestionTitle}>{res.name}</Text>
                      <Text style={styles.suggestionSub}>{res.address || 'Select this location'}</Text>
                   </TouchableOpacity>
                 ))
               )}
            </View>
          )}

          <TouchableOpacity 
            style={{marginTop: 15, padding: 10}} 
            onPress={() => {
              setIsManualEntry(true);
              setBizName(''); 
              setLink(''); 
              setRegStep(7); // Jump to Manual Entry
            }}
          >
            <Text style={{color: COLORS.primary, fontWeight: '700', textAlign: 'center'}}>Can't find your business? Enter manually →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mapMock}>
          <Text style={styles.mapText}>📍 {bizName || 'Search above to find location'}</Text>
          <Text style={styles.mapSub}>{bizName ? 'Location pinned on Map' : 'Showing nearby businesses'}</Text>
        </View>
        <TouchableOpacity style={styles.floatNext} onPress={nextRegStep}>
          <Text style={styles.whiteBtnText}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // 7: Manual Business Entry
  if (regStep === 7) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtnWrapper} onPress={() => setRegStep(1)} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Manual Entry</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.onboardTitle}>Enter your business{'\n'}details manually</Text>
          <Text style={styles.onboardSub}>We'll use these details to generate your review QR code.</Text>

          <Text style={styles.settingLabel}>Business Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Helonix Solutions" 
            value={bizName} 
            onChangeText={setBizName} 
          />

          <Text style={styles.settingLabel}>Google Review Link / Map Link</Text>
          <TextInput 
            style={[styles.input, {height: 80}]} 
            placeholder="Paste your Google map link here" 
            value={link} 
            onChangeText={setLink} 
            multiline
          />

          <Text style={styles.settingLabel}>Business Phone Number</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. +91 99997 28733" 
            value={ownerPhone} 
            onChangeText={setOwnerPhone} 
            keyboardType="phone-pad"
          />

          <TouchableOpacity 
            style={[styles.blackBtn, {marginTop: 20}]} 
            onPress={() => {
              if(!bizName || !link) {
                 Alert.alert('Missing Info', 'Please enter at least the Business Name and Map Link.');
                 return;
              }
              setRegStep(2); // Continue to Business Type
            }}
          >
            <Text style={styles.whiteBtnText}>Save & Continue →</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 2: Type of your business
  if (regStep === 2) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtnWrapper} onPress={prevRegStep} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Business Type</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.onboardSub}>Type of your business</Text>
          <Text style={styles.onboardTitle}>How do you serve your{'\n'}customers at{'\n'}{bizName || 'your Business'}?</Text>
          
          <TouchableOpacity style={[styles.choiceBtn, bizType === 'In Person' && styles.choiceActive]} onPress={() => setBizType('In Person')}>
            <Text style={styles.choiceLabel}>In Person</Text><Text style={{fontSize: 30}}>🏪</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.choiceBtn, bizType === 'Remotely' && styles.choiceActive]} onPress={() => setBizType('Remotely')}>
            <Text style={styles.choiceLabel}>Remotely</Text><Text style={{fontSize: 30}}>📱</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.choiceBtn, bizType === 'Both' && styles.choiceActive]} onPress={() => setBizType('Both')}>
            <Text style={styles.choiceLabel}>Both</Text><Text style={{fontSize: 30}}>🔄</Text>
          </TouchableOpacity>

          <View style={{height: 100}} />
          <TouchableOpacity style={styles.blackBtn} onPress={nextRegStep}><Text style={styles.whiteBtnText}>Next</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 3: Privacy Choices (Welcome Yto Style)
  if (regStep === 3) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtnWrapper} onPress={prevRegStep} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Privacy Settings</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.onboardSub}>Welcome {ownerName || 'User'}</Text>
          <Text style={styles.onboardTitle}>All reviews stay private in Review Boost!</Text>
          <Text style={styles.onboardSub}>Choose what to share on {'\n'}<Text style={{color: '#4285F4'}}>G</Text><Text style={{color: '#EA4335'}}>o</Text><Text style={{color: '#FBBC05'}}>o</Text><Text style={{color: '#4285F4'}}>g</Text><Text style={{color: '#34A853'}}>l</Text><Text style={{color: '#EA4335'}}>e</Text></Text>

          <TouchableOpacity 
            style={[styles.settingCard, (privacyTier === '5-star' || privacyTier === '4-star') && styles.choiceActive]} 
            onPress={() => setPrivacyTier('5-star')} 
            activeOpacity={0.7}
          >
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <View>
                <Text style={styles.settingLabel}>5-star reviews only</Text>
                <Text style={{fontSize: 20}}>⭐⭐⭐⭐⭐</Text>
              </View>
              <View style={[styles.checkbox, (privacyTier === '5-star' || privacyTier === '4-star') && styles.checkboxChecked]}>
                {(privacyTier === '5-star' || privacyTier === '4-star') && <Text style={{color: '#fff', fontSize: 12}}>✓</Text>}
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingCard, privacyTier === '4-star' && styles.choiceActive]} 
            onPress={() => setPrivacyTier(privacyTier === '4-star' ? '5-star' : '4-star')} 
            activeOpacity={0.7}
          >
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <View>
                <Text style={styles.settingLabel}>4-star reviews</Text>
                <Text style={{fontSize: 20}}>⭐⭐⭐⭐</Text>
              </View>
              <View style={[styles.checkbox, privacyTier === '4-star' && styles.checkboxChecked]}>
                {privacyTier === '4-star' && <Text style={{color: '#fff', fontSize: 12}}>✓</Text>}
              </View>
            </View>
          </TouchableOpacity>



          <View style={{height: 100}} />
          <TouchableOpacity style={styles.blackBtn} onPress={nextRegStep}><Text style={styles.whiteBtnText}>Next</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 4: Account Creation (Bridge)
  if (regStep === 4) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtnWrapper} onPress={prevRegStep} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Account Creation</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.onboardTitle}>Create your account</Text>
          <Text style={styles.onboardSub}>Enter your details to manage your business profile.</Text>

          <Text style={styles.settingLabel}>Full Name</Text>
          <TextInput style={styles.input} placeholder="e.g. John Doe" value={ownerName} onChangeText={setOwnerName} />

          <Text style={styles.settingLabel}>Email Address</Text>
          <TextInput style={styles.input} placeholder="name@company.com" value={regEmail} onChangeText={setRegEmail} autoCapitalize="none" keyboardType="email-address" />

          <Text style={styles.settingLabel}>Create Password</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput 
              style={[styles.input, {flex: 1}]} 
              placeholder="At least 8 characters" 
              value={regPassword} 
              onChangeText={setRegPassword} 
              secureTextEntry={!showPassword} 
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{position: 'absolute', right: 15, top: 18}}>
              <Text style={{color: COLORS.primary, fontWeight: 'bold'}}>{showPassword ? 'HIDE' : 'SHOW'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.settingLabel}>Google Review Link</Text>
          <TextInput 
            style={[styles.input, {backgroundColor: '#f9f9f9', color: '#666'}]} 
            placeholder="Auto-filled from Google Maps" 
            value={link} 
            onChangeText={setLink} 
            multiline
            numberOfLines={2}
          />
          
          <TouchableOpacity style={styles.blackBtn} onPress={nextRegStep}>
            <Text style={styles.whiteBtnText}>One last step...</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 5: QR Selection
  if (regStep === 5) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtnWrapper} onPress={prevRegStep} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Select a QR code</Text>
        </View>
        <ScrollView contentContainerStyle={{padding: 20}}>
          <Text style={styles.onboardSub}>Which QR code would you like to use?</Text>
          <View style={styles.qrGrid}>
            {['default', 'hearts', 'scanme', 'beer', 'gift', 'shop'].map(style => (
               <TouchableOpacity key={style} style={[styles.qrStyleCard, qrStyle === style && styles.qrActive]} onPress={() => setQrStyle(style)}>
                  <View style={styles.qrMock}><Text style={{fontSize: 40}}>
                    {style === 'hearts' ? '❤️' : style === 'beer' ? '🍺' : style === 'shop' ? '👜' : '📱'}
                  </Text></View>
                  <Text style={styles.qrStyleLabel}>{style.toUpperCase()}</Text>
               </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.blackBtn} onPress={nextRegStep}><Text style={styles.whiteBtnText}>Confirm Design ✨</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 6: Final QR Preview & Dashboard Finish
  if (regStep === 6) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.backBtnWrapper} onPress={prevRegStep} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            <Text style={[styles.backArrow, {marginBottom: 10}]}>←</Text>
          </TouchableOpacity>
          <Text style={styles.onboardTitle}>Print or download your QR code</Text>
          <Text style={styles.onboardSub}>Let customers scan it and leave feedback for you</Text>

          <View style={[styles.finalQrCard, { backgroundColor: qrStyle === 'hearts' ? '#FFF0F5' : qrStyle === 'beer' ? '#FFF8E1' : '#fff' }]}>
             <Text style={styles.finalBizName}>{bizName || 'Review Boost User'}</Text>
             <Text style={styles.cursiveText}>Leave us a Review</Text>
             <View style={[styles.finalQrFrame, { borderColor: qrStyle === 'hearts' ? '#FF69B4' : qrStyle === 'beer' ? '#FFA000' : '#000' }]}>
                <View style={styles.frameIcon}>
                  <Text style={{fontSize: 60}}>
                    {qrStyle === 'hearts' ? '❤️' : qrStyle === 'beer' ? '🍺' : qrStyle === 'shop' ? '🛍️' : qrStyle === 'gift' ? '🎁' : '📱'}
                  </Text>
                </View>
                <View style={styles.realQrMock}>
                   <QRCode value={link || `https://google.com`} size={80} color="black" backgroundColor="white" />
                </View>
                <View style={[styles.scanMeBadge, { backgroundColor: qrStyle === 'hearts' ? '#FF69B4' : qrStyle === 'beer' ? '#FFA000' : '#000' }]}><Text style={styles.scanMeText}>SCAN ME</Text></View>
             </View>
          </View>

          <View style={{height: 60}} />
          <TouchableOpacity style={styles.blackBtn} onPress={handleFinalRegister}>
            <Text style={styles.whiteBtnText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { padding: 32, flexGrow: 1, paddingTop: 60 },
  initialContent: { flex: 1, padding: 32, justifyContent: 'center', alignItems: 'center' },
  illustrationWrap: { marginBottom: 60, alignItems: 'center' },
  storePlaceholder: { width: 200, height: 200, borderRadius: 20, backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  miniPeople: { position: 'absolute', bottom: 10, flexDirection: 'row', gap: 40 },
  miniStars: { position: 'absolute', top: 50 },
  
  googleBtn: { width: '100%', height: 60, borderRadius: 30, borderWidth: 1.5, borderColor: '#eee', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  googleIconBox: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 12, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2 },
  googleTextIcon: { fontSize: 18, fontWeight: '900', color: '#4285F4' },
  googleBtnText: { fontSize: 16, fontWeight: '700', color: '#333' },
  
  emailBtn: { width: '100%', height: 60, borderRadius: 30, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emailBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  
  newBizBtn: { marginTop: 10 },
  newBizText: { color: COLORS.primary, fontWeight: '600' },

  appTitle: { fontSize: 32, fontWeight: '800', color: COLORS.darkGray },
  onboardTitle: { fontSize: 28, fontWeight: '800', color: '#000', lineHeight: 36, marginBottom: 12 },
  onboardSub: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 30 },
  illustMiddle: { flex: 1, alignItems: 'center', justifyContent: 'center', marginVertical: 40 },

  blackBtn: { width: '100%', height: 60, borderRadius: 30, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  whiteBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  backBtn: { marginTop: 24, alignSelf: 'center' },
  backBtnText: { color: COLORS.mediumGray, fontWeight: '600' },
  
  input: { borderWidth: 1.5, borderColor: '#eee', borderRadius: 12, padding: 18, fontSize: 16, backgroundColor: '#fff', color: '#000', marginBottom: 16 },
  
  headerRow: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  backArrow: { fontSize: 24, fontWeight: '700', color: '#000' },
  backBtnWrapper: { padding: 10, marginLeft: -10 },
  headerLabel: { fontSize: 18, fontWeight: '800' },
  
  mapMock: { flex: 1, backgroundColor: '#eef4ff', alignItems: 'center', justifyContent: 'center' },
  mapText: { fontSize: 18, fontWeight: '700', color: '#0066FF' },
  mapSub: { fontSize: 12, color: '#999', marginTop: 10 },
  floatNext: { position: 'absolute', bottom: 40, alignSelf: 'center', width: width - 60, height: 60, borderRadius: 30, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  
  choiceBtn: { width: '100%', height: 80, borderRadius: 16, borderWidth: 2, borderColor: '#eee', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 },
  choiceActive: { borderColor: '#000' },
  choiceLabel: { fontSize: 18, fontWeight: '700', color: '#666' },
  
  settingCard: { width: '100%', padding: 25, borderRadius: 24, borderWidth: 2, borderColor: '#eee', marginBottom: 20 },
  settingLabel: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#000', borderColor: '#000' },
  
  qrGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginBottom: 40 },
  qrStyleCard: { width: (width - 70) / 2, height: 160, borderRadius: 20, borderWidth: 2, borderColor: '#eee', alignItems: 'center', justifyContent: 'center' },
  qrActive: { borderColor: COLORS.primary },
  qrMock: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  qrStyleLabel: { fontSize: 10, fontWeight: '800', color: '#aaa' },

  // Final QR Style
  finalQrCard: { 
    backgroundColor: '#fff', borderRadius: 32, padding: 32, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10,
    borderWidth: 1.5, borderColor: '#f0f0f0' 
  },
  finalBizName: { fontSize: 20, fontWeight: '800', color: '#333', marginBottom: 12 },
  cursiveText: { fontSize: 28, fontStyle: 'italic', fontFamily: 'serif', color: '#444', marginBottom: 24 },
  finalQrFrame: { width: 140, height: 200, borderWidth: 3, borderColor: '#000', borderRadius: 20, padding: 15, alignItems: 'center', justifyContent: 'flex-start' },
  frameIcon: { marginBottom: 10 },
  realQrMock: { padding: 5, backgroundColor: '#fff', borderWidth: 1 },
  scanMeBadge: { backgroundColor: '#000', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 4, marginTop: 15 },
  scanMeText: { color: '#fff', fontSize: 12, fontWeight: '900' },

  suggestionBox: { position: 'absolute', top: 60, left: 0, right: 0, backgroundColor: '#fff', borderRadius: 12, elevation: 20, shadowColor: '#000', shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.3, shadowRadius: 15, zIndex: 9999, borderWidth: 1, borderColor: '#ddd' },
  suggestionItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  suggestionTitle: { fontSize: 16, fontWeight: '700', color: '#000' },
  suggestionSub: { fontSize: 12, color: '#999', marginTop: 4 },
});
