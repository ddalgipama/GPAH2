
import { AppState } from './types';

export const INITIAL_STATE: AppState = {
  headerLine1: 'WELCOME',
  headerLine2: 'SKE 197',
  termName: '2026 Winter Term (8주 과정)',
  noticeMessage: '셔틀 버스 시간이 변경되었습니다. 공지사항을 확인해 주세요.',
  noticeId: 'initial-notice',
  hallAddress: '경기 김포시 통진읍 옹달샘로81번길 114',
  complexMapUrl: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=1000",
  nearbyMapUrl: "https://www.google.com/maps/d/embed?mid=15aChfVbs5iIw_v60PqGnU-MyNf7xbA0&ehbc=2E312F",
  areaMapUrl: "https://www.google.com/maps/d/embed?mid=15aChfVbs5iIw_v60PqGnU-MyNf7xbA0&ehbc=2E312F",
  transportationInfo: "",
  transportItems: [
    { id: '1', category: 'BUS', label: 'No. 90', title: 'Gurae Station', duration: '30 min', color: '#2563eb' },
    { id: '2', category: 'BUS', label: 'No. 88', title: 'Sau Station · KH', duration: '50 min', color: '#16a34a' },
    { id: '3', category: 'TAXI', label: 'TAXI', title: 'Sau Station', duration: '20k KRW / 30m', color: '#f59e0b' },
    { id: '4', category: 'TAXI', label: 'TAXI', title: 'Gimpo Airport', duration: '30k KRW / 50m', color: '#f59e0b' },
    { id: '5', category: 'TAXI', label: 'TAXI', title: 'Incheon Airport', duration: '50k KRW / 70m', color: '#f59e0b' }
  ],
  emergencyText: '119 – Fire/Ambulance\n112 – Police',
  adminEmail: 'admin@gimpohall.org',
  adminPin: '1111',
  hasNewReport: false,
  events: [],
  meals: [],
  faqCategories: [
    { id: 'cat1', name: '숙소' },
    { id: 'cat2', name: '교통' },
    { id: 'cat3', name: '프로그램' }
  ],
  faqs: [
    { id: '1', category: '숙소', question: '셔틀버스는 언제 운행하나요?', answer: '셔틀버스는 매주 월요일 오전 9시에 운행합니다.', order: 0 }
  ],
  staff: [
    { id: '1', name: '홍길동', role: '시설 관리', phone: '010-1234-5678', email: 'hong@example.com' }
  ],
  reports: [],
  serviceMenus: [
    { id: 'cleaning', title: '청소', title_en: 'Cleaning', icon: '🧹', desc: 'Weekly cleaning schedule' },
    { id: 'laundry', title: '세탁', title_en: 'Laundry', icon: '🧺', desc: 'Washing & Drying rules' },
    { id: 'salon', title: '미용', title_en: 'Salon', icon: '💇‍♂️', desc: 'Haircut appointments' },
    { id: 'shoe', title: '구두', title_en: 'Shoe Care', icon: '👞', desc: 'Polishing service' },
    { id: 'photo', title: '사진촬영', title_en: 'Photo', icon: '📸', desc: 'Graduation photoshoot' },
    { id: 'trash', title: '쓰레기 분리수거', title_en: 'Recycling', icon: '♻️', desc: 'Waste separation guide' },
    { id: 'dry-cleaning', title: '드라이클리닝', title_en: 'Dry Cleaning', icon: '👔', desc: 'External cleaning service' },
  ],
  gradSubmenus: [
    { id: 'graduation-invite', title: '졸업식 초대장', title_en: 'Invitation', icon: '✉️', desc: 'Graduation Invitation', type: 'page' },
    { id: 'shuttle-bus', title: '셔틀버스 안내', title_en: 'Shuttle Info', icon: '🚌', desc: 'Bus routes', type: 'page' }
  ],
  contentPages: {
    'cleaning': { title: '청소 (Cleaning)', blocks: [{ id: 'c1', type: 'text', value: '청소는 매주 수요일 오전에 진행됩니다.' }] },
    'laundry': { title: '세탁 (Laundry)', blocks: [{ id: 'l1', type: 'text', value: '세탁물은 바구니에 담아 정해진 시간에 내놓아 주세요.' }] },
    'salon': { title: '미용 (Salon)', blocks: [{ id: 's1', type: 'text', value: '예약된 날짜에 맞춰 방문해 주세요.' }] },
    'shoe': { title: '구두 (Shoe Care)', blocks: [{ id: 'sh1', type: 'text', value: '구두 손질 서비스 안내입니다.' }] },
    'photo': { title: '사진촬영 (Photo)', blocks: [{ id: 'p1', type: 'text', value: '졸업 사진 촬영 일정 안내입니다.' }] },
    'trash': { title: '쓰레기 분리수거 (Recycling)', blocks: [{ id: 't1', type: 'text', value: '지정된 장소에 분리수거 지침에 따라 배출해 주세요.' }] },
    'dry-cleaning': { title: '드라이클리닝 (Dry Cleaning)', blocks: [{ id: 'dc1', type: 'text', value: '외부 업체를 통한 드라이클리닝 서비스 안내입니다.' }] },
    'graduation-invite': { title: '졸업식 초대장', blocks: [{ id: 'gi1', type: 'text', value: '여러분을 졸업식에 초대합니다.' }] },
    'shuttle-bus': { title: '셔틀버스 안내', blocks: [{ id: 'sb1', type: 'text', value: '셔틀 버스 노선도 안내입니다.' }] }
  },
  survey1: [],
  survey2: [],
  isSurvey2Open: false,
  essentialPhrases: [
    {
      id: '1',
      text_ko: '여기에 가주세요.',
      text_en: 'Please take me here.',
      pronunciation: 'Yeo-gi-e ga-ju-se-yo',
      description_en: 'Show the address to the taxi driver.',
      color: 'rgba(75,106,255,0.08)'
    },
    {
      id: '2',
      text_ko: '충전해 주세요.',
      text_en: 'Please charge this card.',
      pronunciation: 'Chung-jeon-hae ju-se-yo',
      description_en: 'Charge your card at the convenience store.',
      color: 'rgba(0,186,136,0.08)'
    }
  ],
  googleSheetUrl: "",
  gimpoIntro: "김포시는 유구한 역사와 문화를 간직한 도시로, 현대와 과거가 공존하는 매력적인 곳입니다. 아름다운 자연 경관과 다양한 즐길 거리가 가득한 김포에서 잊지 못할 추억을 만들어보세요.",
  noGraduationThisTerm: false,
  noGraduationMessage: "이번 기수는 졸업식이 없습니다."
};

export const EVENT_ICONS: Record<string, string> = {
  ARRIVAL: '🧳',
  OT: '🎤',
  CLEANING: '🧹',
  LAUNDRY: '🧺',
  SALON: '💇‍♂️',
  SHOE: '👞',
  PHOTO: '📸',
  GRADUATION: '🎓'
};

export const MY_MAPS_URL = "https://www.google.com/maps/d/embed?mid=15aChfVbs5iIw_v60PqGnU-MyNf7xbA0&ehbc=2E312F";
