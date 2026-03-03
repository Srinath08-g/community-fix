import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import TicketCard from '../../components/TicketCard';
import { COLORS } from '../../utils/colors';
import { TICKET_STATUSES, URGENCY_LEVELS, CATEGORIES } from '../../utils/constants';

const AllTicketsScreen = ({ navigation }) => {
  const { userProfile } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    if (!userProfile?.communityId) return;
    const q = query(
      collection(db, 'tickets'),
      where('communityId', '==', userProfile.communityId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTickets(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [userProfile]);

  const filtered = tickets.filter((t) => {
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    if (urgencyFilter && t.urgency !== urgencyFilter) return false;
    if (categoryFilter && t.category !== categoryFilter) return false;
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Tickets 📋</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Search tickets..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.filterRow}>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={statusFilter} onValueChange={setStatusFilter} style={styles.picker}>
            <Picker.Item label="All Status" value="" />
            {TICKET_STATUSES.map((s) => <Picker.Item key={s} label={s} value={s} />)}
          </Picker>
        </View>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={urgencyFilter} onValueChange={setUrgencyFilter} style={styles.picker}>
            <Picker.Item label="All Urgency" value="" />
            {URGENCY_LEVELS.map((u) => <Picker.Item key={u} label={u} value={u} />)}
          </Picker>
        </View>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={categoryFilter} onValueChange={setCategoryFilter} style={styles.picker}>
            <Picker.Item label="All Category" value="" />
            {CATEGORIES.map((c) => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TicketCard
            ticket={item}
            onPress={() => navigation.navigate('OfficialTicketDetail', { ticketId: item.id })}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No tickets found</Text>}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.white },
  searchBar: {
    margin: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: COLORS.white,
  },
  filterRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 8, marginBottom: 4 },
  pickerWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  picker: { height: 44 },
  listContent: { paddingBottom: 20 },
  emptyText: { textAlign: 'center', color: COLORS.gray, padding: 20, fontSize: 15 },
});

export default AllTicketsScreen;
