import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';

const statusConfig = {
  Open: { backgroundColor: COLORS.info },
  'In Progress': { backgroundColor: '#f97316' },
  Resolved: { backgroundColor: COLORS.success },
  Closed: { backgroundColor: COLORS.gray },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.Open;
  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  text: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default StatusBadge;
