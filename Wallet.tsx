
import React, { useState } from 'react';
import { useStore } from '../store';
import { PaymentRequest } from '../types';

const Wallet: React.FC = () => {
  const { currentUser, settings, addPaymentRequest, payments } = useStore();
  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAW' | 'HISTORY'>('DEPOSIT');

  const [amount, setAmount] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [method, setMethod] = useState<'BKASH' | 'NAGAD'>('BKASH');

  if (!currentUser) return <div className="p-10 text-center">টাকা জমা বা উত্তোলনের জন্য লগইন করুন।</div>;

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (num < settings.minDeposit) return alert(`সর্বনিম্ন ডিপোজিট ৳${settings.minDeposit}`);
    if (!senderNumber || !trxId) return alert('সব তথ্য পূরণ করুন');

    const req: PaymentRequest = {
      id: Math.random().toString(36),
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'DEPOSIT',
      method,
      amount: num,
      senderNumber,
      transactionId: trxId,
      status: 'PENDING',
      timestamp: Date.now()
    };

    addPaymentRequest(req);
    alert('অনুরোধ পাঠানো হয়েছে। অ্যাডমিন চেক করে ব্যালেন্স যোগ করে দিবে।');
    setAmount('');
    setSenderNumber('');
    setTrxId('');
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (num < settings.minWithdraw) return alert(`সর্বনিম্ন উত্তোলন ৳${settings.minWithdraw}`);
    if (num > currentUser.balance) return alert('আপনার পর্যাপ্ত ব্যালেন্স নেই');
    if (!senderNumber) return alert('নাম্বার দিন');

    const req: PaymentRequest = {
      id: Math.random().toString(36),
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'WITHDRAW',
      method,
      amount: num,
      receiverNumber: senderNumber,
      status: 'PENDING',
      timestamp: Date.now()
    };

    addPaymentRequest(req);
    alert('উত্তোলন অনুরোধ সফল হয়েছে।');
    setAmount('');
    setSenderNumber('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-2xl shadow-xl">
        <p className="text-orange-100 text-sm">আপনার বর্তমান ব্যালেন্স</p>
        <h2 className="text-4xl font-bold mt-1">৳{currentUser.balance}</h2>
      </div>

      <div className="flex bg-slate-800 p-1 rounded-xl">
        {(['DEPOSIT', 'WITHDRAW', 'HISTORY'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === tab ? 'bg-orange-600 shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'DEPOSIT' ? 'টাকা যোগ' : tab === 'WITHDRAW' ? 'উত্তোলন' : 'হিস্ট্রি'}
          </button>
        ))}
      </div>

      {activeTab === 'DEPOSIT' && (
        <form onSubmit={handleDeposit} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-orange-500/20 mb-4">
            <h4 className="text-sm font-bold text-orange-400 mb-2 underline">টাকা পাঠানোর নিয়ম:</h4>
            <p className="text-xs text-slate-300">১. নিচের যেকোনো নাম্বারে সেন্ড মানি করুন।</p>
            <p className="text-xs text-slate-300">২. যে নাম্বার থেকে পাঠিয়েছেন এবং TrxID নিচে দিন।</p>
            <div className="mt-3 flex gap-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase">bKash (Personal)</p>
                <p className="font-mono text-white">{settings.adminBkash}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase">Nagad (Personal)</p>
                <p className="font-mono text-white">{settings.adminNagad}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <label className="flex-1 flex items-center gap-2 bg-slate-900 p-3 rounded-lg border border-slate-700 cursor-pointer">
              <input type="radio" checked={method === 'BKASH'} onChange={() => setMethod('BKASH')} className="accent-orange-500" />
              <span className="text-sm font-bold">bKash</span>
            </label>
            <label className="flex-1 flex items-center gap-2 bg-slate-900 p-3 rounded-lg border border-slate-700 cursor-pointer">
              <input type="radio" checked={method === 'NAGAD'} onChange={() => setMethod('NAGAD')} className="accent-orange-500" />
              <span className="text-sm font-bold">Nagad</span>
            </label>
          </div>

          <InputField label="পরিমাণ (Amount)" type="number" value={amount} onChange={setAmount} placeholder="100" />
          <InputField label="আপনার নাম্বার" type="text" value={senderNumber} onChange={setSenderNumber} placeholder="017xxxxxxxx" />
          <InputField label="TrxID (ট্রানজেকশন আইডি)" type="text" value={trxId} onChange={setTrxId} placeholder="ABC123XYZ" />

          <button className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-xl font-bold mt-4">ডিপোজিট রিকোয়েস্ট পাঠান</button>
        </form>
      )}

      {activeTab === 'WITHDRAW' && (
        <form onSubmit={handleWithdraw} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
          <div className="flex gap-4 mb-4">
            <label className="flex-1 flex items-center gap-2 bg-slate-900 p-3 rounded-lg border border-slate-700 cursor-pointer">
              <input type="radio" checked={method === 'BKASH'} onChange={() => setMethod('BKASH')} className="accent-orange-500" />
              <span className="text-sm font-bold">bKash</span>
            </label>
            <label className="flex-1 flex items-center gap-2 bg-slate-900 p-3 rounded-lg border border-slate-700 cursor-pointer">
              <input type="radio" checked={method === 'NAGAD'} onChange={() => setMethod('NAGAD')} className="accent-orange-500" />
              <span className="text-sm font-bold">Nagad</span>
            </label>
          </div>

          <InputField label="পরিমাণ (৳২০০ এর বেশি হতে হবে)" type="number" value={amount} onChange={setAmount} placeholder="200" />
          <InputField label="টাকা নেওয়ার নাম্বার" type="text" value={senderNumber} onChange={setSenderNumber} placeholder="017xxxxxxxx" />

          <button className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-xl font-bold mt-4">উত্তোলন রিকোয়েস্ট পাঠান</button>
        </form>
      )}

      {activeTab === 'HISTORY' && (
        <div className="space-y-3">
          {payments.filter(p => p.userId === currentUser.id).sort((a,b) => b.timestamp - a.timestamp).map(p => (
            <div key={p.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
              <div>
                <p className="font-bold">{p.type === 'DEPOSIT' ? 'টাকা যোগ' : 'উত্তোলন'} - {p.method}</p>
                <p className="text-[10px] text-slate-500">{new Date(p.timestamp).toLocaleString()}</p>
                {p.transactionId && <p className="text-[10px] text-orange-400">Trx: {p.transactionId}</p>}
              </div>
              <div className="text-right">
                <p className="font-bold">৳{p.amount}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  p.status === 'APPROVED' ? 'bg-green-600/20 text-green-400' : 
                  p.status === 'REJECTED' ? 'bg-red-600/20 text-red-400' : 
                  'bg-yellow-600/20 text-yellow-400'
                }`}>
                  {p.status}
                </span>
              </div>
            </div>
          ))}
          {payments.filter(p => p.userId === currentUser.id).length === 0 && (
            <p className="text-center text-slate-500 py-10">কোনো হিস্ট্রি পাওয়া যায়নি।</p>
          )}
        </div>
      )}
    </div>
  );
};

const InputField: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="text-xs text-slate-400 mb-1 block">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 outline-none focus:border-orange-500"
    />
  </div>
);

export default Wallet;
