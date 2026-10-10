import React, { useState } from 'react';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bell,
  BellRing,
  Filter,
  Search,
  Building,
  User,
  Plus,
  Edit3,
  Calendar,
  FileText,
} from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';
import { ObligationStatus, Obligation } from '../../types/document';

export const ObligationsView: React.FC = () => {
  const {
    activeDocument,
    updateObligationStatus,
    toggleObligationReminder,
    updateObligationNote,
    setCurrentView,
  } = useDocumentContext();

  const [statusFilter, setStatusFilter] = useState<'all' | ObligationStatus>('all');
  const [partyFilter, setPartyFilter] = useState<string>('all');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>('');

  if (!activeDocument || !activeDocument.analysis) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-xl mx-auto my-12">
        <CalendarCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Contract Obligations Available</h3>
        <p className="text-xs text-slate-500 mt-1">Please select or upload a contract first.</p>
        <button
          onClick={() => setCurrentView('upload')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Select Contract
        </button>
      </div>
    );
  }

  const obligations = activeDocument.analysis.obligations || [];

  // Extract unique parties for filtering
  const parties = Array.from(new Set(obligations.map((o) => o.responsibleParty)));

  const filtered = obligations.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchParty = partyFilter === 'all' || o.responsibleParty === partyFilter;
    return matchStatus && matchParty;
  });

  const handleStartNote = (ob: Obligation) => {
    setEditingNoteId(ob.id);
    setNoteDraft(ob.userNotes || '');
  };

  const handleSaveNote = (id: string) => {
    updateObligationNote(id, noteDraft);
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              Compliance & Action Tracker
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Contract Obligations & Key Deadlines
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Tracks specific contractual milestones, payment dates, notice deadlines, and conditional triggers without fabricating calendar dates.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/90 text-center">
              <span className="block text-xl font-extrabold text-slate-900 leading-tight font-mono tabular-nums">
                {obligations.length}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Duties</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-center">
              <span className="block text-xl font-extrabold text-emerald-700 leading-tight font-mono tabular-nums">
                {obligations.filter((o) => o.status === 'completed').length}
              </span>
              <span className="text-[10px] text-emerald-800 font-semibold uppercase">Completed</span>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-400 font-medium">Status:</span>
          {(['all', 'upcoming', 'needs-verification', 'completed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.replace('-', ' ')}
            </button>
          ))}

          {parties.length > 1 && (
            <>
              <span className="text-slate-400 font-medium ml-3">Party:</span>
              <button
                onClick={() => setPartyFilter('all')}
                className={`px-3 py-1 rounded-lg font-medium ${
                  partyFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Parties
              </button>
              {parties.map((p) => (
                <button
                  key={p}
                  onClick={() => setPartyFilter(p)}
                  className={`px-3 py-1 rounded-lg font-medium truncate max-w-[150px] ${
                    partyFilter === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Obligations List */}
      <div className="space-y-3.5">
        {filtered.map((ob, idx) => {
          const isCompleted = ob.status === 'completed';
          const hasCalendarDate = Boolean(ob.dueDate);

          return (
            <div
              key={`${ob.id}-${idx}`}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                isCompleted
                  ? 'border-emerald-200/80 bg-emerald-50/20'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Status Toggle Checkbox */}
                  <button
                    onClick={() =>
                      updateObligationStatus(
                        ob.id,
                        isCompleted ? 'upcoming' : 'completed'
                      )
                    }
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-blue-500 bg-white'
                    }`}
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        {ob.responsibleParty}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Page {ob.pageNumber} · {ob.sourceClause}
                      </span>
                      {hasCalendarDate ? (
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-600" />
                          Due: {ob.dueDate}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          Trigger Condition
                        </span>
                      )}
                    </div>
                    <h3
                      className={`text-sm font-bold pt-1 ${
                        isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {ob.action}
                    </h3>
                  </div>
                </div>

                {/* Right controls: Reminder Bell + Status Selector */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  <button
                    onClick={() => toggleObligationReminder(ob.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      ob.reminderSet
                        ? 'bg-amber-100 text-amber-800'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                    title={ob.reminderSet ? 'Reminder active' : 'Set reminder alert'}
                  >
                    {ob.reminderSet ? <BellRing className="w-4 h-4 text-amber-600" /> : <Bell className="w-4 h-4" />}
                  </button>

                  <select
                    value={ob.status}
                    onChange={(e) =>
                      updateObligationStatus(ob.id, e.target.value as ObligationStatus)
                    }
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="needs-verification">Needs Verification</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              {/* Timing or trigger description */}
              <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <strong>Contractual Trigger / Timeline:</strong> {ob.timingOrTrigger}
              </div>

              {/* User Note Section */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                {editingNoteId === ob.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="Add compliance note or assignee..."
                      className="flex-1 px-3 py-1 rounded-lg border border-slate-300 text-xs text-slate-800"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveNote(ob.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg font-medium text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingNoteId(null)}
                      className="px-2 py-1 text-slate-500 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-slate-500 text-[11px]">
                      {ob.userNotes ? (
                        <span>
                          <strong>Note:</strong> {ob.userNotes}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">No notes added</span>
                      )}
                    </span>
                    <button
                      onClick={() => handleStartNote(ob)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-[11px] flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      {ob.userNotes ? 'Edit' : 'Add Note'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
            <p className="text-sm font-semibold text-slate-700">No obligations match current filter</p>
          </div>
        )}
      </div>
    </div>
  );
};
