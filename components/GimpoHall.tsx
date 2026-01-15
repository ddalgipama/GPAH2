
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
        <button onClick={onBack} className="p-2 text-blue-600 font-medium">← Back</button>
        <h1 className="text-lg font-bold">김포대회회관 소개</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6 space-y-8">
        <section>
          <h2 className="text-xs font-black text-blue-600 tracking-widest uppercase mb-2">Address</h2>
          <p className="text-gray-900 font-medium leading-relaxed">{state.hallAddress}</p>
        </section>

        <section>
          <h2 className="text-xs font-black text-blue-600 tracking-widest uppercase mb-4">Hall Complex Map</h2>
          <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-inner cursor-pointer" onClick={openMaps}>
            <iframe 
              src={`${MY_MAPS_URL}&z=18`} 
              className="w-full h-full pointer-events-none"
              title="Hall Map"
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-2">탭하여 구글 지도로 열기</p>
        </section>

        <section>
          <h2 className="text-xs font-black text-blue-600 tracking-widest uppercase mb-4">Nearby Facilities</h2>
          <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-inner cursor-pointer" onClick={openMaps}>
            <iframe 
              src={`${MY_MAPS_URL}&z=16`} 
              className="w-full h-full pointer-events-none"
              title="Nearby Map"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['Bus Stop', 'ATM', 'Store'].map(tag => (
              <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 py-2 rounded-full text-center font-bold">{tag}</span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black text-blue-600 tracking-widest uppercase mb-4">Area Map</h2>
          <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-inner cursor-pointer" onClick={openMaps}>
            <iframe 
              src={`${MY_MAPS_URL}&z=12`} 
              className="w-full h-full pointer-events-none"
              title="Wide Area Map"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-black text-blue-600 tracking-widest uppercase">Transportation</h2>
          <div className="bg-gray-50 p-5 rounded-2xl space-y-6">
            <div className="flex gap-4 items-start">
              <span className="text-2xl">🚌</span>
              <div>
                <p className="text-sm font-bold">Bus</p>
                <p className="text-xs text-gray-600 mt-1">90번 → 구래역 (약 40분)</p>
                <p className="text-xs text-gray-600">88번 → 사우역/왕국회관 (약 50분)</p>
                <p className="text-[10px] text-blue-500 font-bold mt-2">Bus card recharge: "편의점에서 ‘충전해 주세요.’"</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-2xl">🚕</span>
              <div>
                <p className="text-sm font-bold">Taxi</p>
                <p className="text-xs text-gray-600 mt-1">김포공항 약 40,000원</p>
                <p className="text-xs text-gray-600">김포 왕국회관 ±20,000원</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-xl shadow-blue-100 text-center">
            <p className="text-xs opacity-80 mb-1">Take me here</p>
            <p className="text-2xl font-black">여기로 가 주세요</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GimpoHall;
