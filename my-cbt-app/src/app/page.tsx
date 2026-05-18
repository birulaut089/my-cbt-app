"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, User, LogIn, LayoutDashboard, Users, BookOpen,
  Settings, LogOut, Clock, CheckCircle, AlertTriangle, Play, FileUp, List,
  ChevronLeft, Plus, Edit, Trash2, FileText, CheckSquare
} from 'lucide-react';

/* --- MAIN APP COMPONENT --- */
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
    if (user.role === 'admin') setCurrentView('admin');
    else if (user.role === 'guru') setCurrentView('guru');
    else setCurrentView('siswa');
    showToast(`Selamat datang, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}
          >
            {toast.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentView === 'login' && <LoginView key="login" onLogin={handleLogin} onError={showToast} />}
        {currentView === 'admin' && <AdminDashboard key="admin" user={currentUser} onLogout={handleLogout} />}
        {currentView === 'guru' && <GuruDashboard key="guru" user={currentUser} onLogout={handleLogout} />}
        {currentView === 'siswa' && <SiswaDashboard key="siswa" user={currentUser} onLogout={handleLogout} onStartExam={() => setCurrentView('exam')} />}
        {currentView === 'exam' && <ExamEngine key="exam" user={currentUser} onFinish={() => { setCurrentView('siswa'); showToast("Ujian Selesai, nilai telah disimpan."); }} />}
      </AnimatePresence>
    </div>
  );
}

/* --- 1. LOGIN VIEW --- */
function LoginView({ onLogin, onError }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (username === 'admin') onLogin({ id: 1, role: 'admin', name: 'Super Admin' });
      else if (username === 'guru') onLogin({ id: 2, role: 'guru', name: 'Bapak Budi' });
      else if (username === 'siswa') onLogin({ id: 3, role: 'siswa', name: 'Andi Pratama' });
      else onError('Username salah (Gunakan: admin / guru / siswa)', 'error');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-4"
    >
      <motion.div 
        initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <BookOpen className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Darul Ulum CBT</h1>
          <p className="text-indigo-200">Modern Assessment Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={20} />
              <input 
                type="text" required value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Username (admin / guru / siswa)"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={20} />
              <input 
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
          <button 
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
          >
            {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn size={20} /> Masuk Sistem</>}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* --- 2. ADMIN DASHBOARD --- */
function AdminDashboard({ user, onLogout }: any) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [masterView, setMasterView] = useState('menu'); 

  const adminMenus = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
    { id: 'datamaster', label: 'Data Master', icon: <List size={18}/> },
    { id: 'settings', label: 'Pengaturan', icon: <Settings size={18}/> }
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'datamaster') setMasterView('menu');
  };

  return (
    <DashboardLayout title="Dashboard Admin" user={user} onLogout={onLogout} roleColor="bg-blue-600" activeTab={activeTab} onTabChange={handleTabChange} menuItems={adminMenus}>
      
      {activeTab === 'dashboard' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Siswa" value="1,240" icon={<Users size={24} className="text-blue-600" />} color="bg-blue-50" />
            <StatCard title="Total Guru" value="48" icon={<User size={24} className="text-blue-600" />} color="bg-blue-50" />
            <StatCard title="Ujian Aktif" value="3" icon={<Play size={24} className="text-blue-600" />} color="bg-blue-50" />
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Clock size={20}/> Aktivitas Terbaru</h3>
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">G</div>
                    <div>
                      <p className="font-semibold text-slate-800">Guru Matematika mengupload soal baru</p>
                      <p className="text-sm text-slate-500">Ujian Tengah Semester - Kelas XII</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400">2 jam yang lalu</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'datamaster' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
          {masterView === 'menu' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="font-bold text-xl mb-2 text-slate-800">Manajemen Data Master</h3>
              <p className="text-slate-500 mb-8">Pilih entitas data yang ingin Anda kelola pada sistem CBT.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setMasterView('guru')} className="flex flex-col items-start p-6 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <User size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-slate-800">Data Guru</h4>
                  <p className="text-sm text-slate-500 text-left mt-1">Tambah, edit, atau hapus akses akun Guru.</p>
                </button>

                <button onClick={() => setMasterView('siswa')} className="flex flex-col items-start p-6 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-slate-800">Data Siswa</h4>
                  <p className="text-sm text-slate-500 text-left mt-1">Kelola data peserta ujian dan reset password.</p>
                </button>
              </div>
            </motion.div>
          )}
          {masterView === 'guru' && <DataMasterTable type="Guru" onBack={() => setMasterView('menu')} />}
          {masterView === 'siswa' && <DataMasterTable type="Siswa" onBack={() => setMasterView('menu')} />}
        </div>
      )}

      {activeTab === 'settings' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 min-h-[400px] max-w-3xl">
           <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Settings size={24}/></div>
             <div>
                <h3 className="font-bold text-xl text-slate-800">Pengaturan Sistem</h3>
                <p className="text-sm text-slate-500">Konfigurasi umum aplikasi Darul Ulum CBT.</p>
             </div>
           </div>

           <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Pengaturan berhasil disimpan!'); }}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tahun Ajaran Aktif</label>
                <input 
                  type="text" 
                  defaultValue="2024/2025 Genap" 
                  placeholder="Misal: 2025/2026 Ganjil" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pengumuman Dashboard Siswa</label>
                <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" placeholder="Ketik pengumuman di sini..."></textarea>
                <p className="text-xs text-slate-400 mt-1">Teks ini akan muncul di halaman awal portal ujian siswa.</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <h4 className="font-semibold text-slate-800">Akses Portal Ujian</h4>
                  <p className="text-sm text-slate-500">Izinkan siswa untuk login dan mengakses soal ujian saat ini.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-colors shadow-lg shadow-blue-500/30">
                  Simpan Pengaturan
                </button>
              </div>
           </form>
        </motion.div>
      )}

    </DashboardLayout>
  );
}

/* --- TABEL DATA MASTER (REUSABLE) --- */
function DataMasterTable({ type, onBack }: any) {
  const isGuru = type === 'Guru';
  const [isAdding, setIsAdding] = useState(false);

  if (isAdding) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h3 className="font-bold text-xl text-slate-800">Tambah Data {type}</h3>
        </div>
        <form className="max-w-2xl space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Siap disimpan ke database!'); setIsAdding(false); }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
              <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{isGuru ? 'NIP / Username' : 'NIS / Username'}</label>
              <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" required className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{isGuru ? 'Mata Pelajaran' : 'Kelas'}</label>
              <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">Simpan Data</button>
            <button type="button" onClick={() => setIsAdding(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-6 rounded-lg transition-colors">Batal</button>
          </div>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
            <ChevronLeft size={20} />
          </button>
          <h3 className="font-bold text-xl text-slate-800">Manajemen Data {type}</h3>
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} /> Tambah {type}
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
              <th className="p-4 font-medium">No</th>
              <th className="p-4 font-medium">Nama {type}</th>
              <th className="p-4 font-medium">{isGuru ? 'NIP/Username' : 'NIS/Username'}</th>
              <th className="p-4 font-medium">{isGuru ? 'Mata Pelajaran' : 'Kelas'}</th>
              <th className="p-4 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
              <td className="p-4 text-slate-600">1</td>
              <td className="p-4 font-medium text-slate-800">{isGuru ? 'Bapak Budi' : 'Andi Pratama'}</td>
              <td className="p-4 text-slate-600 font-mono text-sm">{isGuru ? 'guru' : 'siswa'}</td>
              <td className="p-4 text-slate-600">{isGuru ? 'Matematika' : 'XII IPA 1'}</td>
              <td className="p-4 flex justify-center gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16}/></button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* --- 3. GURU DASHBOARD --- */
function GuruDashboard({ user, onLogout }: any) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inputMode, setInputMode] = useState('upload'); // 'upload' or 'manual'

  const guruMenus = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
    { id: 'buat_ujian', label: 'Buat Ujian & Soal', icon: <FileUp size={18}/> },
    { id: 'hasil', label: 'Hasil Ujian', icon: <CheckSquare size={18}/> }
  ];

  return (
    <DashboardLayout title="Workspace Guru" user={user} onLogout={onLogout} roleColor="bg-emerald-500" activeTab={activeTab} onTabChange={setActiveTab} menuItems={guruMenus}>
      
      {activeTab === 'dashboard' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <FileUp className="text-emerald-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Persiapan Ujian</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Silakan menuju menu "Buat Ujian & Soal" untuk mengupload soal format Excel/Word atau membuat soal secara manual.
            </p>
            <button onClick={() => setActiveTab('buat_ujian')} className="bg-emerald-50 text-emerald-700 font-semibold py-3 px-6 rounded-xl w-full flex justify-center items-center gap-2 hover:bg-emerald-100 transition-colors">
              Mulai Buat Ujian Baru
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <h3 className="font-bold text-lg mb-4 text-slate-700 flex items-center gap-2"><Lock size={20}/> Ujian Aktif (Token)</h3>
            <p className="text-sm text-slate-500 mb-4">Berikan token ini kepada siswa agar mereka bisa masuk ke sesi ujian Anda.</p>
            <div className="text-5xl font-black text-slate-800 tracking-widest bg-slate-50 p-6 rounded-2xl text-center border-2 border-dashed border-slate-200">
              X7Y9ZA
            </div>
            <button className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors">
              Reset Token Acak
            </button>
          </div>
        </motion.div>
      )}

      {activeTab === 'buat_ujian' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 min-h-[400px]">
          <h3 className="font-bold text-2xl mb-6 text-slate-800">Manajemen Ujian & Soal</h3>
          
          <div className="flex gap-6 border-b border-slate-200 mb-8">
             <button 
                onClick={() => setInputMode('upload')}
                className={`pb-3 font-medium transition-colors border-b-2 ${inputMode === 'upload' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
                Upload Excel / Word
             </button>
             <button 
                onClick={() => setInputMode('manual')}
                className={`pb-3 font-medium transition-colors border-b-2 ${inputMode === 'manual' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
                Input Manual
             </button>
          </div>
          
          {inputMode === 'upload' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
               <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors bg-white">
                  <FileUp size={48} className="mx-auto text-emerald-400 mb-4" />
                  <p className="text-slate-700 font-medium text-lg mb-2">Tarik & lepas file soal di sini</p>
                  <p className="text-slate-500 text-sm mb-6">Format didukung: .xlsx, .xls, .docx</p>
                  <label className="bg-emerald-100 text-emerald-700 px-6 py-3 rounded-xl font-semibold cursor-pointer hover:bg-emerald-200 transition-colors inline-block shadow-sm">
                     Pilih File Dokumen
                     <input type="file" className="hidden" accept=".xlsx,.xls,.docx" />
                  </label>
                  <div className="mt-6 flex justify-center gap-4 text-sm">
                    <a href="#" className="text-emerald-600 hover:underline flex items-center gap-1"><FileText size={16}/> Template Excel</a>
                    <a href="#" className="text-blue-600 hover:underline flex items-center gap-1"><FileText size={16}/> Template Word</a>
                  </div>
               </div>
               
               <form className="mt-8 space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Settings size={18}/> Pengaturan Sesi Ujian</h4>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-slate-600 mb-1">Nama Ujian / Mapel</label>
                       <input type="text" className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-emerald-500" placeholder="Misal: UAS Matematika" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-slate-600 mb-1">Durasi Pengerjaan (Menit)</label>
                       <input type="number" className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-emerald-500" placeholder="90" defaultValue="90" />
                     </div>
                  </div>
                  <div className="flex gap-6 pt-2">
                    <label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-emerald-600 cursor-pointer" defaultChecked /> Acak Urutan Soal
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-emerald-600 cursor-pointer" defaultChecked /> Acak Urutan Jawaban (A-E)
                    </label>
                  </div>
                  <button type="button" onClick={() => alert('File sedang di-parsing dan Ujian dibuat!')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl mt-4 transition-colors shadow-lg shadow-emerald-500/30">
                    Simpan & Generate Token Baru
                  </button>
               </form>
            </motion.div>
          )}

          {inputMode === 'manual' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
              <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl mb-6 flex gap-3 text-sm">
                <AlertTriangle size={20} className="shrink-0" />
                <p>Fitur input manual cocok untuk merevisi atau menambahkan soal dalam jumlah sedikit. Untuk jumlah soal yang banyak, sangat disarankan menggunakan fitur <strong>Upload Excel/Word</strong>.</p>
              </div>

              <form className="space-y-6">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Pertanyaan Soal</label>
                   <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 text-slate-700" placeholder="Ketik pertanyaan di sini..."></textarea>
                 </div>
                 
                 <div className="space-y-3">
                   <label className="block text-sm font-bold text-slate-700">Pilihan Jawaban (Tandai yang benar)</label>
                   {['A', 'B', 'C', 'D', 'E'].map((opt, idx) => (
                     <div key={opt} className="flex items-center gap-3">
                       <input type="radio" name="correct_answer" className="w-5 h-5 text-emerald-600" defaultChecked={idx===0} />
                       <span className="font-bold text-slate-500 w-6">{opt}.</span>
                       <input type="text" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-emerald-500" placeholder={`Opsi ${opt}`} />
                     </div>
                   ))}
                 </div>
                 
                 <div className="pt-6 border-t border-slate-100 flex gap-3">
                    <button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">Simpan Soal Ini</button>
                    <button type="button" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-6 rounded-lg transition-colors">Bersihkan Form</button>
                 </div>
              </form>
            </motion.div>
          )}

        </motion.div>
      )}

      {activeTab === 'hasil' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 min-h-[400px]">
          <h3 className="font-bold text-xl mb-4 text-slate-800">Rekapitulasi Hasil Ujian</h3>
          <p className="text-slate-500">Fitur untuk melihat dan mengunduh (Excel/PDF) nilai siswa akan muncul di sini.</p>
        </motion.div>
      )}

    </DashboardLayout>
  );
}

/* --- 4. SISWA DASHBOARD --- */
function SiswaDashboard({ user, onLogout, onStartExam }: any) {
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const siswaMenus = [
    { id: 'dashboard', label: 'Ruang Ujian', icon: <Play size={18}/> },
    { id: 'riwayat', label: 'Riwayat Nilai', icon: <Clock size={18}/> }
  ];

  return (
    <DashboardLayout title="Portal Siswa" user={user} onLogout={onLogout} roleColor="bg-amber-500" activeTab={activeTab} onTabChange={setActiveTab} menuItems={siswaMenus}>
      
      {activeTab === 'dashboard' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto mt-10">
          <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
            
            <div className="w-20 h-20 bg-emerald-50 rounded-full mx-auto flex items-center justify-center mb-6">
              <Play className="text-emerald-500 ml-1" size={36} />
            </div>
            
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Mulai Ujian</h2>
            <p className="text-slate-500 mb-10">Masukkan token ujian yang diberikan oleh guru Anda untuk memulai.</p>

            <input 
              type="text" 
              value={token}
              onChange={e => setToken(e.target.value.toUpperCase())}
              placeholder="MASUKKAN TOKEN" 
              maxLength={6}
              className="w-full max-w-xs mx-auto text-center text-3xl font-black tracking-widest bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all mb-6 uppercase"
            />
            
            <button 
              onClick={onStartExam}
              disabled={token.length < 5}
              className="w-full max-w-xs mx-auto bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/30 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              <LogIn size={20} /> Masuk Kelas Ujian
            </button>
          </div>
        </motion.div>
      )}

      {activeTab === 'riwayat' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 min-h-[400px]">
          <h3 className="font-bold text-xl mb-4 text-slate-800">Riwayat Ujian Anda</h3>
          <p className="text-slate-500">Anda belum pernah mengikuti ujian apapun pada semester ini.</p>
        </motion.div>
      )}

    </DashboardLayout>
  );
}

/* --- 5. EXAM ENGINE (FULLSCREEN CBT MODE) --- */
function ExamEngine({ user, onFinish }: any) {
  const [questions] = useState([
    { id: 1, text: "Berapakah hasil dari 5 x 5?", options: ["10", "15", "20", "25", "30"] },
    { id: 2, text: "Manakah yang merupakan bahasa pemrograman Front-End?", options: ["Python", "Java", "C++", "React/JS", "PHP"] },
    { id: 3, text: "Ibukota negara Indonesia adalah...", options: ["Jakarta", "Bandung", "Surabaya", "Medan", "Bali"] },
    { id: 4, text: "Rumus luas lingkaran adalah?", options: ["π x r", "2 x π x r", "π x r x r", "1/2 x a x t", "p x l"] }
  ]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 menit

  // Timer & Security Effect
  useEffect(() => {
    const preventContextMenu = (e: any) => e.preventDefault();
    document.addEventListener('contextmenu', preventContextMenu);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { 
          clearInterval(timer); 
          onFinish(); 
          return 0; 
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      clearInterval(timer);
    };
  }, [onFinish]);

  const handleAnswer = (opt: string) => setAnswers({ ...answers, [questions[currentIdx].id]: opt });
  const isAnswered = (idx: number) => answers[questions[idx].id] !== undefined;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header Sticky Ujian */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">D</div>
          <div>
            <h1 className="font-bold text-slate-800 leading-tight">Simulasi Ujian CBT</h1>
            <p className="text-xs text-slate-500">{user.name} • {user.role.toUpperCase()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className={`px-5 py-2 rounded-lg font-mono text-xl font-bold flex items-center gap-2 ${timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
            <Clock size={20} /> {formatTime(timeLeft)}
          </div>
          <button 
            onClick={() => {
              if(window.confirm('Apakah Anda yakin ingin menyelesaikan ujian sekarang?')) onFinish();
            }}
            className="bg-red-50 text-red-600 hover:bg-red-500 hover:text-white px-5 py-2 rounded-lg font-bold transition-colors border border-red-200"
          >
            Selesai Ujian
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Area Soal */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[500px]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-bold text-slate-400">Soal Nomor <span className="text-2xl text-slate-800 ml-1">{currentIdx + 1}</span></h2>
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">Pilihan Ganda</span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              >
                <p className="text-xl text-slate-800 font-medium leading-relaxed mb-8">
                  {questions[currentIdx].text}
                </p>

                <div className="space-y-3">
                  {questions[currentIdx].options.map((opt, i) => {
                    const isSelected = answers[questions[currentIdx].id] === opt;
                    const letters = ['A', 'B', 'C', 'D', 'E'];
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className={`w-full flex items-center text-left p-4 rounded-xl border-2 transition-all group ${
                          isSelected 
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-inner' 
                            : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold mr-4 transition-colors ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                        }`}>
                          {letters[i]}
                        </span>
                        <span className={`text-lg ${isSelected ? 'font-semibold text-indigo-900' : 'text-slate-700'}`}>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
              <button 
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="px-6 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-colors"
              >
                Soal Sebelumnya
              </button>
              <button 
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={currentIdx === questions.length - 1}
                className="px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-600/20"
              >
                Soal Selanjutnya
              </button>
            </div>
          </div>
        </div>

        {/* Area Navigasi */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <LayoutDashboard size={18} /> Navigasi Soal
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, i) => {
                let btnStyle = "bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent"; 
                if (currentIdx === i) btnStyle = "bg-white border-indigo-600 text-indigo-600 ring-2 ring-indigo-100"; 
                else if (isAnswered(i)) btnStyle = "bg-emerald-500 text-white hover:bg-emerald-600 border-transparent"; 

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`aspect-square rounded-lg font-bold text-sm border-2 transition-all ${btnStyle}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-emerald-500"></div> Sudah Dijawab</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-2 border-indigo-600 bg-white"></div> Posisi Saat Ini</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-slate-100"></div> Belum Dijawab</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* --- REUSABLE COMPONENTS --- */
function DashboardLayout({ children, title, user, onLogout, roleColor, activeTab = 'dashboard', onTabChange, menuItems = [] }: any) {
  
  const getNavClass = (tabId: string) => {
    return activeTab === tabId
      ? "flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-medium cursor-pointer"
      : "flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-slate-300 p-6 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${roleColor}`}>
            D
          </div>
          <span className="text-white font-bold text-xl tracking-wide">Darul Ulum CBT</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((menu: any) => (
             <div key={menu.id} onClick={() => onTabChange && onTabChange(menu.id)} className={getNavClass(menu.id)}>
                {menu.icon} {menu.label}
             </div>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">{user?.name?.charAt(0)}</div>
            <div>
              <p className="text-white text-sm font-bold">{user?.name}</p>
              <p className="text-xs uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 font-medium hover:bg-red-500 hover:text-white transition-colors">
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white px-8 py-5 border-b border-slate-100 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          <button onClick={onLogout} className="md:hidden text-slate-500"><LogOut/></button>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}