import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { addComment } from '../../services/ticketService';
import UrgencyBadge from '../../components/UrgencyBadge';
import StatusBadge from '../../components/StatusBadge';
import CategoryIcon from '../../components/CategoryIcon';
import CommentItem from '../../components/CommentItem';
import { COLORS } from '../../utils/colors';
import { formatDate } from '../../utils/dateUtils';

const TicketDetailScreen = ({ route, navigation }) => {
  const { ticketId } = route.params;
  const { userProfile, user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const unsubscribeTicket = onSnapshot(
      doc(db, 'tickets', ticketId),
      (docSnap) => {
        if (docSnap.exists()) setTicket({ id: docSnap.id, ...docSnap.data() });
      }
    );

    const commentsQ = query(
      collection(db, 'tickets', ticketId, 'comments'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribeComments = onSnapshot(commentsQ, (snapshot) => {
      setComments(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubscribeTicket();
      unsubscribeComments();
    };
  }, [ticketId]);

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    setSending(true);
    try {
      await addComment(ticketId, commentText.trim(), await user.getIdToken());
      setCommentText('');
    } catch {
      // comment failed silently
    } finally {
      setSending(false);
    }
  };

  if (!ticket) return <View style={styles.loading}><Text>Loading...</Text></View>;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket Details</Text>
      </View>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.detailsContainer}>
            {ticket.imageUrl && <Image source={{ uri: ticket.imageUrl }} style={styles.ticketImage} />}
            <Text style={styles.ticketTitle}>{ticket.title}</Text>
            <View style={styles.badgesRow}>
              <CategoryIcon category={ticket.category} />
              <Text style={styles.categoryText}>{ticket.category}</Text>
              <UrgencyBadge urgency={ticket.urgency} />
              <StatusBadge status={ticket.status} />
            </View>
            <Text style={styles.description}>{ticket.description}</Text>
            <Text style={styles.raisedBy}>
              Raised by: {ticket.raisedBy?.name} - Flat {ticket.raisedBy?.flatNumber}
            </Text>
            <Text style={styles.date}>{formatDate(ticket.createdAt)}</Text>
            <View style={styles.divider} />
            <Text style={styles.commentsHeader}>Comments ({comments.length})</Text>
          </View>
        }
        renderItem={({ item }) => <CommentItem comment={item} />}
        ListEmptyComponent={<Text style={styles.noComments}>No comments yet</Text>}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.commentBar}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendComment} disabled={sending}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBar: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 50, gap: 16, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
  backBtn: { color: COLORS.primary, fontSize: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.dark },
  listContent: { paddingBottom: 20 },
  detailsContainer: { padding: 16 },
  ticketImage: { width: '100%', height: 220, borderRadius: 12, marginBottom: 16, resizeMode: 'cover' },
  ticketTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.dark, marginBottom: 12 },
  badgesRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  categoryText: { fontSize: 14, color: COLORS.gray },
  description: { fontSize: 15, color: COLORS.dark, lineHeight: 22, marginBottom: 12 },
  raisedBy: { fontSize: 13, color: COLORS.gray },
  date: { fontSize: 12, color: COLORS.gray, marginTop: 4 },
  divider: { height: 1, backgroundColor: COLORS.lightGray, marginVertical: 16 },
  commentsHeader: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark },
  noComments: { color: COLORS.gray, textAlign: 'center', padding: 16, fontSize: 14 },
  commentBar: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    alignItems: 'flex-end',
    backgroundColor: COLORS.white,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    backgroundColor: COLORS.lightGray,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: { color: COLORS.white, fontWeight: '600' },
});

export default TicketDetailScreen;
