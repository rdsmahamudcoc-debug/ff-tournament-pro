
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { MatchType } from '../types';

const MatchDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tournaments, currentUser, joinTournament } = useStore();
  const match = tournaments.find(t => t.id === id);

  const [selectedMode, setSelectedMode] = useState<MatchType>('SOLO');
  const [names, setNames] = useState<string[]>(['']);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    if (match) {
      setSelectedMode(match.matchType);
    }
  }, [match]);

  if (!match) return <div className="p-10 text-center">টুর্নামেন্ট পাওয়া যায়নি!</div>;

  const isJoined = match.players.some(p => p.userId === currentUser?.id);
  const tenMinutesBefore = match.startTime - 600000;
  const showRoomInfo = isJoined && Date.now() >= tenMinutesBefore;

  const getMultiplier = (mode: MatchType) => {
    if (mode === 'SOLO') return 1;
    if (mode === 'DUO') return 2;
    if (mode === 'SQUAD') return 4;
    return 1;
  };

  const currentMultiplier = getMultiplier(selectedMode);
  const totalFee = match.entryFee * currentMultiplier;

  const handleJoin = () => {
    if (!currentUser) return navigate('/login');
    if (names.some(n => !n.trim())) {
      alert('সব প্লেয়ারের নাম লিখুন');
      return;
    }
    
    const res = joinTournament(match.id, names, selectedMode, totalFee);
    if (res.success) {
      alert(res.msg);
      setShowJoinModal(false);
    } else {
      alert(res.msg);
    }
  };

  const handleNameChange = (index: number, val: string) => {
    const newNames = [...names];
    newNames[index] = val;
    setNames(newNames);
  };

  const openModal = () => {
    setNames(new Array(currentMultiplier).fill(''));
    setShowJoinModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h2 className="text-2xl font-bold mb-4">{match.title}</h2>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="bg-orange-600/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold">ম্যাচ টাইপ: {match.matchType}</span>
          <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs">শুরু: {new Date(match.startTime).toLocaleString('bn-BD')}</span>
        </div>

        {/* Mode Selection */}
        {!isJoined && (
          <div className="mb-6">
            <p className="text-sm text-slate-400 mb-3 font-medium">আপনার খেলার ধরন বেছে নিন:</p>
            <div className="flex bg-slate-900 p-1 rounded-xl gap-1">
              {(['SOLO', 'DUO', 'SQUAD'] as MatchType[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    selectedMode === mode 
                      ? 'bg-orange-600 text-white shadow-lg' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatBox label="এন্ট্রি ফি" value={`৳${totalFee}`} />
          <StatBox label="পার কিল" value={`৳${match.perKill}`} />
          <StatBox label="১ম পুরস্কার" value={`৳${match.prizes.first}`} />
          <StatBox label="২য় পুরস্কার" value={`৳${match.prizes.second}`} />
        </div>

        {showRoomInfo ? (
          <div className="bg-green-600/20 border border-green-500/50 p-4 rounded-xl mb-6">
            <h4 className="font-bold text-green-400 mb-2">রুম তথ্য (Room Info)</h4>
            <div className="flex justify-between items-center mb-2">
              <span>Room ID:</span>
              <span className="font-mono text-xl text-white">{match.roomId || 'অপেক্ষমান...'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Password:</span>
              <span className="font-mono text-xl text-white">{match.password || 'অপেক্ষমান...'}</span>
            </div>
          </div>
        ) : isJoined ? (
          <div className="bg-blue-600/20 border border-blue-500/50 p-4 rounded-xl mb-6 text-center">
            <p className="text-blue-400">আপনি সফলভাবে টুর্নামেন্টে যোগ দিয়েছেন!</p>
            <p className="text-xs text-blue-300 mt-1">রুম আইডি খেলার ১০ মিনিট আগে এই পেইজে পাওয়া যাবে।</p>
          </div>
        ) : (
          <button 
            onClick={openModal}
            className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-orange-600/20"
          >
            যোগ দিন ({selectedMode} - ৳{totalFee})
          </button>
        )}
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-xl font-bold mb-4">প্লেয়ার লিস্ট ({match.players.length})</h3>
        <div className="divide-y divide-slate-700">
          {match.players.map((p, i) => (
            <div key={i} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-200">{p.names.join(' & ')}</p>
                <p className="text-[10px] bg-slate-700 px-2 py-0.5 rounded inline-block mt-1 uppercase text-slate-400">{p.matchType}</p>
              </div>
              <span className="text-green-500 text-sm font-medium">Joined</span>
            </div>
          ))}
          {match.players.length === 0 && (
            <p className="py-4 text-center text-slate-500 italic">এখনও কেউ যোগ দেয়নি।</p>
          )}
        </div>
      </div>

      {showJoinModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-1">{selectedMode} মেম্বারদের নাম</h3>
            <p className="text-xs text-slate-500 mb-6">গেমের ইন-গেম নামগুলো সঠিকভাবে লিখুন।</p>
            
            <div className="space-y-4 mb-8">
              {names.map((n, i) => (
                <div key={i}>
                  <label className="text-[10px] uppercase text-slate-500 mb-1 block font-bold tracking-wider">প্লেয়ার {i + 1}</label>
                  <input 
                    type="text" 
                    value={n}
                    onChange={(e) => handleNameChange(i, e.target.value)}
                    placeholder="In-game Name"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowJoinModal(false)} className="flex-1 bg-slate-700 py-3 rounded-xl font-bold hover:bg-slate-600 transition-colors">বাতিল</button>
              <button onClick={handleJoin} className="flex-1 bg-orange-600 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20">কনফার্ম</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-slate-900 p-3 rounded-xl border border-slate-700/50">
    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">{label}</p>
    <p className="font-bold text-lg text-orange-400">{value}</p>
  </div>
);

export default MatchDetails;
