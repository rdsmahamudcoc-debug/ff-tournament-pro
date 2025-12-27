
export const COLORS = {
  primary: '#f97316', // Orange 500
  secondary: '#1e293b', // Slate 800
  accent: '#ef4444', // Red 500
  background: '#0f172a', // Slate 900
};

export const TEXT = {
  HOME: 'হোম',
  TOURNAMENTS: 'টুর্নামেন্ট',
  WALLET: 'ওয়ালেট',
  PROFILE: 'প্রোফাইল',
  ADMIN: 'অ্যাডমিন প্যানেল',
  MIN_DEPOSIT_MSG: 'সর্বনিম্ন ডিপোজিট ১০০ টাকা',
  MIN_WITHDRAW_MSG: 'সর্বনিম্ন উত্তোলন ২০০ টাকা',
  JOIN_NOW: 'জয়েন করুন',
  ENTRY_FEE: 'এন্ট্রি ফি',
  PER_KILL: 'পার কিল',
  PRIZE_POOL: 'প্রাইজ পুল',
  ROOM_INFO: 'রুম আইডি ও পাসওয়ার্ড',
  CONTACT_ADMIN: 'অ্যাডমিনের সাথে যোগাযোগ',
};

export const MOCK_TOURNAMENTS = [
  {
    id: 't1',
    title: 'ফ্রি ফায়ার স্পেশাল টুর্নামেন্ট #১০১',
    matchType: 'SOLO',
    entryFee: 30,
    perKill: 10,
    prizes: { first: 300, second: 150, third: 50 },
    startTime: Date.now() + 3600000,
    players: [],
    status: 'UPCOMING'
  },
  {
    id: 't2',
    title: 'সানডে ধামাকা স্কোয়াড ব্যাটল',
    matchType: 'SQUAD',
    entryFee: 50,
    perKill: 20,
    prizes: { first: 1000, second: 500, third: 200 },
    startTime: Date.now() + 7200000,
    players: [],
    status: 'UPCOMING'
  }
];
