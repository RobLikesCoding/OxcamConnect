/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Bus, 
  Train, 
  Plane, 
  Clock, 
  Leaf, 
  AlertCircle, 
  ChevronRight, 
  ArrowRightLeft,
  ShieldCheck,
  Zap,
  QrCode,
  ArrowLeft,
  Download,
  Share2,
  Lock,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';

const START_POINTS = ['Oxford City Centre', 'Oxford Parkway', 'Milton Keynes', 'Bicester Skyport'];
const DESTINATIONS = ['Cambridge Science Park', 'Cambridge City Centre', 'Cambridge Airport'];

export default function App() {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [isSimulatingDelay, setIsSimulatingDelay] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [view, setView] = useState<'planner' | 'history' | 'tickets' | 'boarding-pass' | 'checkout' | 'confirmed' | 'apple-wallet'>('planner');
  const [showWalletSuccess, setShowWalletSuccess] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ name: '', card: '', expiry: '', cvv: '' });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPayButtonPressed, setIsPayButtonPressed] = useState(false);
  const [tickets, setTickets] = useState<any[]>([
    {
      id: 'BR-102',
      start: 'Oxford City Centre',
      destination: 'Cambridge City Centre',
      date: '12 MAR 2026',
      boarding: '09:20',
      slot: '09:30',
      gate: 'Pad 02-B',
      seat: '04-A',
      passenger: 'Rob Wilson',
      isDelayed: false
    },
    {
      id: 'BR-089',
      start: 'Bicester Skyport',
      destination: 'Cambridge Science Park',
      date: '05 MAR 2026',
      boarding: '11:45',
      slot: '11:55',
      gate: 'Pad 01-C',
      seat: '01-D',
      passenger: 'Rob Wilson',
      isDelayed: true
    }
  ]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const isDirectSkyport = start === 'Bicester Skyport';

  const subtractMinutes = (timeStr: string, minutes: number) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    let totalMinutes = h * 60 + m - minutes;
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (start && destination) {
      setShowItinerary(true);
    } else {
      setShowItinerary(false);
    }
  }, [start, destination]);

  useEffect(() => {
    if (isSimulatingDelay && showItinerary && !isDirectSkyport) {
      const timer = setTimeout(() => setShowNotification(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowNotification(false);
    }
  }, [isSimulatingDelay, showItinerary, isDirectSkyport]);

  const handlePurchase = () => {
    const newTicket = {
      id: `BR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      start,
      destination,
      date: '18 MAR 2026',
      boarding: isSimulatingDelay && !isDirectSkyport ? '14:35' : '14:20',
      slot: isSimulatingDelay && !isDirectSkyport ? '14:45' : '14:30',
      gate: isDirectSkyport ? 'FATO A' : 'Pad 04-A',
      seat: '02-B',
      passenger: 'Rob Wilson',
      isDelayed: isSimulatingDelay && !isDirectSkyport
    };
    setSelectedTicket(newTicket);
    setCheckoutData({ name: '', card: '', expiry: '', cvv: '' });
    setIsProcessingPayment(false);
    setIsPayButtonPressed(false);
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (view === 'checkout') {
      const timers = [
        setTimeout(() => setCheckoutData(prev => ({ ...prev, name: 'John Smith' })), 500),
        setTimeout(() => setCheckoutData(prev => ({ ...prev, card: '**** **** **** 4444' })), 1000),
        setTimeout(() => setCheckoutData(prev => ({ ...prev, expiry: '10/28', cvv: '***' })), 1500),
        setTimeout(() => {
          setIsPayButtonPressed(true);
          setTimeout(() => {
            setIsProcessingPayment(true);
            setTimeout(() => {
              // Finalize purchase
              setTickets(prev => [selectedTicket, ...prev]);
              setView('confirmed');
            }, 1500);
          }, 300);
        }, 2500)
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [view, selectedTicket]);

  if (view === 'checkout') {
    return (
      <div className="min-h-screen flex flex-col max-w-md mx-auto bg-slate-50 shadow-2xl relative overflow-hidden font-sans">
        <header className="bg-navy p-6 text-white sticky top-0 z-50 flex items-center gap-4">
          <button onClick={() => setView('planner')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Secure Checkout</h1>
        </header>
        
        <main className="flex-1 p-6 space-y-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                <p className="text-2xl font-black text-navy font-mono">£150.00</p>
              </div>
              <ShieldCheck size={32} className="text-emerald-500" />
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cardholder Name</label>
                <input 
                  type="text" 
                  readOnly
                  placeholder="Full Name"
                  value={checkoutData.name}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-navy focus:ring-2 focus:ring-electric transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Card Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    readOnly
                    placeholder="0000 0000 0000 0000"
                    value={checkoutData.card}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-navy focus:ring-2 focus:ring-electric transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                    <div className="w-6 h-4 bg-slate-200 rounded-sm"></div>
                    <div className="w-6 h-4 bg-slate-300 rounded-sm"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expiry</label>
                  <input 
                    type="text" 
                    readOnly
                    placeholder="MM/YY"
                    value={checkoutData.expiry}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-navy focus:ring-2 focus:ring-electric transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">CVV</label>
                  <input 
                    type="password" 
                    readOnly
                    placeholder="***"
                    value={checkoutData.cvv}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-navy focus:ring-2 focus:ring-electric transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
            <Lock size={18} className="text-electric shrink-0" />
            <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
              Your payment is encrypted and secured by Skyports Infrastructure. No card details are stored locally.
            </p>
          </div>
        </main>

        <footer className="p-6 bg-white border-t border-slate-100">
          <button 
            disabled={isProcessingPayment}
            className={`w-full h-16 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
              isProcessingPayment 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : isPayButtonPressed 
                  ? 'bg-blue-600 text-white scale-95 shadow-inner' 
                  : 'bg-electric text-white shadow-lg shadow-blue-200 active:scale-95'
            }`}
          >
            {isProcessingPayment ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-6 h-6 border-2 border-slate-300 border-t-slate-500 rounded-full"
              />
            ) : (
              <>
                <ShieldCheck size={20} />
                Pay Now
              </>
            )}
          </button>
        </footer>
      </div>
    );
  }

  if (view === 'confirmed') {
    return (
      <div className="min-h-screen flex flex-col max-w-md mx-auto bg-slate-50 shadow-2xl relative overflow-hidden">
        <main className="flex-1 p-6 flex flex-col items-center justify-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-200"
          >
            <Check size={48} strokeWidth={3} />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-black text-navy mb-1"
          >
            Booking Confirmed
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 text-xs font-medium mb-8"
          >
            Booking Reference: <span className="text-navy font-bold">OXC-2204-RW</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 relative"
          >
            <div className="bg-navy p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Plane size={80} className="-rotate-45" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Route Summary</p>
              <h3 className="text-sm font-bold flex items-center gap-2">
                {selectedTicket?.start.split(' ')[0]} 
                <ArrowRightLeft size={12} className="text-electric" /> 
                {selectedTicket?.destination.split(' ')[0]}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Flight Detail</p>
                    <p className="text-xs font-bold text-navy">Bristow AAM Flight</p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Slot</p>
                      <p className="text-xs font-bold text-navy">{selectedTicket?.slot || '14:30'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aircraft</p>
                      <p className="text-xs font-bold text-navy">VX-4</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <QRCodeSVG 
                    value={`BOOKING-${selectedTicket?.id || 'RW001'}`} 
                    size={64}
                    level="H"
                  />
                </div>
              </div>

              <div className="p-4 bg-electric/5 rounded-2xl border border-electric/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-electric" />
                  <p className="text-[10px] font-bold text-navy uppercase tracking-widest">Boarding Status</p>
                </div>
                <p className="text-[10px] text-slate-600 leading-tight">
                  Your ticket is now active. Please arrive at the skyport 15 minutes before your slot for security screening.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="w-full space-y-3 mt-8">
            <button className="w-full bg-navy text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-95">
              <div className="flex -space-x-1">
                <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center p-0.5"><div className="w-full h-full bg-black rounded-[1px]"></div></div>
              </div>
              Add to Apple / Google Wallet
            </button>
            <button 
              onClick={() => setView('planner')}
              className="w-full bg-slate-100 text-slate-500 font-bold py-4 rounded-xl transition-transform active:scale-95"
            >
              Close
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (view === 'apple-wallet') {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col justify-end">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setView('boarding-pass')}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative bg-zinc-100 rounded-t-[2.5rem] w-full max-w-md mx-auto h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 flex justify-between items-center text-black">
            <div className="flex items-center gap-2">
              <img 
                src="https://i.postimg.cc/TP3S4dY3/logo_png.png" 
                alt="Skyports" 
                className="h-5 invert grayscale brightness-0"
                referrerPolicy="no-referrer"
              />
            </div>
            <button 
              onClick={() => {
                setShowWalletSuccess(true);
                setTimeout(() => {
                  setShowWalletSuccess(false);
                  setView('planner');
                }, 2000);
              }}
              className="text-white bg-blue-600 px-6 py-2 rounded-full font-bold text-sm active:scale-95 transition-transform"
            >
              Add
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-12">
            <div className="text-center mb-4">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Boarding Pass</p>
            </div>

            {/* The Pass Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-200">
              <div className="bg-navy p-6 text-white relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                  <div className="text-center">
                    <h3 className="text-4xl font-black tracking-tighter">BXM</h3>
                    <p className="text-[10px] font-bold uppercase mt-1 opacity-60">Bicester</p>
                  </div>
                  <Plane size={24} className="text-electric" />
                  <div className="text-center">
                    <h3 className="text-4xl font-black tracking-tighter">CBG</h3>
                    <p className="text-[10px] font-bold uppercase mt-1 opacity-60">Cambridge</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-8">
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Passenger</p>
                    <p className="text-sm font-bold text-black">John Smith</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Flight</p>
                    <p className="text-sm font-bold text-black">BR-056</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Date</p>
                    <p className="text-sm font-bold text-black">22 APR 2026</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Boarding</p>
                    <p className="text-sm font-bold text-black">14:20</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Seat</p>
                    <p className="text-sm font-bold text-black">02-B</p>
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-6">
                  <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest mb-3">Unified Itinerary</p>
                  <div className="flex items-center gap-2 text-zinc-600 text-xs font-semibold">
                    <span>Bus (13:30)</span>
                    <span className="text-zinc-300">|</span>
                    <span>Shuttle (14:05)</span>
                    <span className="text-zinc-300">|</span>
                    <span>Flight (14:30)</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-6">
                  <QRCodeSVG 
                    value="SKYPORTS-APPLE-WALLET-SIM-ROB-WILSON" 
                    size={160}
                    level="H"
                  />
                  <p className="text-[8px] font-mono text-zinc-300 tracking-[0.4em] mt-4">APPLE-WALLET-PASS-ID-0X-BXM-CBG</p>
                </div>
              </div>
            </div>
            
            <p className="text-center mt-6 text-[10px] text-zinc-400 px-8 leading-relaxed">
              Scan this pass at any Bicester Motion or Cambridge Skyport terminal. Legality and terms apply.
            </p>
          </div>

          {/* Success Overlay */}
          <AnimatePresence>
            {showWalletSuccess && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center z-[110]"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4"
                >
                  <Check size={40} />
                </motion.div>
                <p className="text-lg font-bold text-black">Added to Wallet</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  if (view === 'history') {
    return (
      <div className="min-h-screen flex flex-col max-w-md mx-auto bg-slate-50 shadow-2xl relative overflow-hidden">
        <header className="bg-navy p-6 text-white sticky top-0 z-50">
          <h1 className="text-xl font-bold">Flight History</h1>
        </header>
        <main className="flex-1 p-5 space-y-4 pb-24">
          {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                <Clock size={40} />
              </div>
              <p className="text-sm text-slate-400">No flight history yet.</p>
            </div>
          ) : (
            tickets.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-2 rounded-xl text-electric">
                    <Plane size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{t.id}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{t.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-navy">{t.start.split(' ')[0]} → {t.destination.split(' ')[0]}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase">Completed</p>
                </div>
              </div>
            ))
          )}
        </main>
        {/* Footer Nav Mockup */}
        <footer className="bg-white border-t border-slate-100 p-4 flex justify-around items-center fixed bottom-0 w-full max-w-md">
          <button onClick={() => setView('planner')} className="flex flex-col items-center gap-1 text-slate-300"><Navigation size={20} /><span className="text-[10px] font-bold">Plan</span></button>
          <button onClick={() => setView('history')} className="flex flex-col items-center gap-1 text-electric"><Clock size={20} /><span className="text-[10px] font-bold">History</span></button>
          <button onClick={() => setView('tickets')} className="flex flex-col items-center gap-1 text-slate-300"><ShieldCheck size={20} /><span className="text-[10px] font-bold">Tickets</span></button>
        </footer>
      </div>
    );
  }

  if (view === 'tickets') {
    return (
      <div className="min-h-screen flex flex-col max-w-md mx-auto bg-slate-50 shadow-2xl relative overflow-hidden">
        <header className="bg-navy p-6 text-white sticky top-0 z-50">
          <h1 className="text-xl font-bold">Active Tickets</h1>
        </header>
        <main className="flex-1 p-5 space-y-6 pb-24 relative">
          {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                <ShieldCheck size={40} />
              </div>
              <p className="text-sm text-slate-400">You have no active tickets.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((t, i) => (
                <button 
                  key={i} 
                  onClick={() => { setSelectedTicket(t); setView('boarding-pass'); }}
                  className="w-full bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-left relative overflow-hidden group active:scale-[0.98] transition-all"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-electric/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-110"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Flight</p>
                      <h3 className="text-lg font-bold text-navy">{t.id}</h3>
                    </div>
                    <div className="bg-electric/10 p-2 rounded-xl text-electric">
                      <QrCode size={20} />
                    </div>
                  </div>
                  <div className="flex justify-between items-end relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-navy">{t.start.split(' ')[0]}</span>
                        <ArrowRightLeft size={10} className="text-slate-300" />
                        <span className="text-xs font-bold text-navy">{t.destination.split(' ')[0]}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">{t.date} • {t.slot}</p>
                    </div>
                    <span className="text-[10px] font-bold text-electric uppercase border border-electric/20 px-2 py-1 rounded-full">View Pass</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Persistent Ticket in Bottom Right as requested */}
          {tickets.length > 0 && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => { setSelectedTicket(tickets[0]); setView('boarding-pass'); }}
              className="fixed bottom-24 right-[calc(50%-180px)] w-16 h-16 bg-electric text-white rounded-full shadow-xl flex items-center justify-center z-50 hover:scale-110 transition-transform"
            >
              <QrCode size={24} />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-[8px] font-bold">1</span>
              </div>
            </motion.button>
          )}
        </main>
        {/* Footer Nav Mockup */}
        <footer className="bg-white border-t border-slate-100 p-4 flex justify-around items-center fixed bottom-0 w-full max-w-md">
          <button onClick={() => setView('planner')} className="flex flex-col items-center gap-1 text-slate-300"><Navigation size={20} /><span className="text-[10px] font-bold">Plan</span></button>
          <button onClick={() => setView('history')} className="flex flex-col items-center gap-1 text-slate-300"><Clock size={20} /><span className="text-[10px] font-bold">History</span></button>
          <button onClick={() => setView('tickets')} className="flex flex-col items-center gap-1 text-electric"><ShieldCheck size={20} /><span className="text-[10px] font-bold">Tickets</span></button>
        </footer>
      </div>
    );
  }
  if (view === 'boarding-pass') {
    return (
      <div className="min-h-screen flex flex-col max-w-md mx-auto bg-navy relative overflow-hidden">
        {/* Header */}
        <header className="p-6 text-white flex items-center gap-4">
          <button 
            onClick={() => setView('planner')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Your Boarding Pass</h1>
        </header>

        <main className="flex-1 p-6 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full bg-white rounded-[2rem] overflow-hidden shadow-2xl relative"
          >
            {/* Top Section */}
            <div className="bg-electric p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Plane size={120} className="-rotate-45" />
              </div>
              <div className="relative z-10 flex justify-between items-start mb-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Passenger</p>
                  <h2 className="text-xl font-bold">Rob Wilson</h2>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Flight</p>
                  <h2 className="text-xl font-bold">{selectedTicket?.id || 'BR-042'}</h2>
                </div>
              </div>

              <div className="relative z-10 flex justify-between items-center">
                <div className="text-center">
                  <h3 className="text-4xl font-black tracking-tighter">BXM</h3>
                  <p className="text-[10px] font-bold uppercase mt-1 opacity-80">Bicester</p>
                </div>
                <div className="flex-1 flex flex-col items-center px-4">
                  <div className="w-full border-t-2 border-dashed border-white/40 relative">
                    <Plane className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-electric px-1" size={16} />
                  </div>
                  <p className="text-[10px] font-bold mt-2 uppercase tracking-widest">VX-4 eVTOL</p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-black tracking-tighter">
                    {selectedTicket?.destination?.includes('Cambridge Airport') ? 'CBG' : 'CBG'}
                  </h3>
                  <p className="text-[10px] font-bold uppercase mt-1 opacity-80">
                    {selectedTicket?.destination?.split(' ')[0] || 'Cambridge'}
                  </p>
                </div>
              </div>
            </div>

            {/* Perforation Line */}
            <div className="relative h-6 bg-white flex items-center justify-between px-[-12px]">
              <div className="w-6 h-6 rounded-full bg-navy -ml-3"></div>
              <div className="flex-1 border-t-2 border-dashed border-slate-100 mx-2"></div>
              <div className="w-6 h-6 rounded-full bg-navy -mr-3"></div>
            </div>

            {/* Bottom Section */}
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                  <p className="text-sm font-bold text-navy">{selectedTicket?.date || '18 MAR 2026'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Boarding</p>
                  <p className="text-sm font-bold text-navy">{selectedTicket?.boarding || '14:20'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skyport Gate</p>
                  <p className="text-sm font-bold text-navy">{selectedTicket?.gate || 'Pad 04-A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seat</p>
                  <p className="text-sm font-bold text-navy">{selectedTicket?.seat || '02-B'} (Window)</p>
                </div>
              </div>

              {/* Journey Validity & Itinerary */}
              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Unified Journey Validity</p>
                  </div>
                  <p className="text-[10px] text-emerald-700 leading-tight">
                    This ticket is valid for use on each constituent part of the journey listed below. Please present this QR code at each boarding point.
                  </p>
                </div>

                <div className="space-y-4 px-1">
                  {/* Leg 1: Terrestrial */}
                  {selectedTicket?.start !== 'Bicester Skyport' && (
                    <div className="flex gap-3 relative">
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-100 -mb-4"></div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 relative z-10">
                        {selectedTicket?.start?.includes('Oxford') ? <Bus size={14} /> : <Train size={14} />}
                      </div>
                      <div className="pb-4">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-navy">
                            {selectedTicket?.start?.includes('Oxford') ? 'Stagecoach S5 Bus' : 'East West Rail'}
                          </p>
                          <span className="text-[8px] font-bold text-slate-400 border border-slate-200 px-1 rounded">LEG 1</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">Boarding: <span className="font-bold text-navy">{subtractMinutes(selectedTicket?.boarding, 50)}</span> • {selectedTicket?.start}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Leg 2: Shuttle */}
                  {selectedTicket?.start !== 'Bicester Skyport' && (
                    <div className="flex gap-3 relative">
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-100 -mb-4"></div>
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 relative z-10">
                        <Zap size={14} />
                      </div>
                      <div className="pb-4">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-navy">Zero-Emission Shuttle</p>
                          <span className="text-[8px] font-bold text-emerald-400 border border-emerald-200 px-1 rounded">LEG 2</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">Boarding: <span className="font-bold text-navy">{subtractMinutes(selectedTicket?.boarding, 15)}</span> • Bicester Village</p>
                      </div>
                    </div>
                  )}

                  {/* Leg 3: eVTOL */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-electric shrink-0 relative z-10">
                      <Plane size={14} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-navy">Bristow VX-4 eVTOL</p>
                        <span className="text-[8px] font-bold text-electric border border-blue-200 px-1 rounded">LEG {selectedTicket?.start === 'Bicester Skyport' ? '1' : '3'}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Boarding: <span className="font-bold text-navy">{selectedTicket?.boarding}</span> • Bicester Motion Skyport</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                  <QRCodeSVG 
                    value={`SKYPORTS-OXCAM-CONNECT-${selectedTicket?.id || 'BR042'}-ROB-WILSON-${selectedTicket?.isDelayed ? 'DELAYED' : 'ON-TIME'}`} 
                    size={160}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <p className="text-[10px] font-mono text-slate-400 tracking-[0.3em]">BXM-CBG-2026-03-18-{selectedTicket?.id?.split('-')[1] || '042'}</p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="w-full mt-8 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-all">
                <Download size={20} />
                Save
              </button>
              <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-all">
                <Share2 size={20} />
                Share
              </button>
            </div>
            <button 
              onClick={() => setView('apple-wallet')}
              className="w-full flex items-center justify-center gap-3 bg-black hover:bg-zinc-900 text-white font-bold py-4 rounded-2xl transition-all border border-white/10"
            >
              <div className="flex -space-x-1">
                <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center p-0.5 shadow-sm">
                  <div className="w-full h-full bg-black rounded-[2px] flex items-center justify-center overflow-hidden">
                    <div className="w-full h-2 bg-white/10 absolute top-1"></div>
                  </div>
                </div>
              </div>
              Add to Apple Wallet
            </button>
          </div>

          <p className="mt-8 text-[10px] text-white/40 text-center uppercase tracking-widest font-bold">
            Scan at Bicester Motion Skyport Check-in
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-slate-50 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="bg-navy p-6 text-white sticky top-0 z-50">
        <div className="flex justify-between items-start">
          <div>
            <img 
              src="https://i.postimg.cc/TP3S4dY3/logo_png.png" 
              alt="Skyports" 
              className="h-8 mb-1"
              referrerPolicy="no-referrer"
            />
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
              OXCAM Connect
            </p>
          </div>
          <span className="bg-white/10 text-[10px] px-2 py-1 rounded-full border border-white/20 font-semibold uppercase tracking-tighter">
            Conceptual Model
          </span>
        </div>
      </header>

      <main className="flex-1 p-5 space-y-6 pb-24">
        {/* Journey Planner */}
        <section className="glass rounded-2xl p-5 space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase absolute left-10 top-2">Starting Point</label>
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 pt-6 pb-2 text-sm font-semibold focus:ring-2 focus:ring-electric appearance-none"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              >
                <option value="">Select origin...</option>
                {START_POINTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="flex justify-center -my-2 relative z-10">
              <div className="bg-white p-2 rounded-full shadow-md border border-slate-100">
                <ArrowRightLeft className="text-electric rotate-90" size={16} />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase absolute left-10 top-2">Destination</label>
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 pt-6 pb-2 text-sm font-semibold focus:ring-2 focus:ring-electric appearance-none"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              >
                <option value="">Select destination...</option>
                {DESTINATIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Simulation Widget */}
        <section className="flex items-center justify-between glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isSimulatingDelay && !isDirectSkyport ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold">Simulate Terrestrial Delay</p>
              <p className="text-[10px] text-slate-500">Test dynamic slot adjustment</p>
            </div>
          </div>
          <button 
            disabled={isDirectSkyport}
            onClick={() => setIsSimulatingDelay(!isSimulatingDelay)}
            className={`w-12 h-6 rounded-full transition-colors relative ${isSimulatingDelay && !isDirectSkyport ? 'bg-amber-500' : 'bg-slate-200'} ${isDirectSkyport ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isSimulatingDelay && !isDirectSkyport ? 'left-7' : 'left-1'}`} />
          </button>
        </section>

        {/* Itinerary */}
        <AnimatePresence>
          {showItinerary && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Smart Notification */}
              <AnimatePresence>
                {showNotification && !isDirectSkyport && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                      <AlertCircle className="text-amber-500 shrink-0" size={20} />
                      <p className="text-[11px] text-amber-900 leading-relaxed">
                        <span className="font-bold">Terrestrial delay detected.</span> Your Bristow VX-4 departure slot at Bicester Motion Skyport has been dynamically adjusted by 15 minutes to ensure a seamless connection.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Itinerary Card */}
              <div className="glass rounded-3xl overflow-hidden">
                <div className="bg-navy p-4 text-white flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider">Fastest Route</span>
                  <span className="text-lg font-bold">{isDirectSkyport ? '25 min' : '45 min'}</span>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Leg 1 */}
                  {!isDirectSkyport && (
                    <div className="itinerary-line">
                      <div className="itinerary-dot bg-slate-400"></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {start.includes('Oxford') ? <Bus size={14} className="text-slate-500" /> : <Train size={14} className="text-slate-500" />}
                            <h3 className="text-sm font-bold">
                              {start.includes('Oxford') ? 'Stagecoach S5 Bus' : 'East West Rail'}
                            </h3>
                          </div>
                          <p className="text-[11px] text-slate-500">To Bicester Village</p>
                        </div>
                        {isSimulatingDelay && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
                            +12m Delay
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Leg 2 */}
                  {!isDirectSkyport && (
                    <div className="itinerary-line">
                      <div className="itinerary-dot bg-emerald-500"></div>
                      <div className="flex items-center gap-2 mb-1">
                        <Zap size={14} className="text-emerald-500" />
                        <h3 className="text-sm font-bold">Zero-Emission Shuttle</h3>
                      </div>
                      <p className="text-[11px] text-slate-500">Bicester Village → Bicester Motion Skyport</p>
                    </div>
                  )}

                  {/* Leg 3 */}
                  <div className="itinerary-line before:hidden">
                    <div className="itinerary-dot bg-electric"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Plane size={14} className="text-electric" />
                          <h3 className="text-sm font-bold">Bristow AAM Flight</h3>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Vertical Aerospace VX-4 to {destination === 'Cambridge Airport' ? 'Cambridge Airport' : 'Cambridge'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Slot</p>
                        <p className={`text-xs font-bold ${isSimulatingDelay && !isDirectSkyport ? 'text-amber-600' : 'text-navy'}`}>
                          {isSimulatingDelay && !isDirectSkyport ? '14:45' : '14:30'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Dashboard */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Clock size={14} />
                    <span className="text-[10px] font-bold uppercase">Time Saved</span>
                  </div>
                  <p className="text-2xl font-bold text-navy">{isDirectSkyport ? '1h 20m' : '1h 00m'}</p>
                  <p className="text-[10px] text-slate-500 mt-1">vs. Traditional Drive</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-500 mb-2">
                    <Leaf size={14} />
                    <span className="text-[10px] font-bold uppercase">Emissions</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">Net Zero</p>
                  <p className="text-[10px] text-slate-500 mt-1">Operating Phase</p>
                </div>
              </div>

              {/* Comparison Section */}
              <div className="bg-slate-100 rounded-2xl p-4 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Value Proposition</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Traditional Drive</span>
                    <span className="font-bold">18.4kg CO2 • 1h 45m</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-slate-400 h-full w-full"></div>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-electric font-bold">Skyports OXCAM Connect</span>
                    <span className="text-electric font-bold">{isDirectSkyport ? '25m' : '45m'}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-electric h-full w-[24%]"></div>
                  </div>
                </div>
              </div>

              {/* Unified Ticketing */}
              <div className="pt-4">
                <button 
                  onClick={handlePurchase}
                  className="w-full bg-electric hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Purchase End-to-End Ticket
                  <ChevronRight size={18} />
                </button>
                <div className="mt-4 flex gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <ShieldCheck className="text-electric shrink-0" size={16} />
                  <p className="text-[10px] text-blue-800 leading-relaxed">
                    This demonstrates the potential of future API integration with National Rail, regional coach operators, and airline partners for a single unified transaction.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!showItinerary && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
              <Navigation size={40} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-600">Plan Your Journey</h2>
              <p className="text-xs text-slate-400 max-w-[200px] mx-auto">Select your origin and destination to see the future of transport.</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer Nav Mockup */}
      <footer className="bg-white border-t border-slate-100 p-4 flex justify-around items-center fixed bottom-0 w-full max-w-md">
        <button 
          onClick={() => setView('planner')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'planner' ? 'text-electric' : 'text-slate-300'}`}
        >
          <Navigation size={20} />
          <span className="text-[10px] font-bold">Plan</span>
        </button>
        <button 
          onClick={() => setView('history')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'history' ? 'text-electric' : 'text-slate-300'}`}
        >
          <Clock size={20} />
          <span className="text-[10px] font-bold">History</span>
        </button>
        <button 
          onClick={() => setView('tickets')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'tickets' ? 'text-electric' : 'text-slate-300'}`}
        >
          <ShieldCheck size={20} />
          <span className="text-[10px] font-bold">Tickets</span>
        </button>
      </footer>
    </div>
  );
}
