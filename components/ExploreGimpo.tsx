
import React from 'react';
import { AppState } from '../types';
import { MY_MAPS_URL } from '../constants';

interface Props {
  state: AppState;
  onBack: () => void;
}

const ExploreGimpo: React.FC<Props> = ({ state, onBack }) => {
  const attractions = [
    { name: '강화도 (Ganghwa-do)', desc: '역사적인 유적지와 탁 트인 바다 전망을 즐길 수 있는 섬입니다.', img: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&q=80&w=400' },
    { name: '애기봉 (Aegibong)', desc: '북한을 가깝게 볼 수 있는 평화 생태 공원입니다.', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=400' },
    { name: '라베니체 (Laveniche)', desc: '이탈리아 베네치아를 모티브로 한 수변 상업지구입니다.', img: 'https://images.unsplash.com/photo-1516483642781-91486f77971d?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="min-h-screen bg-white pb-20 overflow-y-auto no-scrollbar">
      <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
        <button onClick={onBack} className="p-2 text-blue-600 font-medium flex items-center">
          <span className="mr-1">←</span> Back
        </button>
        <h1 className="text-lg font-bold">Explore Gimpo</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6 space-y-12">
        <section>
          <div className="bg-blue-600 rounded-[40px] p-8 text-white shadow-xl shadow-blue-100">
            <h2 className="text-3xl font-black mb-4 leading-tight">김포 이야기<br/>Explore Gimpo</h2>
            <p className="text-sm opacity-90 leading-relaxed font-medium">{state.gimpoIntro}</p>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xl font-black">Nearby Attractions</h3>
            <button onClick={() => window.open(MY_MAPS_URL, '_blank')} className="text-xs font-bold text-blue-600 underline">View Full List</button>
          </div>
          <div className="space-y-6">
            {attractions.map((a, i) => (
              <div key={i} className="group relative rounded-[32px] overflow-hidden shadow-lg shadow-gray-200 active:scale-[0.98] transition-all">
                <img src={a.img} alt={a.name} className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
                  <h4 className="text-xl font-bold text-white mb-2">{a.name}</h4>
                  <p className="text-[10px] text-gray-300 leading-relaxed uppercase font-black tracking-widest">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
           <h3 className="text-xl font-black mb-6">Local Map Guide</h3>
           <div className="aspect-video bg-gray-100 rounded-[32px] overflow-hidden border-4 border-white shadow-xl mb-6">
              <iframe 
                src={`${MY_MAPS_URL}&z=12`} 
                className="w-full h-full border-0" 
                title="Food & Tour Map" 
              />
           </div>
           
           <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Recommended Dining</h4>
           <div className="space-y-4">
              {[
                { icon: '🍜', name: 'Gimpo Noodle House', desc: 'Handmade kalguksu' },
                { icon: '🥩', name: 'Korean BBQ Town', desc: 'Premium local beef' },
                { icon: '☕', name: 'Bakery Cafe 81', desc: 'Modern scenic view' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-[24px] border border-gray-100 active:bg-blue-50 transition-colors">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">{item.icon}</div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-sm font-bold text-gray-800">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{item.desc}</p>
                  </div>
                  <button className="self-center p-2 text-blue-400">➜</button>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
};

export default ExploreGimpo;
