import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { updateTicketStatus } from '../../services/ticketService';
import TicketCard from '../../components/TicketCard';
import { COLORS } from '../../utils/colors';

const AdminDashboardScreen = ({ navigation }) => {
  const { userProfile, user } = useAuth();
  const [stats, setStats] = useState({ total: 0, byStatus: {}, byUrgency: {}, byCategory: {} });
  const [recentTickets, setRecentTickets] = useState([]);

  useEffect(() => {
    if (!userProfile?.communityId) return;
    const q = query(
      collection(db, 'tickets'),
      where('communityId', '==', userProfile.communityId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const byStatus = { Open: 0, 'In Progress': 0, Resolved: 0, Closed: 0 };
      const byUrgency = { Low: 0, Medium: 0, High: 0 };
      const byCategory = {};
      tickets.forEach((t) => {
        if (byStatus[t.status] !== undefined) byStatus[t.status]++;
        if (byUrgency[t.urgency] !== undefined) byUrgency[t.urgency]++;
        byCategory[t.category] = (byCategory[t.category] || 0) + 1;
      });
      setStats({ total: tickets.length, byStatus, byUrgency, byCategory });
      setRecentTickets(tickets.slice(0, 5));
    });
    return unsubscribe;
  }, [userProfile]);

  const handleStatusUpdate = async (ticketId, status) => {
    try {
      const token = await user.getIdToken();
      await updateTicketStatus(ticketId, status, token);
    } catch {
      // update failed silently
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard 🏛️</Text>
        <Text style={styles.communityName}>{userProfile?.communityId}</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="🔵 Total" value={stats.total} color={COLORS.info} />
        <StatCard label="🟠 Open" value={stats.byStatus.Open || 0} color={COLORS.warning} />
        <StatCard label="🟡 In Progress" value={stats.byStatus['In Progress'] || 0} color="#f97316" />
        <StatCard label="🟢 Resolved" value={stats.byStatus.Resolved || 0} color={COLORS.success} />
        <StatCard label="⚫ Closed" value={stats.byStatus.Closed || 0} color={COLORS.gray} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Urgency Breakdown</Text>
        <View style={styles.urgencyBar}>
          <UrgencyItem label="🔴 High" count={stats.byUrgency.High || 0} color={COLORS.danger} />
          <UrgencyItem label="🟡 Medium" count={stats.byUrgency.Medium || 0} color={COLORS.warning} />
          <UrgencyItem label="🟢 Low" count={stats.byUrgency.Low || 0} color={COLORS.success} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Tickets</Text>
        {recentTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onPress={() => navigation.navigate('OfficialTicketDetail', { ticketId: ticket.id })}
          />
        ))}
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('AllTicketsFromDashboard')}
        >
          <Text style={styles.viewAllButtonText}>View All Tickets →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const StatCard = ({ label, value, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const UrgencyItem = ({ label, count, color }) => (
  <View style={styles.urgencyItem}>
    <Text style={[styles.urgencyCount, { color }]}>{count}</Text>
    <Text style={styles.urgencyLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.white },
  communityName: { fontSize: 13, color: COLORS.white + 'cc', marginTop: 2 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 10,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 16,
    minWidth: '45%',
    flex: 1,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: { fontSize: 28, fontWeight: 'bold' },
  statLabel: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  section: { margin: 16, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark, marginBottom: 12 },
  urgencyBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-around',
  },
  urgencyItem: { alignItems: 'center' },
  urgencyCount: { fontSize: 24, fontWeight: 'bold' },
  urgencyLabel: { fontSize: 12, color: COLORS.gray, marginTop: 4 },
  viewAllButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  viewAllButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 15 },
});

export default AdminDashboardScreen;
