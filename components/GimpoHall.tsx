
import React from 'react';
import { AppState } from '../types';
import { MY_MAPS_URL } from '../constants';

interface Props {
  state: AppState;
  onBack: () => void;
}

const GimpoHall: React.FC<Props> = ({ state, onBack }) => {
  const openMaps = () => window.open(MY_MAPS_URL, '_blank');

  return (
    <div className="min-h-screen bg-white pb-20 overflow-y-auto no-scrollbar">
      <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
        <button onClick={onBack} className="p-2 text-blue-600 font-medium flex items-center">
          <span className="mr-1">←</span> Back
        </button>
        <h1 className="text-lg font-bold">김포대회회관 소개</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6 space-y-8">
        <section>
          <h2 className="text-[10px] font-black text-blue-600 tracking-widest uppercase mb-2">Address</h2>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p className="text-gray-900 font-semibold leading-relaxed">{state.hallAddress}</p>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[10px] font-black text-blue-600 tracking-widest uppercase">Hall Complex Map</h2>
            <button onClick={openMaps} className="text-[10px] font-bold text-gray-400 underline">Open Full Map</button>
          </div>
          <div className="aspect-video bg-gray-100 rounded-[32px] overflow-hidden shadow-lg border-4 border-white">
            <iframe 
              src={`${MY_MAPS_URL}&z=19`} 
              className="w-full h-full border-0"
              title="Hall Map Detailed"
              allowFullScreen
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-3 text-center">회관 내부 구조를 상세히 볼 수 있습니다 (Zoom 19)</p>
        </section>

        <section>
          <h2 className="text-[10px] font-black text-blue-600 tracking-widest uppercase mb-4">Nearby Facilities</h2>
          <div className="aspect-video bg-gray-100 rounded-[32px] overflow-hidden shadow-lg border-4 border-white">
            <iframe 
              src={`${MY_MAPS_URL}&z=16`} 
              className="w-full h-full border-0"
              title="Nearby Map"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['Bus Stop', 'ATM', 'Store'].map(tag => (
              <span key={tag} className="text-[9px] bg-blue-50 text-blue-600 py-2 rounded-xl text-center font-bold uppercase tracking-tight">{tag}</span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-black text-blue-600 tracking-widest uppercase mb-4">Area Map</h2>
          <div className="aspect-video bg-gray-100 rounded-[32px] overflow-hidden shadow-lg border-4 border-white">
            <iframe 
              src={`${MY_MAPS_URL}&z=13`} 
              className="w-full h-full border-0"
              title="Wide Area Map"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[10px] font-black text-blue-600 tracking-widest uppercase">Transportation</h2>
          <div className="bg-gray-50 p-6 rounded-[32px] space-y-6 border border-gray-100">
            <div className="flex gap-4 items-start">
              <span className="text-3xl">🚌</span>
              <div>
                <p className="text-sm font-bold">Public Bus</p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600 font-medium"><span className="text-blue-600 font-black">90번</span> → 구래역 (Gurae Stn)</p>
                  <p className="text-xs text-gray-600 font-medium"><span className="text-blue-600 font-black">88번</span> → 사우역 (Sau Stn)</p>
                </div>
                <div className="mt-3 bg-white p-3 rounded-xl border border-blue-100">
                  <p className="text-[10px] text-blue-600 font-bold leading-tight italic">"Bus card recharge: 편의점에서 ‘충전해 주세요’"</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 items-start pt-4 border-t border-gray-200/50">
              <span className="text-3xl">🚕</span>
              <div>
                <p className="text-sm font-bold">Taxi Info</p>
                <p className="text-xs text-gray-600 mt-1">Gimpo Airport: ~₩40,000</p>
                <p className="text-xs text-gray-600">Gimpo KH: ~₩20,000</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={openMaps}
            className="w-full bg-blue-600 p-6 rounded-[32px] text-white shadow-xl shadow-blue-100 active:scale-[0.98] transition-all text-center group"
          >
            <p className="text-[10px] uppercase font-black tracking-widest opacity-70 mb-1 group-active:opacity-100">Show to Driver</p>
            <p className="text-2xl font-black">여기로 가 주세요</p>
            <p className="text-[10px] mt-2 opacity-60">(Take me to this address)</p>
          </button>
        </section>
      </div>
    </div>
  );
};

export default GimpoHall;
