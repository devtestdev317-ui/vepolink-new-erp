export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'festival' | 'birthday' | 'anniversary' | 'custom';
  employeeName?: string;
  description?: string;
  createdBy?: string;
  isRecurring?: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'closed';
  questions: SurveyQuestion[];
  createdAt: Date;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'rating' | 'text';
  options?: string[];
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: 'general' | 'work-environment' | 'benefits' | 'events' | 'other';
  status: 'submitted' | 'in-review' | 'implemented' | 'rejected';
  createdAt: Date;
  submittedBy: string;
}
export interface CreateEventData {
  title: string;
  date: Date;
  type: CalendarEvent['type'];
  employeeName?: string;
  description?: string;
  isRecurring?: boolean;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId: string;
  answers: SurveyAnswer[];
  submittedAt: Date;
}
export interface SurveyAnswer {
  questionId: string;
  answer: string | number | string[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'closed';
  questions: SurveyQuestion[];
  createdAt: Date;
  responses?: SurveyResponse[];
}

export interface SurveyQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'rating' | 'text';
  options?: string[];
  required?: boolean;
}