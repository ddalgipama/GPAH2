
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
  contentPages: {
    'cleaning': { title: '청소 (Cleaning)', content: '청소는 매주 수요일 오전에 진행됩니다.' },
    'laundry': { title: '세탁 (Laundry)', content: '세탁물은 바구니에 담아 내놓아 주세요.' },
    'salon': { title: '미용 (Salon)', content: '예약된 날짜에 맞춰 방문해 주세요.' },
    'shoe': { title: '구두 (Shoe Care)', content: '구두 손질 서비스 안내입니다.' },
    'photo': { title: '사진촬영 (Photo)', content: '졸업 사진 촬영 일정 안내입니다.' },
    'dry-cleaning': { title: '드라이클리닝 (Dry Cleaning)', content: '외부 업체를 통한 드라이클리닝 안내입니다.' },
    'graduation-invite': { title: 'Graduation Invitation', content: '여러분을 초대합니다.' },
    'shuttle-bus': { title: 'Shuttle Bus Info', content: '셔틀 버스 노선도 안내입니다.' }
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

export const MY_MAPS_URL = "https://www.google.com/maps/d/u/0/embed?mid=1vX693-O84L7K9K-z6S9j6f_K4oY"; // Placeholder MyMaps
