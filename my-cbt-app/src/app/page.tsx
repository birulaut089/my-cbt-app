"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, User, LogIn, LayoutDashboard, Users, BookOpen,
  Settings, LogOut, Clock, CheckCircle, AlertTriangle, Play, FileUp, List
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
    // Simulasi loading API
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
  return (
    <DashboardLayout title="Dashboard Admin" user={user} onLogout={onLogout} roleColor="bg-blue-600">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Siswa" value="1,240" icon={<Users size={24} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Total Guru" value="48" icon={<User size={24} className="text-emerald-600" />} color="bg-emerald-50" />
        <StatCard title="Ujian Aktif" value="3" icon={<Play size={24} className="text-purple-600" />} color="bg-purple-50" />
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
    </DashboardLayout>
  );
}

/* --- 3. GURU DASHBOARD --- */
function GuruDashboard({ user, onLogout }: any) {
  return (
    <DashboardLayout title="Workspace Guru" user={user} onLogout={onLogout} roleColor="bg-emerald-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
            <FileUp className="text-indigo-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Buat Ujian Baru</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Upload soal format Excel/Word atau buat secara manual dengan mudah. Sistem akan otomatis memparsing soal Anda.
          </p>
          <button className="bg-indigo-50 text-indigo-700 font-semibold py-3 px-6 rounded-xl w-full flex justify-center items-center gap-2 hover:bg-indigo-100 transition-colors">
            <FileUp size={20}/> Upload Excel Soal
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <h3 className="font-bold text-lg mb-4 text-slate-700 flex items-center gap-2"><Lock size={20}/> Token Aktif (Simulasi)</h3>
          <div className="text-5xl font-black text-slate-800 tracking-widest bg-slate-50 p-6 rounded-2xl text-center border-2 border-dashed border-slate-200">
            X7Y9ZA
          </div>
          <button className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors">
            Generate Ulang Token
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* --- 4. SISWA DASHBOARD --- */
function SiswaDashboard({ user, onLogout, onStartExam }: any) {
  const [token, setToken] = useState('');

  return (
    <DashboardLayout title="Portal Siswa" user={user} onLogout={onLogout} roleColor="bg-amber-500">
       <div className="max-w-2xl mx-auto mt-10">
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
       </div>
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
    // Mencegah klik kanan (anti-inspect sederhana)
    const preventContextMenu = (e: any) => e.preventDefault();
    document.addEventListener('contextmenu', preventContextMenu);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { 
          clearInterval(timer); 
          onFinish(); // Auto submit jika waktu habis
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
function DashboardLayout({ children, title, user, onLogout, roleColor }: any) {
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
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-medium"><LayoutDashboard size={18}/> Dashboard</a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"><List size={18}/> Data Master</a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"><Settings size={18}/> Pengaturan</a>
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {children}
          </motion.div>
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