import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onFinish: () => void;
}

export function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const [selectedLang, setSelectedLang] = useState('Hindi');
  const [showLanguage, setShowLanguage] = useState(true);

  const TRANSLATIONS: any = {
    English: {
      step1Head: 'Curious?',
      step1Body: 'Curious what your customers think about your service?',
      step2Head: 'Stop Bad Reviews',
      step2Body: 'Unhappy customers are sent to a private form, protecting your public rating.',
      step3Head: 'Boost Google',
      step3Body: 'Happy customers are instantly encouraged to post on Google Maps.',
      step4Head: 'Ready?',
      step4Body: 'Manage everything from your dedicated dashboard.',
      startBtn: 'Get Started Now'
    },
    Hindi: {
      step1Head: 'क्या आप जिज्ञासु हैं?',
      step1Body: 'क्या आप जानना चाहते हैं कि आपके ग्राहक आपकी सेवा के बारे में क्या सोचते हैं?',
      step2Head: 'खराब रिव्यु रोकें',
      step2Body: 'असंतुष्ट ग्राहकों को एक प्राइवेट फॉर्म पर भेजा जाता है, जिससे आपकी पब्लिक रेटिंग सुरक्षित रहती है।',
      step3Head: 'गूगल रेटिंग बढ़ाएं',
      step3Body: 'संतुष्ट ग्राहकों को तुरंत Google Maps पर पोस्ट करने के लिए प्रोत्साहित किया जाता है।',
      step4Head: 'तैयार हैं?',
      step4Body: 'अपने समर्पित डैशबोर्ड से सब कुछ मैनेज करें।',
      startBtn: 'अभी शुरू करें'
    }
  };

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.English;

  if (showLanguage) {
    return (
      <SafeAreaView style={styles.containerWhite}>
        <View style={styles.centerContent}>
          <View style={styles.globeContainer}>
             <Text style={{fontSize: 80}}>🌍</Text>
             <View style={styles.pin}><Text style={{fontSize: 20}}>📍</Text></View>
          </View>
          <Text style={styles.title}>Select your preferred{'\n'}language</Text>
          
          {['English', 'Hindi'].map((lang) => (
            <TouchableOpacity 
              key={lang}
              style={selectedLang === lang ? styles.langBtnActive : styles.langBtn} 
              onPress={() => setSelectedLang(lang)}
            >
              <Text style={selectedLang === lang ? styles.langBtnTextActive : styles.langBtnText}>{lang}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={[styles.startBtn, {position: 'relative', marginTop: 30, width: '100%'}]} onPress={() => setShowLanguage(false)}>
            <Text style={styles.startBtnText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.containerWhite}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
      >
        {/* Slide 1: Curious */}
        <View style={styles.slide}>
           <Text style={styles.heroEmoji}>🤔</Text>
           <Text style={styles.slideTitle}>{t.step1Head}</Text>
           <Text style={styles.slideSub}>{t.step1Body}</Text>
        </View>

        {/* Slide 2: Private Feedback */}
        <View style={styles.slide}>
           <View style={styles.iconCircle}><Text style={{fontSize: 50}}>🔒</Text></View>
           <Text style={styles.slideTitle}>{t.step2Head}</Text>
           <Text style={styles.slideSub}>{t.step2Body}</Text>
        </View>

        {/* Slide 3: Google Boost */}
        <View style={styles.slide}>
           <View style={[styles.iconCircle, {backgroundColor: '#E8F4FD'}]}><Text style={{fontSize: 50}}>🚀</Text></View>
           <Text style={styles.slideTitle}>{t.step3Head}</Text>
           <Text style={styles.slideSub}>{t.step3Body}</Text>
        </View>

        {/* Slide 4: Dashboard */}
        <View style={styles.slide}>
           <View style={[styles.iconCircle, {backgroundColor: '#F2F5FB'}]}><Text style={{fontSize: 50}}>📊</Text></View>
           <Text style={styles.slideTitle}>{t.step4Head}</Text>
           <Text style={styles.slideSub}>{t.step4Body}</Text>
           
           <TouchableOpacity style={[styles.startBtn, {marginTop: 40, position: 'relative', width: '100%'}]} onPress={onFinish}>
              <Text style={styles.startBtnText}>{t.startBtn} ✨</Text>
           </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Swipe Hint */}
      <View style={styles.footerHint}>
        <Text style={styles.hintText}>Swipe to learn more ↔️</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerWhite: { flex: 1, backgroundColor: '#fff' },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  globeContainer: { width: 140, height: 140, marginBottom: 40, alignItems: 'center', justifyContent: 'center' },
  pin: { position: 'absolute', top: 30, right: 30 },
  title: { fontSize: 32, fontWeight: '800', textAlign: 'center', marginBottom: 40, color: '#000' },
  langBtn: { width: '100%', paddingVertical: 18, borderRadius: 40, borderWidth: 1, borderColor: '#eee', marginBottom: 15, alignItems: 'center' },
  langBtnActive: { width: '100%', paddingVertical: 18, borderRadius: 40, borderWidth: 2, borderColor: '#000', marginBottom: 15, alignItems: 'center' },
  langBtnText: { fontSize: 18, fontWeight: '500', color: '#ccc' },
  langBtnTextActive: { fontSize: 18, fontWeight: '600', color: '#000' },
  
  // Carousel
  slide: { width: width, flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  iconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFF5F5', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  heroEmoji: { fontSize: 100, marginBottom: 20 },
  slideTitle: { fontSize: 36, fontWeight: '900', color: '#000', textAlign: 'center' },
  slideSub: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 15, lineHeight: 24 },
  
  footerHint: { position: 'absolute', bottom: 30, alignSelf: 'center' },
  hintText: { fontSize: 12, color: '#aaa', fontWeight: '600', letterSpacing: 1 },

  startBtn: { backgroundColor: '#000', paddingVertical: 20, paddingHorizontal: 40, borderRadius: 40, alignItems: 'center' },
  startBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
