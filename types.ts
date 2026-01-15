
export type AppView = 
  | 'home' 
  | 'gimpo-hall' 
  | 'dorm-services' 
  | 'meal-plan' 
  | 'calendar' 
  | 'graduation' 
  | 'faq' 
  | 'explore-gimpo' 
  | 'contact-us' 
  | 'admin-login' 
  | 'admin-dashboard'
  | 'dorm-detail'
  | 'grad-detail';

export interface Event {
  date: string;
  title_ko: string;
  title_en: string;
  type: 'ARRIVAL' | 'OT' | 'CLEANING' | 'LAUNDRY' | 'SALON' | 'SHOE' | 'PHOTO' | 'GRADUATION';
  time: string;
  location: string;
  description_ko: string;
  description_en: string;
}

export interface Meal {
  date: string;
  meal: 'LUNCH' | 'DINNER';
  order: number;
  menu_ko: string;
  menu_en?: string;
  spicy: boolean;
  seafood: boolean;
  peanut: boolean;
  wheat: boolean;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
}

export interface FAQCategory {
  id: string;
  name: string;
  description?: string;
}

export interface StaffContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface Report {
  id: string;
  roomNumber: string;
  name: string;
  category: string;
  title: string;
  description: string;
  timestamp: string;
  checked?: boolean;
  media?: string;
  mediaType?: string;
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'image';
  value: string;
}

export interface ContentPage {
  title: string;
  blocks: ContentBlock[];
}

export interface ServiceMenu {
  id: string;
  title: string;
  title_en: string;
  icon: string;
  desc: string;
}

export interface GradSubmenu {
  id: string;
  title: string;
  title_en: string;
  icon: string;
  desc: string;
  type: 'link' | 'page';
}

export interface SurveyEntry {
  room: string;
  initials: string;
  guests: number;
  doubleRooms: number;
  twinRooms: number;
  notes: string;
  timestamp: string;
}

export interface EssentialPhrase {
  id: string;
  text_ko: string;
  text_en: string;
  pronunciation: string;
  description_en: string;
  color: string;
}

export interface TransportItem {
  id: string;
  category: 'BUS' | 'TAXI' | 'OTHER';
  label: string;
  title: string;
  duration: string;
  color: string;
}

export interface AppState {
  headerLine1: string;
  headerLine2: string;
  termName: string;
  noticeMessage: string;
  noticeId: string;
  hallAddress: string;
  complexMapUrl: string;
  nearbyMapUrl: string;
  areaMapUrl: string;
  transportationInfo: string;
  transportItems: TransportItem[];
  emergencyText: string;
  adminEmail: string;
  adminPin: string;
  hasNewReport: boolean;
  events: Event[];
  meals: Meal[];
  faqs: FAQItem[];
  faqCategories: FAQCategory[];
  staff: StaffContact[];
  reports: Report[];
  serviceMenus: ServiceMenu[];
  gradSubmenus: GradSubmenu[];
  contentPages: Record<string, ContentPage>;
  survey1: SurveyEntry[];
  survey2: SurveyEntry[];
  isSurvey2Open: boolean;
  essentialPhrases: EssentialPhrase[];
  googleSheetUrl: string;
  gimpoIntro: string;
  noGraduationThisTerm: boolean;
  noGraduationMessage: string;
}
