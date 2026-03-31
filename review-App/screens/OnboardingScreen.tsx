import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onFinish: () => void;
}

export function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const [step, setStep] = useState(0); // 0: Language, 1: Curious, 2: ReviewUP, 3: Private/Google
  const [selectedLang, setSelectedLang] = useState('English');

  const nextStep = () => setStep(step + 1);

  const handleLangPress = (lang: string) => {
    setSelectedLang(lang);
    setStep(1);
  };

  // 1. Language Selection
  if (step === 0) {
    return (
      <SafeAreaView style={styles.containerWhite}>
        <View style={styles.centerContent}>
          <View style={styles.globeContainer}>
             <Text style={{fontSize: 80}}>🌍</Text>
             <View style={styles.pin}><Text style={{fontSize: 20}}>📍</Text></View>
          </View>
          <Text style={styles.title}>Select your preferred{'\n'}language</Text>
          
          {['English', 'Française', 'Española', 'Deutsch'].map((lang) => (
            <TouchableOpacity 
              key={lang}
              style={selectedLang === lang ? styles.langBtnActive : styles.langBtn} 
              onPress={() => handleLangPress(lang)}
            >
              <Text style={selectedLang === lang ? styles.langBtnTextActive : styles.langBtnText}>{lang}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.skipBtn} onPress={nextStep}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 2. Black Slide: Curious?
  if (step === 1) {
    return (
      <View style={[styles.containerBlack, { backgroundColor: '#000' }]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.pagination}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
        </View>
        <View style={styles.contentPad}>
          <Text style={styles.onboardingTextWhite}>Curious what{'\n'}your{'\n'}customers{'\n'}think about{'\n'}your service?</Text>
        </View>
        <TouchableOpacity style={styles.circleArrow} onPress={nextStep}>
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. White Slide: ReviewUP
  if (step === 2) {
    return (
      <View style={styles.containerWhite}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={styles.dotActiveBlack} />
        </View>
        <View style={styles.contentPad}>
          <Text style={styles.onboardingTextBlack}>ReviewUP{'\n'}helps you to{'\n'}collect honest{'\n'}feedback</Text>
        </View>
        <TouchableOpacity style={[styles.circleArrow, { backgroundColor: '#000' }]} onPress={nextStep}>
          <Text style={[styles.arrowText, { color: '#fff' }]}>→</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 4. White Slide: Private or Google
  if (step === 3) {
    return (
      <View style={styles.containerWhite}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <View style={styles.contentPad}>
          <Text style={styles.onboardingTextBlack}>You decide{'\n'}keep the{'\n'}feedback{'\n'}private or{'\n'}send happy{'\n'}reviews to{'\n'}Google.</Text>
        </View>
        <TouchableOpacity style={styles.startBtn} onPress={onFinish}>
          <Text style={styles.startBtnText}>Start Now for Free</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  containerWhite: { flex: 1, backgroundColor: '#fff' },
  containerBlack: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  globeContainer: { width: 140, height: 140, marginBottom: 40, alignItems: 'center', justifyContent: 'center' },
  pin: { position: 'absolute', top: 30, right: 30 },
  title: { fontSize: 32, fontWeight: '800', textAlign: 'center', marginBottom: 40, color: '#000' },
  langBtn: { width: '100%', paddingVertical: 18, borderRadius: 40, borderWidth: 1, borderColor: '#ddd', marginBottom: 15, alignItems: 'center' },
  langBtnActive: { width: '100%', paddingVertical: 18, borderRadius: 40, borderWidth: 2, borderColor: '#000', marginBottom: 15, alignItems: 'center' },
  langBtnText: { fontSize: 18, fontWeight: '500', color: '#ccc' },
  langBtnTextActive: { fontSize: 18, fontWeight: '600', color: '#000' },
  skipBtn: { marginTop: 20 },
  skipText: { fontSize: 16, color: '#aaa', fontWeight: '500' },
  
  // Slides
  pagination: { position: 'absolute', top: 100, alignSelf: 'center', flexDirection: 'row', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#333' },
  dotActive: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  dotActiveBlack: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#000' },
  contentPad: { paddingHorizontal: 40, flex: 1, justifyContent: 'center' },
  onboardingTextWhite: { fontSize: 44, fontWeight: '900', color: '#fff', lineHeight: 52 },
  onboardingTextBlack: { fontSize: 44, fontWeight: '900', color: '#000', lineHeight: 52 },
  circleArrow: { position: 'absolute', bottom: 60, right: 40, width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  arrowText: { fontSize: 24, fontWeight: '700' },
  
  // Start Btn
  startBtn: { position: 'absolute', bottom: 60, alignSelf: 'center', width: width - 80, backgroundColor: '#000', paddingVertical: 20, borderRadius: 40, alignItems: 'center' },
  startBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
