
import React, { useState } from 'react';
import { AppState, Meal } from '../types';

interface Props {
  state: AppState;
  onBack: () => void;
}

const MealPlan: React.FC<Props> = ({ state, onBack }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Basic Calendar Logic
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), i + 1);
    return d.toISOString().split('T')[0];
  });

  const dailyMeals = state.meals.filter(m => m.date === selectedDate);
  const lunch = dailyMeals.filter(m => m.meal === 'LUNCH').sort((a, b) => a.order - b.order);
  const dinner = dailyMeals.filter(m => m.meal === 'DINNER').sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-white flex flex-col h-full">
      <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
        <button onClick={onBack} className="p-2 text-blue-600 font-medium">← Back</button>
        <h1 className="text-lg font-bold">Meal Plan</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
        {/* Simple Horizontal Calendar */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6 mb-6">
          {currentMonthDays.map(date => {
            const d = new Date(date);
            const isSelected = date === selectedDate;
            return (
              <button 
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-50 text-gray-400'
                }`}
              >
                <span className="text-[10px] font-bold uppercase mb-1">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className="text-xl font-black">{d.getDate()}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          <section className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-blue-600 uppercase mb-4 flex items-center gap-2">
              LUNCH 🍽
            </h3>
            {lunch.length > 0 ? (
              <div className="space-y-3">
                {lunch.map((m, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-200/50 pb-2 last:border-0">
                    <span className="font-bold text-gray-800">{m.menu_ko}</span>
                    <div className="flex gap-1 text-sm">
                      {m.spicy && '🌶'}
                      {m.seafood && '🐟'}
                      {m.peanut && '🥜'}
                      {m.wheat && '🌾'}
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-400">데이터가 없습니다.</p>}
          </section>

          <section className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-orange-600 uppercase mb-4 flex items-center gap-2">
              DINNER 🌙
            </h3>
            {dinner.length > 0 ? (
              <div className="space-y-3">
                {dinner.map((m, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-200/50 pb-2 last:border-0">
                    <span className="font-bold text-gray-800">{m.menu_ko}</span>
                    <div className="flex gap-1 text-sm">
                      {m.spicy && '🌶'}
                      {m.seafood && '🐟'}
                      {m.peanut && '🥜'}
                      {m.wheat && '🌾'}
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-400">데이터가 없습니다.</p>}
          </section>

          <div className="bg-blue-50 p-4 rounded-2xl flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold"><span>🌶</span> Spicy</div>
            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold"><span>🐟</span> Seafood</div>
            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold"><span>🥜</span> Peanut</div>
            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold"><span>🌾</span> Wheat/Gluten</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlan;
