
import { AppState } from './types';

export const INITIAL_STATE: AppState = {
  headerLine1: 'WELCOME',
  headerLine2: 'SKE 197',
  termName: '2026 Winter Term (8주 과정)',
  noticeMessage: '셔틀 버스 시간이 변경되었습니다. 공지사항을 확인해 주세요.',
  hallAddress: '여호와의증인의 김포대회회관: 경기 김포시 통진읍 옹달샘로81번길 114',
  gimpoIntro: '김포시는 아름다운 자연경관과 유서 깊은 역사를 자랑하는 도시입니다. 평화로운 분위기 속에서 휴식과 탐방을 즐겨보세요.',
  emergencyText: '119 – Fire/Ambulance\n112 – Police',
  adminEmail: 'admin@gimpohall.org',
  events: [],
  meals: [],
  faqs: [
    { id: '1', category: 'General', question: '셔틀버스는 언제 운행하나요?', answer: '셔틀버스는 매주 월요일 오전 9시에 운행합니다.', order: 0 }
  ],
  staff: [
    { id: '1', name: '홍길동', role: '시설 관리', phone: '010-1234-5678', email: 'hong@example.com' }
  ],
  reports: [],
  serviceMenus: [
    /* Add title_en to satisfy ServiceMenu interface */
    { id: 'cleaning', title: '청소', title_en: 'Cleaning', icon: '🧹', desc: 'Weekly cleaning schedule' },
    { id: 'laundry', title: '세탁', title_en: 'Laundry', icon: '🧺', desc: 'Washing & Drying rules' },
    { id: 'salon', title: '미용', title_en: 'Salon', icon: '💇‍♂️', desc: 'Haircut appointments' },
    { id: 'shoe', title: '구두', title_en: 'Shoe Care', icon: '👞', desc: 'Polishing service' },
    { id: 'photo', title: '사진촬영', title_en: 'Photo', icon: '📸', desc: 'Graduation photoshoot' },
    { id: 'dry-cleaning', title: '드라이클리닝', title_en: 'Dry Cleaning', icon: '👔', desc: 'External cleaning service' },
  ],
  contentPages: {
    'cleaning': { 
      title: '청소 (Cleaning)', 
      blocks: [
        { id: 'c1', type: 'text', value: '청소는 매주 수요일 오전에 진행됩니다. 쾌적한 환경을 위해 협조 부탁드립니다.' }
      ]
    },
    'laundry': { 
      title: '세탁 (Laundry)', 
      blocks: [
        { id: 'l1', type: 'text', value: '세탁물은 바구니에 담아 정해진 시간에 내놓아 주세요.' }
      ]
    },
    'salon': { 
      title: '미용 (Salon)', 
      blocks: [
        { id: 's1', type: 'text', value: '예약된 날짜에 맞춰 방문해 주세요. 전문 미용 봉사자가 여러분을 기다립니다.' }
      ]
    },
    'shoe': { 
      title: '구두 (Shoe Care)', 
      blocks: [
        { id: 'sh1', type: 'text', value: '구두 손질 서비스 안내입니다.' }
      ]
    },
    'photo': { 
      title: '사진촬영 (Photo)', 
      blocks: [
        { id: 'p1', type: 'text', value: '졸업 사진 촬영 일정 안내입니다. 정해진 복장을 준비해 주세요.' }
      ]
    },
    'dry-cleaning': { 
      title: '드라이클리닝 (Dry Cleaning)', 
      blocks: [
        { id: 'dc1', type: 'text', value: '외부 업체를 통한 드라이클리닝 서비스 안내입니다.' }
      ]
    },
    'graduation-invite': { 
      title: 'Graduation Invitation', 
      blocks: [
        { id: 'gi1', type: 'text', value: '여러분을 졸업식에 초대합니다.' }
      ]
    },
    'shuttle-bus': { 
      title: 'Shuttle Bus Info', 
      blocks: [
        { id: 'sb1', type: 'text', value: '셔틀 버스 노선도 안내입니다.' }
      ]
    }
  },
  survey1: [],
  survey2: []
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
