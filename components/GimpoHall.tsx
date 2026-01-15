
import React from 'react';
import { AppState } from '../types';

interface Props {
  state: AppState;
  onBack: () => void;
}

const GimpoHall: React.FC<Props> = ({ state, onBack }) => {
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
          <h2 className="text-[10px] font-black text-blue-600 tracking-widest uppercase mb-4">Hall Complex Map</h2>
          <div className="aspect-video bg-gray-100 rounded-[32px] overflow-hidden shadow-lg border-4 border-white">
            <iframe src={state.complexMapUrl} className="w-full h-full border-0" title="Hall Map" />
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-black text-blue-600 tracking-widest uppercase mb-4">Nearby Facilities</h2>
          <div className="aspect-video bg-gray-100 rounded-[32px] overflow-hidden shadow-lg border-4 border-white">
            <iframe src={state.nearbyMapUrl} className="w-full h-full border-0" title="Nearby Map" />
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-black text-blue-600 tracking-widest uppercase mb-4">Area Map</h2>
          <div className="aspect-video bg-gray-100 rounded-[32px] overflow-hidden shadow-lg border-4 border-white">
            <iframe src={state.areaMapUrl} className="w-full h-full border-0" title="Wide Area Map" />
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-black text-blue-600 tracking-widest uppercase mb-4">Transportation</h2>
          <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">{state.transportationInfo}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GimpoHall;
