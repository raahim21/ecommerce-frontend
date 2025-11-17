// src/components/account/ProfileTab.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield, CheckCircle, XCircle, Edit2, Key, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast'
import { useThemeClasses } from '../../hooks/useThemeClasses';

const API = import.meta.env.VITE_API_BASE_URL;

const ProfileTab = () => {
  const { user } = useAuth();
  const theme = useThemeClasses();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false)
  const [saving, setSaving] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false)


  const verifyPassword = async (e) => {
    e.preventDefault();
    setVerifyLoading(true)
    
    try {
      const res = await fetch(`${API}/api/auth/verify-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const data = await res.json();
      
      if (data.confirmed){
        setConfirmed(true)
        toast.success('You may enter a new password')
      } else{
        toast.error('passwords did not match')
      };
      
      
    } else {
      toast.error('Passwords did not match')
    }
    } catch (error) {
      console.log(error) 
    } finally{
      setVerifyLoading(false)
    }
  };

  const changePassword = async (e) => {

    e.preventDefault();
    const res = await fetch(`${API}/api/auth/change-password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ newPassword }),
    });
    if (res.ok) {
      toast.success('passwords changed successfully!')
      setIsOpen(false);
      setConfirmed(false);
      setPassword('');
      setNewPassword('');
    } else {
      alert('Failed to change password');
    }
  };

  const saveName = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/auth/change-name`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        let data = await res.json()
        setEditingName(false)
        setName(data.name)
      };
    } catch {
      alert('Failed to update name');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={`px-3 py-1 rounded-lg border ${theme.border} bg-transparent ${theme.textMain}`}
                />
                <button onClick={saveName} disabled={saving} className="text-green-500">
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                </button>
                <button onClick={() => { setEditingName(false); setName(user.name); }} className="text-red-500">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <h3 className={`text-2xl font-bold ${theme.textMain}`}>{user?.name}</h3>
            )}
          </div>
        </div>
        {!editingName && (
          <button
            onClick={() => { setEditingName(true); setName(user.name); }}
            className={`flex items-center gap-1 text-sm ${theme.accent} hover:underline`}
          >
            <Edit2 className="w-4 h-4" /> Edit
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Mail className={`w-5 h-5 ${theme.textMuted}`} />
          <span className={theme.textSub}>{user?.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Shield className={`w-5 h-5 ${theme.textMuted}`} />
          <span className={theme.textSub}>Role: <strong className="capitalize">{user?.role}</strong></span>
        </div>
        <div className="flex items-center gap-3">
          {user?.isVerified ? (
            <CheckCircle className={`w-5 h-5 ${theme.success}`} />
          ) : (
            <XCircle className={`w-5 h-5 ${theme.danger}`} />
          )}
          <span className={user?.isVerified ? theme.success : theme.danger}>
            {user?.isVerified ? 'Verified' : 'Not Verified'}
          </span>
          {!user?.isVerified && (
            <button className={`ml-auto text-sm ${theme.accent} hover:underline`}>
              Resend Link
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-4">
        <button
          to="/change-password"
          onClick={() => {
            setIsOpen(prev => !prev)
          }}
          className={`flex items-center gap-2 px-5 py-2.5 ${theme.buttonBg} text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all`}
        >
           {verifyLoading ? <Loader2/> : (
            <>
            <Key className="w-4 h-4" />
            <p>Change Password</p>
            </>
            )}
        </button>
        





{isOpen && !confirmed && (
          <form onSubmit={verifyPassword} className="mt-3 flex flex-col gap-2">
            <input
              type="password"
              placeholder="Enter current password"
              className="bg-white rounded px-3 py-2 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white rounded py-1">Verify</button>
          </form>
        )}

        {isOpen && confirmed && (
          <form onSubmit={changePassword} className="mt-3 flex flex-col gap-2">
            <input
              type="password"
              placeholder="Enter new password"
              className="bg-white rounded px-3 py-2 text-black"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit" className="bg-green-600 text-white rounded py-1">Change Password</button>
          </form>
        )}




      </div>
    </div>
  );
};

export default ProfileTab;