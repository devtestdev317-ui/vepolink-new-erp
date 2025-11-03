import { useState, useEffect } from 'react';
import type { CalendarEvent, Survey, Suggestion, CreateEventData, SurveyResponse, SurveyAnswer } from '@/types/employee-engagement';

export const useEmployeeEngagement = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    // Load events
    const savedEvents = localStorage.getItem('employee-engagement-events');
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        date: new Date(event.date)
      }));
      setEvents(parsedEvents);
    } else {

      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Diwali Celebration',
          date: new Date('2024-11-12'),
          type: 'festival',
          description: 'Office Diwali party and celebrations'
        },
        {
          id: '2',
          title: 'John Doe Birthday',
          date: new Date('2024-11-15'),
          type: 'birthday',
          employeeName: 'John Doe'
        },
        {
          id: '3',
          title: 'Jane Smith Work Anniversary',
          date: new Date('2024-11-20'),
          type: 'anniversary',
          employeeName: 'Jane Smith'
        }
      ];
      setEvents(mockEvents);
    }

    // Load survey responses
    const savedResponses = localStorage.getItem('employee-engagement-survey-responses');
    if (savedResponses) {
      const parsedResponses = JSON.parse(savedResponses).map((response: any) => ({
        ...response,
        submittedAt: new Date(response.submittedAt)
      }));
      setSurveyResponses(parsedResponses);
    }


    const mockSurveys: Survey[] = [
      {
        id: 'survey-1',
        title: 'Q1 Employee Satisfaction Survey',
        description: 'Share your feedback about workplace satisfaction and help us improve your experience',
        status: 'active',
        createdAt: new Date('2024-11-01'),
        questions: [
          {
            id: '1',
            question: 'How satisfied are you with your work environment?',
            type: 'rating',
            required: true
          },
          {
            id: '2',
            question: 'How would you rate work-life balance?',
            type: 'rating',
            required: true
          },
          {
            id: '3',
            question: 'What do you enjoy most about working here?',
            type: 'text',
            required: false
          },
          {
            id: '4',
            question: 'Which areas need improvement?',
            type: 'multiple-choice',
            options: ['Communication', 'Workload', 'Team Collaboration', 'Management Support', 'Office Facilities'],
            required: true
          },
          {
            id: '5',
            question: 'Additional comments or suggestions',
            type: 'text',
            required: false
          }
        ]
      },
      {
        id: 'survey-2',
        title: 'Team Collaboration Feedback',
        description: 'Help us understand and improve team collaboration',
        status: 'active',
        createdAt: new Date('2024-11-10'),
        questions: [
          {
            id: '1',
            question: 'How effective is team communication?',
            type: 'rating',
            required: true
          },
          {
            id: '2',
            question: 'Rate the collaboration tools we use',
            type: 'rating',
            required: true
          }
        ]
      }
    ];
    setSurveys(mockSurveys);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('employee-engagement-events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('employee-engagement-survey-responses', JSON.stringify(surveyResponses));
  }, [surveyResponses]);

  const addEvent = (eventData: CreateEventData) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdBy: 'current-user'
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId ? { ...event, ...updates } : event
      )
    );
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const addSuggestion = (suggestion: Omit<Suggestion, 'id' | 'createdAt' | 'status'>) => {
    const newSuggestion: Suggestion = {
      ...suggestion,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'submitted'
    };
    setSuggestions(prev => [newSuggestion, ...prev]);
  };

  /**
   * Submit a survey response
   * @param surveyId - The ID of the survey being responded to
   * @param answers - Array of answers for the survey questions
   */
  const submitSurveyResponse = (surveyId: string, answers: SurveyAnswer[]): void => {
    // Validate that the survey exists and is active
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey) {
      console.error('Survey not found');
      return;
    }

    if (survey.status !== 'active') {
      console.error('Survey is not active');
      return;
    }

    // Validate that all required questions are answered
    const requiredQuestions = survey.questions.filter(q => q.required);
    const missingRequired = requiredQuestions.filter(q =>
      !answers.find(a => a.questionId === q.id && a.answer !== undefined && a.answer !== '' && (!Array.isArray(a.answer) || a.answer.length > 0))
    );

    if (missingRequired.length > 0) {
      console.error('Missing required questions:', missingRequired.map(q => q.question));
      return;
    }

    // Create new response
    const newResponse: SurveyResponse = {
      id: `response-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      surveyId,
      respondentId: `user-${Math.random().toString(36).substr(2, 9)}`, // In real app, use actual user ID
      answers,
      submittedAt: new Date()
    };

    // Update state
    setSurveyResponses(prev => {
      const updatedResponses = [...prev, newResponse];
      return updatedResponses;
    });

    console.log('Survey response submitted successfully:', newResponse);
  };

  /**
   * Get comprehensive results for a specific survey
   * @param surveyId - The ID of the survey to get results for
   * @returns Survey results with analytics and summaries
   */
  const getSurveyResults = (surveyId: string) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey) {
      console.error('Survey not found ghjgh');
      return null;
    }

    const responses = surveyResponses.filter(response => response.surveyId === surveyId);

    if (responses.length === 0) {
      return {
        survey,
        totalResponses: 0,
        questionResults: survey.questions.map(question => ({
          question,
          responses: [],
          summary: null
        })),
        participationRate: 0,
        averageOverallRating: 0
      };
    }

    const questionResults = survey.questions.map(question => {
      const questionResponses = responses
        .map(response => response.answers.find(answer => answer.questionId === question.id))
        .filter((answer): answer is SurveyAnswer => answer !== undefined);

      return {
        question,
        responses: questionResponses,
        summary: calculateQuestionSummary(question, questionResponses, responses.length)
      };
    });

    // Calculate overall average rating (only for rating questions)
    const ratingQuestions = survey.questions.filter(q => q.type === 'rating');
    const averageOverallRating = ratingQuestions.length > 0
      ? ratingQuestions.reduce((sum, q) => {
        const result = questionResults.find(qr => qr.question.id === q.id);
        return sum + (result?.summary?.averageRating || 0);
      }, 0) / ratingQuestions.length
      : 0;

    return {
      survey,
      totalResponses: responses.length,
      questionResults,
      participationRate: Math.min((responses.length / 100) * 100, 100), // Mock participation rate
      averageOverallRating: Number(averageOverallRating.toFixed(1))
    };
  };

  /**
   * Calculate summary statistics for a specific question
   */
  const calculateQuestionSummary = (question: Survey['questions'][0], responses: SurveyAnswer[], totalResponses: number) => {
    if (responses.length === 0) return null;

    switch (question.type) {
      case 'rating':
        const ratings = responses
          .map(r => {
            if (typeof r.answer === 'number') return r.answer;
            if (typeof r.answer === 'string') {
              const parsed = parseInt(r.answer, 10);
              return isNaN(parsed) ? NaN : parsed;
            }
            return NaN;
          })
          .filter((value): value is number => typeof value === 'number' && !isNaN(value) && value >= 1 && value <= 5);

        if (ratings.length === 0) return null;

        const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

        const distribution = [1, 2, 3, 4, 5].map(rating => {
          const count = ratings.filter(r => r === rating).length;
          return {
            rating,
            count,
            percentage: ratings.length > 0 ? (count / ratings.length) * 100 : 0
          };
        });

        return {
          type: 'rating' as const,
          averageRating: Number(averageRating.toFixed(1)),
          totalRatings: ratings.length,
          distribution
        };

      case 'multiple-choice':
        const optionCounts: { [option: string]: number } = {};

        question.options?.forEach(option => {
          optionCounts[option] = 0;
        });

        responses.forEach(response => {
          if (Array.isArray(response.answer)) {
            response.answer.forEach(option => {
              if (optionCounts.hasOwnProperty(option)) {
                optionCounts[option]++;
              }
            });
          } else if (typeof response.answer === 'string' && question.options?.includes(response.answer)) {
            optionCounts[response.answer]++;
          }
        });

        const choiceSummary = Object.entries(optionCounts).map(([option, count]) => ({
          option,
          count,
          percentage: totalResponses > 0 ? (count / totalResponses) * 100 : 0
        }));

        return {
          type: 'multiple-choice' as const,
          choices: choiceSummary,
          totalSelections: Object.values(optionCounts).reduce((sum, count) => sum + count, 0)
        };

      case 'text':
        const textResponses = responses
          .map(r => r.answer)
          .filter(answer => typeof answer === 'string' && answer.trim().length > 0);

        return {
          type: 'text' as const,
          totalResponses: textResponses.length,
          responses: textResponses as string[]
        };

      default:
        return null;
    }
  };

  /**
   * Check if the current user has already responded to a survey
   * @param surveyId - The ID of the survey to check
   * @returns boolean indicating if user has responded
   */
  const hasUserResponded = (surveyId: string): boolean => {
    let userId = localStorage.getItem('employee-engagement-user-id');
    if (!userId) {
      userId = `user-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('employee-engagement-user-id', userId);
    }

    return surveyResponses.some(response =>
      response.surveyId === surveyId && response.respondentId === userId
    );
  };

  /**
   * Get user's specific response to a survey (optional helper function)
   */
  const getUserSurveyResponse = (surveyId: string): SurveyResponse | null => {
    let userId = localStorage.getItem('employee-engagement-user-id');
    if (!userId) return null;

    return surveyResponses.find(response =>
      response.surveyId === surveyId && response.respondentId === userId
    ) || null;
  };

  /**
   * Close a survey (optional admin function)
   */
  const closeSurvey = (surveyId: string): void => {
    setSurveys(prev =>
      prev.map(survey =>
        survey.id === surveyId ? { ...survey, status: 'closed' as const } : survey
      )
    );
  };

  /**
   * Create a new survey (optional admin function)
   */
  const createSurvey = (surveyData: Omit<Survey, 'id' | 'createdAt'>): void => {
    const newSurvey: Survey = {
      ...surveyData,
      id: `survey-${Date.now()}`,
      createdAt: new Date()
    };
    setSurveys(prev => [...prev, newSurvey]);
  };

  return {
    events,
    surveys,
    suggestions,
    surveyResponses,
    addEvent,
    updateEvent,
    deleteEvent,
    addSuggestion,
    submitSurveyResponse,
    getSurveyResults,
    hasUserResponded,
    getUserSurveyResponse,
    closeSurvey,
    createSurvey
  };
};