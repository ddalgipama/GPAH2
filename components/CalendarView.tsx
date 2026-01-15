
import React, { useState } from 'react';
import { AppState } from '../types';
import { EVENT_ICONS } from '../constants';

interface Props {
  state: AppState;
  onBack: () => void;
}

const CalendarView: React.FC<Props> = ({ state, onBack }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), i + 1);
    return d.toISOString().split('T')[0];
  });

  const dailyEvents = state.events.filter(e => e.date === selectedDate);

  return (
    <div className="min-h-screen bg-white">
      <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
        <button onClick={onBack} className="p-2 text-blue-600 font-medium">← Back</button>
        <h1 className="text-lg font-bold">Calendar</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6">
        <div className="mb-8">
          <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">Current Program</p>
          <h2 className="text-2xl font-black text-gray-900 leading-tight">{state.termName}</h2>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-8">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-[10px] font-bold text-gray-300 text-center py-2">{day}</div>
          ))}
          {/* Calendar visual simplified for demo */}
          {currentMonthDays.map(date => {
            const hasEvent = state.events.some(e => e.date === date);
            const isSelected = date === selectedDate;
            const d = new Date(date);
            return (
              <button 
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`aspect-square rounded-full flex flex-col items-center justify-center relative transition-all ${
                  isSelected ? 'bg-blue-600 text-white font-bold' : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-xs">{d.getDate()}</span>
                {hasEvent && <span className={`w-1 h-1 rounded-full absolute bottom-1.5 ${isSelected ? 'bg-white' : 'bg-blue-600'}`}></span>}
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-blue-600 tracking-widest">Events for {selectedDate}</h3>
          {dailyEvents.length > 0 ? (
            dailyEvents.map((ev, i) => (
              <div key={i} className="bg-gray-50 p-5 rounded-3xl border border-gray-100 flex gap-4 items-start shadow-sm">
                <span className="text-3xl bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner">
                  {EVENT_ICONS[ev.type] || '📅'}
                </span>
                <div>
                  <p className="font-bold text-gray-900">{ev.title_ko}</p>
                  <p className="text-xs text-blue-600 font-bold mt-0.5">{ev.title_en}</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">{ev.time} · {ev.location}</p>
                  {ev.description_ko && <p className="text-xs text-gray-500 mt-3 leading-relaxed bg-white/50 p-2 rounded-xl">{ev.description_ko}</p>}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic py-10 text-center border-2 border-dashed rounded-3xl">일정이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
