
import React, { useState } from 'react';
import { AppState, FAQItem, StaffContact, Event, Meal, ContentPage, ContentBlock, ServiceMenu } from '../types';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ state, updateState, onLogout }) => {
  const [tab, setTab] = useState<'content' | 'services' | 'surveys' | 'data' | 'faq' | 'reports'>('content');
  const [editingService, setEditingService] = useState<string | null>(null);
  const [isManagingMenus, setIsManagingMenus] = useState(false);
  const [editingMenu, setEditingMenu] = useState<ServiceMenu | null>(null);

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = (window as any).XLSX.read(bstr, { type: 'binary' });
        
        const eventsSheet = wb.Sheets['Events'];
        const events: Event[] = eventsSheet ? (window as any).XLSX.utils.sheet_to_json(eventsSheet) : [];
        
        const mealsSheet = wb.Sheets['Meals'];
        const rawMeals = mealsSheet ? (window as any).XLSX.utils.sheet_to_json(mealsSheet) : [];
        const meals: Meal[] = rawMeals.map((m: any) => ({
          ...m,
          spicy: m.spicy === 1 || m.spicy === true,
          seafood: m.seafood === 1 || m.seafood === true,
          peanut: m.peanut === 1 || m.peanut === true,
          wheat: m.wheat === 1 || m.wheat === true
        }));

        updateState({ events, meals });
        alert('데이터가 성공적으로 업데이트되었습니다!');
      } catch (err) {
        alert('엑셀 파일 형식이 올바르지 않습니다. 양식을 확인해 주세요.');
        console.error(err);
      }
    };
    reader.readAsBinaryString(file as Blob);
  };

  const downloadExcelTemplate = () => {
    const wb = (window as any).XLSX.utils.book_new();

    // 1. Events Template
    const eventsData = [
      ['date', 'title_ko', 'title_en', 'type', 'time', 'location', 'description_ko', 'description_en'],
      ['2026-01-20', '오리엔테이션', 'Orientation', 'OT', '10:00', '강당', '일정 소개', 'Intro program'],
      ['2026-01-21', '숙소 청소', 'Room Cleaning', 'CLEANING', '09:00', '숙소동', '청소 협조', 'Cleaning day']
    ];
    const wsEvents = (window as any).XLSX.utils.aoa_to_sheet(eventsData);
    (window as any).XLSX.utils.book_append_sheet(wb, wsEvents, "Events");

    // 2. Meals Template
    const mealsData = [
      ['date', 'meal', 'order', 'menu_ko', 'menu_en', 'spicy', 'seafood', 'peanut', 'wheat'],
      ['2026-01-20', 'LUNCH', 1, '비빔밥', 'Bibimbap', 1, 0, 0, 0],
      ['2026-01-20', 'LUNCH', 2, '미역국', 'Seaweed Soup', 0, 1, 0, 0],
      ['2026-01-20', 'DINNER', 1, '불고기', 'Bulgogi', 0, 0, 0, 1]
    ];
    const wsMeals = (window as any).XLSX.utils.aoa_to_sheet(mealsData);
    (window as any).XLSX.utils.book_append_sheet(wb, wsMeals, "Meals");

    (window as any).XLSX.writeFile(wb, "GimpoHall_Data_Template.xlsx");
  };

  const downloadSurveysExcel = () => {
    if (!state.survey1 || state.survey1.length === 0) {
      alert('다운로드할 데이터가 없습니다.');
      return;
    }
    const ws = (window as any).XLSX.utils.json_to_sheet(state.survey1);
    const wb = (window as any).XLSX.utils.book_new();
    (window as any).XLSX.utils.book_append_sheet(wb, ws, "HotelSurveys");
    (window as any).XLSX.writeFile(wb, `Graduation_Hotel_Survey_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const clearSurveys = () => {
    if (window.confirm('모든 설문 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      updateState({ survey1: [] });
    }
  };

  // Menu Management Helpers
  const saveMenu = (menu: ServiceMenu) => {
    const exists = state.serviceMenus.some(m => m.id === menu.id);
    let updatedMenus;
    if (exists) {
      updatedMenus = state.serviceMenus.map(m => m.id === menu.id ? menu : m);
    } else {
      updatedMenus = [...state.serviceMenus, menu];
    }

    const updatedContentPages = { ...state.contentPages };
    if (!updatedContentPages[menu.id]) {
      updatedContentPages[menu.id] = { title: menu.title, blocks: [] };
    } else {
      updatedContentPages[menu.id].title = menu.title;
    }

    updateState({ serviceMenus: updatedMenus, contentPages: updatedContentPages });
    setEditingMenu(null);
  };

  const deleteMenu = (id: string) => {
    if (!window.confirm('이 메뉴를 삭제하시겠습니까?')) return;
    const updatedMenus = state.serviceMenus.filter(m => m.id !== id);
    updateState({ serviceMenus: updatedMenus });
  };

  // Block Editing Helpers
  const addBlock = (type: 'text' | 'image') => {
    if (!editingService) return;
    const page = state.contentPages[editingService];
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      value: ''
    };
    const updatedBlocks = [...(page.blocks || []), newBlock];
    updateState({
      contentPages: {
        ...state.contentPages,
        [editingService]: { ...page, blocks: updatedBlocks }
      }
    });
  };

  const updateBlockValue = (blockId: string, newValue: string) => {
    if (!editingService) return;
    const page = state.contentPages[editingService];
    const updatedBlocks = page.blocks.map(b => b.id === blockId ? { ...b, value: newValue } : b);
    updateState({
      contentPages: {
        ...state.contentPages,
        [editingService]: { ...page, blocks: updatedBlocks }
      }
    });
  };

  const removeBlock = (blockId: string) => {
    if (!editingService) return;
    const page = state.contentPages[editingService];
    const updatedBlocks = page.blocks.filter(b => b.id !== blockId);
    updateState({
      contentPages: {
        ...state.contentPages,
        [editingService]: { ...page, blocks: updatedBlocks }
      }
    });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (!editingService) return;
    const page = state.contentPages[editingService];
    const updatedBlocks = [...page.blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= updatedBlocks.length) return;
    
    [updatedBlocks[index], updatedBlocks[newIndex]] = [updatedBlocks[newIndex], updatedBlocks[index]];
    
    updateState({
      contentPages: {
        ...state.contentPages,
        [editingService]: { ...page, blocks: updatedBlocks }
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateBlockValue(blockId, reader.result as string);
    };
    reader.readAsDataURL(file as Blob);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white p-6 border-b flex justify-between items-center sticky top-0 z-40">
        <h1 className="font-black text-2xl tracking-tight text-gray-900">Admin</h1>
        <button onClick={onLogout} className="text-[10px] font-black text-gray-400 border border-gray-100 px-4 py-2 rounded-full uppercase tracking-widest hover:bg-gray-50 transition-colors">Logout</button>
      </header>

      {/* Main Tabs */}
      <div className="flex bg-white border-b overflow-x-auto no-scrollbar px-2 sticky top-[81px] z-30">
        {['content', 'services', 'surveys', 'data', 'faq', 'reports'].map(t => (
          <button
            key={t}
            onClick={() => { setTab(t as any); setEditingService(null); setIsManagingMenus(false); }}
            className={`py-4 px-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              tab === t ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-300 hover:text-gray-600'
            }`}
          >
            {t} {t === 'surveys' && state.survey1.length > 0 && `(${state.survey1.length})`}
          </button>
        ))}
      </div>

      <div className="p-6 flex-1 overflow-y-auto pb-32 no-scrollbar">
        {tab === 'content' && (
          <div className="space-y-10">
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Home Header</h3>
              <div className="grid gap-4 bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Small Title</label>
                  <input className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm font-medium" value={state.headerLine1} onChange={e => updateState({ headerLine1: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Main Title</label>
                  <input className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm font-black" value={state.headerLine2} onChange={e => updateState({ headerLine2: e.target.value })} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Notice Bar</h3>
              <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
                <textarea className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm min-h-[120px] font-medium leading-relaxed" value={state.noticeMessage} onChange={e => updateState({ noticeMessage: e.target.value })} />
              </div>
            </section>
          </div>
        )}

        {tab === 'services' && (
          <div className="space-y-6">
            {!editingService && !isManagingMenus && (
              <div className="space-y-4">
                <button 
                  onClick={() => setIsManagingMenus(true)}
                  className="w-full bg-white text-gray-900 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest border border-gray-100 shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <span className="text-blue-600">⚙️</span> Settings & Menu List
                </button>
                <div className="grid grid-cols-1 gap-4">
                  {state.serviceMenus.map(menu => (
                    <button 
                      key={menu.id}
                      onClick={() => setEditingService(menu.id)}
                      className="bg-white p-6 rounded-[32px] border border-gray-100 flex justify-between items-center shadow-sm active:shadow-md active:scale-[0.98] transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl bg-gray-50 w-16 h-16 flex items-center justify-center rounded-2xl">{menu.icon}</span>
                        <div className="text-left">
                          <p className="font-black text-gray-900">{menu.title}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Manage Content</p>
                        </div>
                      </div>
                      <span className="text-blue-600 font-black">➔</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isManagingMenus && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[10px] font-black text-blue-600 tracking-widest uppercase">Service List Management</h3>
                  <button onClick={() => setIsManagingMenus(false)} className="text-xs font-bold text-gray-400 uppercase">Back</button>
                </div>

                <div className="grid gap-3">
                  {state.serviceMenus.map(menu => (
                    <div key={menu.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center group">
                      <div className="flex items-center gap-3">
                        <span className="text-xl bg-gray-50 p-2 rounded-xl">{menu.icon}</span>
                        <div>
                          <p className="text-sm font-black text-gray-900">{menu.title}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{menu.id}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingMenu(menu)} className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-4 py-2 rounded-full">Edit</button>
                        <button onClick={() => deleteMenu(menu.id)} className="text-[9px] font-black text-red-500 uppercase bg-red-50 px-4 py-2 rounded-full">Del</button>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setEditingMenu({ id: '', title: '', title_en: '', icon: '✨', desc: '' })}
                  className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200 active:scale-95 transition-all"
                >
                  + Create New Category
                </button>
              </div>
            )}

            {editingService && (
              <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center sticky top-[-24px] bg-white/95 backdrop-blur-md py-4 z-20 border-b border-gray-100 mb-4 px-2">
                   <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                     {state.contentPages[editingService]?.title}
                   </h3>
                   <button onClick={() => setEditingService(null)} className="text-[10px] font-black text-blue-600 border border-blue-100 px-5 py-2.5 rounded-full uppercase tracking-widest bg-blue-50/50 hover:bg-blue-50 transition-colors">Save & Close</button>
                </div>

                <div className="space-y-6 pt-2">
                   {state.contentPages[editingService]?.blocks?.map((block, idx) => (
                     <div key={block.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative group">
                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                           <button onClick={() => moveBlock(idx, 'up')} className="bg-white border border-gray-100 rounded-xl shadow-lg p-2 text-[10px] active:bg-gray-50 transition-colors">▲</button>
                           <button onClick={() => moveBlock(idx, 'down')} className="bg-white border border-gray-100 rounded-xl shadow-lg p-2 text-[10px] active:bg-gray-50 transition-colors">▼</button>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4">
                           <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{block.type}</span>
                           <button onClick={() => removeBlock(block.id)} className="text-red-500 text-[10px] font-bold uppercase hover:underline">Remove Block</button>
                        </div>

                        {block.type === 'text' ? (
                          <textarea 
                            className="w-full p-4 bg-gray-50/50 border-0 rounded-2xl text-sm min-h-[150px] focus:ring-1 focus:ring-blue-100 font-medium leading-relaxed resize-none"
                            value={block.value}
                            placeholder="이곳에 내용을 입력하세요..."
                            onChange={e => updateBlockValue(block.id, e.target.value)}
                          />
                        ) : (
                          <div className="space-y-3">
                            {block.value ? (
                              <div className="relative rounded-2xl overflow-hidden border border-gray-100 group/img">
                                <img src={block.value} alt="content" className="w-full object-cover max-h-80" />
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                                  <span className="text-white text-[10px] font-black uppercase tracking-widest">Replace Photo</span>
                                  <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, block.id)} />
                                </label>
                              </div>
                            ) : (
                              <label className="w-full aspect-video border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer bg-gray-50 hover:bg-white hover:border-blue-100 transition-all">
                                <span className="text-3xl mb-2 text-blue-600">+</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">Select Image File</span>
                                <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, block.id)} />
                              </label>
                            )}
                          </div>
                        )}
                     </div>
                   ))}
                </div>

                {/* Add Block Floating Bar */}
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[85%] max-w-sm grid grid-cols-2 gap-3 bg-white/90 backdrop-blur-xl p-3 rounded-[32px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-30">
                   <button 
                    onClick={() => addBlock('text')}
                    className="bg-white border border-gray-100 text-gray-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all"
                   >
                     <span className="text-blue-600 text-lg">📝</span> Add Text
                   </button>
                   <button 
                    onClick={() => addBlock('image')}
                    className="bg-white border border-gray-100 text-gray-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all"
                   >
                     <span className="text-blue-600 text-lg">🖼️</span> Add Photo
                   </button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'surveys' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-blue-600 tracking-widest uppercase">Hotel Survey Data ({state.survey1.length})</h3>
              <div className="flex gap-2">
                <button onClick={downloadSurveysExcel} className="text-[10px] font-black text-white bg-blue-600 px-4 py-2 rounded-full uppercase shadow-lg shadow-blue-100 active:scale-95 transition-all">Export Excel</button>
                <button onClick={clearSurveys} className="text-[10px] font-black text-red-500 bg-red-50 px-4 py-2 rounded-full uppercase active:scale-95 transition-all">Clear All</button>
              </div>
            </div>

            {state.survey1.length === 0 ? (
              <div className="text-center py-32 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm font-black uppercase tracking-widest">No survey data yet</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {state.survey1.map((s, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-gray-50 text-gray-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Room {s.room}</span>
                      <span className="text-[10px] font-black text-blue-600 uppercase">Student: {s.initials}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-2xl">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Guests</p>
                        <p className="text-lg font-black">{s.guests} 명</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-2xl">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Rooms Required</p>
                        <p className="text-lg font-black">{s.count} 개</p>
                      </div>
                    </div>
                    {s.notes && (
                      <div className="pt-3 border-t border-gray-50">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Special Notes</p>
                        <p className="text-xs text-gray-600 font-medium">{s.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'data' && (
          <div className="space-y-6">
            <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">📥</span>
                <div>
                  <h3 className="text-lg font-black text-gray-900">1. 양식 다운로드</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Download Template</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                식단표와 일정표를 일괄 업로드하기 위한 Excel 양식을 다운로드합니다.<br/>
                <span className="text-blue-600 font-bold">* Events 시트:</span> 일정 (날짜, 제목, 장소 등)<br/>
                <span className="text-orange-600 font-bold">* Meals 시트:</span> 식단 (날짜, 메뉴, 알러지 정보 등)
              </p>
              <button 
                onClick={downloadExcelTemplate}
                className="w-full bg-gray-50 text-gray-900 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest border border-gray-100 shadow-sm hover:bg-white active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                💾 양식 파일 다운로드 (.xlsx)
              </button>
            </section>

            <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">📤</span>
                <div>
                  <h3 className="text-lg font-black text-gray-900">2. 데이터 업로드</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Upload Completed File</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                작성이 완료된 엑셀 파일을 선택하여 시스템에 반영합니다.<br/>
                <span className="text-red-500 font-bold">* 주의:</span> 업로드 시 기존의 모든 식단 및 일정 데이터가 교체됩니다.
              </p>
              <label className="block w-full bg-blue-600 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest text-center cursor-pointer shadow-xl shadow-blue-100 active:scale-95 transition-all">
                엑셀 파일 선택 & 업로드
                <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleExcelUpload} />
              </label>
            </section>
          </div>
        )}

        {tab === 'faq' && (
          <div className="space-y-4">
             <div className="flex justify-between items-center mb-2">
                <h3 className="text-[10px] font-black text-blue-600 tracking-widest uppercase">FAQ Database</h3>
                <span className="text-[10px] font-bold text-gray-300 uppercase">{state.faqs.length} Items</span>
             </div>
             {state.faqs.map(faq => (
               <div key={faq.id} className="bg-white p-5 rounded-[24px] border border-gray-100 flex justify-between items-center shadow-sm group">
                  <div className="pr-4">
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">{faq.category}</p>
                    <p className="text-sm font-black text-gray-900 leading-snug">{faq.question}</p>
                  </div>
                  <button className="text-[10px] font-black text-gray-300 uppercase group-hover:text-blue-600">Edit</button>
               </div>
             ))}
             <button className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest mt-6 shadow-xl shadow-gray-200 active:scale-95 transition-all">+ Add New FAQ</button>
          </div>
        )}

        {tab === 'reports' && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-blue-600 tracking-widest uppercase mb-4">Inbox ({state.reports.length})</h3>
            {state.reports.length === 0 ? (
              <div className="text-center py-32 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm font-black uppercase tracking-widest">No reports received yet</p>
              </div>
            ) : (
              state.reports.map(r => (
                <div key={r.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100">{r.category}</span>
                    <span className="text-[9px] text-gray-300 font-bold">{r.timestamp}</span>
                  </div>
                  <h4 className="font-black text-gray-900 text-base mb-2">{r.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6 font-medium">{r.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Room {r.roomNumber} · {r.name}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Menu Editing Modal */}
      {editingMenu && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[48px] w-full max-w-sm p-10 shadow-[0_30px_100px_rgba(0,0,0,0.15)] border border-gray-100 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
            <h4 className="text-2xl font-black text-gray-900">{editingMenu.id ? 'Edit Category' : 'New Category'}</h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Unique ID (URL)</label>
                <input 
                  placeholder="e.g. laundry" 
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold" 
                  value={editingMenu.id} 
                  disabled={!!state.serviceMenus.find(m => m.id === editingMenu.id && editingMenu.id !== '')}
                  onChange={e => setEditingMenu({...editingMenu, id: e.target.value.toLowerCase().replace(/\s/g, '-')})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Korean Title</label>
                <input placeholder="청소 안내" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold" value={editingMenu.title} onChange={e => setEditingMenu({...editingMenu, title: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">English Title</label>
                <input placeholder="Cleaning Guide" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold" value={editingMenu.title_en} onChange={e => setEditingMenu({...editingMenu, title_en: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Icon</label>
                  <input placeholder="🧹" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center text-xl" value={editingMenu.icon} onChange={e => setEditingMenu({...editingMenu, icon: e.target.value})} />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Short Description</label>
                  <input placeholder="Weekly info" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium" value={editingMenu.desc} onChange={e => setEditingMenu({...editingMenu, desc: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-6">
              <button onClick={() => setEditingMenu(null)} className="flex-1 text-gray-400 text-xs font-black uppercase tracking-widest py-5">Cancel</button>
              <button onClick={() => saveMenu(editingMenu)} className="flex-1 bg-blue-600 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all">Save Change</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
