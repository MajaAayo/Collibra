import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddBook from './AddBook';
import ViewBooks from './ViewBooks';
import EditBook from './EditBook';
import AdminNavbar from '../components/BookList'; // We'll repurpose BookList as AdminNavbar
import '../css/style.css';

const Admin = () => {
  return (
    <div className="admin-panel">
      <AdminNavbar />
      <div className="admin-content">
        <Routes>
          <Route path="add-book" element={<AddBook />} />
          <Route path="view-books" element={<ViewBooks />} />
          <Route path="edit-book/:id" element={<EditBook />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;