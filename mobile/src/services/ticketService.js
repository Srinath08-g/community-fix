import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import axios from 'axios';
import { db } from '../config/firebase';
import { API_BASE_URL } from '../utils/constants';

export const createTicket = async (ticketData, token) => {
  const response = await axios.post(`${API_BASE_URL}/tickets`, ticketData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCommunityTickets = (communityId, callback) => {
  const q = query(
    collection(db, 'tickets'),
    where('communityId', '==', communityId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const tickets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(tickets);
  });
};

export const getTicketById = async (ticketId, token) => {
  const response = await axios.get(`${API_BASE_URL}/tickets/${ticketId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addComment = async (ticketId, text, token) => {
  const response = await axios.post(
    `${API_BASE_URL}/tickets/${ticketId}/comments`,
    { text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateTicketStatus = async (ticketId, status, token) => {
  const response = await axios.patch(
    `${API_BASE_URL}/admin/tickets/${ticketId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
