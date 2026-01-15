
import React, { useState, useRef } from 'react';
import { AppState, Report } from '../types';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onBack: () => void;
}

const ContactUs: React.FC<Props> = ({ state, updateState, onBack }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    roomNumber: '',
    name: '',
    category: 'room issue',
    title: '',
    description: '',
    media: '',
    mediaType: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const b64 = evt.target?.result as string;
      setFormData({
        ...formData,
        media: b64,
        mediaType: file.type
      });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setFormData({ ...formData, media: '', mediaType: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: Report = {
      id: Date.now().toString(),
      ...formData,
      timestamp: new Date().toLocaleString(),
      checked: false
    };
    // Set hasNewReport: true to notify admin via Home icon
    updateState({ 
      reports: [newReport, ...state.reports],
      hasNewReport: true
    });
    setShowSuccess(true);
    setFormData({
      roomNumber: '',
      name: '',
      category: 'room issue',
      title: '',
      description: '',
      media: '',
      mediaType: ''
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-y-auto no-scrollbar">
      <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
        <button onClick={onBack} className="p-2 text-blue-600 font-medium flex items-center bg-blue-50 px-3 rounded-xl tap-active">
          <span className="mr-1">←</span> Back
        </button>
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
                  <a href={`tel:${s.phone}`} className="p-2 bg-blue-50 rounded-full text-blue-600 tap-active">📞</a>
                  <a href={`mailto:${s.email}`} className="p-2 bg-gray-50 rounded-full text-gray-400 tap-active">✉️</a>
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
              {/* Initials (Left) */}
              <div>
                <div className="flex flex-col mb-1 min-h-[30px] justify-end">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Initials</label>
                  <span className="text-[8px] text-red-500 font-bold lowercase leading-none mt-0.5">(Please Do NOT write your full name)</span>
                </div>
                <input required className="w-full p-3 bg-gray-50 border rounded-2xl text-sm font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. J.D." />
              </div>

              {/* Room No (Right) */}
              <div className="flex flex-col">
                <div className="mb-1 min-h-[30px] flex items-end">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Room No.</label>
                </div>
                <input required className="w-full p-3 bg-gray-50 border rounded-2xl text-sm font-bold" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} placeholder="e.g. 201" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Category</label>
              <select className="w-full p-3 bg-gray-50 border rounded-2xl text-sm font-bold" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option>Room issue</option>
                <option>Facility</option>
                <option>Noise/Cleanliness</option>
                <option>Suggestion</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Title</label>
              <input required className="w-full p-3 bg-gray-50 border rounded-2xl text-sm font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Description</label>
              <textarea required className="w-full p-3 bg-gray-50 border rounded-2xl text-sm min-h-[120px] font-medium" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            {/* Photo/Video Upload */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Attachment (Photo/Video)</label>
              <div className="space-y-3">
                {formData.media ? (
                  <div className="relative group">
                    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                      {formData.mediaType.startsWith('image/') ? (
                        <img src={formData.media} className="w-full h-full object-cover" alt="Attachment" />
                      ) : (
                        <video src={formData.media} className="w-full h-full object-cover" controls />
                      )}
                    </div>
                    <button 
                      type="button" 
                      onClick={removeMedia}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg tap-active"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-6 border-2 border-dashed border-gray-200 rounded-[28px] flex flex-col items-center justify-center gap-2 text-gray-400 active:bg-gray-50 active:border-blue-200 active:text-blue-500 transition-all tap-active"
                  >
                    <span className="text-2xl">{isUploading ? '⌛' : '📸'}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{isUploading ? 'Uploading...' : 'Add Photo or Video'}</span>
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*,video/*" 
                  onChange={handleFileChange} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isUploading}
              className={`w-full ${isUploading ? 'bg-gray-300' : 'bg-blue-600'} text-white py-5 rounded-3xl font-black shadow-lg shadow-blue-100 tap-active transition-all`}
            >
              {isUploading ? 'Please Wait...' : 'Submit Report'}
            </button>
          </form>
        </section>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] w-full max-w-xs p-8 flex flex-col items-center text-center shadow-2xl scale-in-center">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">✓</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">저장되었습니다.</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">Report Saved Successfully</p>
            <button onClick={() => setShowSuccess(false)} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-100 tap-active">확인</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;
