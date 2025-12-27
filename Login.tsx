
import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  // Common fields
  const [identifier, setIdentifier] = useState(''); // ID or Phone for login
  const [password, setPassword] = useState('');
  
  // Registration specific
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [id, setId] = useState(''); // Email or custom ID
  
  const [isRegister, setIsRegister] = useState(false);
  const { login, register } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegister) {
      if (!name || !phone || !id || !password) {
        alert('সব তথ্য পূরণ করুন');
        return;
      }
      const res = register({
        id: Math.random().toString(36).substr(2, 9),
        name,
        phone,
        email: id,
        password
      });
      if (res.success) {
        navigate('/');
      } else {
        alert(res.msg);
      }
    } else {
      if (!identifier || !password) {
        alert('আইডি এবং পাসওয়ার্ড দিন');
        return;
      }
      const res = login(identifier, password);
      if (res.success) {
        navigate('/');
      } else {
        alert(res.msg);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto pt-6 px-4">
      <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-lg shadow-orange-600/30">FF</div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">ফ্রি ফায়ার প্রো টুর্নামেন্ট</h2>
        
        <div className="flex gap-4 mb-6 bg-slate-900 p-1 rounded-xl">
          <button 
            onClick={() => setIsRegister(false)} 
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${!isRegister ? 'bg-orange-600 text-white' : 'text-slate-500'}`}
          >
            লগইন
          </button>
          <button 
            onClick={() => setIsRegister(true)} 
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${isRegister ? 'bg-orange-600 text-white' : 'text-slate-500'}`}
          >
            রেজিস্ট্রেশন
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister ? (
            <>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">আপনার নাম</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Full Name" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-orange-500 transition-colors" 
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">ফোন নাম্বার</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="017xxxxxxxx" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-orange-500 transition-colors" 
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">ইউজার আইডি (ID)</label>
                <input 
                  type="text" 
                  value={id} 
                  onChange={e => setId(e.target.value)} 
                  placeholder="username or email" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-orange-500 transition-colors" 
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">পাসওয়ার্ড</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-orange-500 transition-colors" 
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">ইউজার আইডি / ফোন</label>
                <input 
                  type="text" 
                  value={identifier} 
                  onChange={e => setIdentifier(e.target.value)} 
                  placeholder="ID or Phone" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-orange-500 transition-colors" 
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">পাসওয়ার্ড</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-orange-500 transition-colors" 
                />
              </div>
            </>
          )}

          <button className="w-full bg-orange-600 hover:bg-orange-700 py-4 rounded-xl font-bold text-lg mt-6 shadow-lg shadow-orange-600/20 transition-all active:scale-95">
            {isRegister ? 'অ্যাকাউন্ট তৈরি করুন' : 'লগইন করুন'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-700">
          <p className="text-center text-xs text-slate-500">
            টেস্ট অ্যাকাউন্ট (Admin): <span className="text-orange-400">admin / 123</span><br/>
            টেস্ট অ্যাকাউন্ট (Player): <span className="text-orange-400">player1 / 123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
