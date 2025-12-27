
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Tournament, PaymentRequest, AppSettings, ChatMessage } from './types';
import { MOCK_TOURNAMENTS } from './constants';

const STORAGE_KEY = 'ff_tourney_v1';

interface State {
  currentUser: User | null;
  users: User[];
  tournaments: Tournament[];
  payments: PaymentRequest[];
  settings: AppSettings;
  messages: ChatMessage[];
}

interface StoreContextType extends State {
  login: (identifier: string, password: string) => { success: boolean; msg: string };
  register: (newUser: Omit<User, 'balance' | 'role' | 'joinedMatches'>) => { success: boolean; msg: string };
  logout: () => void;
  updateProfile: (updatedUser: Partial<User>) => void;
  adminUpdateUser: (userId: string, updates: Partial<User>) => void;
  addTournament: (t: Tournament) => void;
  removeTournament: (id: string) => void;
  updateTournament: (updated: Tournament) => void;
  addPaymentRequest: (p: PaymentRequest) => void;
  processPayment: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  joinTournament: (tournamentId: string, playerNames: string[], type: 'SOLO' | 'DUO' | 'SQUAD', fee: number) => { success: boolean; msg: string };
  setSettings: (s: AppSettings) => void;
  sendMessage: (msg: string, receiverId: string) => void;
}

const initialState: State = {
  currentUser: null,
  users: [
    { id: 'admin-1', name: 'Admin', phone: '01700000000', email: 'admin', password: '123', balance: 0, role: 'ADMIN', joinedMatches: [] },
    { id: 'user-1', name: 'Player One', phone: '01800000000', email: 'player1', password: '123', balance: 500, role: 'PLAYER', joinedMatches: [] }
  ],
  tournaments: MOCK_TOURNAMENTS as Tournament[],
  payments: [],
  settings: {
    adminBkash: '01712345678',
    adminNagad: '01912345678',
    marqueeNotice: 'আজকের টুর্নামেন্টে যোগ দিন এবং জিতে নিন আকর্ষণীয় প্রাইজ মানি! রুম আইডি খেলার ১০ মিনিট আগে দেওয়া হবে।',
    minDeposit: 100,
    minWithdraw: 200
  },
  messages: []
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<State>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const login = (identifier: string, password: string) => {
    const user = state.users.find(u => (u.phone === identifier || u.email === identifier) && u.password === password);
    if (user) {
      setState(prev => ({ ...prev, currentUser: user }));
      return { success: true, msg: 'লগইন সফল হয়েছে' };
    }
    return { success: false, msg: 'আইডি বা পাসওয়ার্ড ভুল!' };
  };

  const register = (newUser: Omit<User, 'balance' | 'role' | 'joinedMatches'>) => {
    const exists = state.users.some(u => u.phone === newUser.phone || u.email === newUser.email);
    if (exists) {
      return { success: false, msg: 'এই ফোন বা আইডি দিয়ে অলরেডি অ্যাকাউন্ট আছে' };
    }
    const fullUser: User = { ...newUser, balance: 0, role: 'PLAYER', joinedMatches: [] };
    setState(prev => ({ ...prev, users: [...prev.users, fullUser], currentUser: fullUser }));
    return { success: true, msg: 'অ্যাকাউন্ট তৈরি সফল হয়েছে' };
  };

  const logout = () => setState(prev => ({ ...prev, currentUser: null }));

  const updateProfile = (updatedUser: Partial<User>) => {
    if (!state.currentUser) return;
    const newCurrentUser = { ...state.currentUser, ...updatedUser };
    setState(prev => ({
      ...prev,
      currentUser: newCurrentUser,
      users: prev.users.map(u => u.id === newCurrentUser.id ? newCurrentUser : u)
    }));
  };

  const adminUpdateUser = (userId: string, updates: Partial<User>) => {
    setState(prev => {
      const newUsers = prev.users.map(u => u.id === userId ? { ...u, ...updates } : u);
      const newCurrentUser = prev.currentUser?.id === userId 
        ? { ...prev.currentUser, ...updates } 
        : prev.currentUser;
      return { ...prev, users: newUsers, currentUser: newCurrentUser };
    });
  };

  const addTournament = (t: Tournament) => setState(prev => ({ ...prev, tournaments: [...prev.tournaments, t] }));
  
  const removeTournament = (id: string) => setState(prev => ({
    ...prev,
    tournaments: prev.tournaments.filter(t => t.id !== id)
  }));

  const updateTournament = (updated: Tournament) => setState(prev => ({
    ...prev,
    tournaments: prev.tournaments.map(t => t.id === updated.id ? updated : t)
  }));

  const addPaymentRequest = (p: PaymentRequest) => setState(prev => ({ ...prev, payments: [...prev.payments, p] }));

  const processPayment = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setState(prev => {
      const payment = prev.payments.find(p => p.id === id);
      if (!payment || payment.status !== 'PENDING') return prev;
      const newPayments = prev.payments.map(p => p.id === id ? { ...p, status } : p);
      let newUsers = [...prev.users];
      if (status === 'APPROVED') {
        newUsers = newUsers.map(u => {
          if (u.id === payment.userId) {
            const newBalance = payment.type === 'DEPOSIT' ? u.balance + payment.amount : u.balance - payment.amount;
            return { ...u, balance: newBalance };
          }
          return u;
        });
      }
      const newCurrentUser = state.currentUser?.id === payment.userId ? newUsers.find(u => u.id === payment.userId) || null : state.currentUser;
      return { ...prev, payments: newPayments, users: newUsers, currentUser: newCurrentUser };
    });
  };

  const joinTournament = (tournamentId: string, playerNames: string[], type: 'SOLO' | 'DUO' | 'SQUAD', fee: number) => {
    if (!state.currentUser) return { success: false, msg: 'লগইন করুন' };
    if (state.currentUser.balance < fee) return { success: false, msg: 'পর্যাপ্ত ব্যালেন্স নেই' };
    const tournament = state.tournaments.find(t => t.id === tournamentId);
    if (!tournament) return { success: false, msg: 'টুর্নামেন্ট পাওয়া যায়নি' };
    const newPlayer = { userId: state.currentUser.id, names: playerNames, matchType: type, entryPaid: fee };
    setState(prev => {
      const updatedTournaments = prev.tournaments.map(t => t.id === tournamentId ? { ...t, players: [...t.players, newPlayer] } : t);
      const updatedUsers = prev.users.map(u => u.id === state.currentUser?.id ? { ...u, balance: u.balance - fee, joinedMatches: [...u.joinedMatches, tournamentId] } : u);
      return { ...prev, tournaments: updatedTournaments, users: updatedUsers, currentUser: updatedUsers.find(u => u.id === state.currentUser?.id) || null };
    });
    return { success: true, msg: 'সফলভাবে যোগ দিয়েছেন' };
  };

  const setSettings = (s: AppSettings) => setState(prev => ({ ...prev, settings: s }));

  const sendMessage = (msg: string, receiverId: string) => {
    if (!state.currentUser) return;
    const newMsg: ChatMessage = { id: Math.random().toString(36), senderId: state.currentUser.id, receiverId, message: msg, timestamp: Date.now() };
    setState(prev => ({ ...prev, messages: [...prev.messages, newMsg] }));
  };

  return React.createElement(
    StoreContext.Provider,
    {
      value: {
        ...state,
        login,
        register,
        logout,
        updateProfile,
        adminUpdateUser,
        addTournament,
        removeTournament,
        updateTournament,
        addPaymentRequest,
        processPayment,
        joinTournament,
        setSettings,
        sendMessage,
      },
    },
    children
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
