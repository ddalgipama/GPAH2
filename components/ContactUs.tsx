
import React, { useState } from 'react';
import { AppState, Report } from '../types';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onBack: () => void;
}

const ContactUs: React.FC<Props> = ({ state, updateState, onBack }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    name: '',
    category: 'room issue',
    title: '',
    description: '',
    email: '',
    replyMethod: 'email'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: Report = {
      id: Date.now().toString(),
      ...formData,
      timestamp: new Date().toLocaleString()
    };
    updateState({ reports: [newReport, ...state.reports] });
    alert('제출되었습니다. 감사합니다!');
    setFormData({
      roomNumber: '',
      name: '',
      category: 'room issue',
      title: '',
      description: '',
      email: '',
      replyMethod: 'email'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-y-auto no-scrollbar">
      <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
        <button onClick={onBack} className="p-2 text-blue-600 font-medium">← Back</button>
        <h1 className="text-lg font-bold">Contact Us</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6 space-y-8">
        {/* Staff Contact */}
        <section>
          <h2 className="text-xs font-black text-blue-600 tracking-widest uppercase mb-4">Staff Contact</h2>
          <div className="space-y-3">
            {state.staff.map(s => (
              <div key={s.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-sm font-black">{s.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{s.role}</p>
                </div>
                <div className="flex gap-3">
                  <a href={`tel:${s.phone}`} className="p-2 bg-blue-50 rounded-full text-blue-600">📞</a>
                  <a href={`mailto:${s.email}`} className="p-2 bg-gray-50 rounded-full text-gray-400">✉️</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency */}
        <section className="bg-red-600 p-6 rounded-3xl text-white shadow-xl shadow-red-100">
          <h2 className="text-xs font-black tracking-widest uppercase mb-2 opacity-70">Emergency (24/7)</h2>
          <pre className="font-bold text-lg leading-tight whitespace-pre-wrap">{state.emergencyText}</pre>
        </section>

        {/* Form */}
        <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <h2 className="text-xl font-black mb-6">Problem/Suggestion</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Room No.</label>
                <input required className="w-full p-3 bg-gray-50 border rounded-2xl text-sm" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Initials / Name</label>
                <input required className="w-full p-3 bg-gray-50 border rounded-2xl text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Category</label>
              <select className="w-full p-3 bg-gray-50 border rounded-2xl text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option>Room issue</option>
                <option>Facility</option>
                <option>Noise/Cleanliness</option>
                <option>Suggestion</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Title</label>
              <input required className="w-full p-3 bg-gray-50 border rounded-2xl text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Description</label>
              <textarea required className="w-full p-3 bg-gray-50 border rounded-2xl text-sm min-h-[120px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Photo Upload (Up to 3)</label>
              <input type="file" multiple className="text-[10px] text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-blue-50 file:text-blue-700" />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black shadow-lg shadow-blue-100 active:bg-blue-700 active:scale-[0.98] transition-all">
              Submit Report
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ContactUs;
