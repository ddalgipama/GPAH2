
import React, { useState, useEffect } from 'react';
import { AppState, AppView } from '../types';
import { EVENT_ICONS } from '../constants';

interface HomeProps {
  state: AppState;
  onNavigate: (view: AppView) => void;
}

const Home: React.FC<HomeProps> = ({ state, onNavigate }) => {
  const [dateOffset, setDateOffset] = useState(0);
  const [showNotice, setShowNotice] = useState(false);
  const [hasNewNotice, setHasNewNotice] = useState(false);

  useEffect(() => {
    // Check if the user has seen the current notice
    const lastSeenId = localStorage.getItem('gimpo_last_seen_notice_id');
    if (state.noticeId && lastSeenId !== state.noticeId) {
      setHasNewNotice(true);
    } else {
      setHasNewNotice(false);
    }
  }, [state.noticeId]);

  const handleOpenNotice = () => {
    setShowNotice(true);
    // Once opened, mark as seen
    if (state.noticeId) {
      localStorage.setItem('gimpo_last_seen_notice_id', state.noticeId);
      setHasNewNotice(false);
    }
  };

  const getDisplayDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + dateOffset);
    return d;
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const displayDate = getDisplayDate();
  const dateStr = formatDate(displayDate);

  const todayEvents = state.events.filter(e => e.date === dateStr);
  const todayMeals = state.meals.filter(m => m.date === dateStr);

  const lunch = todayMeals.filter(m => m.meal === 'LUNCH').sort((a, b) => a.order - b.order);
  const dinner = todayMeals.filter(m => m.meal === 'DINNER').sort((a, b) => a.order - b.order);

  const menuItems = [
    { id: 'gimpo-hall', title_ko: '김포대회회관', title_en: 'GIMPO ASSEMBLY HALL', icon: '🏫' },
    { id: 'dorm-services', title_ko: '서비스', title_en: 'SERVICE', icon: '🏠' },
    { id: 'meal-plan', title_ko: '식단 안내', title_en: 'MEAL PLAN', icon: '🍱' },
    { id: 'calendar', title_ko: '일정표', title_en: 'CALENDAR', icon: '📅' },
    { id: 'graduation', title_ko: '졸업식 안내', title_en: 'GRADUATION', icon: '🎓' },
    { id: 'faq', title_ko: '자주 묻는 질문', title_en: 'FAQ', icon: '❓' },
    { id: 'contact-us', title_ko: '문의하기', title_en: 'CONTACT US', icon: '📞' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FB] h-full overflow-hidden">
      <style>{`
        @keyframes noticePulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .notice-badge {
          animation: noticePulse 2s infinite;
        }
      `}</style>

      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 flex justify-between items-end rounded-b-[40px] shadow-sm">
        <div>
          <p className="text-blue-600 text-[10px] font-black tracking-[0.2em] uppercase mb-1">{state.headerLine1}</p>
          <h1 className="text-3xl font-black text-gray-900 leading-tight">{state.headerLine2}</h1>
        </div>
        <div className="flex gap-3 pb-1">
          <button 
            onClick={handleOpenNotice} 
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 tap-active relative"
          >
            <span className="text-xl">📣</span>
            {hasNewNotice && (
              <span className="notice-badge absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-[10px] font-black text-white">N</span>
              </span>
            )}
          </button>
          <button 
            onClick={() => onNavigate('admin-login')} 
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 tap-active border border-gray-100 relative"
          >
            <span className="text-xl">🔐</span>
            {state.hasNewReport && (
              <span className="notice-badge absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-[10px] font-black text-white">N</span>
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar pb-32">
        
        {/* Combined Schedule & Date Selector Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Today's Schedule</h2>
              <span className="text-sm font-black text-gray-900">
                {displayDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
              </span>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => setDateOffset(prev => prev - 1)} 
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-900 tap-active"
              >
                <span className="text-sm">◀</span>
              </button>
              <button 
                onClick={() => setDateOffset(prev => prev + 1)} 
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-900 tap-active"
              >
                <span className="text-sm">▶</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {todayEvents.length > 0 ? (
              todayEvents.map((ev, i) => (
                <div key={i} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-2xl transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl shadow-inner">{EVENT_ICONS[ev.type] || '📅'}</div>
                  <div>
                    <p className="text-[13px] font-black text-gray-900">{ev.title_ko}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{ev.time} · {ev.location}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
                <p className="text-[11px] text-gray-400 font-bold italic">No events for this date.</p>
              </div>
            )}
          </div>
        </div>

        {/* Meals card */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Daily Meals</h2>
            <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Menu</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1">LUNCH ☀️</h3>
              <div className="space-y-1">
                {lunch.length > 0 ? lunch.map((m, i) => (
                  <p key={i} className="text-[13px] font-bold text-gray-700 flex items-center gap-1 leading-tight">
                    {m.menu_ko} <span className="text-[10px] opacity-70">{m.spicy && '🌶'}{m.seafood && '🐟'}</span>
                  </p>
                )) : <p className="text-[11px] text-gray-300">N/A</p>}
              </div>
            </div>
            <div className="space-y-3 border-l pl-4">
              <h3 className="text-[10px] font-black text-orange-600 uppercase flex items-center gap-1">DINNER 🌙</h3>
              <div className="space-y-1">
                {dinner.length > 0 ? dinner.map((m, i) => (
                  <p key={i} className="text-[13px] font-bold text-gray-700 flex items-center gap-1 leading-tight">
                    {m.menu_ko} <span className="text-[10px] opacity-70">{m.spicy && '🌶'}{m.seafood && '🐟'}</span>
                  </p>
                )) : <p className="text-[11px] text-gray-300">N/A</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {menuItems.filter(i => i.id !== 'contact-us').map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as AppView)}
              className="bg-white rounded-[28px] p-5 flex flex-col items-start gap-4 shadow-sm border border-gray-50 tap-active"
            >
              <span className="text-3xl bg-gray-50 w-12 h-12 flex items-center justify-center rounded-2xl">{item.icon}</span>
              <div className="text-left">
                <p className="text-[13px] font-black text-gray-900 leading-tight">{item.title_ko}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.title_en}</p>
              </div>
            </button>
          ))}
          <button
            onClick={() => onNavigate('contact-us')}
            className="col-span-2 bg-gray-900 text-white rounded-[28px] p-6 flex items-center justify-between shadow-xl shadow-gray-200 tap-active mt-2"
          >
            <div className="flex items-center gap-5">
              <span className="text-3xl">📞</span>
              <div className="text-left">
                <p className="text-base font-black leading-tight">문의하기</p>
                <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Contact Support</p>
              </div>
            </div>
            <span className="text-xl opacity-40">→</span>
          </button>
        </div>
      </div>

      {/* Notice Popup */}
      {showNotice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-end p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 pb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <span className="w-10 h-10 bg-blue-50 flex items-center justify-center rounded-xl text-xl">📣</span> Notice
              </h3>
              <button onClick={() => setShowNotice(false)} className="text-2xl text-gray-300 p-2">✕</button>
            </div>
            <div className="bg-gray-50 p-6 rounded-3xl mb-8">
              <p className="text-gray-700 leading-relaxed font-medium text-sm whitespace-pre-wrap">{state.noticeMessage || "현재 새로운 공지사항이 없습니다."}</p>
            </div>
            <button
              onClick={() => setShowNotice(false)}
              className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black shadow-xl shadow-blue-100 tap-active"
            >
              확인하였습니다
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
