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
import { Business, isTrialExpired } from '../App';

const API_BASE_URL = 'http://103.142.175.170:7500';

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

// ── Contact details — Helonix Official ─────────────────────────────────────────
const CONTACT_PHONE_CLEAN = '919999728733'; // Without + for wa.me
const CONTACT_PHONE       = '+919999728733'; // For display/tel
const SUPPORT_EMAIL       = 'Helonixgroup@gmail.com'; 
const SUPPORT_INFO        = 'Info@helonix.com';
const CONTACT_WA_MSG      = 'Hi Helonix! I need help with Review Boost app.';
const WEBSITE_URL      = 'https://www.helonix.com';
const PLAY_STORE_URL   = 'market://details?id=com.reviewboost';

interface SettingsScreenProps {
  business?: Business;
  onLogout?: () => void;
  onReset?: () => void;
  onScreenChange?: (screen: string) => void;
  onUpdateBusiness?: (business: Business) => Promise<void>;
}

export function SettingsScreen({ business, onLogout, onReset, onScreenChange, onUpdateBusiness }: SettingsScreenProps) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isUpgradeVisible, setIsUpgradeVisible]     = useState(false);
  const [loading, setLoading]                       = useState(false);

  // Form State
  const [name, setName]           = useState(business?.name || '');
  const [ownerName, setOwnerName] = useState(business?.ownerName || '');
  const [ownerPhone, setOwnerPhone] = useState(business?.ownerPhone || '');
  const [googleLink, setGoogleLink] = useState(business?.googleReviewLink || '');
  const [logoBase64, setLogoBase64] = useState(business?.logo || '');
  const [bizType, setBizType] = useState(business?.businessType || 'Both');
  const [privacyTier, setPrivacyTier] = useState(business?.privacyTier || '5-star');
  const [qrStyle, setQrStyle] = useState(business?.qrStyle || 'default');
  const [language, setLanguage] = useState('English');
  
  const trial = isTrialExpired(business);

  // ── Sync state when prop changes ──
  React.useEffect(() => {
    if (business?.logo) setLogoBase64(business.logo);
    if (business?.name) setName(business.name);
    if (business?.ownerName) setOwnerName(business.ownerName);
    if (business?.ownerPhone) setOwnerPhone(business.ownerPhone);
    if (business?.googleReviewLink) setGoogleLink(business.googleReviewLink);
    if (business?.businessType) setBizType(business.businessType);
    if (business?.privacyTier) setPrivacyTier(business.privacyTier);
    if (business?.qrStyle) setQrStyle(business.qrStyle);
  }, [business]);

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', includeBase64: true, quality: 0.5 });
    if (result.assets && result.assets[0].base64) {
      setLogoBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleUpdate = async (overrides: Partial<Business> = {}) => {
    if (!business?.id) return;
    setLoading(true);
    try {
      const updateData = {
        name,
        ownerName,
        ownerPhone,
        googleReviewLink: googleLink,
        logo: logoBase64,
        businessType: bizType,
        privacyTier,
        qrStyle,
        ...overrides,
      };

      const response = await fetch(`${API_BASE_URL}/api/business/${business.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const data = await response.json();
        if (onUpdateBusiness) {
          await onUpdateBusiness(data.business);
        }
        Alert.alert('Success', 'Profile updated successfully! ✨');
        setIsEditModalVisible(false);
      } else {
        const err = await response.json();
        Alert.alert('Error', err.error || 'Update failed');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefer = () => {
    if (onScreenChange) onScreenChange('referral');
  };

  const handleContactUs = () => { Linking.openURL(`https://wa.me/${CONTACT_PHONE_CLEAN}?text=${encodeURIComponent(CONTACT_WA_MSG)}`).catch(() => Linking.openURL(`tel:${CONTACT_PHONE}`)); };
  const openGMB = () => { Linking.openURL(business?.googleReviewLink || 'https://business.google.com').catch(() => Alert.alert('Error', 'Link failed.')); };

  const handleUpgradeSelect = (plan: string, credits: string) => {
    const waMsg = `Hi Helonix! I want to upgrade to the *${plan}* plan (${credits} Credits) for my business: *${business?.name}*. Please send me the payment details. 🚀`;
    const waUrl = `https://wa.me/${CONTACT_PHONE_CLEAN}?text=${encodeURIComponent(waMsg)}`;
    
    Alert.alert(
      'Upgrade via WhatsApp 🚀',
      `Plan: ${plan}\nCredits: ${credits}\n\nTo upgrade, please contact us on WhatsApp or Email:\n\n📧 ${SUPPORT_EMAIL}\n📧 ${SUPPORT_INFO}\n📞 ${CONTACT_PHONE}`,
      [
        { text: 'Chat on WhatsApp 📱', onPress: () => Linking.openURL(waUrl) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
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
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            {logoBase64 ? ( <Image source={{ uri: logoBase64 }} style={styles.avatarImage} /> ) : ( <Text style={styles.avatarText}>{business?.name?.charAt(0) || '?'}</Text> )}
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
                 <Text style={styles.planName}>
                    {business?.plan || 'Free Trial'}
                    {business?.plan === 'Free Trial' && ` (${trial.expired ? 'Expired' : `${trial.daysLeft}d left`})`}
                 </Text>
              </View>
           </View>
           <TouchableOpacity style={styles.upgradeBtn} onPress={() => setIsUpgradeVisible(true)}>
              <Text style={styles.upgradeBtnText}>Upgrade Now 🚀</Text>
           </TouchableOpacity>
        </View>

        {/* ── Referral Stats Card (Horizontal) ── */}
        {business?.referralCode && (
          <TouchableOpacity 
            style={styles.referralCard} 
            onPress={() => onScreenChange?.('referral')}
          >
            <View style={styles.referralRow}>
              <View style={[styles.referralBox, {flex: 1.2}]}>
                <Text style={styles.referralBoxLabel}>Your Code</Text>
                <Text style={styles.referralBoxCode}>{business.referralCode}</Text>
              </View>
              <View style={styles.refDivider} />
              <View style={styles.referralBox}>
                <Text style={styles.referralBoxLabel}>Points (Rs)</Text>
                <Text style={[styles.referralBoxCount, {color: COLORS.success}]}>₹{business.points ?? 0}</Text>
              </View>
              <View style={styles.refDivider} />
              <View style={styles.referralBox}>
                <Text style={styles.referralBoxLabel}>Total Ref.</Text>
                <Text style={styles.referralBoxCount}>{business.referralCount ?? 0}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* ── Programs and Products ── */}
        <Text style={styles.sectionLabel}>Programs and Products</Text>
        <View style={styles.menuSection}>
          <MenuItem icon="📊" label="See Your GMB Report"      onPress={openGMB} />
          <MenuItem icon="🎁" label="Refer & Earn"             onPress={handleRefer} />
          <MenuItem icon="🖨️" label="Activate Your Physical QR" onPress={() => onScreenChange?.('qrcodes')} />
        </View>

        {/* ── Support & Info ── */}
        <Text style={styles.sectionLabel}>Support & Settings</Text>
        <View style={styles.menuSection}>
          <MenuItem icon="📞" label="Contact Helonix Support" onPress={handleContactUs} />
          <MenuItem icon="📝" label="Give Us Feedback"        onPress={() => Linking.openURL(`https://wa.me/${CONTACT_PHONE_CLEAN}?text=I have a feedback for Review Boost: `)} />
          <MenuItem icon="🌐" label="Language: English / हिन्दी" onPress={() => {
            const newLang = language === 'English' ? 'Hindi' : 'English';
            setLanguage(newLang);
            Alert.alert('Language Updated', `The app language is now set to ${newLang} (UI Updates arriving soon!)`);
          }} />
          <MenuItem icon="📋" label="Privacy Policy"         onPress={() => onScreenChange?.('legal_privacy')} />
          <MenuItem icon="ℹ️" label="About This App"         onPress={() => onScreenChange?.('legal_about')} />
          <MenuItem icon="🔄" label="Update App"            onPress={() => Linking.openURL(PLAY_STORE_URL)} last />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutBtnText}>🚪  Log Out Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.logoutBtn, {backgroundColor: '#FFF8F0', marginTop: 0}]} onPress={onReset}>
          <Text style={[styles.logoutBtnText, {color: '#E67E22'}]}>🛠️  Reset App & Setup</Text>
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
               
               <PlanItem name="Free Trial" credits="5"       features={['Private Captures', 'Basic QR Code']} onPress={() => setIsUpgradeVisible(false)} />
               <PlanItem name="Basic"      credits="100"     features={['Captures', 'Personalized Branding']} onPress={() => handleUpgradeSelect('Basic', '100')} />
               <PlanItem name="Standard"   credits="500"     features={['Captures', 'Priority Support', 'PDF Reports']} onPress={() => handleUpgradeSelect('Standard', '500')} color={COLORS.primary} popular />
               <PlanItem name="Premium"    credits="Unlimited" features={['Captures', 'AI Auto-Reply', 'Advanced Analytics']} onPress={() => handleUpgradeSelect('Premium', 'Unlimited')} color={COLORS.premium} />
               
               <View style={styles.supportBox}>
                 <Text style={styles.supportTitle}>Need Help? Contact Us:</Text>
                 <Text style={styles.supportItem}>📧 {SUPPORT_EMAIL}</Text>
                 <Text style={styles.supportItem}>📧 {SUPPORT_INFO}</Text>
                 <TouchableOpacity style={styles.waButton} onPress={() => Linking.openURL(`https://wa.me/${CONTACT_PHONE_CLEAN}?text=Hi Helonix! I need help with plan upgrade.`)}>
                    <Text style={styles.waButtonText}>Chat on WhatsApp 📱</Text>
                 </TouchableOpacity>
               </View>
            </View>
         </View>
      </Modal>

      {/* Profile Edit Modal */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}><Text style={styles.closeModalText}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{paddingBottom: 50}}>
               {/* ── Logo Picker In Modal ── */}
               <View style={{alignItems: 'center', marginBottom: 20}}>
                 <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
                   {logoBase64 ? ( <Image source={{ uri: logoBase64 }} style={styles.avatarImage} /> ) : ( <Text style={styles.avatarText}>?</Text> )}
                   <View style={styles.cameraBadge}><Text style={styles.cameraEmoji}>📸</Text></View>
                 </TouchableOpacity>
                 <Text style={{fontSize: 12, color: COLORS.mediumGray}}>Tap to change identity picture</Text>
               </View>

               <Text style={styles.inputLabel}>Business Name</Text>
               <TextInput style={styles.input} value={name} onChangeText={setName} />
               <Text style={styles.inputLabel}>Owner Name</Text>
               <TextInput style={styles.input} value={ownerName} onChangeText={setOwnerName} />
               <Text style={styles.inputLabel}>Phone</Text>
               <TextInput style={styles.input} value={ownerPhone} onChangeText={setOwnerPhone} />
               <Text style={styles.inputLabel}>Google Link</Text>
               <TextInput style={[styles.input, {height: 60}]} value={googleLink} onChangeText={setGoogleLink} multiline />

               <Text style={styles.inputLabel}>Business Type</Text>
               <View style={styles.rowChoice}>
                  {['In Person', 'Remotely', 'Both'].map(t => (
                    <TouchableOpacity key={t} style={[styles.miniBtn, bizType === t && styles.miniBtnActive]} onPress={() => setBizType(t)}><Text style={[styles.miniBtnText, bizType === t && styles.miniBtnTextActive]}>{t}</Text></TouchableOpacity>
                  ))}
               </View>

               <Text style={styles.inputLabel}>Privacy Tier (Minimum to show Google)</Text>
               <View style={styles.rowChoice}>
                  {['5-star', '4-star'].map(p => (
                    <TouchableOpacity key={p} style={[styles.miniBtn, privacyTier === p && styles.miniBtnActive]} onPress={() => setPrivacyTier(p)}><Text style={[styles.miniBtnText, privacyTier === p && styles.miniBtnTextActive]}>{p}</Text></TouchableOpacity>
                  ))}
               </View>

               <Text style={styles.inputLabel}>QR Code Style</Text>
               <View style={[styles.rowChoice, {flexWrap: 'wrap'}]}>
                  {['default', 'hearts', 'scanme', 'beer', 'gift', 'shop'].map(s => (
                    <TouchableOpacity key={s} style={[styles.miniBtn, qrStyle === s && styles.miniBtnActive, {width: '30%', marginBottom: 10}]} onPress={() => setQrStyle(s)}><Text style={[styles.miniBtnText, qrStyle === s && styles.miniBtnTextActive]}>{s}</Text></TouchableOpacity>
                  ))}
               </View>

               <TouchableOpacity style={styles.saveBtn} onPress={() => handleUpdate({
                 name, ownerName, ownerPhone, googleReviewLink: googleLink, businessType: bizType, privacyTier, qrStyle, logo: logoBase64
               })}><Text style={styles.saveBtnText}>Save Changes</Text></TouchableOpacity>
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

function PlanItem({ name, credits, features, onPress, color, popular }: any) {
   return (
      <TouchableOpacity style={[styles.planItem, popular && {borderColor: COLORS.primary, borderWidth: 2}]} onPress={onPress}>
         {popular && <View style={styles.popularBadge}><Text style={styles.popularText}>BEST VALUE</Text></View>}
         <View>
            <Text style={[styles.planItemName, {color: color || COLORS.darkGray}]}>{name}</Text>
            <Text style={styles.planItemFeatures}>{features.join(' • ')}</Text>
         </View>
         <View style={styles.priceTag}>
            <Text style={styles.priceAmount}>{credits}</Text>
            <Text style={styles.priceCycle}>Credits</Text>
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

  planCard: { margin: 16, backgroundColor: COLORS.darkGray, borderRadius: 20, padding: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 6 },
  planLabel: { color: '#ffffff99', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  planBadge: { backgroundColor: '#ffffff22', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  planName: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  upgradeBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  upgradeBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 14 },

  referralCard: { backgroundColor: COLORS.white, marginHorizontal: 16, borderRadius: 16, padding: 20, marginBottom: 10, elevation: 2 },
  referralRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  referralBox: { alignItems: 'center' },
  referralBoxLabel: { fontSize: 11, color: COLORS.mediumGray, fontWeight: '600' },
  referralBoxCode: { fontSize: 20, fontWeight: '800', color: COLORS.primary, marginTop: 4 },
  referralBoxCount: { fontSize: 20, fontWeight: '800', color: COLORS.darkGray, marginTop: 4 },
  refDivider: { width: 1, height: 30, backgroundColor: COLORS.lightBorder },

  sectionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.mediumGray, textTransform: 'uppercase', marginTop: 20, marginBottom: 8, marginHorizontal: 20 },
  menuSection: { backgroundColor: COLORS.white, borderRadius: 16, marginHorizontal: 16, elevation: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.lightBorder },
  menuIconBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#f0f5ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuIcon: { fontSize: 18 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.darkGray },
  menuArrow: { fontSize: 20, color: COLORS.mediumGray },
  logoutBtn: { margin: 20, padding: 16, borderRadius: 14, backgroundColor: '#FFF0F0', alignItems: 'center' },
  logoutBtnText: { color: '#FF4D4D', fontWeight: '700' },

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

  supportBox: { marginTop: 20, padding: 15, backgroundColor: '#F0F5FF', borderRadius: 16, alignItems: 'center' },
  supportTitle: { fontSize: 14, fontWeight: '800', color: COLORS.primary, marginBottom: 10 },
  supportItem: { fontSize: 13, color: '#444', marginBottom: 4, fontWeight: '600' },
  waButton: { marginTop: 15, backgroundColor: '#25D366', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30 },
  waButtonText: { color: '#fff', fontWeight: '800', fontSize: 12 },

  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, height: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  closeModalText: { fontSize: 24 },
  inputLabel: { fontWeight: '700', marginTop: 16 },
  input: { backgroundColor: COLORS.lightGray, padding: 14, borderRadius: 12, marginTop: 6 },
  saveBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, marginTop: 30, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '800' },
  rowChoice: { flexDirection: 'row', gap: 8, marginTop: 8, marginBottom: 16 },
  miniBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  miniBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  miniBtnText: { fontSize: 12, color: '#666', fontWeight: '600' },
  miniBtnTextActive: { color: '#fff' },
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
