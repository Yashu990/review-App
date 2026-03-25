import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Linking,
  Alert,
} from 'react-native';

const COLORS = {
  primary: '#0066FF',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#999999',
  darkGray: '#333333',
  lightBorder: '#E8E8E8',
  backgroundColor: '#F9F9F9',
};

interface SettingsScreenProps {
  onLogout?: () => void;
  onScreenChange?: (screen: string) => void;
}

interface ModalState {
  [key: string]: boolean;
}

export function SettingsScreen({ onLogout, onScreenChange }: SettingsScreenProps) {
  const [activeTab, setActiveTab] = useState('settings');
  const [modals, setModals] = useState<ModalState>({
    gmb: false,
    refer: false,
    qr: false,
    reply: false,
    contact: false,
    terms: false,
    update: false,
  });

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

  const openModal = (key: string) => {
    setModals({ ...modals, [key]: true });
  };

  const closeModal = (key: string) => {
    setModals({ ...modals, [key]: false });
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Error', 'Failed to open phone dialer');
    });
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Error', 'Failed to open email');
    });
  };

  const handleWebsiteLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Failed to open website');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Store Header */}
        <View style={styles.storeHeader}>
          <View style={styles.storeLogoContainer}>
            <Text style={styles.storeLogoText}>G</Text>
          </View>
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>Helonix Pvt Ltd</Text>
            <Text style={styles.storePhone}>9999295906</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {/* GMB Report */}
          <MenuItem
            icon="📊"
            title="See Your GMB Report"
            onPress={() => openModal('gmb')}
          />

          {/* Refer & Earn */}
          <MenuItem
            icon="🤝"
            title="Refer & Earn"
            onPress={() => openModal('refer')}
          />

          {/* Activate Physical QR */}
          <MenuItem
            icon="📱"
            title="Activate Your Physical QR"
            onPress={() => openModal('qr')}
          />

          {/* Auto Reply */}
          <MenuItem
            icon="↩️"
            title="Auto Reply"
            onPress={() => openModal('reply')}
          />
        </View>

        {/* Others Section */}
        <Text style={styles.sectionLabel}>Others</Text>

        <View style={styles.menuContainer}>
          {/* Contact Us */}
          <MenuItem
            icon="☎️"
            title="Contact Us"
            onPress={() => openModal('contact')}
          />

          {/* Terms and Conditions */}
          <MenuItem
            icon="📋"
            title="Terms and Conditions"
            onPress={() => openModal('terms')}
          />

          {/* Update App */}
          <MenuItem
            icon="🔄"
            title="Update App"
            onPress={() => openModal('update')}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* GMB Report Modal */}
      <Modal
        visible={modals.gmb}
        transparent
        animationType="slide"
        onRequestClose={() => closeModal('gmb')}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>GMB Report</Text>
              <TouchableOpacity onPress={() => closeModal('gmb')}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>
                Your Google My Business Report provides insights into:
              </Text>
              <Text style={styles.bulletPoint}>• Customer search actions</Text>
              <Text style={styles.bulletPoint}>• Review analytics</Text>
              <Text style={styles.bulletPoint}>• Business calls</Text>
              <Text style={styles.bulletPoint}>• Customer interactions</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  handleWebsiteLink('https://www.google.com/business');
                  closeModal('gmb');
                }}
              >
                <Text style={styles.modalButtonText}>View GMB Report</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Refer & Earn Modal */}
      <Modal
        visible={modals.refer}
        transparent
        animationType="slide"
        onRequestClose={() => closeModal('refer')}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Refer & Earn</Text>
              <TouchableOpacity onPress={() => closeModal('refer')}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>
                Earn rewards by referring ShopReviews Pro to your friends!
              </Text>
              <Text style={styles.referCode}>Referral Code: SHOPREV2024</Text>
              <Text style={styles.modalText}>
                Get ₹500 credit for every successful referral
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  Alert.alert(
                    'Share Referral Code',
                    'Your referral code has been copied to clipboard: SHOPREV2024'
                  );
                }}
              >
                <Text style={styles.modalButtonText}>Copy & Share Code</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Activate Physical QR Modal */}
      <Modal
        visible={modals.qr}
        transparent
        animationType="slide"
        onRequestClose={() => closeModal('qr')}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Activate Physical QR</Text>
              <TouchableOpacity onPress={() => closeModal('qr')}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>
                Print and display your QR codes in your physical store to collect more reviews.
              </Text>
              <Text style={styles.bulletPoint}>• Generate unique QR codes</Text>
              <Text style={styles.bulletPoint}>• Print high-quality codes</Text>
              <Text style={styles.bulletPoint}>• Track scans in real-time</Text>
              <Text style={styles.bulletPoint}>• Customize QR colors</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  handleTabChange('qrcodes');
                  closeModal('qr');
                }}
              >
                <Text style={styles.modalButtonText}>Go to QR Codes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Auto Reply Modal */}
      <Modal
        visible={modals.reply}
        transparent
        animationType="slide"
        onRequestClose={() => closeModal('reply')}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Auto Reply</Text>
              <TouchableOpacity onPress={() => closeModal('reply')}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>
                Set up automatic replies for incoming customer messages.
              </Text>
              <Text style={styles.modalText}>
                Coming soon! This feature will allow you to:
              </Text>
              <Text style={styles.bulletPoint}>• Set welcome messages</Text>
              <Text style={styles.bulletPoint}>• Create response templates</Text>
              <Text style={styles.bulletPoint}>• Schedule automatic replies</Text>
              <TouchableOpacity
                style={[styles.modalButton, styles.disabledButton]}
                disabled
              >
                <Text style={styles.modalButtonText}>Feature Coming Soon</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Contact Us Modal */}
      <Modal
        visible={modals.contact}
        transparent
        animationType="slide"
        onRequestClose={() => closeModal('contact')}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Us</Text>
              <TouchableOpacity onPress={() => closeModal('contact')}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.contactMethod}>📞 Phone</Text>
              <TouchableOpacity
                style={styles.contactLink}
                onPress={() => handleCall('9999295906')}
              >
                <Text style={styles.contactLinkText}>+91 9999295906</Text>
              </TouchableOpacity>

              <Text style={styles.contactMethod}>📧 Email</Text>
              <TouchableOpacity
                style={styles.contactLink}
                onPress={() => handleEmail('support@shopreviews.pro')}
              >
                <Text style={styles.contactLinkText}>support@shopreviews.pro</Text>
              </TouchableOpacity>

              <Text style={styles.contactMethod}>🌐 Website</Text>
              <TouchableOpacity
                style={styles.contactLink}
                onPress={() => handleWebsiteLink('https://shopreviews.pro')}
              >
                <Text style={styles.contactLinkText}>www.shopreviews.pro</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleEmail('support@shopreviews.pro')}
              >
                <Text style={styles.modalButtonText}>Send Email</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Terms and Conditions Modal */}
      <Modal
        visible={modals.terms}
        transparent
        animationType="slide"
        onRequestClose={() => closeModal('terms')}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms and Conditions</Text>
              <TouchableOpacity onPress={() => closeModal('terms')}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.termsSection}>1. Service Terms</Text>
              <Text style={styles.termsText}>
                ShopReviews Pro is a review collection and management platform. By using our service, you agree to our terms.
              </Text>

              <Text style={styles.termsSection}>2. User Responsibility</Text>
              <Text style={styles.termsText}>
                You are responsible for maintaining the confidentiality of your account and password.
              </Text>

              <Text style={styles.termsSection}>3. Review Policy</Text>
              <Text style={styles.termsText}>
                Reviews must be authentic and not fabricated. Violators may have their account suspended.
              </Text>

              <Text style={styles.termsSection}>4. Data Privacy</Text>
              <Text style={styles.termsText}>
                Your data is protected and will not be shared with third parties without consent.
              </Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => closeModal('terms')}
              >
                <Text style={styles.modalButtonText}>I Agree</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Update App Modal */}
      <Modal
        visible={modals.update}
        transparent
        animationType="slide"
        onRequestClose={() => closeModal('update')}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update App</Text>
              <TouchableOpacity onPress={() => closeModal('update')}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.versionText}>Current Version: 2.1.3</Text>
              <Text style={styles.versionText}>Latest Version: 2.2.0</Text>

              <Text style={styles.updateTitle}>What's New?</Text>
              <Text style={styles.bulletPoint}>• Improved QR code generation</Text>
              <Text style={styles.bulletPoint}>• Better analytics dashboard</Text>
              <Text style={styles.bulletPoint}>• Enhanced security</Text>
              <Text style={styles.bulletPoint}>• Bug fixes and improvements</Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  Alert.alert(
                    'Redirect to App Store',
                    'You will be redirected to the app store to update',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Update',
                        onPress: () => {
                          // In real app, link to actual app store
                          Alert.alert('Success', 'App update initiated');
                          closeModal('update');
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={styles.modalButtonText}>Update Now</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

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

interface MenuItemProps {
  icon: string;
  title: string;
  onPress: () => void;
}

function MenuItem({ icon, title, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
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
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  storeLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
  },
  storeLogoText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkGray,
  },
  storePhone: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.mediumGray,
    marginTop: 2,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
  },
  logoutIcon: {
    fontSize: 18,
  },
  menuContainer: {
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.mediumGray,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.mediumGray,
    marginHorizontal: 8,
    marginBottom: 12,
    marginTop: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkGray,
  },
  closeButton: {
    fontSize: 24,
    color: COLORS.mediumGray,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalText: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.darkGray,
    lineHeight: 20,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.darkGray,
    lineHeight: 20,
    marginLeft: 12,
    marginBottom: 6,
  },
  referCode: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: COLORS.mediumGray,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  contactMethod: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginTop: 12,
    marginBottom: 8,
  },
  contactLink: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 8,
  },
  contactLinkText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  termsSection: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginTop: 12,
    marginBottom: 8,
  },
  termsText: {
    fontSize: 13,
    fontWeight: '400',
    color: COLORS.darkGray,
    lineHeight: 18,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  updateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginTop: 12,
    marginBottom: 8,
  },
});
