import React, { useState } from 'react';
import { Calendar, MessageSquare, BarChart3 } from 'lucide-react';
import { EventCalendar } from '@/components/EventCalendar';
import { SurveysSection } from '@/components/SurveysSection';
import { SuggestionBox } from '@/components/SuggestionBox';
import { useEmployeeEngagement } from '@/hooks/useEmployeeEngagement';
import type { SurveyAnswer } from '@/types/employee-engagement';

export const EmployeeEngagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'surveys' | 'suggestions'>('calendar');
  const {
    events,
    surveys,
    suggestions,
    addEvent,
    updateEvent,
    deleteEvent,
    addSuggestion,
    submitSurveyResponse,
    getSurveyResults,
    hasUserResponded
  } = useEmployeeEngagement();

  const tabs = [
    { id: 'calendar' as const, label: 'Event Calendar', icon: Calendar },
    { id: 'surveys' as const, label: 'Surveys', icon: BarChart3 },
    { id: 'suggestions' as const, label: 'Suggestion Box', icon: MessageSquare }
  ];
  const handleSurveySubmit = (surveyId: string, answers: SurveyAnswer[]) => {
    submitSurveyResponse(surveyId, answers);
  };
  const surveyResults = getSurveyResults('survey-1');
  if (surveyResults) {
    console.log('Total responses:', surveyResults.totalResponses);
    console.log('Average rating:', surveyResults.averageOverallRating);
  }
  const userHasResponded = hasUserResponded('survey-1');
  if (userHasResponded) {
    // Show "Already Completed" state
  } else {
    // Show "Take Survey" button
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Employee Engagement & Welfare
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Celebrating our team, gathering feedback, and making our workplace better together
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {activeTab === 'calendar' && <EventCalendar
            events={events}
            onAddEvent={addEvent}
            onUpdateEvent={updateEvent}
            onDeleteEvent={deleteEvent}
          />}
          {activeTab === 'surveys' && <SurveysSection
            surveys={surveys}
            onSubmitSurvey={handleSurveySubmit}
            onViewResults={getSurveyResults}
            hasUserResponded={hasUserResponded}
          />}
          {activeTab === 'suggestions' && (
            <SuggestionBox suggestions={suggestions} onAddSuggestion={addSuggestion} />
          )}
        </div>
      </div>
    </div>
  );
};