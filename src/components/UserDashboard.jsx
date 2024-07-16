import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { FaEdit, FaTrash } from 'react-icons/fa';

const UserDashboard = () => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setUserName(data.name);
        });

        const itemsRef = ref(db, `users/${user.uid}/items`);
        onValue(itemsRef, (snapshot) => {
          const data = snapshot.val();
          const itemsArray = data ? Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })) : [];
          setItems(itemsArray);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (user) {
      const itemsRef = ref(db, `users/${user.uid}/items`);
      if (editId) {
        update(ref(db, `users/${user.uid}/items/${editId}`), { title, link });
        setEditId(null);
      } else {
        push(itemsRef, { title, link });
      }
      setTitle('');
      setLink('');
    }
  };

  const handleEditItem = (id, title, link) => {
    setEditId(id);
    setTitle(title);
    setLink(link);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      remove(ref(db, `users/${user.uid}/items/${id}`));
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      signOut(auth);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center bg-yellow-200 p-4 mb-6">
        <h1 className="text-2xl font-bold">LinkHub</h1>
        <h2 className="text-2xl">Hi, {userName} 🖐</h2>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200">Logout</button>
      </div>
      
      <form onSubmit={handleAddItem} className="bg-white p-6 rounded shadow-md">
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className='block mb-2 text-gray-600'>Title:</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <div className="flex-1">
            <label className='block mb-2 text-gray-600'>Link:</label>
            <input 
              type="url" 
              value={link} 
              onChange={(e) => setLink(e.target.value)} 
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded self-end hover:bg-green-600 transition duration-200">
            {editId ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </form>
      <table  className="table-auto w-full mt-6 bg-white rounded shadow-md ">
        <thead>
          <tr className='bg-gray-200'>
            <th className="px-4 py-2 text-left text-gray-600">Title</th>
            <th className="px-4 py-2 text-left text-gray-600">Link</th>
            <th className="px-4 py-2 text-left text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className='border-t'>
              <td className="border px-4 py-2">{item.title}</td>
              <td className="border px-4 py-2"><a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">{item.link}</a></td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEditItem(item.id, item.title, item.link)} className="text-blue-500 mr-2 hover:text-blue-700 transition duration-200">
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700 transition duration-200">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;
