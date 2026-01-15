
import React, { useState } from 'react';
import { AppState, SurveyEntry } from '../types';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onBack: () => void;
  onPageDetail: (id: string) => void;
}

const GraduationView: React.FC<Props> = ({ state, updateState, onBack, onPageDetail }) => {
  const [subView, setSubView] = useState<'main' | 'hotel-selection' | 'survey1' | 'survey2'>('main');
  const [surveyData, setSurveyData] = useState({ room: '', initials: '', guests: 0, doubleRooms: 0, twinRooms: 0, notes: '' });

  const handleSurveySubmit = (type: 'survey1' | 'survey2') => {
    const entry: SurveyEntry = {
      ...surveyData,
      timestamp: new Date().toLocaleString()
    };
    
    if (type === 'survey1') {
      updateState({ survey1: [...state.survey1, entry] });
    } else {
      updateState({ survey2: [...state.survey2, entry] });
    }
    
    alert('조사가 완료되었습니다. 감사합니다.');
    setSubView('main');
    setSurveyData({ room: '', initials: '', guests: 0, doubleRooms: 0, twinRooms: 0, notes: '' });
  };

  const SurveyForm = ({ title, type }: { title: string, type: 'survey1' | 'survey2' }) => (
    <div className="p-6">
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
        <h3 className="text-xl font-black mb-1">{title}</h3>
        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-2">Guest Room Survey</p>
        
        {type === 'survey2' && (
          <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-[11px] text-red-600 font-black leading-relaxed">
              ⚠️ 2차 확정조사 이후 변경 및 취소는 불가합니다. 신중하게 작성해주시길 부탁드립니다.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-[9px] font-black text-gray-400 uppercase mb-1 block ml-1">Room Number</label>
            <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold" placeholder="e.g. 101" value={surveyData.room} onChange={e => setSurveyData({...surveyData, room: e.target.value})} />
          </div>
          <div>
            <label className="text-[9px] font-black text-gray-400 uppercase mb-1 block ml-1">
              Student Initials <span className="text-red-500 font-bold lowercase">(Please Do NOT write your full name)</span>
            </label>
            <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold" placeholder="e.g. J.D." value={surveyData.initials} onChange={e => setSurveyData({...surveyData, initials: e.target.value})} />
          </div>
          <div>
            <label className="text-[9px] font-black text-gray-400 uppercase mb-1 block ml-1">Number of Guests</label>
            <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold" type="number" value={surveyData.guests || ''} onChange={e => setSurveyData({...surveyData, guests: parseInt(e.target.value) || 0})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase mb-1 block ml-1">Double rooms</label>
              <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold" type="number" value={surveyData.doubleRooms || ''} onChange={e => setSurveyData({...surveyData, doubleRooms: parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase mb-1 block ml-1">Twin rooms</label>
              <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold" type="number" value={surveyData.twinRooms || ''} onChange={e => setSurveyData({...surveyData, twinRooms: parseInt(e.target.value) || 0})} />
            </div>
          </div>
          <div>
            <label className="text-[9px] font-black text-gray-400 uppercase mb-1 block ml-1">Special Notes</label>
            <textarea className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm min-h-[100px] font-medium" placeholder="Check-in time, extra bed request, etc." value={surveyData.notes} onChange={e => setSurveyData({...surveyData, notes: e.target.value})} />
          </div>
          <button 
            onClick={() => handleSurveySubmit(type)} 
            className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-blue-100 tap-active mt-4"
          >
            Submit Survey
          </button>
        </div>
      </div>
    </div>
  );

  if (subView === 'main') {
    return (
      <div className="min-h-screen bg-white">
        <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
          <button onClick={onBack} className="p-2 text-blue-600 font-medium flex items-center bg-blue-50 px-3 rounded-xl tap-active">
            <span className="mr-1">←</span> Back
          </button>
          <h1 className="text-lg font-bold">Graduation</h1>
          <div className="w-10"></div>
        </header>
        <div className="p-6 space-y-4">
          {state.noGraduationThisTerm ? (
            <div className="animate-in zoom-in duration-500 bg-gray-50 p-10 rounded-[40px] border-2 border-dashed border-gray-200 text-center">
               <span className="text-6xl mb-6 block opacity-20">🎓</span>
               <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">안내 (Information)</h3>
               <p className="text-sm font-bold text-gray-500 leading-relaxed whitespace-pre-wrap">
                 {state.noGraduationMessage || "이번 기수는 졸업식이 없습니다."}
               </p>
            </div>
          ) : (
            <>
              {state.gradSubmenus.map(menu => (
                <button key={menu.id} onClick={() => onPageDetail(menu.id)} className="w-full bg-white border border-gray-100 p-8 rounded-[32px] text-left shadow-sm relative overflow-hidden group active:scale-[0.98] transition-all">
                  <span className="text-5xl absolute -right-4 -bottom-4 opacity-10 transform -rotate-12">{menu.icon}</span>
                  <p className="text-2xl font-black mb-2 leading-tight text-gray-900">{menu.title}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{menu.title_en}</p>
                </button>
              ))}
              <button onClick={() => setSubView('hotel-selection')} className="w-full bg-gray-900 p-8 rounded-[32px] text-white text-left shadow-xl shadow-gray-200 relative overflow-hidden group tap-active">
                 <span className="text-5xl absolute -right-4 -bottom-4 opacity-20 transform -rotate-12">🏨</span>
                 <p className="text-2xl font-black mb-2 leading-tight">Hotel<br/>Reservation</p>
                 <p className="text-xs opacity-70 uppercase tracking-widest font-bold">Guest stay survey</p>
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (subView === 'hotel-selection') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 overflow-y-auto no-scrollbar">
        <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
          <button onClick={() => setSubView('main')} className="p-2 text-blue-600 font-medium flex items-center bg-blue-50 px-3 rounded-xl tap-active">
            <span className="mr-1">←</span> Back
          </button>
          <h1 className="text-lg font-bold">Hotel Reservation</h1>
          <div className="w-10"></div>
        </header>
        <div className="p-6 space-y-4">
          <button 
            onClick={() => setSubView('survey1')} 
            className="w-full bg-white p-8 rounded-[32px] text-left shadow-sm border border-gray-100 tap-active"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-2xl font-black text-gray-900">1차 사전조사</p>
              <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Open</span>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Preliminary Survey</p>
          </button>

          <button 
            onClick={() => state.isSurvey2Open ? setSubView('survey2') : null} 
            className={`w-full p-8 rounded-[32px] text-left shadow-sm border ${
              state.isSurvey2Open ? 'bg-white border-gray-100 tap-active' : 'bg-gray-100 border-gray-200 opacity-60'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-2xl font-black text-gray-900">2차 확정조사</p>
              <span className={`${state.isSurvey2Open ? 'bg-blue-50 text-blue-600' : 'bg-gray-200 text-gray-400'} text-[10px] font-black px-3 py-1 rounded-full uppercase`}>
                {state.isSurvey2Open ? 'Open' : 'Locked'}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Final Confirmation Survey</p>
            
            {state.isSurvey2Open && (
              <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
                <p className="text-[10px] text-red-600 font-black leading-tight">
                  ⚠️ 2차 확정조사 이후 변경 및 취소는 불가합니다. 신중하게 작성해주시길 부탁드립니다.
                </p>
              </div>
            )}

            {!state.isSurvey2Open && (
              <p className="text-[10px] text-gray-400 mt-4 font-bold italic">* 추후 확정 기간에 활성화됩니다.</p>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-y-auto no-scrollbar">
      <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
        <button onClick={() => setSubView('hotel-selection')} className="p-2 text-blue-600 font-medium flex items-center bg-blue-50 px-3 rounded-xl tap-active">
          <span className="mr-1">←</span> Back
        </button>
        <h1 className="text-lg font-bold">{subView === 'survey1' ? '1차 사전조사' : '2차 확정조사'}</h1>
        <div className="w-10"></div>
      </header>
      <SurveyForm 
        title={subView === 'survey1' ? '1차 사전조사' : '2차 확정조사'} 
        type={subView === 'survey1' ? 'survey1' : 'survey2'} 
      />
    </div>
  );
};

export default GraduationView;
