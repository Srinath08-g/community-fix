import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import UrgencyBadge from './UrgencyBadge';
import StatusBadge from './StatusBadge';
import CategoryIcon from './CategoryIcon';
import { COLORS } from '../utils/colors';
import { timeAgo } from '../utils/dateUtils';

const TicketCard = ({ ticket, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.topRow}>
      <CategoryIcon category={ticket.category} />
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>{ticket.title}</Text>
        <Text style={styles.meta}>by {ticket.raisedBy?.name} · {timeAgo(ticket.createdAt)}</Text>
      </View>
      <UrgencyBadge urgency={ticket.urgency} />
    </View>
    <View style={styles.bottomRow}>
      <StatusBadge status={ticket.status} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  titleContainer: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: COLORS.dark },
  meta: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  bottomRow: { flexDirection: 'row', alignItems: 'center' },
});

export default TicketCard;
