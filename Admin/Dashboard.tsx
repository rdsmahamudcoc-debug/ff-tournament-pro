
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { Tournament, AppSettings, MatchType, User, ChatMessage } from '../../types';

const AdminDashboard: React.FC = () => {
  const { 
    currentUser, payments, users, tournaments, settings, messages,
    processPayment, addTournament, removeTournament, updateTournament, setSettings, adminUpdateUser, sendMessage
  } = useStore();

  const [activeMenu, setActiveMenu] = useState<'PAYMENTS' | 'MATCHES' | 'USERS' | 'SETTINGS' | 'MESSAGES'>('PAYMENTS');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newBalance, setNewBalance] = useState<string>('');
  
  // Chat state
  const [selectedUserForChat, setSelectedUserForChat] = useState<User | null>(null);
  const [replyText, setReplyText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  if (currentUser?.role !== 'ADMIN') return <div className="p-10 text-center">Unauthorized Access</div>;

  const handleUpdateBalance = () => {
    if (editingUser && newBalance !== '') {
      adminUpdateUser(editingUser.id, { balance: Number(newBalance) });
      setEditingUser(null);
      setNewBalance('');
      alert('ব্যালেন্স আপডেট সফল হয়েছে!');
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForChat || !replyText.trim()) return;
    sendMessage(replyText, selectedUserForChat.id);
    setReplyText('');
  };

  // Get unique users who have a chat history with admin
  const usersWithMessages = Array.from(new Set(messages.map(m => m.senderId === 'admin-1' ? m.receiverId : m.senderId)))
    .filter(uid => uid !== 'admin-1')
    .map(uid => users.find(u => u.id === uid))
    .filter(Boolean) as User[];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUserForChat]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold border-b border-slate-700 pb-2">অ্যাডমিন কন্ট্রোল প্যানেল</h2>
      
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <AdminTab active={activeMenu === 'PAYMENTS'} onClick={() => setActiveMenu('PAYMENTS')} label="পেমেন্ট" />
        <AdminTab active={activeMenu === 'MATCHES'} onClick={() => setActiveMenu('MATCHES')} label="ম্যাচ" />
        <AdminTab active={activeMenu === 'USERS'} onClick={() => setActiveMenu('USERS')} label="ইউজার" />
        <AdminTab active={activeMenu === 'MESSAGES'} onClick={() => setActiveMenu('MESSAGES')} label="মেসেজ" />
        <AdminTab active={activeMenu === 'SETTINGS'} onClick={() => setActiveMenu('SETTINGS')} label="সেটিংস" />
      </div>

      {activeMenu === 'PAYMENTS' && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg">পেন্ডিং রিকোয়েস্ট ({payments.filter(p => p.status === 'PENDING').length})</h3>
          {payments.filter(p => p.status === 'PENDING').map(p => (
            <div key={p.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.type === 'DEPOSIT' ? 'bg-blue-600' : 'bg-red-600'}`}>
                  {p.type} - {p.method}
                </span>
                <p className="font-bold mt-1 text-slate-200">{p.userName} - {p.amount} BDT</p>
                <p className="text-xs text-slate-400">Number: {p.senderNumber || p.receiverNumber}</p>
                {p.transactionId && <p className="text-xs text-orange-400">Trx: {p.transactionId}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => processPayment(p.id, 'REJECTED')} className="px-4 py-2 bg-red-600/20 text-red-500 rounded-lg text-sm font-bold">Reject</button>
                <button onClick={() => processPayment(p.id, 'APPROVED')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold">Approve</button>
              </div>
            </div>
          ))}
          {payments.filter(p => p.status === 'PENDING').length === 0 && <p className="text-center text-slate-500">No pending payments</p>}
        </div>
      )}

      {activeMenu === 'MATCHES' && <ManageMatches tournaments={tournaments} add={addTournament} remove={removeTournament} update={updateTournament} />}
      
      {activeMenu === 'USERS' && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg">মোট ইউজার: {users.length}</h3>
          <div className="grid gap-3">
            {users.map(u => (
              <div key={u.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                <div>
                  <p className="font-bold">{u.name} <span className="text-[10px] text-slate-500 font-normal">({u.email})</span></p>
                  <p className="text-xs text-slate-500">{u.phone}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-orange-400">৳{u.balance}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{u.role}</p>
                  </div>
                  <button 
                    onClick={() => { setEditingUser(u); setNewBalance(u.balance.toString()); }}
                    className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeMenu === 'MESSAGES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
          {/* User List */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-y-auto">
            <h4 className="p-4 border-b border-slate-700 font-bold">ইনবক্স</h4>
            {usersWithMessages.map(user => (
              <button 
                key={user.id} 
                onClick={() => setSelectedUserForChat(user)}
                className={`w-full p-4 text-left hover:bg-slate-700 border-b border-slate-700/50 transition-colors ${
                  selectedUserForChat?.id === user.id ? 'bg-slate-700 border-l-4 border-l-orange-600' : ''
                }`}
              >
                <p className="font-bold text-sm">{user.name}</p>
                <p className="text-[10px] text-slate-500">{user.phone}</p>
              </button>
            ))}
            {usersWithMessages.length === 0 && <p className="p-10 text-center text-xs text-slate-500 italic">কোনো মেসেজ নেই</p>}
          </div>

          {/* Chat Window */}
          <div className="md:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 flex flex-col overflow-hidden">
            {selectedUserForChat ? (
              <>
                <div className="p-3 bg-slate-900 border-b border-slate-700">
                  <p className="font-bold text-sm">Chatting with: {selectedUserForChat.name}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages
                    .filter(m => (m.senderId === selectedUserForChat.id && m.receiverId === 'admin-1') || (m.senderId === 'admin-1' && m.receiverId === selectedUserForChat.id))
                    .sort((a,b) => a.timestamp - b.timestamp)
                    .map(msg => (
                      <div key={msg.id} className={`flex ${msg.senderId === 'admin-1' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-3 py-1.5 rounded-xl text-xs max-w-[85%] ${
                          msg.senderId === 'admin-1' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-slate-700 text-slate-200 rounded-tl-none'
                        }`}>
                          {msg.message}
                          <p className="text-[8px] opacity-60 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  <div ref={scrollRef} />
                </div>
                <form onSubmit={handleSendReply} className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
                  <input 
                    type="text" 
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="রিপ্লাই লিখুন..." 
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-orange-500"
                  />
                  <button type="submit" className="bg-orange-600 px-4 py-1.5 rounded-lg text-xs font-bold">Reply</button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                বামে ক্লিক করে ইউজার সিলেক্ট করুন
              </div>
            )}
          </div>
        </div>
      )}

      {activeMenu === 'SETTINGS' && (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
          <SettingsField label="Admin bKash" value={settings.adminBkash} onChange={(v) => setSettings({...settings, adminBkash: v})} />
          <SettingsField label="Admin Nagad" value={settings.adminNagad} onChange={(v) => setSettings({...settings, adminNagad: v})} />
          <SettingsField label="Marquee Notice" value={settings.marqueeNotice} onChange={(v) => setSettings({...settings, marqueeNotice: v})} isTextArea />
          <SettingsField label="Min Deposit" value={settings.minDeposit.toString()} onChange={(v) => setSettings({...settings, minDeposit: Number(v)})} />
          <SettingsField label="Min Withdraw" value={settings.minWithdraw.toString()} onChange={(v) => setSettings({...settings, minWithdraw: Number(v)})} />
        </div>
      )}

      {/* Edit Balance Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold mb-1">ব্যালেন্স এডিট করুন</h3>
            <p className="text-xs text-slate-500 mb-6">{editingUser.name}-এর জন্য নতুন ব্যালেন্স দিন।</p>
            
            <div className="mb-8">
              <label className="text-[10px] uppercase text-slate-500 mb-1 block font-bold tracking-wider">নতুন ব্যালেন্স (৳)</label>
              <input 
                type="number" 
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                placeholder="100"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setEditingUser(null)} className="flex-1 bg-slate-700 py-3 rounded-xl font-bold hover:bg-slate-600 transition-colors">বাতিল</button>
              <button onClick={handleUpdateBalance} className="flex-1 bg-orange-600 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20">আপডেট</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminTab: React.FC<{ active: boolean; label: string; onClick: () => void }> = ({ active, label, onClick }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-bold transition-all ${
    active ? 'bg-orange-600' : 'bg-slate-800 text-slate-400'
  }`}>{label}</button>
);

const SettingsField: React.FC<{ label: string; value: string; onChange: (v: string) => void; isTextArea?: boolean }> = ({ label, value, onChange, isTextArea }) => (
  <div>
    <label className="text-xs text-slate-400 mb-1 block">{label}</label>
    {isTextArea ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 outline-none" rows={3} />
    ) : (
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 outline-none" />
    )}
  </div>
);

const ManageMatches: React.FC<{ tournaments: Tournament[], add: (t: Tournament) => void, remove: (id: string) => void, update: (t: Tournament) => void }> = ({ tournaments, add, remove, update }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    matchType: 'SOLO' as MatchType,
    entryFee: 30,
    perKill: 10,
    prizes: { first: 300, second: 150, third: 50 },
    startTime: Date.now() + 86400000,
    roomId: '',
    password: ''
  });

  const handleSave = () => {
    if (editingId) {
      const match = tournaments.find(t => t.id === editingId);
      if (match) update({ ...match, ...form });
    } else {
      add({ 
        id: Math.random().toString(36), 
        ...form, 
        players: [], 
        status: 'UPCOMING' 
      });
    }
    setShowForm(false);
    setEditingId(null);
  };

  const edit = (t: Tournament) => {
    setForm({
      title: t.title,
      matchType: t.matchType,
      entryFee: t.entryFee,
      perKill: t.perKill,
      prizes: t.prizes,
      startTime: t.startTime,
      roomId: t.roomId || '',
      password: t.password || ''
    });
    setEditingId(t.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <button onClick={() => { setEditingId(null); setShowForm(true); }} className="w-full bg-orange-600 py-3 rounded-xl font-bold">+ অ্যাড নিউ টুর্নামেন্ট</button>
      
      {showForm && (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
          <SettingsField label="Title" value={form.title} onChange={v => setForm({...form, title: v})} />
          <div>
            <label className="text-xs text-slate-400 block mb-1">Match Type</label>
            <select value={form.matchType} onChange={e => setForm({...form, matchType: e.target.value as MatchType})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5">
              <option value="SOLO">SOLO</option>
              <option value="DUO">DUO</option>
              <option value="SQUAD">SQUAD</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SettingsField label="Entry Fee (Per Person)" value={form.entryFee.toString()} onChange={v => setForm({...form, entryFee: Number(v)})} />
            <SettingsField label="Per Kill" value={form.perKill.toString()} onChange={v => setForm({...form, perKill: Number(v)})} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <SettingsField label="1st Prize" value={form.prizes.first.toString()} onChange={v => setForm({...form, prizes: {...form.prizes, first: Number(v)}})} />
            <SettingsField label="2nd Prize" value={form.prizes.second.toString()} onChange={v => setForm({...form, prizes: {...form.prizes, second: Number(v)}})} />
            <SettingsField label="3rd Prize" value={form.prizes.third.toString()} onChange={v => setForm({...form, prizes: {...form.prizes, third: Number(v)}})} />
          </div>
          <SettingsField label="Room ID" value={form.roomId} onChange={v => setForm({...form, roomId: v})} />
          <SettingsField label="Room Password" value={form.password} onChange={v => setForm({...form, password: v})} />
          
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 bg-slate-700 py-2.5 rounded-lg font-bold">Cancel</button>
            <button onClick={handleSave} className="flex-1 bg-green-600 py-2.5 rounded-lg font-bold">Save Match</button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {tournaments.map(t => (
          <div key={t.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
            <div>
              <p className="font-bold">{t.title}</p>
              <p className="text-xs text-slate-500">{t.matchType} • Players: {t.players.length}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => edit(t)} className="p-2 bg-slate-700 rounded-lg">✏️</button>
              <button onClick={() => remove(t.id)} className="p-2 bg-red-600/20 text-red-500 rounded-lg">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
