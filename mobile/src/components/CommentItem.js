import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';
import { timeAgo } from '../utils/dateUtils';

const CommentItem = ({ comment }) => {
  const initial = comment.authorName ? comment.authorName[0].toUpperCase() : '?';
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.authorName}>{comment.authorName}</Text>
          <Text style={styles.time}>{timeAgo(comment.createdAt)}</Text>
        </View>
        <Text style={styles.text}>{comment.text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'flex-start',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 },
  content: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  authorName: { fontWeight: 'bold', fontSize: 13, color: COLORS.dark },
  time: { fontSize: 11, color: COLORS.gray },
  text: { fontSize: 14, color: COLORS.dark, lineHeight: 20 },
});

export default CommentItem;
