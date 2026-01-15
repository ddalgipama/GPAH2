
import React, { useState, useEffect, useCallback } from 'react';
import { 
  AppView, 
  AppState, 
  Event, 
  Meal, 
  FAQItem, 
  StaffContact, 
  Report,
  ContentPage
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
  const [activeDormId, setActiveDormId] = useState<string | null>(null);
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('gimpo_app_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
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
    switch (view) {
      case 'home':
        return <Home state={state} onNavigate={navigateTo} />;
      case 'admin-login':
        return <AdminLogin onLogin={() => { setAdminLoggedIn(true); navigateTo('admin-dashboard'); }} onBack={() => navigateTo('home')} />;
      case 'admin-dashboard':
        return adminLoggedIn ? <AdminDashboard state={state} updateState={updateState} onLogout={() => { setAdminLoggedIn(false); navigateTo('home'); }} /> : <AdminLogin onLogin={() => { setAdminLoggedIn(true); navigateTo('admin-dashboard'); }} onBack={() => navigateTo('home')} />;
      case 'gimpo-hall':
        return <GimpoHall state={state} onBack={() => navigateTo('home')} />;
      case 'dorm-services':
        return <DormServices state={state} onBack={() => navigateTo('home')} onDetail={(id) => { setActiveDormId(id); navigateTo('dorm-detail'); }} />;
      case 'dorm-detail':
        const page = state.contentPages[activeDormId || ''];
        return (
          <div className="min-h-screen bg-white pb-20">
            <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <button onClick={() => navigateTo('dorm-services')} className="text-blue-600 font-medium flex items-center">
                <span className="mr-1">←</span> Back
              </button>
              <h1 className="text-lg font-bold">{page?.title || 'Service'}</h1>
              <div className="w-10"></div>
            </header>
            <div className="p-6 prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: page?.content || '' }} />
              {page?.images?.map((img, i) => (
                <img key={i} src={img} alt="content" className="rounded-xl mt-4 w-full object-cover shadow-md" />
              ))}
            </div>
          </div>
        );
      case 'meal-plan':
        return <MealPlan state={state} onBack={() => navigateTo('home')} />;
      case 'calendar':
        return <CalendarView state={state} onBack={() => navigateTo('home')} />;
      case 'graduation':
        return <GraduationView state={state} updateState={updateState} onBack={() => navigateTo('home')} />;
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
    <div className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-white overflow-hidden">
      {renderView()}
    </div>
  );
};

export default App;
