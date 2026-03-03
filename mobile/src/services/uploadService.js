import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export const uploadTicketImage = async (uri, ticketId) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `tickets/${ticketId}/image.jpg`);
  await uploadBytes(storageRef, blob);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};
