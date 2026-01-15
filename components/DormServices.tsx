
import React from 'react';
import { AppState } from '../types';

interface Props {
  state: AppState;
  onBack: () => void;
  onDetail: (id: string) => void;
}

const DormServices: React.FC<Props> = ({ state, onBack, onDetail }) => {
  const services = state.serviceMenus || [];

  return (
    <div className="min-h-screen bg-white">
      <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
        <button onClick={onBack} className="p-2 text-blue-600 font-medium">← Back</button>
        <h1 className="text-lg font-bold">Dormitory Services</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6 overflow-y-auto no-scrollbar pb-20">
        <div className="grid grid-cols-2 gap-4">
          {services.map(s => (
            <button
              key={s.id}
              onClick={() => onDetail(s.id)}
              className="bg-gray-50 rounded-3xl p-6 flex flex-col items-center text-center gap-3 border border-transparent active:border-blue-200 active:bg-blue-50 transition-all shadow-sm"
            >
              <span className="text-4xl mb-2">{s.icon}</span>
              <p className="text-sm font-black leading-tight">{s.title}</p>
              <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">{s.desc}</p>
            </button>
          ))}
          
          {services.length === 0 && (
            <div className="col-span-2 py-20 text-center">
              <p className="text-gray-400 text-sm italic">등록된 서비스가 없습니다.</p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-100">
          <h3 className="text-lg font-black mb-2">쾌적한 숙소를 위해</h3>
          <p className="text-sm opacity-80 leading-relaxed">모든 서비스는 사전에 공지된 시간과 절차를 준수해 주시기 바랍니다. 문의사항은 'Contact Us'를 이용해 주세요.</p>
        </div>
      </div>
    </div>
  );
};

export default DormServices;
