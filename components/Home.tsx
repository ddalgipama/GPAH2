
import React, { useState } from 'react';
import { AppState, AppView } from '../types';
import { EVENT_ICONS } from '../constants';

interface HomeProps {
  state: AppState;
  onNavigate: (view: AppView) => void;
}

const Home: React.FC<HomeProps> = ({ state, onNavigate }) => {
  const [dateOffset, setDateOffset] = useState(0);
  const [showNotice, setShowNotice] = useState(false);

  const getDisplayDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + dateOffset);
    return d;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const displayDate = getDisplayDate();
  const dateStr = formatDate(displayDate);

  const todayEvents = state.events.filter(e => e.date === dateStr);
  const todayMeals = state.meals.filter(m => m.date === dateStr);

  const lunch = todayMeals.filter(m => m.meal === 'LUNCH').sort((a, b) => a.order - b.order);
  const dinner = todayMeals.filter(m => m.meal === 'DINNER').sort((a, b) => a.order - b.order);

  const menuItems = [
    { id: 'gimpo-hall', title_ko: '김포대회회관 소개', title_en: 'GIMPO ASSEMBLY HALL', icon: '🏛️' },
    { id: 'dorm-services', title_ko: '숙소 관리 & 서비스', title_en: 'Dorm Services', icon: '🏠' },
    { id: 'meal-plan', title_ko: '식단 안내', title_en: 'Meal Plan', icon: '🍱' },
    { id: 'calendar', title_ko: '일정표', title_en: 'Calendar', icon: '📅' },
    { id: 'graduation', title_ko: '졸업식 안내', title_en: 'Graduation', icon: '🎓' },
    { id: 'faq', title_ko: '자주 묻는 질문', title_en: 'FAQ', icon: '❓' },
    { id: 'contact-us', title_ko: '문의하기', title_en: 'Contact Us', icon: '📞' },
  ];

  const gridItems = menuItems.filter(item => item.id !== 'contact-us');
  const fullWidthItem = menuItems.find(item => item.id === 'contact-us');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-6 pt-10 pb-6 flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-xs font-semibold tracking-widest">{state.headerLine1}</p>
          <h1 className="text-3xl font-black text-gray-900 leading-tight">{state.headerLine2}</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowNotice(true)} className="p-2 rounded-full bg-blue-50 text-blue-600 active:bg-blue-100 transition-colors">
            📣
          </button>
          <button onClick={() => onNavigate('admin-login')} className="p-2 rounded-full bg-gray-100 active:bg-gray-200 transition-colors">
            🔐
          </button>
        </div>
      </div>

      {/* Today info */}
      <div className="px-6 space-y-4 overflow-y-auto pb-10 no-scrollbar">
        <div className="flex items-center justify-between text-sm font-medium text-gray-500">
          <span>Today · {displayDate.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
          <div className="flex gap-4">
            <button onClick={() => setDateOffset(prev => prev - 1)} className="text-lg">◀</button>
            <button onClick={() => setDateOffset(prev => prev + 1)} className="text-lg">▶</button>
          </div>
        </div>

        {/* Schedule card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 mb-3">오늘의 스케줄 (Today’s Schedule)</h2>
          {todayEvents.length > 0 ? (
            <div className="space-y-3">
              {todayEvents.map((ev, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xl">{EVENT_ICONS[ev.type] || '📅'}</span>
                  <div>
                    <p className="text-sm font-bold">{ev.title_ko}</p>
                    <p className="text-xs text-gray-400">{ev.time} · {ev.location}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">오늘 일정이 없습니다.</p>
          )}
        </div>

        {/* Meals card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center justify-between">
            오늘의 식사 (Meals)
            <span className="text-[10px] text-gray-400 font-normal">🌶 spicy 🐟 seafood 🥜 peanut 🌾 wheat</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-blue-600 flex items-center gap-1">LUNCH 🍽</h3>
              {lunch.length > 0 ? lunch.map((m, i) => (
                <div key={i} className="text-xs text-gray-600 flex flex-wrap gap-1 items-center">
                  {m.menu_ko}
                  <span className="inline-flex gap-0.5">
                    {m.spicy && '🌶'}
                    {m.seafood && '🐟'}
                    {m.peanut && '🥜'}
                    {m.wheat && '🌾'}
                  </span>
                </div>
              )) : <p className="text-[10px] text-gray-400">정보 없음</p>}
            </div>
            <div className="space-y-2 border-l pl-4">
              <h3 className="text-xs font-bold text-orange-600 flex items-center gap-1">DINNER 🌙</h3>
              {dinner.length > 0 ? dinner.map((m, i) => (
                <div key={i} className="text-xs text-gray-600 flex flex-wrap gap-1 items-center">
                  {m.menu_ko}
                  <span className="inline-flex gap-0.5">
                    {m.spicy && '🌶'}
                    {m.seafood && '🐟'}
                    {m.peanut && '🥜'}
                    {m.wheat && '🌾'}
                  </span>
                </div>
              )) : <p className="text-[10px] text-gray-400">정보 없음</p>}
            </div>
          </div>
        </div>

        {/* Main Grid Menu */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          {gridItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as AppView)}
              className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col items-start gap-3 shadow-sm active:scale-95 transition-all text-left"
            >
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-800 leading-tight">{item.title_ko}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{item.title_en}</p>
              </div>
            </button>
          ))}
          
          {fullWidthItem && (
            <button
              key={fullWidthItem.id}
              onClick={() => onNavigate(fullWidthItem.id as AppView)}
              className="col-span-2 bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-5 shadow-sm active:scale-95 transition-all text-left"
            >
              <span className="text-3xl">{fullWidthItem.icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-800 leading-tight">{fullWidthItem.title_ko}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{fullWidthItem.title_en}</p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Notice Popup */}
      {showNotice && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <span className="text-blue-600">📣</span> Urgent Notice
              </h3>
              <button onClick={() => setShowNotice(false)} className="text-2xl text-gray-300">✕</button>
            </div>
            <p className="text-gray-600 leading-relaxed mb-8">{state.noticeMessage || "현재 공지사항이 없습니다."}</p>
            <button
              onClick={() => setShowNotice(false)}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:bg-blue-700 transition-colors"
            >
              확인 (OK)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
