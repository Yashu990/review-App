import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';

const COLORS = {
  primary: '#0066FF',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#999999',
  darkGray: '#333333',
  lightBorder: '#E8E8E8',
  green: '#4CAF50',
  backgroundColor: '#F9F9F9',
};

interface Review {
  id: string;
  rating: number;
  text: string;
  timestamp: string;
  posted: boolean;
  date: 'today' | 'yesterday' | 'older';
}

const SAMPLE_REVIEWS: Review[] = [
  {
    id: '1',
    rating: 5,
    text: '"Amazing shopping experience! The staff was super friendly and helped me find exactly what I needed. Will definitely recommend to friends."',
    timestamp: 'Today, 2:45 PM',
    posted: true,
    date: 'today',
  },
  {
    id: '2',
    rating: 4,
    text: '"Good products and nice store layout. The checkout process was quick. Would give 5 stars if prices were a bit lower."',
    timestamp: 'Today, 11:20 AM',
    posted: false,
    date: 'today',
  },
  {
    id: '3',
    rating: 5,
    text: '"Great service and product quality! The staff was very helpful and knowledgeable. Will definitely come back."',
    timestamp: 'Yesterday, 5:30 PM',
    posted: true,
    date: 'yesterday',
  },
  {
    id: '4',
    rating: 3,
    text: '"Average experience. The products are okay but the service could be better. The store is a bit crowded."',
    timestamp: 'Yesterday, 1:15 PM',
    posted: false,
    date: 'yesterday',
  },
  {
    id: '5',
    rating: 5,
    text: '"Excellent customer service! They went above and beyond to help me. Highly recommend this store to everyone."',
    timestamp: '2 days ago, 3:20 PM',
    posted: true,
    date: 'older',
  },
];

interface ReviewsScreenProps {
  onLogout?: () => void;
  onScreenChange?: (screen: string) => void;
}

export function ReviewsScreen({ onLogout, onScreenChange }: ReviewsScreenProps) {
  const [activeTab, setActiveTab] = useState('reviews');
  const [selectedRating, setSelectedRating] = useState(0); // 0 = all
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest or oldest
  const [filterByDate, setFilterByDate] = useState(false);

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

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let filtered = SAMPLE_REVIEWS;

    // Filter by rating
    if (selectedRating > 0) {
      filtered = filtered.filter((r) => r.rating === selectedRating);
    }

    // Filter by search text
    if (searchText.trim()) {
      filtered = filtered.filter((r) =>
        r.text.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Sort by date
    if (sortBy === 'newest') {
      filtered = filtered.sort(
        (a, b) =>
          SAMPLE_REVIEWS.indexOf(a) - SAMPLE_REVIEWS.indexOf(b)
      );
    } else {
      filtered = filtered.sort(
        (a, b) =>
          SAMPLE_REVIEWS.indexOf(b) - SAMPLE_REVIEWS.indexOf(a)
      );
    }

    return filtered;
  }, [selectedRating, searchText, sortBy]);

  const renderStars = (rating: number) => {
    const fullStars = '⭐'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return fullStars + emptyStars;
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.starsText}>{renderStars(item.rating)}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>

      <Text style={styles.reviewText}>{item.text}</Text>

      <View style={styles.postedStatus}>
        {item.posted ? (
          <>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.postedText}>Posted to Google</Text>
          </>
        ) : (
          <>
            <Text style={styles.notPostedDot}>●</Text>
            <Text style={styles.notPostedText}>Not posted</Text>
          </>
        )}
      </View>
    </View>
  );

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
            <Text style={styles.headerTitle}>Review History</Text>
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
              <Text style={styles.profileEmoji}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search reviews..."
            placeholderTextColor={COLORS.mediumGray}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedRating === 0 && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedRating(0)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedRating === 0 && styles.filterButtonTextActive,
                ]}
              >
                All Reviews
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedRating === 5 && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedRating(5)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedRating === 5 && styles.filterButtonTextActive,
                ]}
              >
                ⭐ 5 Stars
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedRating === 4 && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedRating(4)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedRating === 4 && styles.filterButtonTextActive,
                ]}
              >
                ⭐ 4 Stars
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedRating === 3 && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedRating(3)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedRating === 3 && styles.filterButtonTextActive,
                ]}
              >
                ⭐ 3 Stars
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Sort Options */}
        <View style={styles.sortSection}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setFilterByDate(!filterByDate)}
          >
            <Text style={styles.sortIcon}>📅</Text>
            <Text style={styles.sortText}>Filter by date</Text>
          </TouchableOpacity>

          <View style={styles.sortOptions}>
            <TouchableOpacity
              style={[
                styles.sortOption,
                sortBy === 'newest' && styles.sortOptionActive,
              ]}
              onPress={() => setSortBy('newest')}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === 'newest' && styles.sortOptionTextActive,
                ]}
              >
                Newest
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sortOption,
                sortBy === 'oldest' && styles.sortOptionActive,
              ]}
              onPress={() => setSortBy('oldest')}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === 'oldest' && styles.sortOptionTextActive,
                ]}
              >
                Oldest
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reviews List */}
        <View style={styles.reviewsContainer}>
          {filteredReviews.length > 0 ? (
            <FlatList
              data={filteredReviews}
              renderItem={renderReviewItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => (
                <View style={styles.reviewSeparator} />
              )}
            />
          ) : (
            <View style={styles.noReviews}>
              <Text style={styles.noReviewsIcon}>💬</Text>
              <Text style={styles.noReviewsText}>No reviews found</Text>
              <Text style={styles.noReviewsSubtext}>
                Try adjusting your filters or search terms
              </Text>
            </View>
          )}
        </View>

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
    backgroundColor: COLORS.backgroundColor,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEmoji: {
    fontSize: 20,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.darkGray,
    backgroundColor: COLORS.white,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    backgroundColor: COLORS.white,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.mediumGray,
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  sortSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    backgroundColor: COLORS.white,
  },
  sortIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
  },
  sortOptionActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  sortOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.mediumGray,
  },
  sortOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  reviewsContainer: {
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 0,
  },
  reviewSeparator: {
    height: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsText: {
    fontSize: 14,
    letterSpacing: 2,
  },
  timestamp: {
    fontSize: 11,
    fontWeight: '400',
    color: COLORS.mediumGray,
  },
  reviewText: {
    fontSize: 13,
    fontWeight: '400',
    color: COLORS.darkGray,
    lineHeight: 18,
    marginBottom: 10,
  },
  postedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  checkmark: {
    fontSize: 12,
    color: COLORS.green,
    fontWeight: '700',
  },
  postedText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.green,
  },
  notPostedDot: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  notPostedText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  noReviews: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noReviewsIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  noReviewsText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  noReviewsSubtext: {
    fontSize: 13,
    fontWeight: '400',
    color: COLORS.mediumGray,
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
