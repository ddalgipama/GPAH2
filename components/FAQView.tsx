
import React, { useState } from 'react';
import { AppState } from '../types';

interface Props {
  state: AppState;
  onBack: () => void;
}

const FAQView: React.FC<Props> = ({ state, onBack }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  
  const categories = Array.from(new Set(state.faqs.map(f => f.category)));

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-y-auto no-scrollbar">
      <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
        <button onClick={onBack} className="p-2 text-blue-600 font-medium flex items-center">
          <span className="mr-1">←</span> Back
        </button>
        <h1 className="text-lg font-bold">자주 묻는 질문</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black mb-2 leading-tight">무엇이든<br/>물어보세요</h2>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Help Center & FAQ</p>
        </div>

        {categories.map(cat => (
          <div key={cat} className="mb-8 animate-in fade-in duration-500">
            <h3 className="text-[11px] font-black text-blue-600 tracking-widest uppercase mb-4 px-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              {cat}
            </h3>
            <div className="space-y-3">
              {state.faqs.filter(f => f.category === cat).map(faq => (
                <div key={faq.id} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 transition-all">
                  <button 
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full p-5 flex justify-between items-center text-left active:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-bold text-gray-800 pr-4 leading-snug">{faq.question}</span>
                    <span className={`text-blue-500 transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {openId === faq.id && (
                    <div className="p-6 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-50 animate-in slide-in-from-top-2 duration-300 font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed rounded-[40px] text-gray-300">
            <p className="font-bold text-sm">준비된 질문이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQView;
