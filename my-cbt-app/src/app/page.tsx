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

/* --- APLIKASI UTAMA --- */
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
        {currentView === 'siswa' && <SiswaDashboard key="siswa" user={currentUser} onLogout={() => setCurrentView('login')} />}
      </AnimatePresence>
    </div>
  );
}

/* --- HALAMAN LOGIN --- */
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

/* --- LAYOUT DASHBOARD MENU --- */
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
        <div className="pt-6 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">{user?.name?.charAt(0) || 'U'}</div>
            <div className="text-white"><p className="text-sm font-bold leading-none mb-1">{user?.name}</p><p className="text-[10px] uppercase tracking-widest text-slate-400">{user?.role}</p></div>
          </div>
          <button onClick={onLogout} className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2 font-bold"><LogOut size={16}/> Keluar</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <h1 className="text-3xl font-black text-slate-800 mb-8">{title}</h1>
        {children}
      </main>
    </div>
  );
}

/* --- DASHBOARD ADMIN --- */
function AdminDashboard({ user, onLogout, onShowToast }: any) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<any[][]>([]);
  const [formMode, setFormMode] = useState<'menu' | 'guru' | 'siswa'>('menu');
  const [formData, setFormData] = useState({ username: '', password: '', name: '', detail: '' });
  const [loading, setLoading] = useState(false);

  const fetchUsers = () => {
    fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'getUsers' }) })
      .then(r => r.json()).then(d => { if(d.status === 'success') setUsers(d.users); });
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddUser = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(GAS_URL, {
        method: 'POST', body: JSON.stringify({ action: 'addUser', role: formMode, payload: formData })
      });
      const data = await res.json();
      if(data.status === 'success') {
        onShowToast(`Berhasil menambah ${formMode}`);
        setFormData({ username: '', password: '', name: '', detail: '' });
        setFormMode('menu');
        fetchUsers(); 
      }
    } catch { onShowToast('Gagal menyimpan', 'error'); }
    setLoading(false);
  };

  const adminMenus = [
    { id: 'dashboard', label: 'Data Pengguna', icon: <Database size={18}/> },
    { id: 'datamaster', label: 'Kelola Data Master', icon: <Plus size={18}/> }
  ];

  return (
    <DashboardLayout title="Portal Admin" user={user} onLogout={onLogout} roleColor="bg-blue-600" activeTab={activeTab} onTabChange={setActiveTab} menuItems={adminMenus}>
      {activeTab === 'dashboard' && (
        <div>
          <div className="mb-6"><h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Database className="text-blue-600"/> Data Pengguna Sistem</h2></div>
          <DataTable headers={['ID', 'Username', 'Password', 'Role', 'Nama', 'Keterangan']} data={users} />
        </div>
      )}
      
      {activeTab === 'datamaster' && (
        <div className="bg-white p-8 rounded-3xl border shadow-sm max-w-2xl">
          {formMode === 'menu' ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Manajemen Data Master</h2>
              <p className="text-slate-500 mb-6">Pilih role pengguna yang ingin ditambahkan ke dalam sistem.</p>
              <div className="flex gap-4">
                <button onClick={() => setFormMode('guru')} className="flex-1 p-6 border-2 rounded-xl text-center hover:border-blue-500 hover:bg-blue-50 transition-colors font-bold text-slate-700 hover:text-blue-600"><User className="mx-auto mb-2" size={32}/>Tambah Guru</button>
                <button onClick={() => setFormMode('siswa')} className="flex-1 p-6 border-2 rounded-xl text-center hover:border-blue-500 hover:bg-blue-50 transition-colors font-bold text-slate-700 hover:text-blue-600"><Users className="mx-auto mb-2" size={32}/>Tambah Siswa</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <button type="button" onClick={() => setFormMode('menu')} className="bg-slate-100 p-2 rounded-lg hover:bg-slate-200"><ChevronLeft/></button>
                <h2 className="text-xl font-bold uppercase">Tambah {formMode}</h2>
              </div>
              <input required type="text" placeholder="Nama Lengkap" className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="text" placeholder="Username / NIP / NIS" className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, username: e.target.value})} />
              <input required type="text" placeholder="Password" className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, password: e.target.value})} />
              <input required type="text" placeholder={formMode === 'guru' ? "Mata Pelajaran (Misal: TIK)" : "Kelas (Misal: 10A)"} className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, detail: e.target.value})} />
              <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 transition-colors w-full text-white px-6 py-3 rounded-xl font-bold">{loading ? 'Menyimpan...' : 'Simpan Data Ke Database'}</button>
            </form>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

/* --- DASHBOARD GURU --- */
function GuruDashboard({ user, onLogout, onShowToast }: any) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [qForm, setQForm] = useState({ pertanyaan: '', a: '', b: '', c: '', d: '', e: '', jawaban: 'A' });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[][]>([]);
  const [activeToken, setActiveToken] = useState('XYZ987');

  const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 6; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
    setActiveToken(token);
    onShowToast(`Berhasil membuat token baru: ${token}`);
  };

  useEffect(() => {
    fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'getResults' }) })
      .then(r => r.json()).then(d => { if(d.status === 'success') setResults(d.results); });
  }, []);

  const handleSaveSoal = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'addQuestion', payload: qForm }) });
      const data = await res.json();
      if(data.status === 'success') {
        onShowToast('Soal berhasil ditambahkan ke Bank Soal');
        setQForm({ pertanyaan: '', a: '', b: '', c: '', d: '', e: '', jawaban: 'A' }); 
      }
    } catch { onShowToast('Gagal menyimpan soal', 'error'); }
    setLoading(false);
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (event: any) => {
      try {
        const data = XLSX.utils.sheet_to_json(XLSX.read(event.target.result, { type: 'binary' }).Sheets[Object.keys(XLSX.read(event.target.result, { type: 'binary' }).Sheets)[0]], { header: 1 });
        setLoading(true);
        const res = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'uploadQuestions', payload: data.slice(1) }) });
        const result = await res.json();
        if(result.status === 'success') onShowToast(result.message || 'Excel berhasil di-upload!');
      } catch (err) {
        onShowToast('Gagal memproses file Excel', 'error');
      }
      setLoading(false);
    };
    reader.readAsBinaryString(file);
  };

  const guruMenus = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: <LayoutDashboard size={18}/> },
    { id: 'soal', label: 'Input Manual Soal', icon: <FileText size={18}/> },
    { id: 'upload_excel', label: 'Upload Soal Excel', icon: <UploadCloud size={18}/> },
    { id: 'token', label: 'Token Ujian', icon: <Lock size={18}/> },
    { id: 'hasil', label: 'Hasil Ujian', icon: <CheckSquare size={18}/> }
  ];

  return (
    <DashboardLayout title="Ruang Guru" user={user} onLogout={onLogout} roleColor="bg-emerald-500" activeTab={activeTab} onTabChange={setActiveTab} menuItems={guruMenus}>
      {activeTab === 'dashboard' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-bold mb-2">Selamat Datang, Bapak/Ibu {user?.name}</h2>
          <p className="text-slate-500">Gunakan menu di sebelah kiri untuk mengelola ujian dan melihat nilai siswa.</p>
        </div>
      )}

      {activeTab === 'soal' && (
        <form onSubmit={handleSaveSoal} className="bg-white p-8 rounded-3xl border shadow-sm max-w-3xl space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><FileText className="text-emerald-500"/> Buat Soal Pilihan Ganda</h2>
          <textarea required placeholder="Tuliskan pertanyaan di sini..." className="w-full p-4 border rounded-xl h-32 outline-none focus:ring-2 focus:ring-emerald-500" value={qForm.pertanyaan} onChange={e => setQForm({...qForm, pertanyaan: e.target.value})} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['a', 'b', 'c', 'd', 'e'].map(opt => (
              <div key={opt} className="flex items-center gap-3 p-3 border rounded-xl focus-within:ring-2 focus-within:ring-emerald-500">
                <span className="font-bold uppercase text-slate-400">{opt}.</span>
                <input required type="text" placeholder={`Opsi ${opt.toUpperCase()}`} className="w-full outline-none" value={(qForm as any)[opt]} onChange={e => setQForm({...qForm, [opt]: e.target.value})} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border">
            <span className="font-bold">Kunci Jawaban:</span>
            <select className="p-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500" value={qForm.jawaban} onChange={e => setQForm({...qForm, jawaban: e.target.value})}>
              <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option>
            </select>
          </div>
          <button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 transition-colors text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2">
            <Save size={20} /> {loading ? 'Menyimpan...' : 'Simpan ke Bank Soal'}
          </button>
        </form>
      )}

      {activeTab === 'upload_excel' && (
         <div className="bg-white p-12 rounded-3xl border shadow-sm max-w-2xl text-center">
            <UploadCloud size={64} className="mx-auto text-emerald-500 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Upload Bank Soal Massal</h2>
            <p className="text-slate-500 mb-8">Pilih file berformat <b>.xlsx</b> untuk mengunggah puluhan soal sekaligus ke dalam sistem.</p>
            <div className="border-2 border-dashed border-emerald-200 bg-emerald-50 rounded-2xl p-8 mb-6">
               <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer" />
            </div>
            {loading && <p className="text-emerald-600 font-bold mt-4 animate-pulse">Sedang mengunggah dan memproses data...</p>}
         </div>
      )}

      {activeTab === 'token' && (
         <div className="bg-white p-10 rounded-3xl border shadow-sm max-w-md text-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6"><Lock size={40} /></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Token Ujian Aktif</h2>
            <p className="text-slate-500 mb-8">Berikan kode token 6 digit ini kepada siswa agar mereka bisa mengakses soal ujian.</p>
            <div className="text-5xl font-black tracking-widest text-indigo-600 bg-indigo-50 py-6 rounded-2xl border-2 border-dashed border-indigo-200 mb-8 uppercase shadow-inner">{activeToken}</div>
            <button onClick={generateToken} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 w-full rounded-xl transition-all shadow-lg flex justify-center items-center gap-2"><Lock size={20}/> Acak Token Baru</button>
         </div>
      )}

      {activeTab === 'hasil' && (
        <div>
          <div className="mb-6"><h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><CheckSquare className="text-emerald-600"/> Rekap Nilai Siswa</h2></div>
          <DataTable headers={['Waktu Ujian', 'ID Siswa', 'Jawaban JSON']} data={results} />
        </div>
      )}
    </DashboardLayout>
  );
}

/* --- DASHBOARD SISWA --- */
function SiswaDashboard({ user, onLogout }: any) {
  return (
    <DashboardLayout title="Portal Siswa" user={user} onLogout={onLogout} roleColor="bg-amber-500" activeTab="ujian" onTabChange={() => {}} menuItems={[{id:'ujian', label:'Ruang Ujian', icon:<Play size={18}/>}]}>
      <div className="max-w-md mx-auto mt-10 p-10 bg-white border border-slate-100 rounded-[2rem] shadow-xl text-center">
        <Play className="mx-auto text-emerald-500 mb-6" size={48} />
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Siap Ujian?</h2>
        <p className="text-slate-500 mb-8">Masukkan token ujian yang diberikan oleh guru pengawas Anda.</p>
        <input type="text" placeholder="MASUKKAN TOKEN" maxLength={6} className="w-full text-center text-3xl font-black tracking-widest bg-slate-50 border-2 border-slate-200 rounded-xl py-4 mb-6 uppercase focus:border-emerald-500 focus:outline-none" />
        <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all">Verifikasi Token</button>
      </div>
    </DashboardLayout>
  );
}