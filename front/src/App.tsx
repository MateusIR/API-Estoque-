// App.tsx (atualizado)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateItem from './pages/CreateItem';
import EditItem from './pages/EditItem';
import AdjustStock from './pages/AdjustStock';
import Reports from './pages/Reports';
import './App.css';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/items/new" element={<ProtectedRoute><CreateItem /></ProtectedRoute>} />
            <Route path="/items/:id/edit" element={<ProtectedRoute><EditItem /></ProtectedRoute>} />
            <Route path="/items/:id/adjust" element={<ProtectedRoute><AdjustStock /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;