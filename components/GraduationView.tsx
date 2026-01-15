
import React, { useState } from 'react';
import { AppState } from '../types';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onBack: () => void;
}

const GraduationView: React.FC<Props> = ({ state, updateState, onBack }) => {
  const [subView, setSubView] = useState<'main' | 'invite' | 'hotel' | 'shuttle'>('main');
  const [surveyStep, setSurveyStep] = useState<1 | 2>(1);
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
          <button onClick={() => setSubView('invite')} className="w-full bg-blue-600 p-8 rounded-[32px] text-white text-left shadow-xl shadow-blue-100 relative overflow-hidden group">
            <span className="text-5xl absolute -right-4 -bottom-4 opacity-20 transform -rotate-12 group-active:rotate-0 transition-all">✉️</span>
            <p className="text-2xl font-black mb-2 leading-tight">Graduation<br/>Invitation</p>
            <p className="text-xs opacity-70 uppercase tracking-widest font-bold">View program & invite</p>
          </button>
          <button onClick={() => setSubView('hotel')} className="w-full bg-gray-900 p-8 rounded-[32px] text-white text-left shadow-xl shadow-gray-200 relative overflow-hidden group">
             <span className="text-5xl absolute -right-4 -bottom-4 opacity-20 transform -rotate-12 group-active:rotate-0 transition-all">🏨</span>
             <p className="text-2xl font-black mb-2 leading-tight">Hotel<br/>Reservation</p>
             <p className="text-xs opacity-70 uppercase tracking-widest font-bold">Guest stay & survey</p>
          </button>
          <button onClick={() => setSubView('shuttle')} className="w-full bg-orange-50 p-8 rounded-[32px] text-orange-600 text-left border border-orange-100 relative overflow-hidden group">
             <span className="text-5xl absolute -right-4 -bottom-4 opacity-20 transform -rotate-12 group-active:rotate-0 transition-all">🚌</span>
             <p className="text-2xl font-black mb-2 leading-tight">Shuttle Bus<br/>Info</p>
             <p className="text-xs opacity-70 uppercase tracking-widest font-bold">Routes & schedules</p>
          </button>
        </div>
      </div>
    );
  }

  if (subView === 'hotel') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 overflow-y-auto no-scrollbar">
        <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
          <button onClick={() => setSubView('main')} className="p-2 text-blue-600 font-medium">← Back</button>
          <h1 className="text-lg font-bold">Hotel Reservation</h1>
          <div className="w-10"></div>
        </header>
        <div className="p-6">
          <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm">
            <button 
              onClick={() => setSurveyStep(1)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${surveyStep === 1 ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
            >
              1차 사전 조사
            </button>
            <button 
              onClick={() => setSurveyStep(2)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${surveyStep === 2 ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
            >
              2차 확정 예약
            </button>
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            {surveyStep === 1 ? (
              <div className="space-y-6">
                <h3 className="text-xl font-black">Guest Room Survey</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">졸업식 참석 가족/지인을 위한 호텔 사전 조사입니다.</p>
                <div className="space-y-4">
                  <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm" placeholder="Room Number" value={survey1Data.room} onChange={e => setSurvey1Data({...survey1Data, room: e.target.value})} />
                  <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm" placeholder="Student Initials" value={survey1Data.initials} onChange={e => setSurvey1Data({...survey1Data, initials: e.target.value})} />
                  <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm" placeholder="Number of Guests" type="number" onChange={e => setSurvey1Data({...survey1Data, guests: parseInt(e.target.value)})} />
                  <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm" placeholder="Number of Rooms" type="number" onChange={e => setSurvey1Data({...survey1Data, count: parseInt(e.target.value)})} />
                  <textarea className="w-full p-4 bg-gray-50 border rounded-2xl text-sm min-h-[100px]" placeholder="Special Notes" value={survey1Data.notes} onChange={e => setSurvey1Data({...survey1Data, notes: e.target.value})} />
                </div>
                <button onClick={handleSurveySubmit} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black shadow-lg shadow-blue-100 mt-4">Submit Survey</button>
              </div>
            ) : (
              <div className="text-center py-10 space-y-4">
                <span className="text-6xl">🔒</span>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">2차 예약 기간이 아닙니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
        <button onClick={() => setSubView('main')} className="p-2 text-blue-600 font-medium">← Back</button>
        <h1 className="text-lg font-bold">{subView === 'invite' ? 'Invitation' : 'Shuttle Bus'}</h1>
        <div className="w-10"></div>
      </header>
      <div className="p-6 prose">
        <div dangerouslySetInnerHTML={{ __html: state.contentPages[subView === 'invite' ? 'graduation-invite' : 'shuttle-bus']?.content }} />
      </div>
    </div>
  );
};

export default GraduationView;
