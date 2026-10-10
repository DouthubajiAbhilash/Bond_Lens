import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  UploadCloud,
  FileText,
  ChevronDown,
  AlertTriangle,
  ShieldCheck,
  X,
  FileCheck,
  Menu,
} from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';

export const Header: React.FC = () => {
  const {
    documents,
    activeDocumentId,
    setActiveDocumentId,
    activeDocument,
    setCurrentView,
    globalSearchQuery,
    setGlobalSearchQuery,
    notifications,
    markNotificationAsRead,
    setIsDisclaimerOpen,
    setIsSidebarCollapsed,
  } = useDocumentContext();

  const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const docDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (docDropdownRef.current && !docDropdownRef.current.contains(event.target as Node)) {
        setIsDocDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-20 shrink-0 text-slate-900">
      {/* Left: Mobile Menu Toggle + Document Switcher */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Document Switcher Dropdown */}
        <div className="relative" ref={docDropdownRef}>
          <button
            onClick={() => setIsDocDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-left transition-all max-w-[220px] sm:max-w-xs md:max-w-sm group cursor-pointer"
            title="Switch active document target"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs font-semibold text-slate-800 truncate">
                  {activeDocument ? activeDocument.fileName : 'Select contract'}
                </span>
                {activeDocument?.isSample && (
                  <span className="text-[10px] text-blue-600 font-medium shrink-0">· Demo</span>
                )}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0 ml-0.5" />
          </button>

          {/* Switcher Dropdown Menu */}
          {isDocDropdownOpen && (
            <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Available Contracts ({documents.length})
                </span>
                <button
                  onClick={() => {
                    setIsDocDropdownOpen(false);
                    setCurrentView('upload');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                >
                  + Upload New
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-100">
                {documents.map((doc) => {
                  const isSelected = doc.id === activeDocumentId;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setActiveDocumentId(doc.id);
                        setIsDocDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 flex items-start gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50 text-blue-900' : 'text-slate-700'
                      }`}
                    >
                      <FileCheck className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate">{doc.fileName}</p>
                        <p className="text-[11px] text-slate-500">
                          {doc.pageCount} pages · Score {doc.analysis?.documentSummary.overallRiskScore ?? 'N/A'}/100
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            placeholder="Search clauses, liabilities, terms..."
            className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
          {globalSearchQuery && (
            <button
              onClick={() => setGlobalSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={() => setIsDisclaimerOpen(true)}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-slate-500" />
          <span>Disclaimer</span>
        </button>

        <button
          onClick={() => setCurrentView('upload')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload Contract</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => setIsNotifDropdownOpen((prev) => !prev)}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Risk Intelligence Alerts</span>
                <span className="text-[11px] text-slate-500 font-mono tabular-nums">{unreadCount} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className="p-3.5 text-left hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
