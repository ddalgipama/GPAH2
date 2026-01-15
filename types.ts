
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
  | 'dorm-detail';

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
}

export interface ContentPage {
  title: string;
  content: string;
  images?: string[];
}

export interface AppState {
  headerLine1: string;
  headerLine2: string;
  termName: string;
  noticeMessage: string;
  hallAddress: string;
  gimpoIntro: string;
  emergencyText: string;
  adminEmail: string;
  events: Event[];
  meals: Meal[];
  faqs: FAQItem[];
  staff: StaffContact[];
  reports: Report[];
  contentPages: Record<string, ContentPage>;
  survey1: any[];
  survey2: any[];
}
