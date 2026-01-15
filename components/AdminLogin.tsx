
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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8 text-white">
      <button onClick={onBack} className="absolute top-10 left-6 text-gray-400 hover:text-white">✕ Close</button>
      
      <div className="text-center mb-12">
        <h2 className="text-2xl font-black mb-2">Admin Mode</h2>
        <p className="text-gray-500 text-sm">Enter PIN to access dashboard</p>
      </div>

      <div className="flex gap-4 mb-16">
        {[1, 2, 3, 4].map(i => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
              pin.length >= i 
                ? 'bg-blue-500 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                : 'border-gray-700'
            } ${error ? 'border-red-500 bg-red-500 animate-bounce' : ''}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8 max-w-[280px]">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
          <button 
            key={num} 
            onClick={() => handlePress(num)}
            className="w-16 h-16 rounded-full bg-gray-800 text-2xl font-bold active:bg-blue-600 active:scale-90 transition-all"
          >
            {num}
          </button>
        ))}
        <div />
        <button onClick={() => handlePress('0')} className="w-16 h-16 rounded-full bg-gray-800 text-2xl font-bold active:bg-blue-600 active:scale-90 transition-all">0</button>
        <button onClick={handleBack} className="w-16 h-16 rounded-full flex items-center justify-center text-xl text-gray-500 active:text-white">⌫</button>
      </div>

      <div className="mt-16 text-center">
        <button className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Forgot PIN? Contact Support</button>
      </div>
    </div>
  );
};

export default AdminLogin;
