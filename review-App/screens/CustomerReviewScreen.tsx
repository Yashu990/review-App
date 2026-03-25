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
  onSubmitPrivateReview: (data: { name: string; number: string; comment: string; rating: number }) => void;
  onGoBack?: () => void;
}

export function CustomerReviewScreen({ 
  businessName, 
  googleReviewLink, 
  onSubmitPrivateReview,
  onGoBack 
}: CustomerReviewScreenProps) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [comment, setComment] = useState('');

  const handleRating = (r: number) => {
    setRating(r);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a star rating');
      return;
    }

    if (rating >= 4) {
      // Good review -> Redirect to Google
      Alert.alert(
        'Thank you!',
        'We are glad you had a great experience. Redirecting you to our Google Review page to share your feedback.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (googleReviewLink) {
                Linking.openURL(googleReviewLink).catch((err) => 
                  Alert.alert('Error', 'Could not open the review link')
                );
              } else {
                Alert.alert('Error', 'Google review link not found for this business.');
              }
            }
          }
        ]
      );
    } else {
      // Bad review -> Capture details
      if (!name || !number || !comment) {
        Alert.alert('Incomplete', 'Please fill in all fields so we can improve our service.');
        return;
      }
      
      onSubmitPrivateReview({ name, number, comment, rating });
      Alert.alert(
        'Feedback Received',
        'Thank you for your feedback. We are sorry you had a sub-optimal experience. Our manager will contact you shortly to resolve this issue.',
        [{ text: 'Dismiss', onPress: onGoBack }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Send Feedback</Text>
          <Text style={styles.subtitle}>{businessName}</Text>
        </View>

        {/* Star Rating Section */}
        <View style={styles.starsSection}>
          <Text style={styles.sectionLabel}>How was your experience?</Text>
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
          <Text style={styles.ratingHint}>
            {rating === 0 ? 'Select a rating' : 
             rating <= 3 ? 'We are sorry! Let us fix it.' : 'We are glad you liked it!'}
          </Text>
        </View>

        {/* Input Form (Always visible or conditional?) */}
        {/* Requirement: "5 star will show 3 filed number name comment" */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your number"
              value={number}
              onChangeText={setNumber}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Comment</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us what happened..."
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.darkGray,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.mediumGray,
    marginTop: 4,
  },
  starsSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  starIcon: {
    fontSize: 48,
  },
  ratingHint: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  formSection: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.darkGray,
    backgroundColor: COLORS.lightGray,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
});
