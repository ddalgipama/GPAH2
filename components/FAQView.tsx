
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
        <button onClick={onBack} className="p-2 text-blue-600 font-medium">← Back</button>
        <h1 className="text-lg font-bold">FAQ</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black mb-2">무엇이든 물어보세요</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Frequently Asked Questions</p>
        </div>

        {categories.map(cat => (
          <div key={cat} className="mb-8">
            <h3 className="text-[10px] font-black text-blue-600 tracking-widest uppercase mb-4 pl-4">{cat}</h3>
            <div className="space-y-3">
              {state.faqs.filter(f => f.category === cat).map(faq => (
                <div key={faq.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                  <button 
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full p-5 flex justify-between items-center text-left"
                  >
                    <span className="text-sm font-bold text-gray-800 pr-4">{faq.question}</span>
                    <span className={`text-blue-600 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {openId === faq.id && (
                    <div className="p-5 pt-0 text-sm text-gray-500 leading-relaxed border-t border-gray-50 animate-in slide-in-from-top-2 duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-gray-900 rounded-[40px] p-8 text-white mt-12">
          <p className="text-xs opacity-60 uppercase font-black tracking-widest mb-1">Still need help?</p>
          <p className="text-lg font-bold mb-6">원하는 답변을 찾지 못하셨나요?</p>
          <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-lg shadow-blue-900/40 active:scale-[0.98] transition-all">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQView;
