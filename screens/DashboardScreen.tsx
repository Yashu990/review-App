import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';

const COLORS = {
  primary: '#0066FF',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#999999',
  darkGray: '#333333',
  lightBorder: '#E8E8E8',
  lightGreen: '#E8F5E9',
  green: '#4CAF50',
  lightYellow: '#FFF8E1',
};

interface DashboardScreenProps {
  onLogout?: () => void;
  onScreenChange?: (screen: string) => void;
}

export function DashboardScreen({ onLogout, onScreenChange }: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Review Dashboard</Text>
            <Text style={styles.headerSubtitle}>ShopReviews Pro</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.bellIcon}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={handleLogout}
            >
              <Image
                source={{
                  uri: 'https://i.pravatar.cc/150?img=1',
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {/* QR Scans Card */}
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Total QR Scans</Text>
              <Text style={styles.qrIcon}>📱</Text>
            </View>
            <Text style={styles.statValue}>1,285</Text>
            <View style={styles.statChange}>
              <Text style={styles.increaseArrow}>↑</Text>
              <Text style={styles.increaseText}> 8.2% </Text>
              <Text style={styles.changeText}>vs last week</Text>
            </View>
          </View>

          {/* Reviews Card */}
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Total Reviews</Text>
              <Text style={styles.chatIcon}>💬</Text>
            </View>
            <Text style={styles.statValue}>432</Text>
            <View style={styles.statChange}>
              <Text style={styles.increaseArrow}>↑</Text>
              <Text style={styles.increaseText}> 12.5% </Text>
              <Text style={styles.changeText}>vs last week</Text>
            </View>
          </View>
        </View>

        {/* Rating Breakdown */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rating Breakdown</Text>
            <Text style={styles.timePeriod}>Last 30 days</Text>
          </View>

          <View style={styles.ratingContainer}>
            {/* 5 Star */}
            <View style={[styles.ratingCard, styles.ratingCardGreen]}>
              <View style={styles.ratingTop}>
                <Text style={styles.starIcon}>⭐</Text>
                <Text style={styles.ratingLabel}>5★</Text>
              </View>
              <Text style={styles.ratingCount}>287</Text>
              <Text style={styles.ratingText}>Reviews</Text>
              <Text style={styles.ratingPercent}>66.4% of total</Text>
            </View>

            {/* 1-4 Star */}
            <View style={styles.ratingCard}>
              <View style={styles.ratingTop}>
                <Text style={styles.emptyStarIcon}>☆</Text>
                <Text style={styles.ratingLabel}>1-4★</Text>
              </View>
              <Text style={styles.ratingCount}>145</Text>
              <Text style={styles.ratingText}>Reviews</Text>
              <Text style={styles.ratingPercent}>33.6% of total</Text>
            </View>
          </View>
        </View>

        {/* Recent Reviews */}
        <View style={styles.section}>
          <View style={styles.recentHeader}>
            <Text style={styles.sectionTitle}>Recent Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.starsContainer}>
                <Text style={styles.starEmoji}>⭐⭐⭐⭐⭐</Text>
              </View>
              <Text style={styles.reviewTime}>2 hours ago</Text>
            </View>
            <Text style={styles.reviewText}>
              "Great service and product quality! The staff was very helpful and
              knowledgeable. Will definitely come back."
            </Text>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavItem
          icon="📊"
          label="Dashboard"
          active={activeTab === 'dashboard'}
          onPress={() => handleTabChange('dashboard')}
        />
        <NavItem
          icon="📱"
          label="QR Codes"
          active={activeTab === 'qrcodes'}
          onPress={() => handleTabChange('qrcodes')}
        />
        <NavItem
          icon="💬"
          label="Reviews"
          active={activeTab === 'reviews'}
          onPress={() => handleTabChange('reviews')}
        />
        <NavItem
          icon="⚙️"
          label="Settings"
          active={activeTab === 'settings'}
          onPress={() => handleTabChange('settings')}
        />
      </View>
    </SafeAreaView>
  );
}

interface NavItemProps {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
}

function NavItem({ icon, label, active, onPress }: NavItemProps) {
  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.navIcon}>{icon}</Text>
      <Text
        style={[
          styles.navLabel,
          active && styles.navLabelActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.darkGray,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.mediumGray,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    fontSize: 20,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.mediumGray,
  },
  qrIcon: {
    fontSize: 20,
  },
  chatIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  increaseArrow: {
    fontSize: 16,
    color: COLORS.green,
    fontWeight: '700',
  },
  increaseText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.green,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.mediumGray,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkGray,
  },
  timePeriod: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.mediumGray,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  ratingCard: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  ratingCardGreen: {
    backgroundColor: COLORS.lightGreen,
  },
  ratingTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  emptyStarIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.mediumGray,
  },
  ratingCount: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.mediumGray,
  },
  ratingPercent: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.mediumGray,
    marginTop: 2,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  reviewCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starEmoji: {
    fontSize: 16,
  },
  reviewTime: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.mediumGray,
  },
  reviewText: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightBorder,
    paddingBottom: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  navIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.mediumGray,
  },
  navLabelActive: {
    color: COLORS.primary,
  },
});
