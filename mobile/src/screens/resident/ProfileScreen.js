import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/colors';

const ProfileScreen = () => {
  const { userProfile, logout } = useAuth();

  const initials = userProfile?.name
    ? userProfile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{userProfile?.name}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>{userProfile?.role === 'official' ? '🏛️ Official' : '🏠 Resident'}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <InfoRow label="Email" value={userProfile?.email} />
        {userProfile?.flatNumber && <InfoRow label="Flat Number" value={userProfile.flatNumber} />}
        {userProfile?.phone && <InfoRow label="Phone" value={userProfile.phone} />}
        <InfoRow label="Community" value={userProfile?.communityId} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || '-'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.white },
  avatarContainer: { alignItems: 'center', padding: 32, backgroundColor: COLORS.white, marginBottom: 8 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { color: COLORS.white, fontSize: 28, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', color: COLORS.dark, marginBottom: 8 },
  roleBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleBadgeText: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  infoLabel: { fontSize: 14, color: COLORS.gray },
  infoValue: { fontSize: 14, color: COLORS.dark, fontWeight: '600' },
  logoutButton: {
    backgroundColor: COLORS.danger,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});

export default ProfileScreen;
