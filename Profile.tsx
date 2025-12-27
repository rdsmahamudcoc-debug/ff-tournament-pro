
import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { currentUser, updateProfile, logout } = useStore();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  if (!currentUser) return <div className="p-10 text-center"><button onClick={() => navigate('/login')} className="bg-orange-600 px-6 py-2 rounded-lg">লগইন করুন</button></div>;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email });
    alert('প্রোফাইল আপডেট হয়েছে');
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center">
        <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">👤</div>
        <h2 className="text-xl font-bold">{currentUser.name}</h2>
        <p className="text-slate-400">{currentUser.phone}</p>
        <p className="text-orange-400 font-bold mt-2">ব্যালেন্স: ৳{currentUser.balance}</p>
      </div>

      <form onSubmit={handleUpdate} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
        <h3 className="font-bold mb-2">প্রোফাইল তথ্য আপডেট</h3>
        <div>
          <label className="text-xs text-slate-400 block mb-1">নাম</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">ইমেইল</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5" />
        </div>
        <button className="w-full bg-orange-600 py-3 rounded-xl font-bold">আপডেট করুন</button>
      </form>

      <div className="grid gap-2">
        <button onClick={() => navigate('/wallet')} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-left flex justify-between">
          <span>ওয়ালেট হিস্ট্রি</span>
          <span>➜</span>
        </button>
        <button onClick={() => navigate('/contact')} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-left flex justify-between">
          <span>অ্যাডমিনের সাথে কথা বলুন</span>
          <span>➜</span>
        </button>
        <button onClick={() => { logout(); navigate('/'); }} className="w-full bg-red-600/20 text-red-500 p-4 rounded-xl font-bold">লগ আউট</button>
      </div>
    </div>
  );
};

export default Profile;
