import React from 'react';
import { DocumentProvider, useDocumentContext } from './context/DocumentContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DisclaimerModal } from './components/common/DisclaimerModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { UploadView } from './components/upload/UploadView';
import { AnalysisView } from './components/analysis/AnalysisView';
import { RiskRadarView } from './components/risk/RiskRadarView';
import { ObligationsView } from './components/obligations/ObligationsView';
import { DocumentChatView } from './components/chat/DocumentChatView';
import { ReportsView } from './components/reports/ReportsView';
import { LibraryView } from './components/library/LibraryView';

const AppContent: React.FC = () => {
  const { currentView } = useDocumentContext();

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-50">
        {/* Top Header */}
        <Header />

        {/* View Container */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'upload' && <UploadView />}
          {currentView === 'analysis' && <AnalysisView />}
          {currentView === 'risk-radar' && <RiskRadarView />}
          {currentView === 'obligations' && <ObligationsView />}
          {currentView === 'chat' && <DocumentChatView />}
          {currentView === 'reports' && <ReportsView />}
          {currentView === 'library' && <LibraryView />}
        </main>
      </div>

      {/* Legal Boundary Notice Modal */}
      <DisclaimerModal />
    </div>
  );
};

export default function App() {
  return (
    <DocumentProvider>
      <AppContent />
    </DocumentProvider>
  );
}
