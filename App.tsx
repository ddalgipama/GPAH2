
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
          contentPages: { ...INITIAL_STATE.contentPages, ...(parsed.contentPages || {}) },
          events: Array.isArray(parsed.events) ? parsed.events : INITIAL_STATE.events,
          meals: Array.isArray(parsed.meals) ? parsed.meals : INITIAL_STATE.meals,
          faqs: Array.isArray(parsed.faqs) ? parsed.faqs : INITIAL_STATE.faqs,
          faqCategories: Array.isArray(parsed.faqCategories) ? parsed.faqCategories : INITIAL_STATE.faqCategories,
          staff: Array.isArray(parsed.staff) ? parsed.staff : INITIAL_STATE.staff,
          reports: Array.isArray(parsed.reports) ? parsed.reports : INITIAL_STATE.reports,
          gradSubmenus: Array.isArray(parsed.gradSubmenus) ? parsed.gradSubmenus : INITIAL_STATE.gradSubmenus,
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
        return <AdminLogin onLogin={() => { setAdminLoggedIn(true); navigateTo('admin-dashboard'); }} onBack={() => navigateTo('home')} />;
      case 'admin-dashboard':
        return adminLoggedIn 
          ? <AdminDashboard state={state} updateState={updateState} onLogout={() => { setAdminLoggedIn(false); navigateTo('home'); }} /> 
          : <AdminLogin onLogin={() => { setAdminLoggedIn(true); navigateTo('admin-dashboard'); }} onBack={() => navigateTo('home')} />;
      case 'gimpo-hall':
        return <GimpoHall state={state} onBack={() => navigateTo('home')} />;
      case 'dorm-services':
        return <DormServices state={state} onBack={() => navigateTo('home')} onDetail={(id) => { setActivePageId(id); navigateTo('dorm-detail'); }} />;
      case 'dorm-detail':
      case 'grad-detail':
        const page = getSafePage(activePageId);
        const backView = view === 'dorm-detail' ? 'dorm-services' : 'graduation';
        return (
          <div className="min-h-screen bg-white pb-20 overflow-y-auto no-scrollbar relative">
            <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20 shadow-sm">
              <button onClick={() => navigateTo(backView)} className="text-blue-600 font-medium flex items-center px-2 py-1 active:bg-blue-50 rounded-lg">
                <span className="mr-1">←</span> Back
              </button>
              <h1 className="text-lg font-bold text-gray-900">{page.title}</h1>
              <div className="w-10"></div>
            </header>
            <div className="p-6 pt-8 space-y-6">
              {page.blocks.map((block) => (
                <div key={block.id} className="animate-in fade-in duration-500 slide-in-from-bottom-2">
                  {block.type === 'text' ? (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">{block.value}</p>
                  ) : (
                    block.value && <img src={block.value} alt="content" className="rounded-3xl w-full object-cover shadow-xl border border-gray-100" />
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
    <div className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-white overflow-hidden flex flex-col">
      {renderView()}
    </div>
  );
};

export default App;
