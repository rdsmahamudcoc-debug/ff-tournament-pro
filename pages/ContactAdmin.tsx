
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const ContactAdmin: React.FC = () => {
  const { currentUser, messages, sendMessage } = useStore();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!currentUser) return <div className="p-10 text-center">যোগাযোগ করার জন্য আগে লগইন করুন।</div>;

  // Filter messages between this user and any admin
  const chatMessages = messages.filter(m => 
    (m.senderId === currentUser.id && m.receiverId === 'admin-1') ||
    (m.senderId === 'admin-1' && m.receiverId === currentUser.id)
  ).sort((a, b) => a.timestamp - b.timestamp);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText, 'admin-1');
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-2xl mx-auto bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
      <div className="bg-slate-900 p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center font-bold">A</div>
          <div>
            <h3 className="font-bold text-sm">অ্যাডমিন সাপোর্ট</h3>
            <p className="text-[10px] text-green-500">অনলাইন</p>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            <p className="text-sm">আপনার কোনো প্রশ্ন থাকলে নিচে লিখুন।</p>
            <p className="text-xs">অ্যাডমিন শীঘ্রই আপনার মেসেজের উত্তর দিবে।</p>
          </div>
        )}
        {chatMessages.map(msg => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                isMe ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-slate-700 text-slate-200 rounded-tl-none'
              }`}>
                {msg.message}
                <p className="text-[8px] opacity-60 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-700 flex gap-2">
        <input 
          type="text" 
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="মেসেজ লিখুন..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-orange-500 transition-colors text-sm"
        />
        <button type="submit" className="bg-orange-600 p-2 rounded-xl px-4 font-bold hover:bg-orange-700">পাঠান</button>
      </form>
    </div>
  );
};

export default ContactAdmin;
