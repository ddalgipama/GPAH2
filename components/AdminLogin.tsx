
import React, { useState } from 'react';

interface Props {
  onLogin: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<Props> = ({ onLogin, onBack }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const correctPin = localStorage.getItem('gimpo_admin_pin') || '1111';

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === correctPin) {
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
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between p-8 text-gray-900">
      <div className="w-full flex justify-end">
        <button onClick={onBack} className="p-2 text-gray-400 text-xl font-light active:scale-90 transition-transform">✕</button>
      </div>
      
      <div className="flex flex-col items-center w-full max-w-xs">
        <div className="text-center mb-10">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-xl font-black mb-1">관리자 모드</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Admin Access</p>
        </div>

        {/* PIN Indicators */}
        <div className="flex gap-5 mb-12">
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                pin.length >= i 
                  ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-100' 
                  : 'border-gray-200 bg-gray-50'
              } ${error ? 'border-red-500 bg-red-500' : ''}`}
            />
          ))}
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
      </div>

      <div className="pb-6">
        <button className="text-[10px] text-gray-300 uppercase tracking-widest font-black">Authorized Personnel Only</button>
      </div>
    </div>
  );
};

export default AdminLogin;
