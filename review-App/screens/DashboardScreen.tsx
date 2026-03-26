import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { PrivateReview } from '../App';

const COLORS = {
  primary: '#0066FF',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#999999',
  darkGray: '#333333',
  lightBorder: '#E8E8E8',
  green: '#4CAF50',
  error: '#EF5350',
};

interface DashboardScreenProps {
  reviews: PrivateReview[];
  onScreenChange?: (screen: string) => void;
  logo?: string;
}

export function DashboardScreen({ reviews, onScreenChange, logo }: DashboardScreenProps) {
  
  const negativeReviews = reviews.filter(r => r.rating <= 3);
  const totalReviews = negativeReviews.length;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const handleTabChange = (tab: string) => {
    if (onScreenChange) {
      onScreenChange(tab);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Profile Icon on Top Right */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Review Dashboard</Text>
            <Text style={styles.headerSubtitle}>Pro Management</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileIconButton}
            onPress={() => handleTabChange('settings')}
          >
            {logo ? (
               <Image source={{ uri: logo }} style={styles.profileLogo} />
            ) : (
               <Text style={styles.profileEmoji}>👤</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Captured (1-3★)</Text>
            <Text style={styles.statValue}>{totalReviews}</Text>
            <Text style={styles.statHint}>Action Required</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Avg captured rating</Text>
            <Text style={styles.statValue}>{avgRating} ★</Text>
            <Text style={styles.statHint}>Internal Score</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => handleTabChange('qrcodes')}
            >
              <Text style={styles.actionIcon}>📱</Text>
              <Text style={styles.actionLabel}>Manage QR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => handleTabChange('reviews')}
            >
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionLabel}>View Reviews</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Captured Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Negative Experience</Text>
            <TouchableOpacity onPress={() => handleTabChange('reviews')}>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {reviews.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCardText}>No negative feedback captured yet. That's good!</Text>
            </View>
          ) : (
            reviews.slice(0, 3).map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.customerName}>{review.customerName}</Text>
                  <Text style={styles.ratingBadge}>{review.rating} ★</Text>
                </View>
                <Text style={styles.reviewSnippet} numberOfLines={2}>
                  "{review.comment}"
                </Text>
              </View>
            ))
          )}
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => handleTabChange('dashboard')}>
          <Text style={[styles.navIcon, {color: COLORS.primary}]}>📊</Text>
          <Text style={[styles.navLabel, {color: COLORS.primary}]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => handleTabChange('qrcodes')}>
          <Text style={styles.navIcon}>📱</Text>
          <Text style={styles.navLabel}>QR Codes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => handleTabChange('reviews')}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navLabel}>Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => handleTabChange('settings')}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.darkGray },
  headerSubtitle: { fontSize: 14, color: COLORS.mediumGray, marginTop: 2 },
  profileIconButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.lightGray,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.lightBorder, overflow: 'hidden'
  },
  profileLogo: { width: 44, height: 44 },
  profileEmoji: { fontSize: 22 },
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statCard: { flex: 1, backgroundColor: '#EEF4FF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#D0E1FF' },
  statLabel: { fontSize: 12, fontWeight: '700', color: COLORS.primary, marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: '800', color: COLORS.darkGray, marginBottom: 4 },
  statHint: { fontSize: 10, color: COLORS.mediumGray },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.darkGray, marginBottom: 16 },
  actionsGrid: { flexDirection: 'row', gap: 12 },
  actionCard: { flex: 1, backgroundColor: COLORS.lightGray, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: COLORS.lightBorder },
  actionIcon: { fontSize: 28, marginBottom: 8 },
  actionLabel: { fontSize: 14, fontWeight: '700', color: COLORS.darkGray },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  viewAllLink: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  reviewCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.lightBorder, marginBottom: 12 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  customerName: { fontSize: 16, fontWeight: '700', color: COLORS.darkGray },
  ratingBadge: { color: COLORS.error, fontWeight: '700' },
  reviewSnippet: { fontSize: 14, color: COLORS.mediumGray, fontStyle: 'italic' },
  emptyCard: { padding: 40, alignItems: 'center', backgroundColor: COLORS.lightGray, borderRadius: 16 },
  emptyCardText: { color: COLORS.mediumGray, textAlign: 'center' },
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row',
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.lightBorder, paddingVertical: 12, paddingBottom: 20,
  },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, color: COLORS.mediumGray, marginTop: 4, fontWeight: '600' },
});
