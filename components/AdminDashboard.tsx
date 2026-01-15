
import React, { useState } from 'react';
import { AppState, FAQItem, StaffContact, Event, Meal } from '../types';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ state, updateState, onLogout }) => {
  const [tab, setTab] = useState<'content' | 'data' | 'reports' | 'faq'>('content');

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = (window as any).XLSX.read(bstr, { type: 'binary' });
      
      // Parse Events
      const eventsSheet = wb.Sheets['Events'];
      const events: Event[] = (window as any).XLSX.utils.sheet_to_json(eventsSheet);
      
      // Parse Meals
      const mealsSheet = wb.Sheets['Meals'];
      const rawMeals = (window as any).XLSX.utils.sheet_to_json(mealsSheet);
      const meals: Meal[] = rawMeals.map((m: any) => ({
        ...m,
        spicy: !!m.spicy,
        seafood: !!m.seafood,
        peanut: !!m.peanut,
        wheat: !!m.wheat
      }));

      updateState({ events, meals });
      alert('Data updated successfully!');
    };
    reader.readAsBinaryString(file);
  };

  const handleUpdatePage = (key: string, content: string) => {
    updateState({
      contentPages: {
        ...state.contentPages,
        [key]: { ...state.contentPages[key], content }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <h1 className="font-black text-xl text-blue-600">Admin Panel</h1>
        <button onClick={onLogout} className="text-xs font-bold text-gray-400 border px-3 py-1 rounded-full uppercase">Logout</button>
      </header>

      <div className="flex bg-white border-b overflow-x-auto no-scrollbar">
        {['content', 'data', 'faq', 'reports'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`flex-1 py-4 px-6 text-xs font-black uppercase tracking-widest ${
              tab === t ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-6 flex-1 overflow-y-auto pb-20 no-scrollbar">
        {tab === 'content' && (
          <div className="space-y-8">
            <section className="bg-white p-6 rounded-3xl shadow-sm border space-y-4">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-2">Home Header</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Line 1 (Small)</label>
                  <input 
                    className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm" 
                    value={state.headerLine1} 
                    onChange={e => updateState({ headerLine1: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Line 2 (Large)</label>
                  <input 
                    className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm font-bold" 
                    value={state.headerLine2} 
                    onChange={e => updateState({ headerLine2: e.target.value })}
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-3xl shadow-sm border space-y-4">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-2">Urgent Notice</h3>
              <textarea 
                className="w-full p-3 bg-gray-50 border rounded-xl text-sm min-h-[100px]" 
                value={state.noticeMessage}
                onChange={e => updateState({ noticeMessage: e.target.value })}
              />
            </section>

            <section className="bg-white p-6 rounded-3xl shadow-sm border space-y-4">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-2">Gimpo Hall Address</h3>
              <input 
                className="w-full p-3 bg-gray-50 border rounded-xl text-sm" 
                value={state.hallAddress}
                onChange={e => updateState({ hallAddress: e.target.value })}
              />
            </section>
          </div>
        )}

        {tab === 'data' && (
          <div className="space-y-8">
            <section className="bg-white p-6 rounded-3xl shadow-sm border text-center">
              <div className="mb-6">
                <span className="text-5xl block mb-4">📊</span>
                <h3 className="text-lg font-bold">Import Program Data</h3>
                <p className="text-xs text-gray-500 mt-2">Upload the Excel file containing Events and Meals sheets.</p>
              </div>
              <label className="block w-full bg-blue-600 text-white py-4 rounded-2xl font-bold cursor-pointer hover:bg-blue-700 transition-colors">
                Select Excel File
                <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleExcelUpload} />
              </label>
              <button className="mt-4 text-[10px] font-bold text-blue-600 uppercase">Download Template Excel</button>
            </section>

            <section className="bg-white p-6 rounded-3xl shadow-sm border space-y-4">
              <h3 className="text-sm font-black uppercase text-gray-400">Current Term Name</h3>
              <input 
                className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold" 
                value={state.termName}
                onChange={e => updateState({ termName: e.target.value })}
              />
            </section>
          </div>
        )}

        {tab === 'faq' && (
          <div className="space-y-4">
             <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold mb-4">+ Add FAQ Category</button>
             {state.faqs.map(faq => (
               <div key={faq.id} className="bg-white p-4 rounded-2xl border flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-blue-600">{faq.category}</p>
                    <p className="text-sm font-bold">{faq.question}</p>
                  </div>
                  <button className="text-xs text-gray-300">Edit</button>
               </div>
             ))}
          </div>
        )}

        {tab === 'reports' && (
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase text-gray-400">Received Reports ({state.reports.length})</h3>
            {state.reports.length === 0 ? (
              <p className="text-center text-gray-400 py-20 italic">새로운 제보가 없습니다.</p>
            ) : (
              state.reports.map(r => (
                <div key={r.id} className="bg-white p-5 rounded-3xl border shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{r.category}</span>
                    <span className="text-[10px] text-gray-400">{r.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-sm mb-1">{r.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">{r.description}</p>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Room {r.roomNumber} · {r.name}</span>
                  </div>
                </div>
              ))
            )}
            <button className="w-full border-2 border-dashed py-4 rounded-2xl text-[10px] font-bold uppercase text-gray-400">Export All to Excel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
