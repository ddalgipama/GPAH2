
import React, { useState } from 'react';
import { AppState } from '../types';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onLogin: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<Props> = ({ state, updateState, onLogin, onBack }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [resetFlow, setResetFlow] = useState<'none' | 'email' | 'new-pin'>('none');
  const [resetEmail, setResetEmail] = useState('');
  const [newPin, setNewPin] = useState('');

  const handlePress = (num: string) => {
    if (resetFlow === 'new-pin') {
      if (newPin.length < 4) {
        const p = newPin + num;
        setNewPin(p);
        if (p.length === 4) {
          updateState({ adminPin: p });
          alert('비밀번호가 성공적으로 변경되었습니다. (PIN has been reset.)');
          setNewPin('');
          setResetFlow('none');
          setPin('');
        }
      }
      return;
    }

    if (pin.length < 4) {
      const p = pin + num;
      setPin(p);
      if (p.length === 4) {
        if (p === state.adminPin) {
          // Clear notification on success login
          updateState({ hasNewReport: false });
          onLogin();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  const handleBack = () => {
    if (resetFlow === 'new-pin') {
      setNewPin(newPin.slice(0, -1));
    } else {
      setPin(pin.slice(0, -1));
    }
  };

  const handleEmailVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetEmail === state.adminEmail) {
      setResetFlow('new-pin');
    } else {
      alert('등록된 관리자 이메일과 일치하지 않습니다. (Email does not match.)');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between p-8 text-gray-900">
      <div className="w-full flex justify-end">
        <button onClick={onBack} className="p-2 text-gray-400 text-xl font-light active:scale-90 transition-transform">✕</button>
      </div>
      
      <div className="flex flex-col items-center w-full max-w-xs">
        {resetFlow === 'email' ? (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
              <h2 className="text-xl font-black mb-1">비밀번호 초기화</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Email Verification</p>
            </div>
            <form onSubmit={handleEmailVerify} className="space-y-4">
              <input 
                type="email" 
                required 
                className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold focus:ring-2 ring-blue-100 outline-none" 
                placeholder="Enter Admin Email" 
                value={resetEmail} 
                onChange={e => setResetEmail(e.target.value)} 
              />
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-lg shadow-blue-100 tap-active">Verify Email</button>
              <button type="button" onClick={() => setResetFlow('none')} className="w-full text-[10px] text-gray-400 font-bold uppercase py-2">Cancel</button>
            </form>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="text-4xl mb-4">🔐</div>
              <h2 className="text-xl font-black mb-1">
                {resetFlow === 'new-pin' ? '새 PIN 입력' : '관리자 모드'}
              </h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                {resetFlow === 'new-pin' ? 'Set New 4-Digit PIN' : 'Admin Access'}
              </p>
            </div>

            {/* PIN Indicators */}
            <div className="flex gap-5 mb-12">
              {[1, 2, 3, 4].map(i => {
                const len = resetFlow === 'new-pin' ? newPin.length : pin.length;
                return (
                  <div 
                    key={i} 
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                      len >= i 
                        ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-100' 
                        : 'border-gray-200 bg-gray-50'
                    } ${error ? 'border-red-500 bg-red-500' : ''}`}
                  />
                );
              })}
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-6 w-full">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button 
                  key={num} 
                  onClick={() => handlePress(num)}
                  className="aspect-square rounded-2xl bg-gray-50 text-xl font-bold text-gray-700 active:bg-blue-50 active:text-blue-600 active:scale-90 transition-all border border-transparent active:border-blue-100"
                >
                  {num}
                </button>
              ))}
              <div />
              <button 
                onClick={() => handlePress('0')} 
                className="aspect-square rounded-2xl bg-gray-50 text-xl font-bold text-gray-700 active:bg-blue-50 active:text-blue-600 active:scale-90 transition-all border border-transparent active:border-blue-100"
              >
                0
              </button>
              <button 
                onClick={handleBack} 
                className="aspect-square flex items-center justify-center text-lg text-gray-300 active:text-gray-600 active:scale-90 transition-all"
              >
                ⌫
              </button>
            </div>
            
            {resetFlow === 'none' && (
              <button 
                onClick={() => setResetFlow('email')} 
                className="mt-12 text-[10px] text-blue-600 font-black uppercase tracking-widest opacity-60 hover:opacity-100"
              >
                Forgot PIN?
              </button>
            )}
          </>
        )}
      </div>

      <div className="pb-6">
        <button className="text-[10px] text-gray-300 uppercase tracking-widest font-black">Authorized Personnel Only</button>
      </div>
    </div>
  );
};

export default AdminLogin;
