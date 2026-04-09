import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#0066FF',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#999999',
  darkGray: '#333333',
  lightBorder: '#E8E8E8',
};

interface LegalScreenProps {
  type: 'privacy' | 'about';
  onBack: () => void;
}

export function LegalScreen({ type, onBack }: LegalScreenProps) {
  const isPrivacy = type === 'privacy';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isPrivacy ? 'Privacy Policy' : 'About Review Boost'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isPrivacy ? (
          <>
            <Text style={styles.title}>Privacy Policy of Review me</Text>
            <Text style={styles.para}>
              At Review me, we prioritize your privacy and are committed to being transparent about how we handle your data. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our application. By accessing or using Review me, you agree to the collection and use of information in accordance with this policy.
            </Text>

            <Text style={styles.sectionTitle}>Information We Collect</Text>
            <Text style={styles.para}>
              <Text style={styles.bold}>Personal Information:</Text> When you register or use our services, we collect personal information such as your name, email, and phone number. If you represent a business, we also gather business details, including the company name and contact information.
            </Text>
            <Text style={styles.para}>
              <Text style={styles.bold}>Usage Data:</Text> We automatically track usage data to enhance your experience with our application. This may include information about your interactions with the app, device information, and location data.
            </Text>

            <Text style={styles.sectionTitle}>How We Use Your Information</Text>
            <Text style={styles.bullet}>• To Provide Services: Your personal and business information helps us deliver and improve our services.</Text>
            <Text style={styles.bullet}>• To Communicate: We may use your contact information to send you updates, notifications, and other relevant communication.</Text>
            <Text style={styles.bullet}>• To Improve User Experience: Analysing usage data allows us to optimize and enhance the functionality of our app.</Text>

            <Text style={styles.sectionTitle}>How We Protect Your Information</Text>
            <Text style={styles.para}>
              Your information is safeguarded with industry-standard security measures to ensure your trust and protection. We implement various security protocols to prevent unauthorized access, use, or disclosure of your data.
            </Text>

            <Text style={styles.sectionTitle}>Disclosure of Information</Text>
            <Text style={styles.para}>
              We do not sell or rent your personal information to third parties. However, we may share your information with trusted partners who assist us in providing our services, subject to strict confidentiality agreements.
            </Text>

            <Text style={styles.sectionTitle}>Your Consent</Text>
            <Text style={styles.para}>
              By using Review me, you consent to the collection and use of information as outlined in this Privacy Policy. We reserve the right to update this policy, and any changes will be communicated to you through our application or via email.
            </Text>
            
            <Text style={styles.para}>
              If you have any questions or concerns about our Privacy Policy, please feel free to contact us. Your privacy is important to us, and we are here to address any queries you may have.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>About This App</Text>
            <Text style={styles.para}>
              "Review me" is a cutting-edge platform crafted to empower businesses in enhancing their online presence and boosting sales through the strategic management of customer reviews. Initially a part of the Cloud Home dashboard, "Review me" has evolved into a standalone app, offering small business owners a streamlined approach to review management.
            </Text>

            <Text style={styles.sectionTitle}>Key Features</Text>
            <Text style={styles.bullet}>• Smart Feedback Requests: Effortlessly send review requests via email, encouraging customers to share their experiences with your business.</Text>
            <Text style={styles.bullet}>• Custom QR Codes: Create personalized QR codes linked to your Google business listing, enabling customers to leave reviews with ease.</Text>
            <Text style={styles.bullet}>• All in one Review Dashboard: Manage and organize all customer reviews from one easy-to-navigate platform, complete with filtering and sorting options to prioritize feedback effectively.</Text>
            <Text style={styles.bullet}>• The 5-star Brand: Highlight your top reviews to bolster your online credibility and attract more customers.</Text>
            <Text style={styles.bullet}>• Review Story: Delve into customer feedback with detailed reports and visual data representations to make informed, strategic business decisions.</Text>
            <Text style={styles.bullet}>• Google Maps Integration: Showcase your most exceptional reviews directly on your Google Maps listing to draw in more clientele.</Text>

            <Text style={styles.sectionTitle}>Why Choose "Review me"?</Text>
            <Text style={styles.bullet}>• Boost Customer Trust: Positive reviews are pivotal in building credibility and trust, which are essential for attracting new customers.</Text>
            <Text style={styles.bullet}>• Increase Customer Engagement: By frequently interacting with customers through review requests and responses, you can foster increased loyalty and engagement.</Text>
            <Text style={styles.bullet}>• Maximize Efficiency: Automating the review management process saves time and helps keep your business organized and efficient.</Text>
            <Text style={styles.bullet}>• Future-Proof Your Business: Regular updates and the introduction of new features ensure your business stays ahead in the realm of online reputation management.</Text>

            <Text style={styles.sectionTitle}>Target Users</Text>
            <Text style={styles.bullet}>• Small Businesses</Text>
            <Text style={styles.bullet}>• Multi-Location Franchises</Text>
            <Text style={styles.bullet}>• Service Providers</Text>

            <Text style={styles.sectionTitle}>How to Get Started</Text>
            <Text style={styles.para}>1. Sign Up: Create your account and link it to your Google business profile.</Text>
            <Text style={styles.para}>2. Generate QR Code: Develop a custom QR code for your business.</Text>
            <Text style={styles.para}>3. Set Up Review Requests: Customize and automate the process of sending review request emails.</Text>
            <Text style={styles.para}>4. Monitor: Use the dashboard to keep track of all reviews.</Text>
            <Text style={styles.para}>5. Analyse and Improve: Leverage detailed analytics to enhance your business’s performance.</Text>

            <Text style={styles.sectionTitle}>Pricing and Plans</Text>
            <Text style={styles.bullet}>• Free Trial: Experience "Review me" free for up to 7 days.</Text>
            <Text style={styles.bullet}>• Monthly Subscription (Cancel anytime): Perfect for small businesses beginning their journey with review management.</Text>
            <Text style={styles.bullet}>• Yearly Subscription (Cancel anytime): Tailored for growing businesses that require advanced features.</Text>
            
            <Text style={styles.para}>
              By integrating "Review me" into your business strategy, you can significantly enhance your online reputation, attract more customers, and ultimately increase sales.
            </Text>
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBorder,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.darkGray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.darkGray,
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.darkGray,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 24,
    marginBottom: 12,
  },
  para: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  bullet: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.darkGray,
    marginBottom: 10,
    paddingLeft: 8,
  },
  bold: {
    fontWeight: '700',
  },
});
