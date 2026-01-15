
import React, { useState } from 'react';
import { AppState } from '../types';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onBack: () => void;
  onPageDetail: (id: string) => void;
}

const GraduationView: React.FC<Props> = ({ state, updateState, onBack, onPageDetail }) => {
  const [subView, setSubView] = useState<'main' | 'hotel'>('main');
  const [survey1Data, setSurvey1Data] = useState({ room: '', initials: '', guests: 0, count: 0, notes: '' });

  const handleSurveySubmit = () => {
    updateState({ survey1: [...state.survey1, survey1Data] });
    alert('조사가 완료되었습니다. 감사합니다.');
    setSubView('main');
  };

  if (subView === 'main') {
    return (
      <div className="min-h-screen bg-white">
        <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
          <button onClick={onBack} className="p-2 text-blue-600 font-medium">← Back</button>
          <h1 className="text-lg font-bold">Graduation</h1>
          <div className="w-10"></div>
        </header>
        <div className="p-6 space-y-4">
          {state.gradSubmenus.map(menu => (
            <button key={menu.id} onClick={() => onPageDetail(menu.id)} className="w-full bg-white border border-gray-100 p-8 rounded-[32px] text-left shadow-sm relative overflow-hidden group active:scale-[0.98] transition-all">
              <span className="text-5xl absolute -right-4 -bottom-4 opacity-10 transform -rotate-12">{menu.icon}</span>
              <p className="text-2xl font-black mb-2 leading-tight text-gray-900">{menu.title}</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{menu.title_en}</p>
            </button>
          ))}
          <button onClick={() => setSubView('hotel')} className="w-full bg-gray-900 p-8 rounded-[32px] text-white text-left shadow-xl shadow-gray-200 relative overflow-hidden group">
             <span className="text-5xl absolute -right-4 -bottom-4 opacity-20 transform -rotate-12">🏨</span>
             <p className="text-2xl font-black mb-2 leading-tight">Hotel<br/>Reservation</p>
             <p className="text-xs opacity-70 uppercase tracking-widest font-bold">Guest stay survey</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-y-auto no-scrollbar">
      <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
        <button onClick={() => setSubView('main')} className="p-2 text-blue-600 font-medium">← Back</button>
        <h1 className="text-lg font-bold">Hotel Reservation</h1>
        <div className="w-10"></div>
      </header>
      <div className="p-6">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-black mb-6">Guest Room Survey</h3>
          <div className="space-y-4">
            <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm" placeholder="Room Number" value={survey1Data.room} onChange={e => setSurvey1Data({...survey1Data, room: e.target.value})} />
            <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm" placeholder="Student Initials" value={survey1Data.initials} onChange={e => setSurvey1Data({...survey1Data, initials: e.target.value})} />
            <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm" placeholder="Number of Guests" type="number" onChange={e => setSurvey1Data({...survey1Data, guests: parseInt(e.target.value)})} />
            <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm" placeholder="Number of Rooms" type="number" onChange={e => setSurvey1Data({...survey1Data, count: parseInt(e.target.value)})} />
            <textarea className="w-full p-4 bg-gray-50 border rounded-2xl text-sm min-h-[100px]" placeholder="Special Notes" value={survey1Data.notes} onChange={e => setSurvey1Data({...survey1Data, notes: e.target.value})} />
            <button onClick={handleSurveySubmit} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black shadow-lg shadow-blue-100">Submit Survey</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraduationView;
