
import React, { useState } from 'react';
import { AppState, FAQItem, FAQCategory, StaffContact, Event, Meal, ContentPage, ContentBlock, ServiceMenu, GradSubmenu, Report } from '../types';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ state, updateState, onLogout }) => {
  const [tab, setTab] = useState<'content' | 'hall' | 'services' | 'graduation' | 'surveys' | 'data' | 'faq' | 'reports' | 'staff'>('content');
  const [editingService, setEditingService] = useState<string | null>(null);
  const [isManagingMenus, setIsManagingMenus] = useState(false);
  const [editingMenu, setEditingMenu] = useState<ServiceMenu | GradSubmenu | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<FAQCategory | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffContact | null>(null);

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
        alert('엑셀 파일 형식이 올바르지 않습니다.');
      }
    };
    reader.readAsBinaryString(file as Blob);
  };

  const downloadExcelTemplate = () => {
    const wb = (window as any).XLSX.utils.book_new();
    const eventsData = [['date', 'title_ko', 'title_en', 'type', 'time', 'location', 'description_ko', 'description_en']];
    const wsEvents = (window as any).XLSX.utils.aoa_to_sheet(eventsData);
    (window as any).XLSX.utils.book_append_sheet(wb, wsEvents, "Events");
    const mealsData = [['date', 'meal', 'order', 'menu_ko', 'menu_en', 'spicy', 'seafood', 'peanut', 'wheat']];
    const wsMeals = (window as any).XLSX.utils.aoa_to_sheet(mealsData);
    (window as any).XLSX.utils.book_append_sheet(wb, wsMeals, "Meals");
    (window as any).XLSX.writeFile(wb, "GimpoHall_Data_Template.xlsx");
  };

  const downloadSurveysExcel = () => {
    if (!state.survey1.length) return alert('데이터가 없습니다.');
    const ws = (window as any).XLSX.utils.json_to_sheet(state.survey1);
    const wb = (window as any).XLSX.utils.book_new();
    (window as any).XLSX.utils.book_append_sheet(wb, ws, "Surveys");
    (window as any).XLSX.writeFile(wb, "Graduation_Hotel_Surveys.xlsx");
  };

  const downloadReportsExcel = () => {
    if (!state.reports.length) return alert('데이터가 없습니다.');
    const ws = (window as any).XLSX.utils.json_to_sheet(state.reports);
    const wb = (window as any).XLSX.utils.book_new();
    (window as any).XLSX.utils.book_append_sheet(wb, ws, "Reports");
    (window as any).XLSX.writeFile(wb, "Inquiry_Reports.xlsx");
  };

  const toggleReportCheck = (id: string) => {
    const updated = state.reports.map(r => r.id === id ? { ...r, checked: !r.checked } : r);
    updateState({ reports: updated });
  };

  const saveMenu = (menu: ServiceMenu | GradSubmenu) => {
    const targetKey = tab === 'services' ? 'serviceMenus' : 'gradSubmenus';
    const list = (state as any)[targetKey] as any[];
    const exists = list.some(m => m.id === menu.id);
    let newList = exists ? list.map(m => m.id === menu.id ? menu : m) : [...list, menu];
    
    const updatedPages = { ...state.contentPages };
    if (!updatedPages[menu.id]) updatedPages[menu.id] = { title: menu.title, blocks: [] };
    else updatedPages[menu.id].title = menu.title;

    updateState({ [targetKey]: newList, contentPages: updatedPages });
    setEditingMenu(null);
  };

  const addBlock = (type: 'text' | 'image') => {
    if (!editingService) return;
    const page = state.contentPages[editingService];
    const newBlock: ContentBlock = { id: Date.now().toString(), type, value: '' };
    const updated = [...(page.blocks || []), newBlock];
    updateState({ contentPages: { ...state.contentPages, [editingService]: { ...page, blocks: updated } } });
  };

  const updateBlockValue = (blockId: string, newValue: string) => {
    if (!editingService) return;
    const page = state.contentPages[editingService];
    const updated = page.blocks.map(b => b.id === blockId ? { ...b, value: newValue } : b);
    updateState({ contentPages: { ...state.contentPages, [editingService]: { ...page, blocks: updated } } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <header className="bg-white p-6 border-b flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-black text-2xl tracking-tight text-gray-900">Admin</h1>
        <button onClick={onLogout} className="text-[10px] font-black text-gray-400 border border-gray-100 px-4 py-2 rounded-full uppercase tracking-widest hover:bg-gray-50">Logout</button>
      </header>

      <div className="flex bg-white border-b overflow-x-auto no-scrollbar px-2 sticky top-[81px] z-40">
        {['content', 'hall', 'services', 'graduation', 'surveys', 'data', 'faq', 'reports', 'staff'].map(t => (
          <button key={t} onClick={() => { setTab(t as any); setEditingService(null); setIsManagingMenus(false); }}
            className={`py-4 px-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${tab === t ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-300 hover:text-gray-600'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="p-6 flex-1 overflow-y-auto pb-32 no-scrollbar">
        {tab === 'content' && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Home Page</h3>
            <div className="grid gap-4 bg-white p-6 rounded-[32px] border border-gray-100">
              <div><label className="text-[10px] font-black text-gray-400 uppercase">Line 1</label><input className="w-full p-4 bg-gray-50 rounded-2xl text-sm" value={state.headerLine1} onChange={e => updateState({ headerLine1: e.target.value })} /></div>
              <div><label className="text-[10px] font-black text-gray-400 uppercase">Line 2</label><input className="w-full p-4 bg-gray-50 rounded-2xl text-sm" value={state.headerLine2} onChange={e => updateState({ headerLine2: e.target.value })} /></div>
              <div><label className="text-[10px] font-black text-gray-400 uppercase">Notice Message</label><textarea className="w-full p-4 bg-gray-50 rounded-2xl text-sm min-h-[100px]" value={state.noticeMessage} onChange={e => updateState({ noticeMessage: e.target.value })} /></div>
            </div>
          </div>
        )}

        {tab === 'hall' && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Hall Information</h3>
            <div className="grid gap-4 bg-white p-6 rounded-[32px] border border-gray-100">
              <div><label className="text-[10px] font-black text-gray-400 uppercase">Address</label><input className="w-full p-4 bg-gray-50 rounded-2xl text-sm" value={state.hallAddress} onChange={e => updateState({ hallAddress: e.target.value })} /></div>
              <div><label className="text-[10px] font-black text-gray-400 uppercase">Complex Map Iframe URL</label><input className="w-full p-4 bg-gray-50 rounded-2xl text-sm" value={state.complexMapUrl} onChange={e => updateState({ complexMapUrl: e.target.value })} /></div>
              <div><label className="text-[10px] font-black text-gray-400 uppercase">Nearby Map Iframe URL</label><input className="w-full p-4 bg-gray-50 rounded-2xl text-sm" value={state.nearbyMapUrl} onChange={e => updateState({ nearbyMapUrl: e.target.value })} /></div>
              <div><label className="text-[10px] font-black text-gray-400 uppercase">Area Map Iframe URL</label><input className="w-full p-4 bg-gray-50 rounded-2xl text-sm" value={state.areaMapUrl} onChange={e => updateState({ areaMapUrl: e.target.value })} /></div>
              <div><label className="text-[10px] font-black text-gray-400 uppercase">Transportation Info</label><textarea className="w-full p-4 bg-gray-50 rounded-2xl text-sm min-h-[100px]" value={state.transportationInfo} onChange={e => updateState({ transportationInfo: e.target.value })} /></div>
            </div>
          </div>
        )}

        {editingService ? (
          <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center sticky top-[-24px] bg-white/95 backdrop-blur-md py-4 z-20 border-b border-gray-100 mb-4 px-2">
              <h3 className="font-black text-gray-900 text-sm">{state.contentPages[editingService]?.title}</h3>
              <button onClick={() => setEditingService(null)} className="text-[10px] font-black text-blue-600 border border-blue-100 px-5 py-2.5 rounded-full uppercase bg-blue-50/50">Save & Close</button>
            </div>
            <div className="space-y-6 pt-2">
              {state.contentPages[editingService]?.blocks?.map((block) => (
                <div key={block.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative group">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{block.type}</span>
                  </div>
                  {block.type === 'text' ? (
                    <textarea className="w-full p-4 bg-gray-50/50 border-0 rounded-2xl text-sm min-h-[150px]" value={block.value} onChange={e => updateBlockValue(block.id, e.target.value)} />
                  ) : (
                    <div className="bg-gray-50 p-10 rounded-2xl text-center text-xs text-gray-400">Image Upload Not Fully Functional in Demo</div>
                  )}
                </div>
              ))}
            </div>
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[85%] max-w-sm grid grid-cols-2 gap-3 z-30">
              <button onClick={() => addBlock('text')} className="bg-white border border-gray-100 text-gray-900 py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl">Add Text</button>
              <button onClick={() => addBlock('image')} className="bg-white border border-gray-100 text-gray-900 py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl">Add Photo</button>
            </div>
          </div>
        ) : (
          <>
            {tab === 'services' && (
              <div className="space-y-4">
                {state.serviceMenus.map(menu => (
                  <button key={menu.id} onClick={() => setEditingService(menu.id)} className="w-full bg-white p-6 rounded-[32px] border border-gray-100 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4"><span className="text-3xl">{menu.icon}</span><div className="text-left"><p className="font-black text-gray-900">{menu.title}</p></div></div>
                    <span className="text-blue-600">➔</span>
                  </button>
                ))}
              </div>
            )}
            {tab === 'graduation' && (
              <div className="space-y-4">
                <button onClick={() => setIsManagingMenus(true)} className="w-full bg-blue-50 text-blue-600 py-4 rounded-2xl font-black text-[10px] uppercase border border-blue-100">Manage Submenus</button>
                {state.gradSubmenus.map(menu => (
                  <button key={menu.id} onClick={() => setEditingService(menu.id)} className="w-full bg-white p-6 rounded-[32px] border border-gray-100 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4"><span className="text-3xl">{menu.icon}</span><div className="text-left"><p className="font-black text-gray-900">{menu.title}</p></div></div>
                    <span className="text-blue-600">➔</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'reports' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-blue-600 uppercase">Inquiries</h3>
              <button onClick={downloadReportsExcel} className="text-[10px] font-black bg-blue-600 text-white px-4 py-2 rounded-full uppercase">Export Excel</button>
            </div>
            {state.reports.map(r => (
              <div key={r.id} className={`bg-white p-6 rounded-[32px] border shadow-sm ${r.checked ? 'opacity-50 border-gray-100' : 'border-blue-100'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase text-blue-600">{r.category}</span>
                  <input type="checkbox" checked={!!r.checked} onChange={() => toggleReportCheck(r.id)} className="w-5 h-5" />
                </div>
                <h4 className="font-black text-gray-900">{r.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{r.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-50 text-[10px] font-bold text-gray-400">Room {r.roomNumber} · {r.name} · {r.timestamp}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'data' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center">
              <h3 className="text-lg font-black mb-4">Template Download</h3>
              <button onClick={downloadExcelTemplate} className="w-full bg-gray-50 py-5 rounded-2xl font-black text-xs uppercase border border-gray-100">Download .xlsx Template</button>
            </div>
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center">
              <h3 className="text-lg font-black mb-4">Upload Data</h3>
              <label className="block w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase cursor-pointer">
                Select & Upload Excel
                <input type="file" className="hidden" accept=".xlsx" onChange={handleExcelUpload} />
              </label>
            </div>
          </div>
        )}

        {tab === 'surveys' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-blue-600 uppercase">Hotel Surveys</h3>
              <button onClick={downloadSurveysExcel} className="text-[10px] font-black bg-blue-600 text-white px-4 py-2 rounded-full uppercase">Export Excel</button>
            </div>
            {state.survey1.length === 0 ? <p className="text-center py-20 text-gray-400">No data</p> : (
              state.survey1.map((s, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                  <div className="flex justify-between font-black text-[10px] text-gray-400 mb-2"><span>Room {s.room}</span><span>Student: {s.initials}</span></div>
                  <div className="text-sm font-bold">Guests: {s.guests} 명 / Rooms: {s.count} 개</div>
                  {s.notes && <div className="mt-2 text-[10px] text-gray-500 italic">{s.notes}</div>}
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'faq' && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-blue-600 uppercase">FAQ Management</h3>
            {state.faqCategories.map(cat => (
              <div key={cat.id} className="bg-white p-6 rounded-[32px] border border-gray-100">
                <div className="flex justify-between mb-4"><h4 className="font-black text-sm">{cat.name}</h4><button className="text-[9px] font-black text-red-500 uppercase">Del</button></div>
                <div className="space-y-2">
                  {state.faqs.filter(f => f.category === cat.name).map(f => (
                    <div key={f.id} className="text-xs p-3 bg-gray-50 rounded-xl flex justify-between"><span>{f.question}</span><button className="text-blue-600">Edit</button></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'staff' && (
          <div className="space-y-6">
             <h3 className="text-[10px] font-black text-blue-600 uppercase">Emergency Numbers</h3>
             <textarea className="w-full p-4 bg-white border border-gray-100 rounded-[32px] text-sm font-bold min-h-[100px]" value={state.emergencyText} onChange={e => updateState({ emergencyText: e.target.value })} />
             <h3 className="text-[10px] font-black text-blue-600 uppercase mt-8">Staff Contact</h3>
             <div className="space-y-4">
               {state.staff.map(s => (
                 <div key={s.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex justify-between items-center">
                   <div><p className="font-black text-sm">{s.name}</p><p className="text-[10px] text-gray-400 font-bold uppercase">{s.role}</p></div>
                   <button className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-4 py-2 rounded-full">Edit</button>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>

      {isManagingMenus && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] p-10 overflow-y-auto">
          <div className="max-w-sm mx-auto">
            <h2 className="text-xl font-black mb-8">Graduation Submenus</h2>
            <div className="space-y-4">
              {state.gradSubmenus.map(m => (
                <div key={m.id} className="bg-white p-4 rounded-2xl border flex justify-between items-center">
                  <span className="font-bold">{m.title}</span>
                  <div className="flex gap-2"><button className="text-[9px] font-black text-red-500">Del</button></div>
                </div>
              ))}
              <button onClick={() => setIsManagingMenus(false)} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black mt-10">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
