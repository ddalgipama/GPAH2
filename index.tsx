
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// 글로벌 에러 캡처 (스크립트 로드 단계에서 발생할 수 있는 문제 확인)
window.onerror = function(message, source, lineno, colno, error) {
  const container = document.getElementById('root');
  if (container) {
    container.innerHTML = `
      <div style="padding: 20px; color: #cc0000; font-family: sans-serif; text-align: center; height: 100vh; display: flex; flex-direction: column; justify-content: center;">
        <h2 style="margin-bottom: 10px;">Critical Load Error</h2>
        <p style="font-size: 14px; color: #666; max-width: 300px; margin: 0 auto;">${message}</p>
        <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 12px; font-weight: bold;">Retry</button>
      </div>
    `;
  }
  return false;
};

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("React app initialized and rendered.");
  } catch (error) {
    console.error("Mounting error:", error);
    container.innerHTML = `
      <div style="padding: 20px; color: #cc0000; font-family: sans-serif; text-align: center; height: 100vh; display: flex; flex-direction: column; justify-content: center;">
        <h2 style="margin-bottom: 10px;">Runtime Error</h2>
        <p style="font-size: 14px; color: #666;">${error instanceof Error ? error.message : 'Unknown error'}</p>
        <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 12px; font-weight: bold;">Reload</button>
      </div>
    `;
  }
}
