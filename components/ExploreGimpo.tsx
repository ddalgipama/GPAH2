
import React from 'react';
import { AppState } from '../types';
import { MY_MAPS_URL } from '../constants';

interface Props {
  state: AppState;
  onBack: () => void;
}

const ExploreGimpo: React.FC<Props> = ({ state, onBack }) => {
  const attractions = [
    { name: '강화도', desc: '역사적인 유적지와 탁 트인 바다 전망을 즐길 수 있는 섬입니다.', img: 'https://picsum.photos/400/300?random=1' },
    { name: '애기봉', desc: '북한을 가깝게 볼 수 있는 평화 생태 공원입니다.', img: 'https://picsum.photos/400/300?random=2' },
    { name: '라베니체', desc: '이탈리아 베네치아를 모티브로 한 수변 상업지구입니다.', img: 'https://picsum.photos/400/300?random=3' },
  ];

  return (
    <div className="min-h-screen bg-white pb-20 overflow-y-auto no-scrollbar">
      <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
        <button onClick={onBack} className="p-2 text-blue-600 font-medium">← Back</button>
        <h1 className="text-lg font-bold">Explore Gimpo</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6 space-y-12">
        <section>
          <div className="bg-blue-600 rounded-[40px] p-8 text-white shadow-xl shadow-blue-100">
            <h2 className="text-3xl font-black mb-4">김포 이야기</h2>
            <p className="text-sm opacity-90 leading-relaxed font-medium">{state.gimpoIntro}</p>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xl font-black">Nearby Attractions</h3>
            <button onClick={() => window.open(MY_MAPS_URL, '_blank')} className="text-xs font-bold text-blue-600 underline">View on Maps</button>
          </div>
          <div className="space-y-6">
            {attractions.map((a, i) => (
              <div key={i} className="group relative rounded-[32px] overflow-hidden shadow-lg shadow-gray-200">
                <img src={a.img} alt={a.name} className="w-full aspect-[4/3] object-cover group-active:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                  <h4 className="text-xl font-bold text-white mb-2">{a.name}</h4>
                  <p className="text-[10px] text-gray-300 leading-relaxed uppercase font-bold tracking-widest">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
           <h3 className="text-xl font-black mb-6">Local Restaurants</h3>
           <div className="aspect-video bg-gray-100 rounded-[32px] overflow-hidden border-4 border-white shadow-lg mb-6">
              <iframe src={MY_MAPS_URL} className="w-full h-full" title="Food Map" />
           </div>
           <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🍜</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Gimpo Noodle House</p>
                    <p className="text-[10px] text-gray-400 mt-1">Traditional Korean handmade noodles</p>
                    <div className="flex gap-1 mt-2">
                       <span className="text-[9px] font-black text-orange-500 uppercase">$$</span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
};

export default ExploreGimpo;
