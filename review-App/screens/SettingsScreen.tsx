import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
  Linking,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RazorpayCheckout from 'react-native-razorpay';
import { Business } from '../App';

const API_BASE_URL = 'http://103.142.175.170:7500';
const RAZORPAY_KEY_ID = 'rzp_live_lqNwjPz8cC76Fx';

const COLORS = {
  primary: '#0066FF',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#999999',
  darkGray: '#333333',
  lightBorder: '#E8E8E8',
  backgroundColor: '#F2F5FB',
  success: '#4CAF50',
  gold: '#FFD700',
  premium: '#6C4AB6',
};

// ── Contact details — change these to yours ──────────────────────────────────
const CONTACT_PHONE    = '+918888888888'; // Your WhatsApp / support number
const CONTACT_WA_MSG   = 'Hi! I need help with Review Boost app.';
const TERMS_URL        = 'https://reviewboost.in/terms'; // Your terms URL
const PLAY_STORE_URL   = 'market://details?id=com.reviewapp'; // Your Play Store package

interface SettingsScreenProps {
  business?: Business;
  onLogout?: () => void;
  onScreenChange?: (screen: string) => void;
  onUpdateBusiness?: (business: Business) => Promise<void>;
}

export function SettingsScreen({ business, onLogout, onScreenChange, onUpdateBusiness }: SettingsScreenProps) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isUpgradeVisible, setIsUpgradeVisible]     = useState(false);
  const [loading, setLoading]                       = useState(false);

  // Form State
  const [name, setName]           = useState(business?.name || '');
  const [ownerName, setOwnerName] = useState(business?.ownerName || '');
  const [ownerPhone, setOwnerPhone] = useState(business?.ownerPhone || '');
  const [googleLink, setGoogleLink] = useState(business?.googleReviewLink || '');
  const [logoBase64, setLogoBase64] = useState(business?.logo || '');

  // ── Handlers ─────────────────────────────────────────────────────────────
  const pickImage = async () => { /* ... (keep as is) */ };
  const handleUpdate = async () => { /* ... (keep as is) */ };

  const handleRefer = async () => {
    let code = business?.referralCode;
    if (!code && business?.id) {
       try {
         const res = await fetch(`${API_BASE_URL}/api/business/${business.id}/generate-referral`, { method: 'POST' });
         if (res.ok) { const data = await res.json(); code = data.referralCode; if (onUpdateBusiness && business) await onUpdateBusiness({...business, referralCode: code}); }
       } catch (e) { Alert.alert('Error', 'Could not generate referral code.'); return; }
    }
    if (code) {
      const msg = `Hey! I'm using Review Boost. Use my code *${code}* and we both benefit! 🚀\nhttps://play.google.com/store/apps/details?id=com.reviewapp`;
      Linking.openURL(`whatsapp://send?text=${encodeURIComponent(msg)}`).catch(() => Alert.alert('Referral Code', code));
    }
  };

  const handleContactUs = () => { Linking.openURL(`whatsapp://send?phone=${CONTACT_PHONE}&text=${encodeURIComponent(CONTACT_WA_MSG)}`).catch(() => Linking.openURL(`tel:${CONTACT_PHONE}`)); };
  const openGMB = () => { Linking.openURL(business?.googleReviewLink || 'https://business.google.com').catch(() => Alert.alert('Error', 'Link failed.')); };

  const handleUpgradeSelect = async (plan: string, price: string) => {
    if (!business?.id) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    setLoading(true);
    try {
      // 1. Create a Razorpay Order through the backend
      const response = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(price),
          receipt: `upgrade_plan_${business.id}_${Date.now()}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.description || errorData.details || 'Failed to create payment order');
      }

      const orderData = await response.json();

      // 2. Options for Razorpay Checkout
      const options = {
        description: `Upgrade to ${plan} Plan`,
        image: business.logo || 'https://reviewboost.in/logo.png', // Fallback Logo
        currency: orderData.currency,
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        name: 'Review Boost',
        order_id: orderData.id,
        prefill: {
          email: business.email || '',
          contact: business.ownerPhone || '',
          name: business.ownerName || ''
        },
        theme: { color: COLORS.primary }
      };

      // 3. Open Razorpay Checkout
      RazorpayCheckout.open(options).then(async (data: any) => {
        // 4. Verify Payment on Success
        const verifyRes = await fetch(`${API_BASE_URL}/api/payments/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: data.razorpay_order_id,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature,
            businessId: business.id,
            planName: plan
          }),
        });

        const verifyData = await verifyRes.json();
        
        if (verifyData.success) {
          Alert.alert('Success', `Welcome to the ${plan} plan! 🚀`, [
            { text: 'Awesome', onPress: () => {
              if (onUpdateBusiness) onUpdateBusiness(verifyData.business);
              setIsUpgradeVisible(false);
            }}
          ]);
        } else {
          Alert.alert('Error', 'Payment verification failed');
        }
      }).catch((error: any) => {
        // Handle failure
        console.log('Razorpay Error:', error);
        Alert.alert('Error', `Payment failed: ${error.description || error.message || 'Cancelled'}`);
      });

    } catch (error: any) {
      console.error('Payment Error:', error);
      Alert.alert('Error', error.message || 'Could not initiate payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* ── Profile Header ── */}
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.avatarContainer} onPress={() => setIsEditModalVisible(true)}>
            {business?.logo ? ( <Image source={{ uri: business.logo }} style={styles.avatarImage} /> ) : ( <Text style={styles.avatarText}>{business?.name?.charAt(0) || '?'}</Text> )}
            <View style={styles.cameraBadge}><Text style={styles.cameraEmoji}>📸</Text></View>
          </TouchableOpacity>
          <Text style={styles.businessName}>{business?.name || 'Your Business'}</Text>
          <Text style={styles.ownerSubtitle}>{business?.ownerPhone || ''}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}><Text style={styles.editButtonText}>🖊️  Edit Profile</Text></TouchableOpacity>
        </View>

        {/* ── Subscription Plan Card ── */}
        <View style={styles.planCard}>
           <View>
              <Text style={styles.planLabel}>Current Plan</Text>
              <View style={styles.planBadge}>
                 <Text style={styles.planName}>{business?.plan || 'Free Trial'}</Text>
              </View>
           </View>
           <TouchableOpacity style={styles.upgradeBtn} onPress={() => setIsUpgradeVisible(true)}>
              <Text style={styles.upgradeBtnText}>Upgrade Now 🚀</Text>
           </TouchableOpacity>
        </View>

        {/* ── Referral Stats Card (Horizontal) ── */}
        {business?.referralCode && (
          <View style={styles.referralCard}>
            <View style={styles.referralRow}>
              <View style={styles.referralBox}>
                <Text style={styles.referralBoxLabel}>Your Code</Text>
                <Text style={styles.referralBoxCode}>{business.referralCode}</Text>
              </View>
              <View style={styles.refDivider} />
              <View style={styles.referralBox}>
                <Text style={styles.referralBoxLabel}>Total Referrals</Text>
                <Text style={styles.referralBoxCount}>{business.referralCount ?? 0}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ── Programs and Products ── */}
        <Text style={styles.sectionLabel}>Programs and Products</Text>
        <View style={styles.menuSection}>
          <MenuItem icon="📊" label="See Your GMB Report"      onPress={openGMB} />
          <MenuItem icon="🎁" label="Refer & Earn"             onPress={handleRefer} />
          <MenuItem icon="🖨️" label="Activate Your Physical QR" onPress={() => onScreenChange?.('qrcodes')} />
        </View>

        {/* ── Support & Info ── */}
        <Text style={styles.sectionLabel}>Others</Text>
        <View style={styles.menuSection}>
          <MenuItem icon="📞" label="Contact Us"            onPress={handleContactUs} />
          <MenuItem icon="📋" label="Terms and Conditions"  onPress={() => Linking.openURL(TERMS_URL)} />
          <MenuItem icon="🔄" label="Update App"            onPress={() => Linking.openURL(PLAY_STORE_URL)} last />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutBtnText}>🚪  Log Out Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── MODAL: Upgrade Plans ── */}
      <Modal visible={isUpgradeVisible} animationType="fade" transparent>
         <View style={styles.upgradeOverlay}>
            <View style={styles.upgradeModal}>
               <View style={styles.upgradeHeader}>
                  <Text style={styles.upgradeTitle}>Choose Your Plan</Text>
                  <TouchableOpacity onPress={() => setIsUpgradeVisible(false)}><Text style={styles.closeX}>✕</Text></TouchableOpacity>
               </View>
               <PlanItem name="Free Trial" price="0"    features={['5 Private Captures', 'Basic QR Code']} onPress={() => setIsUpgradeVisible(false)} />
               <PlanItem name="Basic"    price="499"  features={['100 Captures', 'Personalized Branding']} onPress={() => handleUpgradeSelect('Basic', '499')} />
               <PlanItem name="Standard" price="999"  features={['500 Captures', 'Priority Support', 'PDF Reports']} onPress={() => handleUpgradeSelect('Standard', '999')} color={COLORS.primary} popular />
               <PlanItem name="Premium"  price="1499" features={['Unlimited Captures', 'AI Auto-Reply', 'Advanced Analytics']} onPress={() => handleUpgradeSelect('Premium', '1499')} color={COLORS.premium} />
            </View>
         </View>
      </Modal>

      {/* Profile Edit Modal Logic kept from previous... */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}><Text style={styles.closeModalText}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{paddingBottom: 50}}>
               <Text style={styles.inputLabel}>Business Name</Text>
               <TextInput style={styles.input} value={name} onChangeText={setName} />
               <Text style={styles.inputLabel}>Owner Name</Text>
               <TextInput style={styles.input} value={ownerName} onChangeText={setOwnerName} />
               <Text style={styles.inputLabel}>Phone</Text>
               <TextInput style={styles.input} value={ownerPhone} onChangeText={setOwnerPhone} />
               <Text style={styles.inputLabel}>Google Link</Text>
               <TextInput style={styles.input} value={googleLink} onChangeText={setGoogleLink} />
               <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}><Text style={styles.saveBtnText}>Save Changes</Text></TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => onScreenChange?.('dashboard')}><Text style={styles.navIcon}>📊</Text><Text style={styles.navLabel}>Dashboard</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onScreenChange?.('qrcodes')}><Text style={styles.navIcon}>📱</Text><Text style={styles.navLabel}>QR Codes</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onScreenChange?.('reviews')}><Text style={styles.navIcon}>💬</Text><Text style={styles.navLabel}>Reviews</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onScreenChange?.('settings')}><Text style={[styles.navIcon, {color: COLORS.primary}]}>⚙️</Text><Text style={[styles.navLabel, {color: COLORS.primary}]}>Settings</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, onPress, last }: any) {
  return (
    <TouchableOpacity style={[styles.menuItem, last && { borderBottomWidth: 0 }]} onPress={onPress}>
      <View style={styles.menuIconBox}><Text style={styles.menuIcon}>{icon}</Text></View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
}

function PlanItem({ name, price, features, onPress, color, popular }: any) {
   return (
      <TouchableOpacity style={[styles.planItem, popular && {borderColor: COLORS.primary, borderWidth: 2}]} onPress={onPress}>
         {popular && <View style={styles.popularBadge}><Text style={styles.popularText}>BEST VALUE</Text></View>}
         <View>
            <Text style={[styles.planItemName, {color: color || COLORS.darkGray}]}>{name}</Text>
            <Text style={styles.planItemFeatures}>{features.join(' • ')}</Text>
         </View>
         <View style={styles.priceTag}>
            <Text style={styles.priceAmount}>₹{price}</Text>
            <Text style={styles.priceCycle}>/mo</Text>
         </View>
      </TouchableOpacity>
   );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundColor },
  scrollContent: { paddingBottom: 110 },
  profileHeader: { backgroundColor: COLORS.white, alignItems: 'center', paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: COLORS.lightBorder },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12, position: 'relative' },
  avatarImage: { width: 80, height: 80, borderRadius: 40 },
  avatarText: { fontSize: 32, fontWeight: '800', color: COLORS.white },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary },
  cameraEmoji: { fontSize: 14 },
  businessName: { fontSize: 18, fontWeight: '800', color: COLORS.darkGray },
  ownerSubtitle: { fontSize: 13, color: COLORS.mediumGray, marginTop: 2, marginBottom: 12 },
  editButton: { borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 16 },
  editButtonText: { color: COLORS.primary, fontWeight: '700', fontSize: 12 },

  // Subscription Plan UI
  planCard: { margin: 16, backgroundColor: COLORS.darkGray, borderRadius: 20, padding: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 6 },
  planLabel: { color: '#ffffff99', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  planBadge: { backgroundColor: '#ffffff22', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  planName: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  upgradeBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  upgradeBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 14 },

  // Referral Card
  referralCard: { backgroundColor: COLORS.white, marginHorizontal: 16, borderRadius: 16, padding: 20, marginBottom: 10, elevation: 2 },
  referralRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  referralBox: { alignItems: 'center' },
  referralBoxLabel: { fontSize: 11, color: COLORS.mediumGray, fontWeight: '600' },
  referralBoxCode: { fontSize: 20, fontWeight: '800', color: COLORS.primary, marginTop: 4 },
  referralBoxCount: { fontSize: 20, fontWeight: '800', color: COLORS.darkGray, marginTop: 4 },
  refDivider: { width: 1, height: 30, backgroundColor: COLORS.lightBorder },

  // List Menu
  sectionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.mediumGray, textTransform: 'uppercase', marginTop: 20, marginBottom: 8, marginHorizontal: 20 },
  menuSection: { backgroundColor: COLORS.white, borderRadius: 16, marginHorizontal: 16, elevation: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.lightBorder },
  menuIconBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#f0f5ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuIcon: { fontSize: 18 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.darkGray },
  menuArrow: { fontSize: 20, color: COLORS.mediumGray },
  logoutBtn: { margin: 20, padding: 16, borderRadius: 14, backgroundColor: '#FFF0F0', alignItems: 'center' },
  logoutBtnText: { color: '#FF4D4D', fontWeight: '700' },

  // Overlay
  upgradeOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  upgradeModal: { backgroundColor: '#fff', borderRadius: 28, padding: 24 },
  upgradeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  upgradeTitle: { fontSize: 22, fontWeight: '800', color: COLORS.darkGray },
  closeX: { fontSize: 24, color: COLORS.mediumGray },
  planItem: { backgroundColor: '#f9f9f9', padding: 20, borderRadius: 20, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'relative' },
  planItemName: { fontSize: 20, fontWeight: '800' },
  planItemFeatures: { fontSize: 12, color: COLORS.mediumGray, marginTop: 4 },
  priceTag: { alignItems: 'flex-end' },
  priceAmount: { fontSize: 22, fontWeight: '900', color: COLORS.darkGray },
  priceCycle: { fontSize: 12, color: COLORS.mediumGray },
  popularBadge: { position: 'absolute', top: -10, alignSelf: 'center', backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  popularText: { color: '#fff', fontSize: 10, fontWeight: '900' },

  // Bottom Nav
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, height: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  closeModalText: { fontSize: 24 },
  inputLabel: { fontWeight: '700', marginTop: 16 },
  input: { backgroundColor: COLORS.lightGray, padding: 14, borderRadius: 12, marginTop: 6 },
  saveBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, marginTop: 30, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '800' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.lightBorder, paddingVertical: 12, paddingBottom: 24 },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, color: COLORS.mediumGray, marginTop: 4, fontWeight: '600' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});
