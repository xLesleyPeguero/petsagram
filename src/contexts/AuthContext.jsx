import { createContext, useContext, useState } from 'react';
import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc, query, where, getDocs, collection } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const register = async (username, password, firstName, lastName) => {
    try {
      // Validate input
      if (!username || !password || !firstName || !lastName) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Check if username already exists
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error('Username already exists');
      }

      // Create user document in Firestore
      const userRef = doc(collection(db, 'users'));
      const userData = {
        id: userRef.id,
        username,
        password,
        firstName,
        lastName,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(userRef, userData);
      
      // Set current user after successful registration
      setCurrentUser({
        id: userRef.id,
        username,
        firstName,
        lastName
      });

      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const login = async (username, password) => {
    try {
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      // Find user by username
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Invalid username or password');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Check password (in plain text)
      if (userData.password !== password) {
        throw new Error('Invalid username or password');
      }

      // Remove password from user data before setting current user
      const { password: _, ...userWithoutPassword } = userData;
      setCurrentUser(userWithoutPassword);
      return userWithoutPassword;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 