import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '../components/ProfileModal.jsx';

export default function Profile() {
  const navigate = useNavigate();
  return <ProfileModal onClose={() => navigate('/chat')} />;
}
