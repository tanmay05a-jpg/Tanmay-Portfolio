import React, { useState, useEffect } from 'react';
import {
  Edit3,
  Plus,
  Eye,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Film,
  SlidersHorizontal,
  ShieldCheck,
  Cloud,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { VideoManagerModal } from './VideoManagerModal';

export const EditToolbar: React.FC = () => {
  const {
    isEditMode,
    setIsEditMode,
    setEditingProject,
    setIsEditingText,
    setTextEditTab,
    toastMessage,
    projects,
    isAdminAuthenticated,
    setIsAdminModalOpen,
    logoutAdmin,
    isSyncing,
    saveToServer,
  } = usePortfolio();

  // Auto-collapse on mobile screens so it does not block the mobile preview
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // If NOT authenticated as Admin, NEVER show the edit toolbar to public visitors!
  if (!isAdminAuthenticated) {
    return (
      <>
        {/* Toast Notification Banner (for visitor actions like booking, inquiry) */}
        {toastMessage && (
          <div className="fixed top-20 right-4 sm:right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-xl border border-slate-800 animate-in fade-in slide-in-from-top-4 duration-200 max-w-[calc(100vw-2rem)]">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  const customProjectsCount = projects.filter((p) => p.isCustom || p.badge === 'Client Work' || p.badge === 'Featured Project').length;

  return (
    <>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-xl border border-slate-800 animate-in fade-in slide-in-from-top-4 duration-200 max-w-[calc(100vw-2rem)]">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Floating Admin Controls Bar (Only visible to verified Tanmay Admin) */}
      <aside
        aria-label="Admin portfolio controls"
        className={`fixed z-40 transition-all duration-300 ${
          isCollapsed
            ? 'bottom-4 right-4 sm:bottom-5 sm:right-5'
            : 'bottom-3 inset-x-3 sm:inset-x-auto sm:right-5 sm:bottom-5'
        }`}
      >
        {isCollapsed ? (
          /* Collapsed Floating Pill */
          <button
            onClick={() => setIsCollapsed(false)}
            className="flex items-center gap-2 rounded-full bg-slate-950/95 backdrop-blur-md px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-semibold text-white shadow-xl hover:bg-slate-900 border border-slate-700 transition-all hover:scale-105 group"
            title="Open Admin Bar"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Admin Active</span>
            <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
          </button>
        ) : (
          /* Expanded Bar */
          <div className="w-full sm:w-auto max-w-full sm:max-w-none flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl bg-white/95 backdrop-blur-md p-2.5 sm:p-2 shadow-2xl border border-slate-300 ring-1 ring-black/5 text-xs">
            {/* Top Row on Mobile: Mode Indicator & Toggle */}
            <div className="flex items-center justify-between gap-2 pb-2 sm:pb-0 sm:pr-3 border-b sm:border-b-0 sm:border-r border-slate-200">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    isEditMode ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
                <span className="font-bold text-slate-900 text-xs truncate">
                  {isEditMode ? 'Edit Mode ON' : 'Preview Mode'}
                </span>
                <span className="text-[10px] text-slate-500 hidden md:inline shrink-0 font-mono">
                  ({projects.length} works)
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditMode((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    isEditMode
                      ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isEditMode ? 'Done' : 'Enable Editing'}
                </button>

                {/* Mobile collapse button right in header */}
                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 sm:hidden"
                  title="Minimize toolbar"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 sm:py-0 w-full sm:w-auto justify-start sm:justify-end no-scrollbar">
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors shadow-xs whitespace-nowrap shrink-0"
                title="Manage, upload and change portfolio videos"
              >
                <Film className="h-3.5 w-3.5 text-blue-600" />
                <span>Videos</span>
              </button>

              <button
                onClick={() => setEditingProject('new')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors shadow-xs whitespace-nowrap shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Work</span>
              </button>

              <button
                onClick={() => {
                  setTextEditTab('hero');
                  setIsEditingText(true);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
              >
                <Edit3 className="h-3 w-3 text-slate-500" />
                <span>Edit Copy</span>
              </button>

              <button
                type="button"
                onClick={() => saveToServer()}
                disabled={isSyncing}
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0"
                title="Publish changes live to website"
              >
                <Cloud className={`h-3.5 w-3.5 text-emerald-600 ${isSyncing ? 'animate-bounce' : ''}`} />
                <span>{isSyncing ? 'Publishing...' : 'Save Live'}</span>
              </button>

              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 shrink-0"
                title="Admin Security & Password Settings"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                <span className="hidden lg:inline">Settings</span>
              </button>

              {/* Desktop collapse button */}
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 hidden sm:block shrink-0"
                title="Minimize toolbar"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Video Manager Modal */}
      <VideoManagerModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </>
  );
};
