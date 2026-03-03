import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import { auth, db } from '../config/firebase';
import { API_BASE_URL } from '../utils/constants';

export const loginUser = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const registerUser = async ({ name, email, password, role, communityId, flatNumber, phone }) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, {
    name,
    email,
    password,
    role,
    communityId,
    flatNumber,
    phone,
  });
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getCurrentUserProfile = async (uid) => {
  const docSnap = await getDoc(doc(db, 'users', uid));
  return docSnap.exists() ? docSnap.data() : null;
};
