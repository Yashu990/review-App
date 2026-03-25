import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from 'react-native';
import { PrivateReview, Business } from '../App';

const COLORS = {
  primary: '#0066FF',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#999999',
  darkGray: '#333333',
  lightBorder: '#E8E8E8',
  starActive: '#FFD700',
  error: '#EF5350',
  success: '#66BB6A',
};

interface ReviewsScreenProps {
  reviews: PrivateReview[];
  businesses: Business[];
  onScreenChange: (screen: string) => void;
}

export function ReviewsScreen({ reviews, businesses, onScreenChange }: ReviewsScreenProps) {
  
  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Error', 'Unable to initiate call.');
    });
  };

  const getBusinessName = (bizId: string) => {
    const biz = businesses.find(b => b.id === bizId);
    return biz ? biz.name : 'Your Store';
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Captured Feedback</Text>
            <Text style={styles.headerSubtitle}>Follow up with unhappy customers.</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileIconButton}
            onPress={() => onScreenChange('settings')}
          >
            <Text style={styles.profileEmoji}>👤</Text>
          </TouchableOpacity>
        </View>

        {reviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No captured reviews yet.</Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onScreenChange('qrcodes')}
            >
              <Text style={styles.actionButtonText}>Show QR Code to Get Reviews</Text>
            </TouchableOpacity>
          </View>
        ) : (
          [...reviews].reverse().map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View>
                  <Text style={styles.customerName}>{review.customerName}</Text>
                  <Text style={styles.reviewDate}>{formatDate(review.timestamp)}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>{review.rating} ★</Text>
                </View>
              </View>

              <Text style={styles.bizTarget}>Feedback for: {getBusinessName(review.businessId)}</Text>
              
              <View style={styles.commentBox}>
                <Text style={styles.commentText}>"{review.comment}"</Text>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={styles.callButton}
                  onPress={() => handleCall(review.customerPhone)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.callButtonText}>📞 Call {review.customerPhone}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Full Bottom Nav with Settings Page */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => onScreenChange('dashboard')}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navLabel}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onScreenChange('qrcodes')}>
          <Text style={styles.navIcon}>📱</Text>
          <Text style={styles.navLabel}>QR Codes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onScreenChange('reviews')}>
          <Text style={[styles.navIcon, {color: COLORS.primary}]}>💬</Text>
          <Text style={[styles.navLabel, {color: COLORS.primary}]}>Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onScreenChange('settings')}>
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
  headerTitle: { fontSize: 28, fontWeight: '700', color: COLORS.darkGray },
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
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: COLORS.mediumGray, marginBottom: 20 },
  reviewCard: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: COLORS.lightBorder, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  customerName: { fontSize: 18, fontWeight: '700', color: COLORS.darkGray },
  reviewDate: { fontSize: 12, color: COLORS.mediumGray },
  ratingBadge: { backgroundColor: COLORS.error, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  ratingText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  bizTarget: { fontSize: 13, fontWeight: '600', color: COLORS.primary, marginBottom: 12 },
  commentBox: { backgroundColor: COLORS.lightGray, padding: 16, borderRadius: 12, marginBottom: 20 },
  commentText: { fontSize: 15, fontStyle: 'italic', color: COLORS.darkGray, lineHeight: 22 },
  cardActions: { width: '100%' },
  callButton: { backgroundColor: COLORS.success, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  callButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
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
