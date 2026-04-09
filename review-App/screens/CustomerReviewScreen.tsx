import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
  Alert,
  Image,
} from 'react-native';

const COLORS = {
  primary: '#0066FF',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#999999',
  darkGray: '#333333',
  lightBorder: '#E8E8E8',
  starActive: '#FFD700',
  starEmpty: '#D1D1D1',
  success: '#4CAF50',
};

interface CustomerReviewScreenProps {
  businessName: string;
  googleReviewLink: string;
  privacyTier: string;
  onSubmitPrivateReview: (data: { name: string; number: string; comment: string; rating: number }) => void;
  onGoBack?: () => void;
}

export function CustomerReviewScreen({ 
  businessName, 
  googleReviewLink, 
  privacyTier,
  onSubmitPrivateReview,
  onGoBack 
}: CustomerReviewScreenProps) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [comment, setComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const isGoodReview = privacyTier === '4-star' ? rating >= 4 : rating >= 5;

  const handleRating = (r: number) => {
    setRating(r);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a star rating');
      return;
    }

    if (isGoodReview) {
      setShowSuccess(true);
    } else {
      if (!name || !number || !comment) {
        Alert.alert('Incomplete', 'Please fill in all fields so we can improve our service.');
        return;
      }
      
      onSubmitPrivateReview({ name, number, comment, rating });
      setShowSuccess(true);
    }
  };

  if (showSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successWrapper}>
          <View style={styles.successCard}>
             <Text style={styles.bigStar}>⭐</Text>
             <Text style={styles.thanksText}>Thanks for your Feedback</Text>
          </View>

          <View style={styles.promoSection}>
             <View style={styles.appBranding}>
                <Text style={styles.appLogoText}>Review <Text style={{color: '#E91E63'}}>Boost</Text></Text>
                <Text style={styles.promoSub}>Get more reviews, grow your reputation! Promotes your business now!</Text>
             </View>
             
             <View style={styles.storeButtons}>
                <TouchableOpacity onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.reviewboost')}>
                   <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png' }} style={styles.storeIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('https://apps.apple.com/app/review-boost')}>
                   <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge_ES_RGB_blk_100217.svg/1200px-Download_on_the_App_Store_Badge_ES_RGB_blk_100217.svg.png' }} style={styles.storeIcon} />
                </TouchableOpacity>
             </View>
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={() => {
            if (isGoodReview && googleReviewLink) {
               Linking.openURL(googleReviewLink);
            }
            onGoBack?.();
          }}>
             <Text style={styles.doneBtnText}>{isGoodReview ? 'Go to Google Maps' : 'Finish'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          {onGoBack && (
            <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
              <Text style={styles.backArrow}>← Back</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title}>Give feedback</Text>
          <Text style={styles.subtitle}>What are your thoughts on the experience with <Text style={styles.boldBiz}>{businessName?.toUpperCase()}</Text>?</Text>
        </View>

        {/* Star Rating Section */}
        <View style={styles.starsSection}>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => handleRating(s)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.starIcon, 
                  { color: s <= rating ? COLORS.starActive : COLORS.starEmpty }
                ]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Input Form */}
        <View style={styles.formSection}>
          {rating > 0 && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your feedback</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us about your experience..."
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
              />
            </View>
          )}

          {/* If Negative -> Reveal Name/Number fields and the Blue Box */}
          {rating > 0 && !isGoodReview && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Your Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Your Number:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  value={number}
                  onChangeText={setNumber}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.bluePromoBox}>
                <Text style={styles.promoText}>
                  Give us a chance to improve our services also get exclusive tips, offer and campaigns. Drop your phone no. If you are interested!
                </Text>
              </View>
            </>
          )}

          {rating > 0 && (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>{isGoodReview ? 'Open Google' : 'Submit'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5FB',
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  backArrow: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A5E',
  },
  subtitle: {
    fontSize: 15,
    color: '#444',
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  boldBiz: {
    fontWeight: '800',
    color: '#E91E63', // Pinkish like in the image
  },
  starsSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  starIcon: {
    fontSize: 48,
  },
  formSection: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A5E',
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: COLORS.darkGray,
    backgroundColor: COLORS.white,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  bluePromoBox: {
    backgroundColor: '#4A90E2',
    padding: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  promoText: {
    color: '#FFEB3B', // Yellow text on blue like the image hint
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#FF5C8D', // Pink submit button like in the image
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  
  // Success Screen Styles
  successWrapper: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#fff' },
  successCard: { 
    backgroundColor: '#fff', padding: 40, borderRadius: 20, alignItems: 'center', 
    elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 
  },
  bigStar: { fontSize: 80, marginBottom: 20 },
  thanksText: { fontSize: 24, fontWeight: '800', textAlign: 'center', color: '#1A1A5E' },
  
  promoSection: { marginTop: 40, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 30 },
  appBranding: { alignItems: 'center', marginBottom: 20 },
  appLogoText: { fontSize: 28, fontWeight: '900', color: '#1A1A5E' },
  promoSub: { fontSize: 13, color: '#666', textAlign: 'center', marginTop: 10, lineHeight: 18 },
  
  storeButtons: { flexDirection: 'row', gap: 10, marginTop: 10 },
  storeIcon: { width: 140, height: 42, resizeMode: 'contain' },
  
  doneBtn: { backgroundColor: '#1A1A5E', padding: 18, borderRadius: 12, marginTop: 40, alignItems: 'center' },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
