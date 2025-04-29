import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { AuthContext } from './AuthContext';
import { db } from '../utils/firebase';

// Default categories to seed a new user
const DEFAULT_CATEGORIES = [
  'General',
  'Food',
  'Rent',
  'Salary',
  'Bills',
  'Subscriptions',
];

export const CategoryContext = createContext({
  categories: [],
  addCategory: async () => {},
  updateCategory: async () => {},
  deleteCategory: async () => {},
});

export function CategoryProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (!user) return;

    const colRef = collection(db, 'users', user.uid, 'categories');
    const q = query(colRef, orderBy('name', 'asc'));

    // Listen for changes
    const unsubscribe = onSnapshot(q, snap => {
      const docs = snap.docs.map(d => ({ id: d.id, name: d.data().name }));
      setCategories(docs);

      // Seed defaults once if empty
      if (docs.length === 0 && !seeded) {
        DEFAULT_CATEGORIES.forEach(name => {
          addDoc(colRef, { name });
        });
        setSeeded(true);
      }
    });

    return unsubscribe;
  }, [user, seeded]);

  // CRUD operations
  const addCategory = async (name) => {
    if (!name.trim()) return;
    await addDoc(collection(db, 'users', user.uid, 'categories'), { name: name.trim() });
  };

  const updateCategory = async (id, name) => {
    await updateDoc(doc(db, 'users', user.uid, 'categories', id), { name: name.trim() });
  };

  const deleteCategory = async (id) => {
    await deleteDoc(doc(db, 'users', user.uid, 'categories', id));
  };

  // Only JSX here—no stray strings
  return (
    <CategoryContext.Provider value={{
      categories,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </CategoryContext.Provider>
  );
}