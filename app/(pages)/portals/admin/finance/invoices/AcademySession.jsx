// components/settings/AcademicSelectors.jsx
import React, { useState, useEffect } from "react";
import { ChevronDown, Calendar, BookOpen } from "lucide-react";

export default function AcademicSelectors({ 
  sessions, 
  selectedSession, 
  setSelectedSession,
  selectedTerm,
  setSelectedTerm 
}) {
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [isTermOpen, setIsTermOpen] = useState(false);

  // Auto-select current session and term on load
  useEffect(() => {
    if (sessions && sessions.length > 0 && !selectedSession) {
      const currentSession = sessions.find(s => s.current === true || s.isCurrent === true);
      if (currentSession) {
        setSelectedSession(currentSession);
        
        // Auto-select current term if exists
        if (currentSession.terms && currentSession.terms.length > 0) {
          const currentTerm = currentSession.terms.find(t => t.current === true);
          if (currentTerm) {
            setSelectedTerm(currentTerm);
          }
        }
      } else {
        // If no current session, select the first one
        setSelectedSession(sessions[0]);
      }
    }
  }, [sessions, selectedSession, setSelectedSession, setSelectedTerm]);

  // Get available terms for selected session
  const availableTerms = selectedSession?.terms || [];

  // Handle session selection
  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    setIsSessionOpen(false);
    
    // Reset term selection when session changes
    const currentTerm = session.terms?.find(t => t.current === true);
    setSelectedTerm(currentTerm || null);
  };

  // Handle term selection
  const handleTermSelect = (term) => {
    setSelectedTerm(term);
    setIsTermOpen(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {/* Session Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-600" />
            Academic Session
          </div>
        </label>
        
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSessionOpen(!isSessionOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 hover:border-brand-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              {selectedSession ? (
                <>
                  <span className="font-medium text-gray-900">{selectedSession.name}</span>
                  {selectedSession.current && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </>
              ) : (
                <span className="text-gray-400">Select academic session</span>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isSessionOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSessionOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsSessionOpen(false)}
              />
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {sessions && sessions.length > 0 ? (
                    sessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => handleSessionSelect(session)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0
                          ${selectedSession?.id === session.id ? 'bg-brand-50' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-medium ${selectedSession?.id === session.id ? 'text-brand-700' : 'text-gray-900'}`}>
                              {session.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {formatDate(session.startDate)} → {formatDate(session.endDate)}
                            </p>
                          </div>
                          {session.current && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">
                            {session.terms?.length || 0} term{session.terms?.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-400 text-sm">
                      No sessions available
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Term Selector - Only show if session has terms */}
      {selectedSession && availableTerms.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-600" />
              Academic Term
            </div>
          </label>
          
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTermOpen(!isTermOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 hover:border-brand-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                {selectedTerm ? (
                  <>
                    <span className="font-medium text-gray-900">{selectedTerm.name}</span>
                    {selectedTerm.current && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-400">Select term</span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isTermOpen ? 'rotate-180' : ''}`} />
            </button>

            {isTermOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsTermOpen(false)}
                />
                <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="max-h-64 overflow-y-auto">
                    {availableTerms.map((term) => (
                      <button
                        key={term.id}
                        onClick={() => handleTermSelect(term)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0
                          ${selectedTerm?.id === term.id ? 'bg-brand-50' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-medium ${selectedTerm?.id === term.id ? 'text-brand-700' : 'text-gray-900'}`}>
                              {term.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {formatDate(term.startDate)} → {formatDate(term.endDate)}
                            </p>
                          </div>
                          {term.current && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* No terms message */}
      {selectedSession && availableTerms.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-700">
            No terms configured for {selectedSession.name}. Please add terms to continue.
          </p>
        </div>
      )}
    </div>
  );
}