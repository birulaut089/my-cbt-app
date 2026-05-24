"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, User, LogIn, LayoutDashboard, Users, BookOpen,
  Settings, LogOut, Clock, CheckCircle, AlertTriangle, Play, FileUp, List,
  ChevronLeft, Plus, CheckSquare, UploadCloud, Database, Save, FileText
} from 'lucide-react';
import * as XLSX from 'xlsx';

const GAS_URL = "https://script.google.com/macros/s/AKfycbyUGtn7HpP4a5ex9XBxv0KaRVXgslKEKwtQLQLvpSCXCThK9XdSbkR5fR3q0hDbOgeRrQ/exec";

/* --- KOMPONEN TABEL --- */
function DataTable({ data, headers }: { data: any[][], headers: string[] }) {
  if (!data || data.length === 0) return <div className="p-8 text-center text-slate-500 bg-white rounded-xl shadow border border-slate-200">Tiada data untuk dipaparkan.</div>;
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow border border-slate-200">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>{headers.map((h, i) => <th key={i} className="p-4 font-semibold text-slate-700 whitespace-nowrap">{h}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              {headers.map((_, j) => <td key={j} className="p-4 text-slate-600">{String(row[j] || '-')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CBTApp() {
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [toast, setToast] = useState<{message: string, type: string} | null>(null);

  const showToast = (message: string, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setCurrentView(String(user.role).toLowerCase().trim()); 
    showToast(`Selamat datang, ${user.name}!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 20 }} exit={{ opacity: 0, y: -50 }} className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
            {toast.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />} {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentView === 'login' && <LoginView key="login" onLogin={handleLogin} onError={showToast} />}
        {currentView === 'admin' && <AdminDashboard key="admin" user={currentUser} onLogout={() => setCurrentView('login')} onShowToast={showToast} />}
        {currentView === 'guru' && <GuruDashboard key="guru" user={currentUser} onLogout={() => setCurrentView('login')} onShowToast={showToast} />}
      </AnimatePresence>
    </div>
  );
}

function LoginView({ onLogin, onError }: any) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'login', ...form }) });
      const data = await res.json();
      if (data.status === 'success') onLogin(data.user);
      else onError(data.message, 'error');
    } catch { onError('Gagal terhubung ke database', 'error'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-8">Login CBT</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" required placeholder="Username" className="w-full border rounded-xl py-3 px-4" onChange={e => setForm({...form, username: e.target.value})} />
          <input type="password" required placeholder="Password" className="w-full border rounded-xl py-3 px-4" onChange={e => setForm({...form, password: e.target.value})} />
          <button disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl">{loading ? '...' : 'Masuk'}</button>
        </form>
      </div>
    </div>
  );
}

function DashboardLayout({ children, title, user, onLogout, roleColor, activeTab, onTabChange, menuItems }: any) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-72 bg-slate-900 p-6 flex flex-col h-screen sticky top-0">
        <div className="flex items-center gap-3 mb-10 text-white font-bold text-xl"><div className={`w-8 h-8 rounded-lg ${roleColor} flex items-center justify-center`}>D</div> CBT Darul Ulum</div>
        <nav className="flex-1 space-y-2">
          {menuItems?.map((m: any) => (
            <div key={m.id} onClick={() => onTabChange(m.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${activeTab === m.id ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              {m.icon} {m.label}
            </div>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto py-3 text-red-400 hover:text-red-300 flex items-center gap-2"><LogOut size={16}/> Keluar</button>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

function GuruDashboard({ user, onLogout, onShowToast }: any) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [qForm, setQForm] = useState({ pertanyaan: '', a: '', b: '', c: '', d: '', e: '', jawaban: 'A' });
  const [loading, setLoading] = useState(false);
  const [activeToken, setActiveToken] = useState('XYZ987');

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (event: any) => {
      const data = XLSX.utils.sheet_to_json(XLSX.read(event.target.result, { type: 'binary' }).Sheets[Object.keys(XLSX.read(event.target.result, { type: 'binary' }).Sheets)[0]], { header: 1 });
      setLoading(true);
      await fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'uploadQuestions', payload: data.slice(1) }) });
      onShowToast('Excel berhasil di-upload!');
      setLoading(false);
    };
    reader.readAsBinaryString(file);
  };

  const guruMenus = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
    { id: 'soal', label: 'Input Soal', icon: <FileText size={18}/> },
    { id: 'upload', label: 'Upload Excel', icon: <UploadCloud size={18}/> },
    { id: 'token', label: 'Token Ujian', icon: <Lock size={18}/> }
  ];

  return (
    <DashboardLayout title="Ruang Guru" user={user} onLogout={onLogout} roleColor="bg-emerald-500" activeTab={activeTab} onTabChange={setActiveTab} menuItems={guruMenus}>
      {activeTab === 'upload' && (
        <div className="bg-white p-12 rounded-3xl text-center border">
          <UploadCloud size={64} className="mx-auto text-emerald-500 mb-4" />
          <input type="file" onChange={handleFileUpload} className="block w-full p-4 border rounded-xl" />
        </div>
      )}
      {activeTab === 'token' && (
        <div className="bg-white p-12 rounded-3xl text-center border">
          <h2 className="text-4xl font-black mb-6">{activeToken}</h2>
          <button onClick={() => setActiveToken(Math.random().toString(36).substring(7).toUpperCase())} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">Acak Token Baru</button>
        </div>
      )}
      {activeTab === 'dashboard' && <div className="bg-white p-8 rounded-3xl border">Selamat datang, Bapak/Ibu {user?.name}</div>}
    </DashboardLayout>
  );
}

function AdminDashboard({ user, onLogout, onShowToast }: any) {
  // ... (Sama seperti struktur sebelumnya)
  return <div className="p-8">Portal Admin</div>
}