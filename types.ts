
export type MatchType = 'SOLO' | 'DUO' | 'SQUAD';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  balance: number;
  role: 'PLAYER' | 'ADMIN';
  joinedMatches: string[];
}

export interface Tournament {
  id: string;
  title: string;
  matchType: MatchType;
  entryFee: number; // Single person fee
  perKill: number;
  prizes: {
    first: number;
    second: number;
    third: number;
  };
  startTime: number; // Timestamp
  roomId?: string;
  password?: string;
  players: JoinedPlayer[];
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
}

export interface JoinedPlayer {
  userId: string;
  names: string[]; // 1 for solo, 2 for duo, 4 for squad
  matchType: MatchType;
  entryPaid: number;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  type: 'DEPOSIT' | 'WITHDRAW';
  method: 'BKASH' | 'NAGAD';
  amount: number;
  senderNumber?: string;
  receiverNumber?: string;
  transactionId?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: number;
}

export interface AppSettings {
  adminBkash: string;
  adminNagad: string;
  marqueeNotice: string;
  minDeposit: number;
  minWithdraw: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: number;
}
