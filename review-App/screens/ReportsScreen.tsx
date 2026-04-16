import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE } from '../constants';
import { Business } from '../App';

const COLORS = {
  primary: '#0066FF',
  positive: '#4CAF50',
  negative: '#EF5350',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#999999',
  darkGray: '#333333',
  lightBorder: '#E8E8E8',
};

interface ReportData {
  positive: number;
  negative: number;
  labels: string[];
  dataPositive: number[];
  dataNegative: number[];
}

interface ReportsScreenProps {
  business?: Business;
  onScreenChange: (screen: string) => void;
}

export function ReportsScreen({ business, onScreenChange }: ReportsScreenProps) {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    fetchReport();
  }, [filter, business?.id]);

  const fetchReport = async () => {
    if (!business?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/analytics/report/${business.id}?filter=${filter}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error('Report fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const maxVal = data ? Math.max(...data.dataPositive, ...data.dataNegative, 1) : 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with BACK button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => onScreenChange('settings')}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.headerTitle}>{business?.name || 'GMB'} Performance Report</Text>
          <Text style={styles.headerSubtitle}>Confidential Analytics</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.introCard}>
          <Text style={styles.introText}>
            This report generates a summary of all negative and positive reviews on a monthly, weekly, or daily basis.
          </Text>
        </View>

        {/* Filter Toggles */}
        <View style={styles.filterContainer}>
          {(['daily', 'weekly', 'monthly'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : data && data.labels.length > 0 ? (
          <>
            {/* Stats Cards */}
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { borderLeftColor: COLORS.positive }]}>
                <Text style={styles.statLabel}>Positive (Redirected)</Text>
                <Text style={[styles.statValue, { color: COLORS.positive }]}>{data.positive}</Text>
              </View>
              <View style={[styles.statCard, { borderLeftColor: COLORS.negative }]}>
                <Text style={styles.statLabel}>Negative (Captured)</Text>
                <Text style={[styles.statValue, { color: COLORS.negative }]}>{data.negative}</Text>
              </View>
            </View>

            {/* Growth Chart */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Review Distribution</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartScroll}>
                {data.labels.map((label, idx) => (
                  <View key={idx} style={styles.chartColumn}>
                    <View style={styles.barStack}>
                      <View 
                        style={[
                          styles.bar, 
                          { 
                            height: (data.dataPositive[idx] / maxVal) * 150, 
                            backgroundColor: COLORS.positive,
                          }
                        ]} 
                      />
                      <View 
                        style={[
                          styles.bar, 
                          { 
                            height: (data.dataNegative[idx] / maxVal) * 150, 
                            backgroundColor: COLORS.negative,
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.barLabel}>{label.split('-').pop()}</Text>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: COLORS.positive }]} />
                  <Text style={styles.legendText}>Positive</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: COLORS.negative }]} />
                  <Text style={styles.legendText}>Negative</Text>
                </View>
              </View>
            </View>

            {/* Periodic Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.sectionTitle}>Periodic Summary</Text>
              {data.labels.map((label, idx) => (
                <View key={idx} style={styles.summaryRow}>
                  <Text style={styles.summaryDate}>{label}</Text>
                  <View style={styles.summaryValues}>
                    <Text style={[styles.summaryVal, { color: COLORS.positive }]}>+{data.dataPositive[idx]}</Text>
                    <Text style={[styles.summaryVal, { color: COLORS.negative }]}>-{data.dataNegative[idx]}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📉</Text>
            <Text style={styles.emptyTitle}>No Data Found</Text>
            <Text style={styles.emptyText}>
              There are no reviews recorded yet for this period. 
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBorder
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lightGray,
    justifyContent: 'center', alignItems: 'center'
  },
  backIcon: { fontSize: 24, fontWeight: 'bold', color: COLORS.darkGray },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.darkGray },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  introCard: { backgroundColor: '#F0F5FF', padding: 15, borderRadius: 12, marginVertical: 20 },
  introText: { fontSize: 13, color: COLORS.primary, fontWeight: '600', lineHeight: 18, textAlign: 'center' },
  filterContainer: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.lightGray, 
    borderRadius: 12, 
    padding: 4,
    marginBottom: 20
  },
  filterTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  filterTabActive: { backgroundColor: COLORS.white, elevation: 2 },
  filterTabText: { fontSize: 13, fontWeight: '600', color: COLORS.mediumGray },
  filterTabTextActive: { color: COLORS.primary, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.lightBorder, borderLeftWidth: 4 },
  statLabel: { fontSize: 10, color: COLORS.mediumGray, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '800' },
  chartContainer: { 
    backgroundColor: COLORS.white, 
    borderRadius: 20, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: COLORS.lightBorder,
    marginBottom: 24
  },
  chartTitle: { fontSize: 16, fontWeight: '700', color: COLORS.darkGray, marginBottom: 20 },
  chartScroll: { alignItems: 'flex-end', paddingBottom: 10 },
  chartColumn: { alignItems: 'center', marginRight: 15, width: 30 },
  barStack: { justifyContent: 'flex-end', height: 150, gap: 2 },
  bar: { width: 12, borderRadius: 6 },
  barLabel: { fontSize: 10, color: COLORS.mediumGray, marginTop: 8, fontWeight: '600' },
  chartLegend: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 20, borderTopWidth: 1, borderTopColor: COLORS.lightBorder, paddingTop: 15 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: COLORS.mediumGray, fontWeight: '600' },
  summaryContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.darkGray, marginBottom: 16 },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.lightBorder 
  },
  summaryDate: { fontSize: 14, fontWeight: '600', color: COLORS.darkGray },
  summaryValues: { flexDirection: 'row', gap: 12 },
  summaryVal: { fontSize: 14, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: COLORS.darkGray, marginBottom: 5 },
  emptyText: { fontSize: 14, color: COLORS.mediumGray, textAlign: 'center' },
});
