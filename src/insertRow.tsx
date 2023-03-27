import React from 'react';
import { db } from './firestore';
import { collection, addDoc } from 'firebase/firestore';

function insert() {
  const insertRow = async () => {
    try {
      const docRef = await addDoc(
        collection(db, 'doanduckien.2001@gmail.com'),
        {
          date: '',
          name: '',
        }
      );
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div>
      <button onClick={insertRow}>Insert</button>
    </div>
  );
}

export default insert;
