import React from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsPanel from '../components/SettingsPanel.jsx';

export default function Settings() {
  const navigate = useNavigate();
  return <SettingsPanel onClose={() => navigate('/chat')} />;
}
