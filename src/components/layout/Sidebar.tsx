import React from 'react';
import {
  ShieldAlert,
  LayoutDashboard,
  UploadCloud,
  FileSearch,
  Radar,
  CalendarCheck,
  MessageSquareText,
  FileSpreadsheet,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileCheck2,
  X,
} from 'lucide-react';
import { useDocumentContext, ActiveView } from '../../context/DocumentContext';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    activeDocument,
    setIsDisclaimerOpen,
  } = useDocumentContext();

  const navigationItems: Array<{
    id: ActiveView;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
  }> = [
    { id: 'dashboard', label: 'Risk Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Contract', icon: UploadCloud },
    {
      id: 'analysis',
      label: 'Clause Analysis',
      icon: FileSearch,
      badge: activeDocument?.analysis?.clauses?.length,
    },
    {
      id: 'risk-radar',
      label: 'Risk Radar',
      icon: Radar,
      badge: activeDocument?.analysis?.risks?.filter((r) => r.status === 'needs-review')?.length,
    },
    {
      id: 'obligations',
      label: 'Obligations & Deadlines',
      icon: CalendarCheck,
      badge: activeDocument?.analysis?.obligations?.length,
    },
    { id: 'chat', label: 'Ask Document (Q&A)', icon: MessageSquareText },
    { id: 'reports', label: 'Export Reports', icon: FileSpreadsheet },
    { id: 'library', label: 'Document Library', icon: FolderOpen },
  ];

  const handleNavClick = (view: ActiveView) => {
    setCurrentView(view);
    if (window.innerWidth < 1024) {
      setIsSidebarCollapsed(true);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {!isSidebarCollapsed && (
        <div
          onClick={() => setIsSidebarCollapsed(true)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800 ${
          isSidebarCollapsed ? 'w-20 -translate-x-full lg:translate-x-0' : 'w-72 translate-x-0'
        } min-h-screen select-none z-40 shrink-0`}
      >
        {/* Brand Header */}
        <div className={`flex items-center h-16 border-b border-slate-800 ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
          <div
            className="flex items-center gap-3 cursor-pointer overflow-hidden rounded-lg group"
            onClick={() => handleNavClick('dashboard')}
            title="ClauseGuard AI Dashboard"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30 shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-white text-base tracking-tight leading-none truncate">
                  ClauseGuard <span className="text-blue-400 font-semibold text-xs ml-0.5">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider font-medium mt-1 truncate">
                  Risk Intelligence
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className={`p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ${isSidebarCollapsed ? 'hidden' : 'ml-auto'}`}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 hidden lg:block" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 hidden lg:block" />
                <X className="w-4 h-4 lg:hidden" />
              </>
            )}
          </button>
        </div>

        {/* Collapsed Sidebar Toggle for Desktop */}
        {isSidebarCollapsed && (
          <div className="hidden lg:flex justify-center py-2 border-b border-slate-800">
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Active Document Context Preview in Sidebar */}
        {!isSidebarCollapsed && activeDocument && (
          <div className="mx-3.5 mt-3.5 p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <FileCheck2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-[11px] font-semibold text-slate-200 truncate">
                {activeDocument.fileName}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>{activeDocument.pageCount} pages</span>
              <span className="font-mono text-rose-400 font-bold">
                Risk: {activeDocument.analysis?.documentSummary.overallRiskScore ?? 'N/A'}/100
              </span>
            </div>
          </div>
        )}

        {/* Navigation Items List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                {!isSidebarCollapsed && typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-mono tabular-nums ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Workspace Footer */}
        {!isSidebarCollapsed && (
          <div className="p-3.5 border-t border-slate-800 bg-slate-950/40">
            <button
              onClick={() => setIsDisclaimerOpen(true)}
              className="w-full py-2 px-3 rounded-lg text-[11px] text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Legal Advisory Notice</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
