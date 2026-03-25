import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Alert,
} from 'react-native';

const COLORS = {
  primary: '#0066FF',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#999999',
  darkGray: '#333333',
  lightBorder: '#E8E8E8',
  blue: '#0066FF',
  green: '#4CAF50',
  red: '#F44336',
  purple: '#9C27B0',
  orange: '#FF9800',
  black: '#333333',
};

const QR_COLORS = [
  { name: 'Blue', value: COLORS.blue },
  { name: 'Green', value: COLORS.green },
  { name: 'Red', value: COLORS.red },
  { name: 'Purple', value: COLORS.purple },
  { name: 'Orange', value: COLORS.orange },
  { name: 'Black', value: COLORS.black },
];

const QR_TYPES = ['Review Collection', 'Feedback Form', 'Survey', 'Photo Review'];

interface QRCodesScreenProps {
  onLogout?: () => void;
  onScreenChange?: (screen: string) => void;
}

export function QRCodesScreen({ onLogout, onScreenChange }: QRCodesScreenProps) {
  const [activeTab, setActiveTab] = useState('qrcodes');
  const [storeName, setStoreName] = useState('My Awesome Store');
  const [qrType, setQrType] = useState('Review Collection');
  const [selectedColor, setSelectedColor] = useState(COLORS.blue);
  const [showDropdown, setShowDropdown] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [generatedTime, setGeneratedTime] = useState('');

  const handleGenerateQR = () => {
    if (!storeName.trim()) {
      Alert.alert('Store Name Required', 'Please enter a store name');
      return;
    }
    
    // Generate QR code
    setQrGenerated(true);
    
    // Set generated time
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    setGeneratedTime(`Generated just now at ${timeString}`);
  };

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
            <Text style={styles.headerTitle}>Generate Review QR</Text>
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

        {/* QR Code Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>QR Code Settings</Text>

          {/* Store Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Store Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your store name"
              placeholderTextColor={COLORS.mediumGray}
              value={storeName}
              onChangeText={setStoreName}
            />
          </View>

          {/* QR Type */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>QR Type</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text style={styles.dropdownText}>{qrType}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            {/* Dropdown Menu */}
            <Modal
              visible={showDropdown}
              transparent
              animationType="fade"
              onRequestClose={() => setShowDropdown(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setShowDropdown(false)}
                activeOpacity={1}
              >
                <View style={styles.dropdownMenu}>
                  {QR_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setQrType(type);
                        setShowDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          qrType === type && styles.dropdownItemTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          {/* QR Color */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>QR Color</Text>
            <View style={styles.colorGrid}>
              {QR_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.name}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.value },
                    selectedColor === color.value && styles.colorOptionSelected,
                  ]}
                  onPress={() => setSelectedColor(color.value)}
                >
                  {selectedColor === color.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={[styles.generateButton, { borderColor: selectedColor }]}
            onPress={handleGenerateQR}
            activeOpacity={0.8}
          >
            <Text style={styles.generateButtonIcon}>⚡</Text>
            <Text style={styles.generateButtonText}>Generate QR Code</Text>
          </TouchableOpacity>
        </View>

        {/* Generated QR Code Section */}
        {qrGenerated && (
          <View style={styles.qrSection}>
            <View style={styles.qrHeader}>
              <Text style={styles.qrTitle}>Your QR Code</Text>
              <Text style={styles.generatedTime}>
                {generatedTime}
              </Text>
            </View>

            {/* QR Code Display */}
            <View
              style={[
                styles.qrCodeContainer,
                { borderColor: selectedColor },
              ]}
            >
              <View
                style={[
                  styles.qrCodeDisplay,
                  { backgroundColor: selectedColor + '15' },
                ]}
              >
                <View style={[styles.qrSquare, { borderColor: selectedColor }]} />
                <View style={[styles.qrSquare, { borderColor: selectedColor }]} />
                <View style={[styles.qrCenter, { backgroundColor: selectedColor }]} />
                <View style={[styles.qrSquare, { borderColor: selectedColor }]} />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.downloadButton]}
                activeOpacity={0.8}
              >
                <Text style={styles.actionButtonIcon}>⬇️</Text>
                <Text style={styles.actionButtonText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.shareButton]}
                activeOpacity={0.8}
              >
                <Text style={styles.actionButtonIcon}>📤</Text>
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.printButton]}
                activeOpacity={0.8}
              >
                <Text style={styles.actionButtonIcon}>🖨️</Text>
                <Text style={styles.actionButtonText}>Print</Text>
              </TouchableOpacity>
            </View>

            {/* QR Details */}
            <View style={styles.qrDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Store:</Text>
                <Text style={styles.detailValue}>{storeName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Text style={styles.detailValue}>{qrType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Color:</Text>
                <View style={[styles.colorDot, { backgroundColor: selectedColor }]} />
              </View>
            </View>
          </View>
        )}

        {/* Empty State */}
        {!qrGenerated && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📱</Text>
            <Text style={styles.emptyStateText}>
              Configure your QR code settings and click "Generate QR Code" to create your review QR
            </Text>
          </View>
        )}

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
    paddingBottom: 100,
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
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEmoji: {
    fontSize: 20,
  },
  settingsSection: {
    marginBottom: 24,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.darkGray,
    backgroundColor: COLORS.white,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.darkGray,
  },
  dropdownArrow: {
    fontSize: 12,
    color: COLORS.mediumGray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  dropdownMenu: {
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBorder,
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.mediumGray,
  },
  dropdownItemTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  colorGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: COLORS.darkGray,
    borderWidth: 3,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  generateButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    borderWidth: 2,
  },
  generateButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  qrSection: {
    marginBottom: 24,
  },
  qrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkGray,
  },
  generatedTime: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  qrCodeContainer: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  qrCodeDisplay: {
    width: 200,
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  qrSquare: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderWidth: 3,
    borderRadius: 4,
  },
  qrCenter: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  downloadButton: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  shareButton: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  printButton: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  actionButtonIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  qrDetails: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.mediumGray,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.darkGray,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.mediumGray,
    textAlign: 'center',
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
