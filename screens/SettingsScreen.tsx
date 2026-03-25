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
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Business } from '../App';

const COLORS = {
  primary: '#0066FF',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#999999',
  darkGray: '#333333',
  lightBorder: '#E8E8E8',
  backgroundColor: '#F9F9F9',
  success: '#4CAF50',
};

interface SettingsScreenProps {
  business?: Business;
  onLogout?: () => void;
  onScreenChange?: (screen: string) => void;
  onUpdateBusiness?: (business: Business) => Promise<void>;
}

export function SettingsScreen({ business, onLogout, onScreenChange, onUpdateBusiness }: SettingsScreenProps) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState(business?.name || '');
  const [ownerName, setOwnerName] = useState(business?.ownerName || '');
  const [ownerPhone, setOwnerPhone] = useState(business?.ownerPhone || '');
  const [googleLink, setGoogleLink] = useState(business?.googleReviewLink || '');
  const [logoBase64, setLogoBase64] = useState(business?.logo || '');

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.7,
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Failed to pick image');
      return;
    }

    if (result.assets && result.assets[0].base64) {
      setLogoBase64(`data:${result.assets[0].type};base64,${result.assets[0].base64}`);
    }
  };

  const handleUpdate = async () => {
    if (!name || !ownerName || !ownerPhone || !googleLink) {
      Alert.alert('Error', 'Please fill all mandatory fields.');
      return;
    }

    if (onUpdateBusiness && business) {
      setLoading(true);
      try {
        await onUpdateBusiness({
          ...business,
          name,
          ownerName,
          ownerPhone,
          googleReviewLink: googleLink,
          logo: logoBase64,
        });
        setIsEditModalVisible(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } catch (err) {
        Alert.alert('Error', 'Failed to update profile.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity 
             style={styles.avatarContainer} 
             onPress={() => setIsEditModalVisible(true)}
          >
            {business?.logo ? (
               <Image source={{ uri: business.logo }} style={styles.avatarImage} />
            ) : (
               <Text style={styles.avatarText}>{business?.name.charAt(0) || '?'}</Text>
            )}
            <View style={styles.cameraBadge}>
               <Text style={styles.cameraEmoji}>📸</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.businessName}>{business?.name || 'Your Business'}</Text>
          <Text style={styles.ownerSubtitle}>{business?.ownerName || 'Business Owner'}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.statsRow}>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => setIsEditModalVisible(true)}
          >
            <Text style={styles.editButtonText}>🖊️ Edit Profile & Logo</Text>
          </TouchableOpacity>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Details</Text>
          <DetailItem label="Business Name" value={business?.name} />
          <DetailItem label="Owner" value={business?.ownerName} />
          <DetailItem label="Phone" value={business?.ownerPhone} />
          <DetailItem label="Google Review Link" value={business?.googleReviewLink} numberOfLines={1} />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutBtnText}>Log Out Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Business Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
              
              <Text style={styles.inputLabel}>Business Logo</Text>
              <View style={styles.logoPickerContainer}>
                 <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
                    {logoBase64 ? (
                       <Image source={{ uri: logoBase64 }} style={styles.previewImage} />
                    ) : (
                       <>
                          <Text style={styles.plusIcon}>+</Text>
                          <Text style={styles.pickerHint}>Select from Gallery</Text>
                       </>
                    )}
                 </TouchableOpacity>
                 <Text style={styles.pickerSubHint}>Tap current logo to change</Text>
              </View>

              <Text style={styles.inputLabel}>Business Name</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} />
              
              <Text style={styles.inputLabel}>Owner Full Name</Text>
              <TextInput style={styles.input} value={ownerName} onChangeText={setOwnerName} />
              
              <Text style={styles.inputLabel}>Owner Phone</Text>
              <TextInput style={styles.input} value={ownerPhone} onChangeText={setOwnerPhone} keyboardType="phone-pad" />
              
              <Text style={styles.inputLabel}>Google Review Link</Text>
              <TextInput style={styles.input} value={googleLink} onChangeText={setGoogleLink} />

              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => onScreenChange?.('dashboard')}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navLabel}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onScreenChange?.('qrcodes')}>
          <Text style={styles.navIcon}>📱</Text>
          <Text style={styles.navLabel}>QR Codes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onScreenChange?.('reviews')}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navLabel}>Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onScreenChange?.('settings')}>
          <Text style={[styles.navIcon, {color: COLORS.primary}]}>⚙️</Text>
          <Text style={[styles.navLabel, {color: COLORS.primary}]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function DetailItem({ label, value, numberOfLines = 2 }: { label: string, value?: string, numberOfLines?: number }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={numberOfLines}>{value || 'Not set'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundColor },
  scrollContent: { paddingBottom: 100 },
  profileHeader: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBorder,
  },
  avatarContainer: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    position: 'relative', overflow: 'visible',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4,
  },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  avatarText: { fontSize: 40, fontWeight: '800', color: COLORS.white },
  cameraBadge: {
     position: 'absolute', bottom: 0, right: 0, 
     backgroundColor: '#fff', width: 32, height: 32, borderRadius: 16,
     justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary
  },
  cameraEmoji: { fontSize: 16 },
  businessName: { fontSize: 24, fontWeight: '800', color: COLORS.darkGray },
  ownerSubtitle: { fontSize: 14, color: COLORS.mediumGray, marginTop: 4 },
  statsRow: { padding: 20, alignItems: 'center' },
  editButton: {
    backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.primary,
    borderRadius: 10, paddingVertical: 10, paddingHorizontal: 24,
  },
  editButtonText: { color: COLORS.primary, fontWeight: '700' },
  section: { backgroundColor: COLORS.white, padding: 20, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.darkGray, marginBottom: 16 },
  detailItem: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 10 },
  detailLabel: { fontSize: 12, color: COLORS.mediumGray, fontWeight: '600', marginBottom: 4 },
  detailValue: { fontSize: 16, color: COLORS.darkGray, fontWeight: '500' },
  logoPickerContainer: {
     alignItems: 'center', marginVertical: 10,
  },
  imagePickerBtn: {
     width: 120, height: 120, borderRadius: 20, backgroundColor: COLORS.lightGray,
     borderWidth: 2, borderColor: COLORS.lightBorder, borderStyle: 'dashed',
     justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  previewImage: { width: 120, height: 120 },
  plusIcon: { fontSize: 40, color: COLORS.mediumGray },
  pickerHint: { fontSize: 12, color: COLORS.mediumGray, marginTop: 4 },
  pickerSubHint: { fontSize: 10, color: COLORS.mediumGray, marginTop: 10 },
  logoutBtn: { margin: 20, padding: 16, borderRadius: 12, backgroundColor: '#FFF0F0', alignItems: 'center' },
  logoutBtnText: { color: '#FF4D4D', fontWeight: '700' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '90%', padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.darkGray },
  closeModalText: { fontSize: 24, color: COLORS.mediumGray },
  form: { flex: 1 },
  inputLabel: { fontSize: 14, fontWeight: '700', color: COLORS.darkGray, marginBottom: 8, marginTop: 14 },
  input: { backgroundColor: COLORS.lightGray, padding: 14, borderRadius: 12, fontSize: 16, color: COLORS.darkGray },
  saveBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 14, alignItems: 'center', marginTop: 30, marginBottom: 50 },
  saveBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 16 },
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row',
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.lightBorder, paddingVertical: 12,
  },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, color: COLORS.mediumGray, marginTop: 4, fontWeight: '600' },
});
