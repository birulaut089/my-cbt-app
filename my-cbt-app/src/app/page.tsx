"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, User, LogIn, LayoutDashboard, Users, BookOpen,
  Settings, LogOut, Clock, CheckCircle, AlertTriangle, Play, FileUp, List,
  ChevronLeft, Plus, Edit, Trash2, FileText, CheckSquare, UploadCloud
} from 'lucide-react';

/* --- KONFIGURASI URL BACKEND --- */
const GAS_URL = "https://script.google.com/macros/s/AKfycbyUGtn7HpP4a5ex9XBxv0KaRVXgslKEKwtQLQLvpSCXCThK9XdSbkR5fR3q0hDbOgeRrQ/exec";

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
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 20 }} exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}
          >
            {toast.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentView === 'login' && <LoginView key="login" onLogin={handleLogin} onError={showToast} />}
        {currentView === 'admin' && <AdminDashboard key="admin" user={currentUser} onLogout={handleLogout} onShowToast={showToast} />}
        {currentView === 'guru' && <GuruDashboard key="guru" user={currentUser} onLogout={handleLogout} onShowToast={showToast} />}
        {currentView === 'siswa' && <SiswaDashboard key="siswa" user={currentUser} onLogout={handleLogout} onStartExam={() => setCurrentView('exam')} />}
        {currentView === 'exam' && <ExamEngine key="exam" user={currentUser} onFinish={() => { setCurrentView('siswa'); showToast("Ujian Selesai."); }} />}
      </AnimatePresence>
    </div>
  );
}

/* 1. LOGIN VIEW */
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
      else onError('Gunakan: admin / guru / siswa', 'error');
    }, 800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4"><BookOpen className="text-white" size={32} /></div>
          <h1 className="text-3xl font-bold text-white mb-2">Darul Ulum CBT</h1>
          <p className="text-indigo-200">Modern Assessment Platform</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={20} />
            <input type="text" required value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={20} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2">
            {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn size={20} /> Masuk Sistem</>}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

/* 2. ADMIN DASHBOARD */
function AdminDashboard({ user, onLogout, onShowToast }: any) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [masterView, setMasterView] = useState('menu');

  const adminMenus = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
    { id: 'datamaster', label: 'Data Master', icon: <List size={18}/> },
    { id: 'settings', label: 'Pengaturan', icon: <Settings size={18}/> }
  ];

  return (
    <DashboardLayout title="Dashboard Admin" user={user} onLogout={onLogout} roleColor="bg-blue-600" activeTab={activeTab} onTabChange={(t:any)=>{setActiveTab(t); setMasterView('menu')}} menuItems={adminMenus}>
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Siswa" value="1,240" icon={<Users size={24}/>} color="bg-blue-50 text-blue-600" />
            <StatCard title="Total Guru" value="48" icon={<User size={24}/>} color="bg-emerald-50 text-emerald-600" />
            <StatCard title="Ujian Aktif" value="3" icon={<Play size={24}/>} color="bg-purple-50 text-purple-600" />
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Clock size={20}/> Aktivitas Sistem</h3>
            <div className="space-y-4">
              {[1,2].map(i => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">Server berjalan normal • {new Date().toLocaleDateString()}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'datamaster' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[500px]">
          {masterView === 'menu' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button onClick={()=>setMasterView('guru')} className="p-8 border-2 border-slate-100 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4"><User size={28}/></div>
                <h4 className="text-xl font-bold">Data Guru</h4>
                <p className="text-slate-500">Kelola akun pengajar Darul Ulum.</p>
              </button>
              <button onClick={()=>setMasterView('siswa')} className="p-8 border-2 border-slate-100 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4"><Users size={28}/></div>
                <h4 className="text-xl font-bold">Data Siswa</h4>
                <p className="text-slate-500">Kelola database peserta ujian.</p>
              </button>
            </div>
          ) : (
            <DataMasterAction type={masterView === 'guru' ? 'Guru' : 'Siswa'} onBack={()=>setMasterView('menu')} onShowToast={onShowToast} />
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-2xl">
          <h3 className="text-xl font-bold mb-6">Pengaturan Global</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Tahun Ajaran Aktif</label>
              <input type="text" defaultValue="2024/2025 Genap" className="w-full p-3 bg-slate-50 border rounded-xl" />
            </div>
            <button onClick={()=>onShowToast('Pengaturan disimpan')} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">Simpan Perubahan</button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/* 3. GURU DASHBOARD */
function GuruDashboard({ user, onLogout, onShowToast }: any) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inputMode, setInputMode] = useState('upload');

  const guruMenus = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
    { id: 'buat_ujian', label: 'Buat Ujian & Soal', icon: <FileUp size={18}/> },
    { id: 'hasil', label: 'Hasil Ujian', icon: <CheckSquare size={18}/> }
  ];

  return (
    <DashboardLayout title="Workspace Guru" user={user} onLogout={onLogout} roleColor="bg-emerald-500" activeTab={activeTab} onTabChange={setActiveTab} menuItems={guruMenus}>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Selamat Datang</h2>
            <p className="text-slate-500 mb-6">Silakan buat paket soal baru melalui menu di samping.</p>
            <button onClick={()=>setActiveTab('buat_ujian')} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold">Mulai Sekarang</button>
          </div>
          <div className="bg-white p-8 rounded-3xl border shadow-sm text-center">
            <p className="text-sm font-bold text-slate-400 mb-2">TOKEN UJIAN AKTIF</p>
            <div className="text-5xl font-black tracking-widest text-indigo-600 mb-4">ABC123</div>
            <button className="text-emerald-600 font-bold border border-emerald-600 px-4 py-2 rounded-lg">Ganti Token</button>
          </div>
        </div>
      )}

      {activeTab === 'buat_ujian' && (
        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <div className="flex gap-4 border-b mb-8">
            <button onClick={()=>setInputMode('upload')} className={`pb-3 font-bold ${inputMode==='upload'?'border-b-2 border-emerald-600 text-emerald-600':'text-slate-400'}`}>Upload File</button>
            <button onClick={()=>setInputMode('manual')} className={`pb-3 font-bold ${inputMode==='manual'?'border-b-2 border-emerald-600 text-emerald-600':'text-slate-400'}`}>Input Manual</button>
          </div>

          {inputMode === 'upload' ? (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-200 p-12 rounded-3xl text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                <UploadCloud size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="font-bold text-lg">Pilih file Excel (.xlsx) atau Word (.docx)</p>
                <input type="file" className="mt-4" onChange={()=>onShowToast('File terpilih, silakan simpan')} />
              </div>
              <button onClick={()=>onShowToast('Soal dari file berhasil disimpan ke Spreadsheet')} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg">Upload & Simpan Soal</button>
            </div>
          ) : (
            <ManualQuestionForm onShowToast={onShowToast} />
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

/* --- KOMPONEN PENDUKUNG (ADMIN ACTION) --- */
function DataMasterAction({ type, onBack, onShowToast }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nama:'', username:'', password:'', detail:'' });

  const handleSave = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'addUser', role: type.toLowerCase(), data: form })
      });
      const resJson = await res.json();
      if(resJson.status === 'success') {
        onShowToast(`Data ${type} Berhasil disimpan!`);
        setIsAdding(false);
        setForm({ nama:'', username:'', password:'', detail:'' });
      }
    } catch(err) { onShowToast('Gagal terhubung ke GAS', 'error'); }
    finally { setLoading(false); }
  };

  if(isAdding) return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={()=>setIsAdding(false)}><ChevronLeft/></button>
        <h3 className="text-xl font-bold">Form Tambah {type}</h3>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" required placeholder="Nama Lengkap" className="p-3 bg-slate-50 border rounded-xl" value={form.nama} onChange={e=>setForm({...form, nama:e.target.value})} />
          <input type="text" required placeholder="Username / NIP / NIS" className="p-3 bg-slate-50 border rounded-xl" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
          <input type="password" required placeholder="Password" className="p-3 bg-slate-50 border rounded-xl" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
          <input type="text" required placeholder={type==='Guru'?'Mata Pelajaran':'Kelas'} className="p-3 bg-slate-50 border rounded-xl" value={form.detail} onChange={e=>setForm({...form, detail:e.target.value})} />
        </div>
        <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">
          {loading ? 'Proses...' : 'Simpan ke Spreadsheet'}
        </button>
      </form>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onBack}><ChevronLeft/></button>
          <h3 className="text-xl font-bold">Manajemen {type}</h3>
        </div>
        <button onClick={()=>setIsAdding(true)} className="bg-indigo-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"><Plus size={18}/> Tambah {type}</button>
      </div>
      <div className="p-12 text-center border-2 border-dashed rounded-3xl text-slate-400">Data tabel akan dimuat otomatis dari Spreadsheet</div>
    </div>
  );
}

/* --- KOMPONEN GURU: FORM MANUAL --- */
function ManualQuestionForm({ onShowToast }: any) {
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState({ pertanyaan:'', a:'', b:'', c:'', d:'', e:'', jawaban:'a' });

  const handleSaveSoal = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'addQuestion', data: q })
      });
      const resJson = await res.json();
      if(resJson.status === 'success') {
        onShowToast('Soal berhasil disimpan ke Database!');
        setQ({ pertanyaan:'', a:'', b:'', c:'', d:'', e:'', jawaban:'a' });
      }
    } catch(err) { onShowToast('Gagal Simpan', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSaveSoal} className="space-y-6 max-w-3xl">
      <textarea required placeholder="Tulis Pertanyaan..." className="w-full p-4 bg-slate-50 border rounded-2xl h-32" value={q.pertanyaan} onChange={e=>setQ({...q, pertanyaan:e.target.value})} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {['a','b','c','d','e'].map(l => (
          <div key={l} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border">
            <input type="radio" name="jawaban" checked={q.jawaban===l} onChange={()=>setQ({...q, jawaban:l})} />
            <span className="uppercase font-bold text-slate-400 w-4">{l}.</span>
            <input type="text" placeholder={`Opsi ${l.toUpperCase()}`} className="bg-transparent outline-none w-full" value={(q as any)[l]} onChange={e=>setQ({...q, [l]:e.target.value})} />
          </div>
        ))}
      </div>
      <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg">
        {loading ? 'Menyimpan...' : 'Simpan Soal Sekarang'}
      </button>
    </form>
  );
}

/* --- REUSABLE COMPONENTS --- */
function DashboardLayout({ children, title, user, onLogout, roleColor, activeTab, onTabChange, menuItems }: any) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-72 bg-slate-900 p-6 flex flex-col h-screen sticky top-0">
        <div className="flex items-center gap-3 mb-10 px-2 text-white font-bold text-xl uppercase tracking-tighter">
          <div className={`w-8 h-8 rounded-lg ${roleColor} flex items-center justify-center text-white`}>D</div>
          Darul Ulum CBT
        </div>
        <nav className="flex-1 space-y-2">
          {menuItems.map((m: any) => (
            <div key={m.id} onClick={()=>onTabChange(m.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${activeTab===m.id?'bg-white/10 text-white':'text-slate-400 hover:text-white'}`}>
              {m.icon} {m.label}
            </div>
          ))}
        </nav>
        <div className="pt-6 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">{user?.name?.charAt(0)}</div>
            <div className="text-white"><p className="text-sm font-bold leading-none mb-1">{user?.name}</p><p className="text-[10px] uppercase tracking-widest text-slate-400">{user?.role}</p></div>
          </div>
          <button onClick={onLogout} className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2 font-bold"><LogOut size={16}/> Keluar</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <header className="mb-10 flex justify-between items-center"><h1 className="text-3xl font-black text-slate-800">{title}</h1></header>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{children}</motion.div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className={`p-6 rounded-3xl shadow-sm border border-slate-100 bg-white flex items-center gap-6`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>{icon}</div>
      <div><p className="text-slate-500 text-sm font-medium">{title}</p><p className="text-3xl font-black text-slate-800">{value}</p></div>
    </div>
  );
}

/* DUMMY ENGINE & SISWA (Simplified) */
function SiswaDashboard({ onLogout, onStartExam }: any) {
  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white border rounded-3xl shadow-xl text-center">
      <Play className="mx-auto text-emerald-500 mb-4" size={48} />
      <h2 className="text-2xl font-bold mb-4">Ujian Matematika</h2>
      <input type="text" placeholder="Masukkan Token" className="w-full p-4 border rounded-xl mb-4 text-center font-bold tracking-widest" />
      <button onClick={onStartExam} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold">Mulai Ujian</button>
    </div>
  );
}

function ExamEngine({ onFinish }: any) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
      <h1 className="text-4xl font-bold mb-4">Halaman Ujian Aktif</h1>
      <p className="mb-8">Simulasi sedang berjalan...</p>
      <button onClick={onFinish} className="bg-red-500 text-white px-8 py-3 rounded-xl font-bold">Selesai Ujian</button>
    </div>
  );
}