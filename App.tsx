
import React, { useState, useEffect } from 'react';
import { 
  AppView, 
  AppState 
} from './types';
import { INITIAL_STATE } from './constants';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import GimpoHall from './components/GimpoHall';
import DormServices from './components/DormServices';
import MealPlan from './components/MealPlan';
import CalendarView from './components/CalendarView';
import GraduationView from './components/GraduationView';
import FAQView from './components/FAQView';
import ExploreGimpo from './components/ExploreGimpo';
import ContactUs from './components/ContactUs';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('gimpo_app_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { 
          ...INITIAL_STATE, 
          ...parsed,
          contentPages: { ...INITIAL_STATE.contentPages, ...(parsed.contentPages || {}) }
        };
      }
    } catch (e) {
      console.error("Failed to load local state", e);
    }
    return INITIAL_STATE;
  });
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  useEffect(() => {
    localStorage.setItem('gimpo_app_state', JSON.stringify(state));
  }, [state]);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const navigateTo = (newView: AppView) => {
    setView(newView);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    const getSafePage = (id: string | null) => {
      if (!id) return { title: 'Not Found', blocks: [] };
      return state.contentPages[id] || { title: 'Not Found', blocks: [{ type: 'text', value: 'Content is under preparation.' }] };
    };

    switch (view) {
      case 'home':
        return <Home state={state} onNavigate={navigateTo} />;
      case 'admin-login':
        return <AdminLogin state={state} updateState={updateState} onLogin={() => { setAdminLoggedIn(true); navigateTo('admin-dashboard'); }} onBack={() => navigateTo('home')} />;
      case 'admin-dashboard':
        return adminLoggedIn 
          ? <AdminDashboard state={state} updateState={updateState} onLogout={() => { setAdminLoggedIn(false); navigateTo('home'); }} /> 
          : <AdminLogin state={state} updateState={updateState} onLogin={() => { setAdminLoggedIn(true); navigateTo('admin-dashboard'); }} onBack={() => navigateTo('home')} />;
      case 'gimpo-hall':
        return <GimpoHall state={state} onBack={() => navigateTo('home')} />;
      case 'dorm-services':
        return <DormServices state={state} onBack={() => navigateTo('home')} onDetail={(id) => { setActivePageId(id); navigateTo('dorm-detail'); }} />;
      case 'dorm-detail':
      case 'grad-detail':
        const page = getSafePage(activePageId);
        const backView = view === 'dorm-detail' ? 'dorm-services' : 'graduation';
        return (
          <div className="flex-1 flex flex-col bg-white">
            <header className="h-16 border-b flex items-center justify-between px-4 sticky top-0 bg-white/95 backdrop-blur-md z-20">
              <button onClick={() => navigateTo(backView)} className="h-10 px-3 text-blue-600 font-bold flex items-center bg-blue-50 rounded-xl tap-active">
                <span className="mr-1">←</span> Back
              </button>
              <h1 className="text-base font-black text-gray-900 truncate max-w-[200px]">{page.title}</h1>
              <div className="w-10"></div>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-20 no-scrollbar">
              {page.blocks.map((block) => (
                <div key={block.id} className="animate-in fade-in duration-500">
                  {block.type === 'text' ? (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium text-[15px]">{block.value}</p>
                  ) : (
                    block.value && <img src={block.value} alt="content" className="rounded-[32px] w-full object-cover shadow-lg border border-gray-100" />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'meal-plan':
        return <MealPlan state={state} onBack={() => navigateTo('home')} />;
      case 'calendar':
        return <CalendarView state={state} onBack={() => navigateTo('home')} />;
      case 'graduation':
        return <GraduationView state={state} updateState={updateState} onBack={() => navigateTo('home')} onPageDetail={(id) => { setActivePageId(id); navigateTo('grad-detail'); }} />;
      case 'faq':
        return <FAQView state={state} onBack={() => navigateTo('home')} />;
      case 'explore-gimpo':
        return <ExploreGimpo state={state} onBack={() => navigateTo('home')} />;
      case 'contact-us':
        return <ContactUs state={state} updateState={updateState} onBack={() => navigateTo('home')} />;
      default:
        return <Home state={state} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl flex flex-col relative overflow-hidden">
      {renderView()}
    </div>
  );
};

export default App;
