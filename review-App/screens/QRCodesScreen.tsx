import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share'; 
import QRCode from 'react-native-qrcode-svg';
import { Business } from '../App';

const COLORS = {
  primary: '#0066FF',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#999999',
  darkGray: '#333333',
  lightBorder: '#E8E8E8',
};

interface QRCodesScreenProps {
  businesses: Business[];
  onSelectBusiness: (id: string) => void;
  onScreenChange?: (screen: string) => void;
}

export function QRCodesScreen({ businesses, onSelectBusiness, onScreenChange }: QRCodesScreenProps) {
  const [sharing, setSharing] = useState(false);
  const viewShotRef = useRef<any>(null);
  
  const generateRealLink = (business: Business) => {
    const BASE_URL = "http://103.142.175.170:7500"; // Live Server
    return `${BASE_URL}/rate-us?businessId=${business.id}`;
  };

  const handleShare = async (business: Business) => {
    const link = generateRealLink(business);
    try {
      await Share.open({
        title: 'Share Feedback Link',
        message: `Share your experience with ${business.name}! \n\nGive feedback here: \n${link}`,
        url: link, 
      });
    } catch (error: any) {
      if (error?.message?.includes('User did not share')) return;
      console.log('Share Error:', error);
    }
  };

  const handleDownload = async () => {
    try {
      setSharing(true);
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 1.0,
      });

      await Share.open({
        title: 'Review Boost QR',
        url: uri,
        type: 'image/png',
        failOnCancel: false,
      });
    } catch (error: any) {
      console.error('Capture failed', error);
      Alert.alert('Error', 'Could not capture QR image.');
    } finally {
      setSharing(false);
    }
  };

  const getStyleColor = (style: string = 'default') => {
    switch (style) {
      case 'hearts': return '#FFEBEE';
      case 'premium': return '#F3E5F5';
      case 'beer': return '#FFF8E1';
      default: return '#F1F7FF';
    }
  };

  const getStyleIcon = (style: string = 'default') => {
    switch (style) {
      case 'hearts': return '❤️';
      case 'beer': return '🍺';
      case 'premium': return '✨';
      default: return '⭐';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Your QR Codes</Text>
            <Text style={styles.headerSubtitle}>Ready for print and display.</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileIconButton}
            onPress={() => onScreenChange?.('settings')}
          >
            <Text style={styles.profileEmoji}>👤</Text>
          </TouchableOpacity>
        </View>

        {businesses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No businesses registered yet. Register your business to generate QR codes!</Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onScreenChange?.('dashboard')}
            >
              <Text style={styles.actionButtonText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </View>
        ) : (
          businesses.map((biz) => {
            const qrLink = generateRealLink(biz);
            return (
              <ViewShot key={biz.id} ref={viewShotRef} options={{ format: "png", quality: 1.0 }}>
                <View style={[styles.card, {backgroundColor: getStyleColor(biz.qrStyle)}]}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.bizName}>{biz.name} {getStyleIcon(biz.qrStyle)}</Text>
                    <Text style={styles.ownerInfo}>Scan to Review our Business</Text>
                  </View>

                  <View style={styles.qrContainer}>
                    <QRCode
                      value={qrLink}
                      size={200}
                      color="black"
                      backgroundColor={COLORS.white}
                      logo={biz.logo ? { uri: biz.logo } : undefined}
                      logoSize={50}
                      logoBorderRadius={12}
                      logoBackgroundColor={COLORS.white}
                    />
                    <Text style={[styles.qrCaption, {marginTop: 15, fontWeight: '700'}]}>POWERED BY REVIEW BOOST 🚀</Text>
                  </View>

                  <View style={styles.cardActions}>
                    <TouchableOpacity 
                      style={styles.secondaryButton}
                      onPress={() => onSelectBusiness(biz.id)}
                    >
                      <Text style={styles.secondaryButtonText}>Preview Page</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.primaryButton}
                      onPress={() => handleShare(biz)}
                    >
                      <Text style={styles.primaryButtonText}>Share Link</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.primaryButton, {backgroundColor: '#25D366'}]} // WhatsApp Green
                      onPress={handleDownload}
                    >
                      <Text style={styles.primaryButtonText}>Download 📥</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ViewShot>
            );
          })
        )}
      </ScrollView>

      {/* Full Bottom Nav with Settings */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => onScreenChange?.('dashboard')}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navLabel}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onScreenChange?.('qrcodes')}>
          <Text style={[styles.navIcon, {color: COLORS.primary}]}>📱</Text>
          <Text style={[styles.navLabel, {color: COLORS.primary}]}>QR Codes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onScreenChange?.('reviews')}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navLabel}>Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onScreenChange?.('settings')}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.darkGray },
  headerSubtitle: { fontSize: 14, color: COLORS.mediumGray, marginTop: 4 },
  profileIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
  },
  profileEmoji: {
    fontSize: 22,
  },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { textAlign: 'center', color: COLORS.mediumGray, marginBottom: 20 },
  card: {
    backgroundColor: COLORS.white, borderRadius: 24, padding: 24, marginBottom: 24,
    borderWidth: 1, borderColor: COLORS.lightBorder, shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  cardHeader: { marginBottom: 20, alignItems: 'center' },
  bizName: { fontSize: 20, fontWeight: '800', color: COLORS.darkGray, textAlign: 'center' },
  ownerInfo: { fontSize: 14, color: COLORS.mediumGray, marginTop: 4 },
  detailsBox: { width: '100%', backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 12, marginBottom: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  detailLabel: { fontSize: 12, color: COLORS.mediumGray, fontWeight: '600' },
  detailValue: { fontSize: 12, color: COLORS.darkGray, fontWeight: '700', flex: 1, textAlign: 'right', marginLeft: 10 },
  qrContainer: { padding: 24, backgroundColor: COLORS.white, borderRadius: 24, borderWidth: 1, borderColor: '#f0f0f0', alignItems: 'center' },
  qrCaption: { marginTop: 12, fontSize: 14, fontWeight: '700', color: COLORS.primary, letterSpacing: 1 },
  cardActions: { flexDirection: 'row', marginTop: 30, gap: 12, width: '100%' },
  primaryButton: { flex: 1, backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryButtonText: { color: COLORS.white, fontWeight: '700' },
  secondaryButton: { flex: 1, backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  secondaryButtonText: { color: COLORS.primary, fontWeight: '700' },
  actionButton: { backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 12 },
  actionButtonText: { color: COLORS.white, fontWeight: '600' },
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row',
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.lightBorder, paddingVertical: 12,
  },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, color: COLORS.mediumGray, marginTop: 4, fontWeight: '600' },
});
