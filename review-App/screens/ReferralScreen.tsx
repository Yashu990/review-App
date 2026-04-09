import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
} from 'react-native';
import Share from 'react-native-share';
import { Business } from '../App';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#0066FF',
  secondary: '#FFD700', // Gold
  white: '#FFFFFF',
  lightGray: '#F8F9FA',
  darkGray: '#1A1A1A',
  mediumGray: '#6C757D',
  success: '#28A745',
  whatsapp: '#25D366',
};

interface ReferralScreenProps {
  business?: Business;
  onScreenChange: (screen: string) => void;
}

export function ReferralScreen({ business, onScreenChange }: ReferralScreenProps) {
  const referralCode = business?.referralCode || 'REF-BOOTS123';
  const points = business?.points || 0;
  const referrals = business?.referralCount || 0;

  const appLink = "https://www.helonix.com/review-boost"; 
  const shareMessage = `Hey! 🚀 I'm using *Review Boost* to grow my business reviews. Use my special code *${referralCode}* to get 100 bonus points (worth ₹100)! \n\nDownload and Register here:\n${appLink}`;

  const copyToClipboard = () => {
    // We will use standard Alert for now to avoid crash
    // if clipboard library is not linked.
    Alert.alert('Referral Code', `Your code is: ${referralCode}\n\n(Feature coming in next update!)`);
  };

  const handleShare = async (platform?: string) => {
    try {
      // For WhatsApp/Social, putting the Link directly IN the message is more reliable for hyperlinking
      const options = {
        title: 'Refer Review Boost',
        message: shareMessage,
      };

      if (platform === 'whatsapp') {
        await Share.shareSingle({
          ...options,
          social: Share.Social.WHATSAPP,
        } as any);
      } else {
        await Share.open(options);
      }
    } catch (error: any) {
      if (error?.message?.includes('User did not share')) return;
      console.log('Share Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onScreenChange('dashboard')} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer & Earn</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Visual Hero */}
        <View style={styles.heroSection}>
           <Text style={styles.heroEmoji}>🎁</Text>
           <Text style={styles.heroTitle}>Invite Friends &{'\n'}Earn Points</Text>
           <Text style={styles.heroSub}>Earn 100 points for every friend who signs up using your code.</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
           <View style={styles.statItem}>
              <Text style={styles.statVal}>{referrals}</Text>
              <Text style={styles.statLab}>Total Referrals</Text>
           </View>
           <View style={styles.statDivider} />
           <View style={styles.statItem}>
              <Text style={[styles.statVal, {color: COLORS.primary}]}>{points}</Text>
              <Text style={styles.statLab}>Total Points</Text>
           </View>
        </View>

        {/* Referral Code Box */}
        <View style={styles.codeContainer}>
           <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
           <View style={styles.codeBox}>
              <Text style={styles.codeText}>{referralCode}</Text>
              <TouchableOpacity onPress={copyToClipboard} style={styles.copyBadge}>
                 <Text style={styles.copyText}>COPY</Text>
              </TouchableOpacity>
           </View>
        </View>

        {/* Share Buttons */}
        <View style={styles.shareSection}>
           <TouchableOpacity style={[styles.shareBtn, {backgroundColor: COLORS.whatsapp}]} onPress={() => handleShare('whatsapp')}>
              <Text style={styles.shareIcon}>📱</Text>
              <Text style={styles.shareBtnText}>Share on WhatsApp</Text>
           </TouchableOpacity>
           
           <TouchableOpacity style={styles.shareBtn} onPress={() => handleShare()}>
              <Text style={styles.shareIcon}>🔗</Text>
              <Text style={styles.shareBtnText}>Share App Link</Text>
           </TouchableOpacity>
        </View>

        {/* How it works */}
        <View style={styles.infoSection}>
           <Text style={styles.infoTitle}>How it works?</Text>
           
           <View style={styles.stepRow}>
              <View style={styles.stepCircle}><Text style={styles.stepNum}>1</Text></View>
              <View style={styles.stepContent}>
                 <Text style={styles.stepHead}>Invite your friends</Text>
                 <Text style={styles.stepSub}>Share your referral link or code with friends via WhatsApp or Social Media.</Text>
              </View>
           </View>

           <View style={styles.stepRow}>
              <View style={styles.stepCircle}><Text style={styles.stepNum}>2</Text></View>
              <View style={styles.stepContent}>
                 <Text style={styles.stepHead}>They Register</Text>
                 <Text style={styles.stepSub}>Your friend clicks your link and registers their business on Review Boost.</Text>
              </View>
           </View>

           <View style={styles.stepRow}>
              <View style={styles.stepCircle}><Text style={styles.stepNum}>3</Text></View>
              <View style={styles.stepContent}>
                 <Text style={styles.stepHead}>Get Rewards (₹100)</Text>
                 <Text style={styles.stepSub}>Both receive 100 points (₹100). Use them for 5 extra free days or subtract from your subscription cost! 🎁</Text>
              </View>
           </View>
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' 
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backBtnText: { fontSize: 24, fontWeight: '700', color: COLORS.darkGray },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.darkGray },
  scrollContent: { padding: 25 },
  
  heroSection: { alignItems: 'center', marginBottom: 40 },
  heroEmoji: { fontSize: 80, marginBottom: 20 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: COLORS.darkGray, textAlign: 'center', lineHeight: 34 },
  heroSub: { fontSize: 14, color: COLORS.mediumGray, textAlign: 'center', marginTop: 12, lineHeight: 20, paddingHorizontal: 20 },

  statsRow: { 
    flexDirection: 'row', backgroundColor: COLORS.lightGray, borderRadius: 20, padding: 20, 
    marginBottom: 40, alignItems: 'center' 
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 24, fontWeight: '800', color: COLORS.darkGray },
  statLab: { fontSize: 12, color: COLORS.mediumGray, marginTop: 4, fontWeight: '600' },
  statDivider: { width: 1, height: 30, backgroundColor: '#ddd' },

  codeContainer: { marginBottom: 40 },
  codeLabel: { fontSize: 12, fontWeight: '800', color: COLORS.mediumGray, textAlign: 'center', marginBottom: 15 },
  codeBox: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.primary, 
    borderRadius: 16, padding: 20, justifyContent: 'space-between' 
  },
  codeText: { fontSize: 22, fontWeight: '900', color: COLORS.primary, letterSpacing: 2 },
  copyBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  copyText: { color: COLORS.white, fontSize: 12, fontWeight: '800' },

  shareSection: { gap: 15, marginBottom: 50 },
  shareBtn: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.darkGray, 
    padding: 18, borderRadius: 16, justifyContent: 'center' 
  },
  shareBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700', marginLeft: 10 },
  shareIcon: { fontSize: 22 },

  infoSection: { backgroundColor: COLORS.lightGray, padding: 25, borderRadius: 24 },
  infoTitle: { fontSize: 18, fontWeight: '800', color: COLORS.darkGray, marginBottom: 25 },
  stepRow: { flexDirection: 'row', marginBottom: 25 },
  stepCircle: { 
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, 
    alignItems: 'center', justifyContent: 'center', marginTop: 2 
  },
  stepNum: { color: COLORS.white, fontWeight: '800' },
  stepContent: { flex: 1, marginLeft: 15 },
  stepHead: { fontSize: 16, fontWeight: '800', color: COLORS.darkGray, marginBottom: 4 },
  stepSub: { fontSize: 13, color: COLORS.mediumGray, lineHeight: 18 },
});
