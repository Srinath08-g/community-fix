import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';

const urgencyConfig = {
  Low: { backgroundColor: COLORS.success, label: '🟢 Low' },
  Medium: { backgroundColor: COLORS.warning, label: '🟡 Medium' },
  High: { backgroundColor: COLORS.danger, label: '🔴 High' },
};

const UrgencyBadge = ({ urgency }) => {
  const config = urgencyConfig[urgency] || urgencyConfig.Low;
  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
      <Text style={styles.text}>{config.label}</Text>
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

export default UrgencyBadge;
