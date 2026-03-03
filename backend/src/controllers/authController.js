const admin = require('../config/firebase');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, communityId, flatNumber, phone } = req.body;
    if (!name || !email || !password || !role || !communityId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const userRecord = await admin.auth().createUser({ email, password, displayName: name });

    const profile = {
      name,
      email,
      role,
      communityId,
      flatNumber: flatNumber || null,
      phone: phone || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await admin.firestore().collection('users').doc(userRecord.uid).set(profile);

    return res.status(201).json({ message: 'User registered successfully', uid: userRecord.uid });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
