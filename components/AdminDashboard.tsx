
import React, { useState } from 'react';
import { AppState, FAQItem, StaffContact, Report, ServiceMenu, ContentBlock, GradSubmenu, TransportItem, EssentialPhrase } from '../types';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ state, updateState, onLogout }) => {
  const [tab, setTab] = useState<'home' | 'hall' | 'services' | 'data' | 'graduation' | 'faq' | 'inquiry'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dataMode, setDataMode] = useState<'excel' | 'google'>('google');
  
  // Selection states for modals
  const [editingStaff, setEditingStaff] = useState<StaffContact | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [editingTransport, setEditingTransport] = useState<TransportItem | null>(null);
  const [editingPhrase, setEditingPhrase] = useState<EssentialPhrase | null>(null);
  const [editingService, setEditingService] = useState<ServiceMenu | null>(null);
  const [editingGradMenu, setEditingGradMenu] = useState<GradSubmenu | null>(null);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const menuItems = [
    { id: 'home', label: '메인화면 · 공지', icon: '🏠' },
    { id: 'hall', label: '김포대회회관 정보', icon: '🏫' },
    { id: 'services', label: '숙소 서비스 CRUD', icon: '🛠️' },
    { id: 'data', label: '식단 · 일정 관리', icon: '📊' },
    { id: 'graduation', label: '졸업식 관리', icon: '🎓' },
    { id: 'faq', label: 'FAQ 관리', icon: '❓' },
    { id: 'inquiry', label: '문의 · 연락처 관리', icon: '📞' }
  ];

  const handleMenuClick = (id: any) => {
    setTab(id);
    setIsMenuOpen(false);
    setEditingContentId(null);
  };

  const handleApplyChanges = () => {
    updateState({ noticeId: Date.now().toString() });
    setShowSuccessModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => callback(evt.target?.result as string);
    reader.readAsDataURL(file);
  };

  const exportToExcel = (data: any[], fileName: string) => {
    if (data.length === 0) {
      alert("내보낼 데이터가 없습니다.");
      return;
    }
    const ws = (window as any).XLSX.utils.json_to_sheet(data);
    const wb = (window as any).XLSX.utils.book_new();
    (window as any).XLSX.utils.book_append_sheet(wb, ws, "Data");
    (window as any).XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const moveBlock = (pageId: string, index: number, direction: 'up' | 'down') => {
    const page = state.contentPages[pageId];
    if (!page) return;
    const newBlocks = [...page.blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    updateState({ contentPages: { ...state.contentPages, [pageId]: { ...page, blocks: newBlocks } } });
  };

  const updateContentBlock = (pageId: string, blockId: string, value: string) => {
    const page = state.contentPages[pageId];
    if (!page) return;
    const newBlocks = page.blocks.map(b => b.id === blockId ? { ...b, value } : b);
    updateState({ contentPages: { ...state.contentPages, [pageId]: { ...page, blocks: newBlocks } } });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden relative">
      <header className="h-16 bg-white border-b flex items-center justify-between px-5 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-900 border border-gray-100 tap-active"><span className="text-xl">☰</span></button>
          <div>
            <h1 className="text-sm font-black text-gray-900 leading-tight">Admin</h1>
            <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">{menuItems.find(i => i.id === tab)?.label}</p>
          </div>
        </div>
        <button onClick={onLogout} className="text-[10px] font-black text-gray-400 border border-gray-100 px-4 py-2 rounded-full uppercase tracking-widest tap-active">Logout</button>
      </header>

      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-[280px] bg-white z-[70] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-8 border-b flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-900">Settings</h2>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-300 text-xl p-2">✕</button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all tap-active ${tab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[13px] font-black">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </>
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
        {/* Tab 1: Home Screen */}
        {tab === 'home' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Main Page Management</h3>
              <button onClick={handleApplyChanges} className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg shadow-blue-100">저장하기</button>
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-4 shadow-sm">
              <div><label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">WELCOME Line</label><input className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold" value={state.headerLine1} onChange={e => updateState({ headerLine1: e.target.value })} /></div>
              <div><label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">SKE 197 Line</label><input className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-black text-blue-600" value={state.headerLine2} onChange={e => updateState({ headerLine2: e.target.value })} /></div>
              <div><label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">Current Program Name (캘린더 문구)</label><input className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold text-gray-900" value={state.termName} onChange={e => updateState({ termName: e.target.value })} /></div>
              <div><label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">공지사항 텍스트</label><textarea className="w-full p-4 bg-gray-50 rounded-2xl text-sm min-h-[100px]" value={state.noticeMessage} onChange={e => updateState({ noticeMessage: e.target.value })} /></div>
              <div className="pt-4 border-t space-y-4">
                <p className="text-[10px] font-black text-gray-900 uppercase">Admin Credentials</p>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">관리자 이메일</label><input className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold" value={state.adminEmail} onChange={e => updateState({ adminEmail: e.target.value })} /></div>
                    <div><label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">현재 비밀번호 (PIN)</label><input className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-black" value={state.adminPin} onChange={e => updateState({ adminPin: e.target.value })} /></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Hall Info & Transport & Phrases */}
        {tab === 'hall' && (
          <div className="space-y-10">
            <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Gimpo Hall Info</h3>
                  <button onClick={handleApplyChanges} className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full">저장</button>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-6 shadow-sm">
                  <div><label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">Hall Address</label><input className="w-full p-4 bg-gray-50 rounded-2xl text-sm" value={state.hallAddress} onChange={e => updateState({ hallAddress: e.target.value })} /></div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase mb-2 block">Complex Map Image</label>
                    <div className="space-y-3">
                      {state.complexMapUrl && <img src={state.complexMapUrl} className="w-full aspect-video object-cover rounded-2xl border" />}
                      <label className="block w-full bg-blue-50 text-blue-600 py-4 rounded-2xl text-[10px] font-black uppercase text-center cursor-pointer">
                          이미지 업로드/변경
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e, (url) => updateState({ complexMapUrl: url }))} />
                      </label>
                    </div>
                  </div>
                  <div><label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">Google Maps Iframe Link</label><input className="w-full p-4 bg-gray-50 rounded-2xl text-[11px]" value={state.nearbyMapUrl} onChange={e => updateState({ nearbyMapUrl: e.target.value })} /></div>
                </div>
            </section>

            {/* Transport CRUD */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Transportation (교통 안내)</h3>
                <button onClick={() => setEditingTransport({ id: Date.now().toString(), category: 'BUS', label: '', title: '', duration: '', color: '#2563eb' })} className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase">+ Add</button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {state.transportItems.map(t => (
                  <div key={t.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-3">
                      <span style={{ backgroundColor: t.color }} className="w-2 h-8 rounded-full" />
                      <div>
                        <p className="text-xs font-black">{t.label} · {t.title}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{t.duration}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingTransport(t)} className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">Edit</button>
                      <button onClick={() => updateState({ transportItems: state.transportItems.filter(x => x.id !== t.id) })} className="text-[9px] font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">Del</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ESSENTIAL KOREAN PHRASES CRUD (New Addition) */}
            <section className="space-y-4">
               <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Essential Korean Phrases</h3>
                  <button onClick={() => setEditingPhrase({ id: Date.now().toString(), text_ko: '', text_en: '', pronunciation: '', description_en: '', color: 'rgba(75,106,255,0.08)' })} className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg shadow-blue-100">+ Add Phrase</button>
               </div>
               <div className="grid grid-cols-1 gap-3">
                  {state.essentialPhrases.map(p => (
                    <div key={p.id} className="bg-white p-5 rounded-[28px] border border-gray-100 flex justify-between items-center shadow-sm">
                       <div>
                          <p className="text-sm font-black text-gray-900">{p.text_ko}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">{p.text_en}</p>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => setEditingPhrase(p)} className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-2 rounded-xl">Edit</button>
                          <button onClick={() => updateState({ essentialPhrases: state.essentialPhrases.filter(x => x.id !== p.id) })} className="text-[10px] font-black text-red-600 bg-red-50 px-3 py-2 rounded-xl">Del</button>
                       </div>
                    </div>
                  ))}
                  {state.essentialPhrases.length === 0 && <div className="py-10 text-center bg-white border-2 border-dashed rounded-3xl text-gray-300 font-bold italic uppercase text-[10px]">No phrases added</div>}
               </div>
            </section>
          </div>
        )}

        {/* Tab 3: Dormitory Services CRUD (Activated) */}
        {tab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Dormitory Services Management</h3>
              <button 
                onClick={() => {
                  const id = `service-${Date.now()}`;
                  const newService: ServiceMenu = { id, title: '새 서비스', title_en: 'New Service', icon: '🏠', desc: '서비스 설명' };
                  updateState({ 
                    serviceMenus: [...state.serviceMenus, newService],
                    contentPages: { ...state.contentPages, [id]: { title: '새 서비스', blocks: [{ id: 'b1', type: 'text', value: '내용을 입력하세요.' }] } }
                  });
                }} 
                className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full"
              >
                + Add New Service
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
               {state.serviceMenus.map(s => (
                 <div key={s.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl bg-gray-50 w-12 h-12 flex items-center justify-center rounded-2xl">{s.icon}</span>
                        <div>
                          <p className="font-black text-base text-gray-900">{s.title}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{s.title_en}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingService(s)} className="bg-gray-100 text-gray-600 text-[10px] font-black px-3 py-2 rounded-xl">Edit Title/Icon</button>
                        <button onClick={() => {
                           if(window.confirm('정말 삭제하시겠습니까?')) {
                             updateState({ serviceMenus: state.serviceMenus.filter(x => x.id !== s.id) });
                           }
                        }} className="bg-red-50 text-red-500 text-[10px] font-black px-3 py-2 rounded-xl">Del</button>
                      </div>
                   </div>
                   <button onClick={() => setEditingContentId(s.id)} className="w-full bg-blue-600 text-white text-[10px] font-black py-4 rounded-2xl shadow-lg shadow-blue-50">Edit Page Content & Order</button>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Tab 4: Data Management (Unified Excel) */}
        {tab === 'data' && (
          <div className="space-y-8">
            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Meal & Calendar Sync</h3>
            
            <div className="flex p-1 bg-gray-100 rounded-2xl">
              <button onClick={() => setDataMode('excel')} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${dataMode === 'excel' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>① Unified Excel Mode</button>
              <button onClick={() => setDataMode('google')} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${dataMode === 'google' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>② Google Sheets Sync</button>
            </div>

            {dataMode === 'excel' ? (
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-300">
                <h4 className="font-black">Unified Excel Management</h4>
                <p className="text-xs font-medium text-gray-500 leading-relaxed">식단표와 일정표를 하나의 엑셀 파일(별도 시트)로 통합 관리합니다.</p>
                <div className="space-y-4">
                  <button className="w-full bg-gray-50 border border-dashed py-5 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest">Download All-in-One Template</button>
                  <label className="block w-full bg-blue-600 text-white py-5 rounded-2xl text-center text-xs font-black uppercase cursor-pointer shadow-lg shadow-blue-100">
                    Upload All-in-One Excel
                    <input type="file" className="hidden" accept=".xlsx,.xls" />
                  </label>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-300">
                <h4 className="font-black text-green-600">Google Sheets Sync Mode</h4>
                <div className="space-y-4">
                  <p className="text-xs font-medium text-gray-500">시트만 수정하면 앱에 즉시 자동 반영됩니다.</p>
                  <input className="w-full p-4 bg-gray-50 border rounded-2xl text-xs font-bold" placeholder="Google Sheet CSV URL" value={state.googleSheetUrl} onChange={e => updateState({ googleSheetUrl: e.target.value })} />
                  <button 
                    onClick={() => { setIsSyncing(true); setTimeout(() => { setIsSyncing(false); setShowSuccessModal(true); }, 1500); }} 
                    className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xs uppercase shadow-lg shadow-green-100"
                  >
                    {isSyncing ? 'Syncing...' : '🔄 Sync & Update UI Now'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Graduation Management (Full CRUD) */}
        {tab === 'graduation' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Graduation Management</h3>
              <button onClick={handleApplyChanges} className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full">저장</button>
            </div>
            
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="text-sm font-black">이번 기수는 졸업식이 없습니다</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Toggle mode</p>
                </div>
                <button 
                  onClick={() => updateState({ noGraduationThisTerm: !state.noGraduationThisTerm })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${state.noGraduationThisTerm ? 'bg-red-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${state.noGraduationThisTerm ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {/* Sub-menu CRUD */}
              <div className="pt-4 border-t space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-gray-900 uppercase">Edit Sub-Menu Pages (CRUD)</p>
                  <button onClick={() => setEditingGradMenu({ id: `grad-${Date.now()}`, title: '', title_en: '', icon: '📜', desc: '', type: 'page' })} className="text-[9px] font-bold text-blue-600 px-3 py-1 bg-blue-50 rounded-lg">+ Add Menu</button>
                </div>
                <div className="space-y-3">
                  {state.gradSubmenus.map(m => (
                    <div key={m.id} className="bg-white p-4 rounded-2xl border flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{m.icon}</span>
                        <span className="text-sm font-black text-gray-700">{m.title}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingContentId(m.id)} className="text-[9px] font-black text-blue-600 px-3 py-1.5 bg-blue-50 rounded-lg">Content</button>
                        <button onClick={() => setEditingGradMenu(m)} className="text-[9px] font-black text-gray-600 px-3 py-1.5 bg-gray-50 rounded-lg">Edit</button>
                        <button onClick={() => updateState({ gradSubmenus: state.gradSubmenus.filter(x => x.id !== m.id) })} className="text-[9px] font-black text-red-600 px-3 py-1.5 bg-red-50 rounded-lg">Del</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
              <h4 className="font-black">Hotel Survey Management</h4>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                 <div>
                    <p className="text-xs font-black text-blue-700">2차 호텔 예약 조사 오픈</p>
                    <p className="text-[9px] text-blue-400 uppercase font-bold">Open Survey 2 to users</p>
                 </div>
                 <button 
                  onClick={() => updateState({ isSurvey2Open: !state.isSurvey2Open })}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all ${state.isSurvey2Open ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'}`}
                 >
                  {state.isSurvey2Open ? 'Open Now' : 'Locked'}
                 </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => exportToExcel(state.survey1, "Survey1_Pre")} className="bg-gray-900 text-white text-[10px] font-black py-4 rounded-2xl uppercase">1차 조사 엑셀</button>
                <button onClick={() => exportToExcel(state.survey2, "Survey2_Final")} className="bg-gray-900 text-white text-[10px] font-black py-4 rounded-2xl uppercase">2차 조사 엑셀</button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: FAQ (Activated) */}
        {tab === 'faq' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">FAQ Content Management</h3>
              <button onClick={() => setEditingFaq({ id: Date.now().toString(), category: '숙소', question: '', answer: '', order: 0 })} className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full">+ Add FAQ</button>
            </div>
            <div className="space-y-3">
              {state.faqs.map(f => (
                <div key={f.id} className="bg-white p-5 rounded-[24px] border border-gray-100 flex justify-between items-center shadow-sm">
                  <div className="max-w-[70%]">
                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg mb-1 inline-block">{f.category}</span>
                    <p className="text-sm font-black text-gray-900 truncate">{f.question}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingFaq(f)} className="p-2 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-bold">Edit</button>
                    <button onClick={() => updateState({ faqs: state.faqs.filter(x => x.id !== f.id) })} className="p-2 bg-red-50 text-red-500 rounded-lg text-[10px] font-bold">Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Inquiry & Contacts (Activated) */}
        {tab === 'inquiry' && (
          <div className="space-y-10">
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Staff Contacts</h3>
                <button onClick={() => setEditingStaff({ id: Date.now().toString(), name: '', role: '', phone: '', email: '' })} className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase">+ Add Staff</button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {state.staff.map(s => (
                  <div key={s.id} className="bg-white p-4 rounded-2xl border flex justify-between items-center shadow-sm">
                    <div><p className="text-xs font-black">{s.name}</p><p className="text-[9px] text-gray-400 font-bold">{s.role} · {s.phone}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingStaff(s)} className="text-[10px] font-black text-blue-600 px-2 py-1 bg-blue-50 rounded-md">Edit</button>
                      <button onClick={() => updateState({ staff: state.staff.filter(x => x.id !== s.id) })} className="text-[10px] font-black text-red-600 px-2 py-1 bg-red-50 rounded-md">Del</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
               <h3 className="text-[10px] font-black text-red-600 uppercase tracking-widest">Emergency Contact (24/7)</h3>
               <div className="bg-white p-6 rounded-[32px] border border-red-100 shadow-sm">
                  <textarea className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-black min-h-[80px]" value={state.emergencyText} onChange={e => updateState({ emergencyText: e.target.value })} />
                  <button onClick={handleApplyChanges} className="w-full mt-4 bg-red-600 text-white py-4 rounded-2xl text-xs font-black uppercase">비상 연락처 저장</button>
               </div>
            </section>

            <section className="space-y-4">
               <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">User Reports (문의내역)</h3>
                <button onClick={() => exportToExcel(state.reports, "Gimpo_Inquiry_Reports")} className="bg-gray-900 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase">📊 Export Excel</button>
              </div>
              <div className="space-y-4">
                {state.reports.map(r => (
                  <div key={r.id} className={`bg-white p-5 rounded-[32px] border ${r.checked ? 'border-green-100 opacity-60' : 'border-gray-100 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${r.checked ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{r.category}</span>
                      <div className="flex gap-2">
                        <button onClick={() => updateState({ reports: state.reports.map(x => x.id === r.id ? {...x, checked: !x.checked} : x) })} className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.checked ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 shadow-sm border'}`}>✓</button>
                        <button onClick={() => updateState({ reports: state.reports.filter(x => x.id !== r.id) })} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">✕</button>
                      </div>
                    </div>
                    <h4 className="font-black text-gray-900 text-sm">{r.title} (Room {r.roomNumber} - {r.name})</h4>
                    <p className="text-xs text-gray-500 mt-2">{r.description}</p>
                    {r.media && (
                      <div className="mt-4 rounded-2xl overflow-hidden border">
                         {r.mediaType?.startsWith('image/') ? <img src={r.media} className="w-full h-auto" /> : <video src={r.media} className="w-full" controls />}
                      </div>
                    )}
                  </div>
                ))}
                {state.reports.length === 0 && <div className="py-20 text-center bg-white rounded-3xl border border-dashed text-gray-300 font-bold italic">No reports yet.</div>}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* MODAL: Content Page Editor */}
      {editingContentId && (
        <div className="fixed inset-0 bg-white z-[110] flex flex-col animate-in slide-in-from-bottom duration-300">
           <header className="h-16 border-b flex items-center justify-between px-5 sticky top-0 bg-white shadow-sm">
             <div className="flex items-center gap-4">
               <button onClick={() => setEditingContentId(null)} className="h-10 px-3 bg-blue-50 text-blue-600 font-black rounded-xl text-xs">← Back</button>
               <h2 className="text-sm font-black text-gray-900 truncate max-w-[150px]">{state.contentPages[editingContentId]?.title} Editor</h2>
             </div>
             <button onClick={() => { setEditingContentId(null); setShowSuccessModal(true); }} className="text-[10px] font-black text-white bg-blue-600 px-4 py-2 rounded-full uppercase">저장 완료</button>
           </header>
           <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
             {state.contentPages[editingContentId]?.blocks.map((block, index) => (
               <div key={block.id} className="space-y-3 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative group">
                 <div className="flex justify-between items-center mb-2">
                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Block {index + 1}: {block.type}</span>
                      <div className="flex gap-1">
                        <button onClick={() => moveBlock(editingContentId, index, 'up')} disabled={index === 0} className="w-6 h-6 bg-gray-50 rounded-lg text-[10px] disabled:opacity-30">▲</button>
                        <button onClick={() => moveBlock(editingContentId, index, 'down')} disabled={index === state.contentPages[editingContentId].blocks.length - 1} className="w-6 h-6 bg-gray-50 rounded-lg text-[10px] disabled:opacity-30">▼</button>
                      </div>
                   </div>
                   <button 
                    onClick={() => {
                      const newBlocks = state.contentPages[editingContentId].blocks.filter(b => b.id !== block.id);
                      updateState({ contentPages: { ...state.contentPages, [editingContentId]: { ...state.contentPages[editingContentId], blocks: newBlocks } } });
                    }} 
                    className="text-[9px] font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                   >Remove</button>
                 </div>
                 {block.type === 'text' ? (
                   <textarea 
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium min-h-[120px] outline-none" 
                    value={block.value} 
                    onChange={e => updateContentBlock(editingContentId, block.id, e.target.value)} 
                   />
                 ) : (
                   <div className="space-y-3">
                     {block.value && <img src={block.value} className="w-full aspect-video object-cover rounded-2xl border" />}
                     <label className="block w-full bg-gray-100 text-gray-400 py-4 rounded-2xl text-[10px] font-black uppercase text-center cursor-pointer border-2 border-dashed">
                        이미지 변경
                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e, (url) => updateContentBlock(editingContentId, block.id, url))} />
                     </label>
                   </div>
                 )}
               </div>
             ))}
             <div className="flex gap-2">
               <button 
                onClick={() => {
                  const page = state.contentPages[editingContentId];
                  updateState({ contentPages: { ...state.contentPages, [editingContentId]: { ...page, blocks: [...page.blocks, { id: `b-${Date.now()}`, type: 'text', value: '' }] } } });
                }} 
                className="flex-1 bg-gray-50 py-4 rounded-2xl text-[10px] font-black uppercase text-gray-400"
               >+ Add Text</button>
               <button 
                onClick={() => {
                  const page = state.contentPages[editingContentId];
                  updateState({ contentPages: { ...state.contentPages, [editingContentId]: { ...page, blocks: [...page.blocks, { id: `b-${Date.now()}`, type: 'image', value: '' }] } } });
                }} 
                className="flex-1 bg-gray-50 py-4 rounded-2xl text-[10px] font-black uppercase text-gray-400"
               >+ Add Image</button>
             </div>
           </div>
        </div>
      )}

      {/* MODAL: Edit Service Menu */}
      {editingService && (
        <div className="fixed inset-0 bg-black/60 z-[120] flex items-center p-6 backdrop-blur-sm">
          <form onSubmit={(e) => {
            e.preventDefault();
            updateState({ serviceMenus: state.serviceMenus.map(s => s.id === editingService.id ? editingService : s) });
            setEditingService(null);
            setShowSuccessModal(true);
          }} className="bg-white rounded-[40px] w-full p-8 space-y-4 shadow-2xl scale-in-center">
            <h3 className="text-lg font-black">Menu Info Editor</h3>
            <div className="flex gap-3">
               <input className="w-20 p-4 bg-gray-50 border rounded-2xl text-2xl text-center" value={editingService.icon} onChange={e => setEditingService({...editingService, icon: e.target.value})} required />
               <input className="flex-1 p-4 bg-gray-50 border rounded-2xl text-sm font-bold" value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} required />
            </div>
            <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold" placeholder="Title (EN)" value={editingService.title_en} onChange={e => setEditingService({...editingService, title_en: e.target.value})} required />
            <div className="flex gap-2 pt-4"><button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black">메뉴 저장</button><button type="button" onClick={() => setEditingService(null)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black">취소</button></div>
          </form>
        </div>
      )}

      {/* MODAL: Edit Grad Menu Item */}
      {editingGradMenu && (
        <div className="fixed inset-0 bg-black/60 z-[120] flex items-center p-6 backdrop-blur-sm">
          <form onSubmit={(e) => {
            e.preventDefault();
            const exists = state.gradSubmenus.some(m => m.id === editingGradMenu.id);
            const newList = exists ? state.gradSubmenus.map(m => m.id === editingGradMenu.id ? editingGradMenu : m) : [...state.gradSubmenus, editingGradMenu];
            if (!exists) {
               updateState({ 
                 gradSubmenus: newList, 
                 contentPages: { ...state.contentPages, [editingGradMenu.id]: { title: editingGradMenu.title, blocks: [{ id: 'b1', type: 'text', value: '' }] } } 
               });
            } else {
               updateState({ gradSubmenus: newList });
            }
            setEditingGradMenu(null);
            setShowSuccessModal(true);
          }} className="bg-white rounded-[40px] w-full p-8 space-y-4 shadow-2xl scale-in-center">
            <h3 className="text-lg font-black">Graduation Menu Editor</h3>
            <div className="flex gap-3">
               <input className="w-20 p-4 bg-gray-50 border rounded-2xl text-2xl text-center" value={editingGradMenu.icon} onChange={e => setEditingGradMenu({...editingGradMenu, icon: e.target.value})} required />
               <input className="flex-1 p-4 bg-gray-50 border rounded-2xl text-sm font-bold" value={editingGradMenu.title} onChange={e => setEditingGradMenu({...editingGradMenu, title: e.target.value})} required />
            </div>
            <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold" placeholder="Title (EN)" value={editingGradMenu.title_en} onChange={e => setEditingGradMenu({...editingGradMenu, title_en: e.target.value})} required />
            <div className="flex gap-2 pt-4"><button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black">저장</button><button type="button" onClick={() => setEditingGradMenu(null)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black">취소</button></div>
          </form>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] w-full max-w-xs p-8 flex flex-col items-center text-center shadow-2xl scale-in-center">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">✓</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">저장되었습니다.</h3>
            <button onClick={() => setShowSuccessModal(false)} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-100 tap-active">확인</button>
          </div>
        </div>
      )}

      {/* MODAL: Edit Staff */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black/60 z-[120] flex items-center p-6 backdrop-blur-sm">
          <form onSubmit={(e) => {
            e.preventDefault();
            const exists = state.staff.some(s => s.id === editingStaff.id);
            const newList = exists ? state.staff.map(s => s.id === editingStaff.id ? editingStaff : s) : [...state.staff, editingStaff];
            updateState({ staff: newList });
            setEditingStaff(null);
            setShowSuccessModal(true);
          }} className="bg-white rounded-[40px] w-full p-8 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black">Staff Member Editor</h3>
            <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold" placeholder="Name" value={editingStaff.name} onChange={e => setEditingStaff({...editingStaff, name: e.target.value})} required />
            <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold" placeholder="Role" value={editingStaff.role} onChange={e => setEditingStaff({...editingStaff, role: e.target.value})} required />
            <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold" placeholder="Phone" value={editingStaff.phone} onChange={e => setEditingStaff({...editingStaff, phone: e.target.value})} required />
            <div className="flex gap-2 pt-4"><button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black">Save</button><button type="button" onClick={() => setEditingStaff(null)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black">Cancel</button></div>
          </form>
        </div>
      )}

      {/* MODAL: Edit FAQ */}
      {editingFaq && (
        <div className="fixed inset-0 bg-black/60 z-[120] flex items-center p-6 backdrop-blur-sm">
          <form onSubmit={(e) => {
            e.preventDefault();
            const exists = state.faqs.some(f => f.id === editingFaq.id);
            const newList = exists ? state.faqs.map(f => f.id === editingFaq.id ? editingFaq : f) : [...state.faqs, editingFaq];
            updateState({ faqs: newList });
            setEditingFaq(null);
            setShowSuccessModal(true);
          }} className="bg-white rounded-[40px] w-full p-8 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-black">FAQ Item Editor</h3>
            <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold" placeholder="Category" value={editingFaq.category} onChange={e => setEditingFaq({...editingFaq, category: e.target.value})} required />
            <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold" placeholder="Question" value={editingFaq.question} onChange={e => setEditingFaq({...editingFaq, question: e.target.value})} required />
            <textarea className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-medium min-h-[100px]" placeholder="Answer" value={editingFaq.answer} onChange={e => setEditingFaq({...editingFaq, answer: e.target.value})} required />
            <div className="flex gap-2 pt-4"><button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black">저장</button><button type="button" onClick={() => setEditingFaq(null)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black">취소</button></div>
          </form>
        </div>
      )}

      {/* MODAL: Edit Transport */}
      {editingTransport && (
        <div className="fixed inset-0 bg-black/60 z-[120] flex items-center p-6 backdrop-blur-sm">
          <form onSubmit={(e) => {
            e.preventDefault();
            const exists = state.transportItems.some(t => t.id === editingTransport.id);
            const newList = exists ? state.transportItems.map(t => t.id === editingTransport.id ? editingTransport : t) : [...state.transportItems, editingTransport];
            updateState({ transportItems: newList });
            setEditingTransport(null);
            setShowSuccessModal(true);
          }} className="bg-white rounded-[40px] w-full p-8 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black">Transport Item Editor</h3>
            <select className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold" value={editingTransport.category} onChange={e => setEditingTransport({...editingTransport, category: e.target.value as any})}>
              <option value="BUS">BUS</option><option value="TAXI">TAXI</option><option value="OTHER">OTHER</option>
            </select>
            <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold" placeholder="Label (No. 88)" value={editingTransport.label} onChange={e => setEditingTransport({...editingTransport, label: e.target.value})} required />
            <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold" placeholder="Destination" value={editingTransport.title} onChange={e => setEditingTransport({...editingTransport, title: e.target.value})} required />
            <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold" placeholder="Duration/Cost" value={editingTransport.duration} onChange={e => setEditingTransport({...editingTransport, duration: e.target.value})} required />
            <div className="flex gap-2 pt-4"><button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black">저장</button><button type="button" onClick={() => setEditingTransport(null)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black">취소</button></div>
          </form>
        </div>
      )}

      {/* MODAL: Edit Phrase */}
      {editingPhrase && (
        <div className="fixed inset-0 bg-black/60 z-[120] flex items-center p-6 backdrop-blur-sm">
          <form onSubmit={(e) => {
            e.preventDefault();
            const exists = state.essentialPhrases.some(p => p.id === editingPhrase.id);
            const newList = exists ? state.essentialPhrases.map(p => p.id === editingPhrase.id ? editingPhrase : p) : [...state.essentialPhrases, editingPhrase];
            updateState({ essentialPhrases: newList });
            setEditingPhrase(null);
            setShowSuccessModal(true);
          }} className="bg-white rounded-[40px] w-full p-8 space-y-4 shadow-2xl scale-in-center">
            <h3 className="text-lg font-black">Korean Phrase Editor</h3>
            <div className="space-y-3">
               <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold" placeholder="Korean Text" value={editingPhrase.text_ko} onChange={e => setEditingPhrase({...editingPhrase, text_ko: e.target.value})} required />
               <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold" placeholder="English Translation" value={editingPhrase.text_en} onChange={e => setEditingPhrase({...editingPhrase, text_en: e.target.value})} required />
               <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold" placeholder="Pronunciation" value={editingPhrase.pronunciation} onChange={e => setEditingPhrase({...editingPhrase, pronunciation: e.target.value})} required />
               <input className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold" placeholder="Context Description" value={editingPhrase.description_en} onChange={e => setEditingPhrase({...editingPhrase, description_en: e.target.value})} required />
            </div>
            <div className="flex gap-2 pt-4"><button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black">저장</button><button type="button" onClick={() => setEditingPhrase(null)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black">취소</button></div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
