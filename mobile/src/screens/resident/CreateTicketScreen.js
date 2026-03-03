import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { createTicket } from '../../services/ticketService';
import { uploadTicketImage } from '../../services/uploadService';
import { COLORS } from '../../utils/colors';
import { CATEGORIES, URGENCY_LEVELS, CATEGORY_ICONS } from '../../utils/constants';

const CreateTicketScreen = ({ navigation }) => {
  const { userProfile, user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Garbage');
  const [urgency, setUrgency] = useState('Low');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Validation Error', 'Title and description are required');
      return;
    }
    setLoading(true);
    try {
      let imageUrl = null;
      if (imageUri) {
        const ticketId = Date.now().toString();
        imageUrl = await uploadTicketImage(imageUri, ticketId);
      }
      await createTicket({ title, description, category, urgency, imageUrl }, await user.getIdToken());
      Alert.alert('Success', 'Ticket raised successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Raise Issue</Text>
      </View>

      <Text style={styles.label}>Title *</Text>
      <TextInput style={styles.input} placeholder="Brief title of the issue" value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe the issue in detail"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryItem, category === cat && styles.categoryItemActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={styles.categoryIcon}>{CATEGORY_ICONS[cat]}</Text>
            <Text style={[styles.categoryLabel, category === cat && styles.categoryLabelActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Urgency</Text>
      <View style={styles.urgencyRow}>
        {URGENCY_LEVELS.map((level) => {
          const colors = { Low: COLORS.success, Medium: COLORS.warning, High: COLORS.danger };
          return (
            <TouchableOpacity
              key={level}
              style={[
                styles.urgencyButton,
                urgency === level && { backgroundColor: colors[level], borderColor: colors[level] },
              ]}
              onPress={() => setUrgency(level)}
            >
              <Text style={[styles.urgencyButtonText, urgency === level && { color: COLORS.white }]}>
                {level === 'Low' ? '🟢' : level === 'Medium' ? '🟡' : '🔴'} {level}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Text style={styles.photoButtonText}>📷 {imageUri ? 'Change Photo' : 'Add Photo'}</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitButtonText}>{loading ? 'Submitting...' : 'Submit Ticket'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: 20, paddingTop: 50, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 16 },
  backBtn: { color: COLORS.primary, fontSize: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.dark },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.dark, marginTop: 16, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    backgroundColor: COLORS.lightGray,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  categoryRow: { flexDirection: 'row' },
  categoryItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.lightGray,
    minWidth: 72,
  },
  categoryItemActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '15' },
  categoryIcon: { fontSize: 24 },
  categoryLabel: { fontSize: 11, color: COLORS.gray, marginTop: 4 },
  categoryLabelActive: { color: COLORS.primary, fontWeight: '600' },
  urgencyRow: { flexDirection: 'row', gap: 10 },
  urgencyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  urgencyButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.gray },
  photoButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  photoButtonText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },
  previewImage: { width: '100%', height: 200, borderRadius: 12, marginTop: 12, resizeMode: 'cover' },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
  },
  submitButtonText: { color: COLORS.white, fontSize: 17, fontWeight: 'bold' },
});

export default CreateTicketScreen;
