import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserProfile = async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      return;
    }
    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        });
      } else {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
      });
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      fetchUserProfile(firebaseUser);
    });
    return () => unsub();
  }, []);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserProfile(userCredential.user);
    return userCredential;
  };

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
