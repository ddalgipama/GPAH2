
import React from 'react';
import { AppState } from '../types';

interface Props {
  state: AppState;
  onBack: () => void;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1,
  color: "#4b6aff",
  marginBottom: 8,
};

const labelChipStyle: React.CSSProperties = {
  display: "inline-block",
  fontSize: 11,
  padding: "2px 8px",
  borderRadius: 999,
  backgroundColor: "#f3f4ff",
  color: "#4b6aff",
  marginRight: 6,
  marginBottom: 4,
};

const highlightPhraseStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  margin: "4px 0 2px",
};

const GimpoHall: React.FC<Props> = ({ state, onBack }) => {
  const busItems = state.transportItems.filter(item => item.category === 'BUS');
  const taxiItems = state.transportItems.filter(item => item.category === 'TAXI');
  const otherItems = state.transportItems.filter(item => item.category === 'OTHER');

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20 overflow-y-auto no-scrollbar">
      {/* Header Sticky Container */}
      <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
        <button onClick={onBack} className="p-2 text-blue-600 font-medium flex items-center bg-blue-50 px-3 rounded-xl tap-active transition-all">
          <span className="mr-1">←</span> Back
        </button>
        <h1 className="text-lg font-bold">Gimpo Hall</h1>
        <div className="w-10"></div>
      </header>

      <div style={{ padding: 16, paddingBottom: 32 }}>
        {/* 페이지 타이틀 */}
        <header style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>김포대회회관 소개</h1>
          <p style={{ fontSize: 12, color: "#666" }}>
            Gimpo Assembly Hall
          </p>
        </header>

        {/* 1. 주소 */}
        <section style={cardStyle}>
          <div style={sectionTitleStyle}>ADDRESS · 여호와의 증인 김포대회회관</div>
          <p style={{ fontSize: 14, lineHeight: 1.5 }}>
            경기 김포시 통진읍 옹달샘로81번길 114
          </p>
        </section>

        {/* 2. 단지 지도 */}
        <section style={cardStyle}>
          <div style={sectionTitleStyle}>HALL COMPLEX MAP</div>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
            Check the layout of the hall complex.
          </p>
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid #eee",
              backgroundColor: '#f9f9f9',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {state.complexMapUrl ? (
              <img
                src={state.complexMapUrl}
                alt="Hall Complex Map"
                style={{ width: "100%", display: "block" }}
              />
            ) : (
              <p className="text-gray-300 text-xs font-bold uppercase tracking-widest">No Map Uploaded</p>
            )}
          </div>
        </section>

        {/* 3. 근처 시설 & 왕국회관 */}
        <section style={cardStyle}>
          <div style={sectionTitleStyle}>NEARBY FACILITIES & KINGDOM HALLS</div>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
            Convenience stores and Kingdom Halls nearby.
          </p>
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid #eee",
            }}
          >
            {state.nearbyMapUrl ? (
               <iframe
                src={state.nearbyMapUrl}
                width="100%"
                height="260"
                loading="lazy"
                style={{ border: 0, display: "block" }}
                referrerPolicy="no-referrer-when-downgrade"
                title="Nearby Map"
              />
            ) : (
               <div className="h-[260px] bg-gray-50 flex items-center justify-center text-gray-300 font-bold uppercase text-[10px]">No Map Linked</div>
            )}
          </div>
        </section>

        {/* 4. 교통 안내 (동적 렌더링) */}
        <section style={cardStyle}>
          <div style={sectionTitleStyle}>TRANSPORTATION</div>

          {/* 버스 */}
          {busItems.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <span style={labelChipStyle}>BUS</span>
              <div className="space-y-2 mt-2">
                {busItems.map(bus => (
                  <div key={bus.id} className="flex items-center gap-2">
                    <span 
                      style={{ backgroundColor: bus.color || '#2563eb' }}
                      className="text-white text-[10px] px-2 py-0.5 rounded font-black"
                    >
                      {bus.label}
                    </span>
                    <span className="text-[13px] font-bold">{bus.title} ({bus.duration})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 택시 */}
          {taxiItems.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <span style={labelChipStyle}>TAXI</span>
              <ul
                style={{
                  margin: "6px 0 0",
                  paddingLeft: 16,
                  fontSize: 13,
                  lineHeight: 1.5,
                  listStyleType: 'disc'
                }}
              >
                {taxiItems.map(taxi => (
                  <li key={taxi.id}>
                    <strong>{taxi.title}:</strong> {taxi.duration}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 기타 */}
          {otherItems.length > 0 && (
            <div>
              <span style={labelChipStyle}>OTHER</span>
              <div className="space-y-1 mt-2">
                {otherItems.map(item => (
                  <p key={item.id} className="text-[13px] font-bold text-gray-700">
                    {item.label}: {item.title} ({item.duration})
                  </p>
                ))}
              </div>
            </div>
          )}

          {state.transportItems.length === 0 && (
             <p className="text-center text-gray-300 text-[10px] font-bold py-4 uppercase tracking-widest">No transport info added</p>
          )}
        </section>

        {/* 5. 필수 표현 */}
        <section style={cardStyle}>
          <div style={sectionTitleStyle}>ESSENTIAL KOREAN PHRASES</div>
          {state.essentialPhrases.map((phrase) => (
            <div
              key={phrase.id}
              style={{
                marginTop: 8,
                marginBottom: 16,
                padding: 12,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${phrase.color || 'rgba(75,106,255,0.08)'}, rgba(0,0,0,0))`,
              }}
            >
              <div style={{ fontSize: 11, color: "#555", fontWeight: 'bold' }}>
                {phrase.description_en}
              </div>
              <div style={highlightPhraseStyle}>{phrase.text_ko}</div>
              <div style={{ fontSize: 12, color: "#4b6aff", fontWeight: '700' }}>
                [ {phrase.pronunciation} ]
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default GimpoHall;
