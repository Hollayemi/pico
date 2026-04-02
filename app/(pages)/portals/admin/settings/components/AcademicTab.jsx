// components/settings/AcademicTab.jsx
import React, { useState, useEffect } from "react";
import { Calendar, Plus, Edit2, Trash2, X, Check, Loader2, Save } from "lucide-react";
import { 
  useGetAcademicSettingsQuery, 
  useUpdateAcademicSessionMutation,
  useCreateSessionMutation,
  useDeleteSessionMutation,
  useSetCurrentSessionMutation,
  useCreateTermMutation,
  useUpdateTermMutation,
  useDeleteTermMutation,
  useSetCurrentTermMutation 
} from "@/redux/slices/settingsSlice";
import { Section, Field } from "./SharedComponents";
import toast from "react-hot-toast";

export default function AcademicTab() {
  const { data: academicData, isLoading: academicLoading, refetch } = useGetAcademicSettingsQuery();
  const [updateAcademicSession, { isLoading: updatingSession }] = useUpdateAcademicSessionMutation();
  const [createSession, { isLoading: creatingSession }] = useCreateSessionMutation();
  const [deleteSession, { isLoading: deletingSession }] = useDeleteSessionMutation();
  const [setCurrentSession, { isLoading: settingSession }] = useSetCurrentSessionMutation();
  const [createTerm, { isLoading: creatingTerm }] = useCreateTermMutation();
  const [updateTerm, { isLoading: updatingTerm }] = useUpdateTermMutation();
  const [deleteTerm, { isLoading: deletingTerm }] = useDeleteTermMutation();
  const [setCurrentTerm, { isLoading: settingTerm }] = useSetCurrentTermMutation();

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editTerm, setEditTerm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (academicData?.data) {
      setSessions(academicData.data.sessions || []);
      if (academicData.data.currentSession && !selectedSession) {
        setSelectedSession(academicData.data.currentSession);
      }
    }
  }, [academicData]);

  const markSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveSession = async () => {
    try {
      await updateAcademicSession({ currentSession: selectedSession }).unwrap();
      markSaved();
      toast.success("Academic session updated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update session");
    }
  };

  const handleCreateSession = async (sessionData) => {
    try {
      const result = await createSession(sessionData).unwrap();
      setSessions(prev => [...prev, result?.data?.session]);
      toast.success("Session created successfully");
      setShowSessionModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create session");
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!confirm("Delete this session? All terms under this session will also be deleted.")) return;
    try {
      await deleteSession(sessionId).unwrap();
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (selectedSession?.id === sessionId) setSelectedSession(null);
      toast.success("Session deleted");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete session");
    }
  };

  const handleSetCurrentSession = async (sessionId) => {
    try {
      await setCurrentSession(sessionId).unwrap();
      const session = sessions.find(s => s.id === sessionId);
      setSelectedSession(session);
      toast.success("Current session updated");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to set current session");
    }
  };

  const handleSaveTerm = async (data) => {
    if (!editTerm || !selectedSession) return;
    try {
      if (editTerm._isNew) {
        const result = await createTerm({ 
          ...data, 
          sessionId: selectedSession.id 
        }).unwrap();
        setSessions(prev => prev.map(s => 
          s.id === selectedSession.id 
            ? { ...s, terms: [...(s.terms || []), result?.data?.term] }
            : s
        ));
      } else {
        await updateTerm({ id: editTerm.id, ...data }).unwrap();
        setSessions(prev => prev.map(s => 
          s.id === selectedSession.id 
            ? { ...s, terms: (s.terms || []).map(t => t.id === editTerm.id ? { ...t, ...editTerm } : t) }
            : s
        ));
      }
      toast.success("Term saved");
      setEditTerm(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save term");
    }
  };

  const handleDeleteTerm = async (termId) => {
    try {
      await deleteTerm(termId).unwrap();
      setSessions(prev => prev.map(s => 
        s.id === selectedSession?.id 
          ? { ...s, terms: (s.terms || []).filter(t => t.id !== termId) }
          : s
      ));
      toast.success("Term deleted");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete term");
    }
  };

  const handleSetCurrentTerm = async (termId) => {
    try {
      await setCurrentTerm(termId).unwrap();
      setSessions(prev => prev.map(s => 
        s.id === selectedSession?.id 
          ? { ...s, terms: (s.terms || []).map(t => ({ ...t, current: t.id === termId })) }
          : s
      ));
      toast.success("Current term updated");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to set current term");
    }
  };

  if (academicLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 py-8 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading academic settings...
      </div>
    );
  }

  const currentTerms = selectedSession?.terms || [];

  return (
    <Section icon={Calendar} title="Academic Session & Terms">
      <div className="space-y-5">
        {/* Sessions Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">Academic Sessions</p>
            <button
              onClick={() => {
                setEditingSession(null);
                setShowSessionModal(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 text-white text-xs rounded-lg hover:bg-brand-700"
            >
              <Plus className="w-3.5 h-3.5" /> Create Session
            </button>
          </div>

          {sessions.length > 0 ? <div className="space-y-2">
            {sessions.map(session => (
              <div
                key={session?.id}
                className={`border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${
                  selectedSession?.id === session?.id 
                    ? "border-brand-300 bg-brand-50 ring-2 ring-brand-200" 
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => setSelectedSession(session)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selectedSession?.id === session?.id ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-900 text-sm">{session.name}</p>
                    {session.current && (
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-semibold">Current</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {session.startDate} → {session.endDate}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Terms: {session.terms?.length || 0}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!session.current && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetCurrentSession(session.id);
                      }}
                      disabled={settingSession}
                      className="px-3 py-1.5 text-xs border border-brand-200 text-brand-600 rounded-lg hover:bg-brand-50 disabled:opacity-40"
                    >
                      Set Current
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSession(session);
                      setShowSessionModal(true);
                    }}
                    className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {!session.current && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                      disabled={deletingSession}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!sessions.length && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No academic sessions configured yet. Click "Create Session" to get started.
              </div>
            )}
          </div> : null}
        </div>

        {/* Terms Section - Only shows when a session is selected */}
        {selectedSession && (
          <div className="border-t border-gray-200 pt-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Terms for {selectedSession.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Manage terms within this academic session
                </p>
              </div>
              <button
                onClick={() => setEditTerm({ _isNew: true, name: "", startDate: "", endDate: "" })}
                className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 text-white text-xs rounded-lg hover:bg-brand-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add Term
              </button>
            </div>

            <div className="space-y-3">
              {currentTerms.map(term => (
                <div key={term.id} className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    term.current ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-gray-900 text-sm">{term.name}</p>
                      {term.current && (
                        <span className="text-xs bg-brand-600 text-white px-2 py-0.5 rounded-full font-semibold">Current Term</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{term.startDate} → {term.endDate}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!term.current && (
                      <button
                        onClick={() => handleSetCurrentTerm(term.id)}
                        disabled={settingTerm}
                        className="px-3 py-1.5 text-xs border border-brand-200 text-brand-600 rounded-lg hover:bg-brand-50 disabled:opacity-40"
                      >
                        Set Current
                      </button>
                    )}
                    <button onClick={() => setEditTerm(term)} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {!term.current && (
                      <button
                        onClick={() => handleDeleteTerm(term.id)}
                        disabled={deletingTerm}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {!currentTerms.length && (
                <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
                  No terms configured for this session. Click "Add Term" to create one.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Session Modal */}
        {showSessionModal && (
          <SessionModal
            session={editingSession}
            onClose={() => setShowSessionModal(false)}
            onSave={handleCreateSession}
          />
        )}

        {/* Term Modal */}
        {editTerm && (
          <TermModal
            term={editTerm}
            onClose={() => setEditTerm(null)}
            onSave={handleSaveTerm}
            isLoading={creatingTerm || updatingTerm}
          />
        )}
      </div>
    </Section>
  );
}

// Session Modal Component
function SessionModal({ session, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: session?.name || "",
    startDate: session?.startDate || "",
    endDate: session?.endDate || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error("Please fill all fields");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-5 py-4 flex items-center justify-between">
          <h3 className="text-white font-bold">{session ? "Edit Session" : "Create Session"}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Field label="Session Name">
            <input
              value={formData.name}
              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. 2025/2026"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date">
              <input
                type="date"
                value={formData.startDate}
                onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
              />
            </Field>
            <Field label="End Date">
              <input
                type="date"
                value={formData.endDate}
                onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
              />
            </Field>
          </div>
          <div className="border-t pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700">
              <Check className="w-4 h-4" />
              {session ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Term Modal Component
function TermModal({ term, onClose, onSave, isLoading }) {
  const [formData, setFormData] = useState({
    name: term?.name || "",
    startDate: term?.startDate || "",
    endDate: term?.endDate || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error("Please fill all fields");
      return;
    }
    onSave({ ...term, ...formData });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-5 py-4 flex items-center justify-between">
          <h3 className="text-white font-bold">{term._isNew ? "Create Term" : "Edit Term"}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Field label="Term Name">
            <input
              value={formData.name}
              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. 1st Term"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date">
              <input
                type="date"
                value={formData.startDate}
                onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
              />
            </Field>
            <Field label="End Date">
              <input
                type="date"
                value={formData.endDate}
                onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
              />
            </Field>
          </div>
          <div className="border-t pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700 disabled:opacity-60">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}