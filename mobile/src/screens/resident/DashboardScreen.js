import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import TicketCard from '../../components/TicketCard';
import { COLORS } from '../../utils/colors';
import { CATEGORIES } from '../../utils/constants';

const DashboardScreen = ({ navigation }) => {
  const { userProfile } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!userProfile?.communityId) return;
    const q = query(
      collection(db, 'tickets'),
      where('communityId', '==', userProfile.communityId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTickets(data);
    });
    return unsubscribe;
  }, [userProfile]);

  useEffect(() => {
    let filtered = tickets;
    if (categoryFilter !== 'All') filtered = filtered.filter((t) => t.category === categoryFilter);
    if (urgencyFilter !== 'All') filtered = filtered.filter((t) => t.urgency === urgencyFilter);
    setFilteredTickets(filtered);
  }, [tickets, categoryFilter, urgencyFilter]);

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === 'Open').length;
  const resolvedTickets = tickets.filter((t) => t.status === 'Resolved').length;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {userProfile?.name?.split(' ')[0]} 👋</Text>
        <Text style={styles.communityName}>{userProfile?.communityId}</Text>
      </View>

      <FlatList
        data={filteredTickets}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <>
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: COLORS.info + '20' }]}>
                <Text style={[styles.statNumber, { color: COLORS.info }]}>{totalTickets}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: COLORS.warning + '20' }]}>
                <Text style={[styles.statNumber, { color: COLORS.warning }]}>{openTickets}</Text>
                <Text style={styles.statLabel}>Open</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: COLORS.success + '20' }]}>
                <Text style={[styles.statNumber, { color: COLORS.success }]}>{resolvedTickets}</Text>
                <Text style={styles.statLabel}>Resolved</Text>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {['All', ...CATEGORIES].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.filterChip, categoryFilter === cat && styles.filterChipActive]}
                  onPress={() => setCategoryFilter(cat)}
                >
                  <Text style={[styles.filterChipText, categoryFilter === cat && styles.filterChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.urgencyRow}>
              {['All', '🔴 High', '🟡 Medium', '🟢 Low'].map((u) => {
                const val = u === 'All' ? 'All' : u.split(' ')[1];
                return (
                  <TouchableOpacity
                    key={u}
                    style={[styles.urgencyChip, urgencyFilter === val && styles.urgencyChipActive]}
                    onPress={() => setUrgencyFilter(val)}
                  >
                    <Text style={[styles.urgencyChipText, urgencyFilter === val && styles.urgencyChipTextActive]}>
                      {u}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TicketCard ticket={item} onPress={() => navigation.navigate('TicketDetail', { ticketId: item.id })} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No issues reported yet 🎉</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('RaiseIssue')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 50 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: COLORS.white },
  communityName: { fontSize: 14, color: COLORS.white + 'cc', marginTop: 2 },
  statsRow: { flexDirection: 'row', padding: 16, gap: 12 },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  filterRow: { paddingHorizontal: 16, paddingBottom: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { color: COLORS.gray, fontSize: 13 },
  filterChipTextActive: { color: COLORS.white, fontWeight: '600' },
  urgencyRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  urgencyChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  urgencyChipActive: { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary },
  urgencyChipText: { color: COLORS.gray, fontSize: 12 },
  urgencyChipTextActive: { color: COLORS.white, fontWeight: '600' },
  listContent: { paddingBottom: 80 },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: COLORS.gray },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: { color: COLORS.white, fontSize: 28, fontWeight: 'bold' },
});

export default DashboardScreen;
