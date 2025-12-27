
import React from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Tournament } from '../types';

const Home: React.FC = () => {
  const { tournaments } = useStore();
  const navigate = useNavigate();

  const getMultiplier = (type: string) => {
    if (type === 'SOLO') return 1;
    if (type === 'DUO') return 2;
    if (type === 'SQUAD') return 4;
    return 1;
  };

  return (
    <div className="space-y-6">
      <section className="relative h-48 rounded-2xl overflow-hidden shadow-2xl">
        <img src="https://picsum.photos/seed/ffgame/800/400" alt="Banner" className="w-full h-full object-cover brightness-50" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
          <h2 className="text-2xl font-bold text-white mb-2">প্রতিদিন জিতুন হাজার হাজার টাকা</h2>
          <p className="text-slate-300 text-sm">সেরা ফ্রি ফায়ার টুর্নামেন্ট প্ল্যাটফর্ম</p>
        </div>
      </section>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span className="w-2 h-6 bg-orange-600 rounded-full"></span>
          চলমান টুর্নামেন্ট
        </h3>
      </div>

      <div className="grid gap-4">
        {tournaments.filter(t => t.status !== 'COMPLETED').map(t => (
          <div 
            key={t.id} 
            className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-orange-500/50 transition-all cursor-pointer"
            onClick={() => navigate(`/match/${t.id}`)}
          >
            <div className="p-4 flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.matchType === 'SOLO' ? 'bg-blue-600' : t.matchType === 'DUO' ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {t.matchType}
                  </span>
                  <span className="text-xs text-slate-400">Time: {new Date(t.startTime).toLocaleString('bn-BD')}</span>
                </div>
                <h4 className="font-bold text-lg mb-3">{t.title}</h4>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-900 p-2 rounded text-center">
                    <p className="text-[10px] text-slate-400 uppercase">এন্ট্রি ফি</p>
                    <p className="font-bold text-orange-400">৳{t.entryFee * getMultiplier(t.matchType)}</p>
                  </div>
                  <div className="bg-slate-900 p-2 rounded text-center">
                    <p className="text-[10px] text-slate-400 uppercase">পার কিল</p>
                    <p className="font-bold text-orange-400">৳{t.perKill}</p>
                  </div>
                  <div className="bg-slate-900 p-2 rounded text-center">
                    <p className="text-[10px] text-slate-400 uppercase">প্রথম পুরস্কার</p>
                    <p className="font-bold text-orange-400">৳{t.prizes.first}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-2 sm:w-32">
                <div className="text-center mb-1">
                  <p className="text-xs text-slate-400">Joined</p>
                  <p className="font-bold">{t.players.length} / {t.matchType === 'SOLO' ? 48 : t.matchType === 'DUO' ? 24 : 12}</p>
                </div>
                <button className="bg-orange-600 hover:bg-orange-700 py-2 rounded-lg font-bold text-sm transition-colors">
                  Join Match
                </button>
              </div>
            </div>
            
            <div className="bg-slate-700/50 px-4 py-2 flex justify-between items-center text-[10px] text-slate-400">
              <span>Map: Bermuda</span>
              <span>Mode: Classic TPP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
