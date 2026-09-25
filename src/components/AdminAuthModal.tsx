import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  LogOut,
  Download,
  Sparkles,
  Cloud,
  FileCode,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const AdminAuthModal: React.FC = () => {
  const {
    isAdminAuthenticated,
    adminEmail,
    isAdminModalOpen,
    setIsAdminModalOpen,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword,
    isEditMode,
    setIsEditMode,
    isSyncing,
    lastSyncedAt,
    saveToServer,
    exportToJson,
    projects,
    showToast,
  } = usePortfolio();

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Change password states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isAdminModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!passwordInput.trim()) {
      setLoginError('Please enter your admin password.');
      return;
    }
    setIsSubmitting(true);
    const result = await loginAdmin(passwordInput.trim());
    setIsSubmitting(false);
    if (result.success) {
      setPasswordInput('');
      setLoginError(null);
    } else {
      setLoginError(result.error || 'Incorrect admin password. Please try again.');
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMessage(null);

    if (newPasswordInput.length < 6) {
      setPasswordChangeMessage({ text: 'New password must be at least 6 characters.', isError: true });
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeMessage({ text: 'Passwords do not match.', isError: true });
      return;
    }

    setIsSubmitting(true);
    const result = await changeAdminPassword(newPasswordInput.trim());
    setIsSubmitting(false);

    if (result.success) {
      setPasswordChangeMessage({ text: 'Password changed successfully! Keep it safe.', isError: false });
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordChangeMessage(null);
      }, 2000);
    } else {
      setPasswordChangeMessage({ text: result.error || 'Failed to update password.', isError: true });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isAdminAuthenticated ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
              {isAdminAuthenticated ? <ShieldCheck className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
            </div>
            <div>
              <h2 id="admin-modal-title" className="text-sm font-bold text-slate-900 tracking-tight">
                {isAdminAuthenticated ? 'Admin Control Center' : 'Admin Security Verification'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {isAdminAuthenticated ? `Active Session: ${adminEmail}` : 'Authorized Access Only · Tanmay Agrawal'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAdminModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {!isAdminAuthenticated ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-4 text-xs text-blue-900 leading-relaxed">
                <div className="font-semibold flex items-center gap-1.5 text-blue-950">
                  <KeyRound className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Admin Credentials Required</span>
                </div>
                <p className="mt-1 text-slate-600">
                  To protect your portfolio from unauthorized edits, editing controls, video management, and pricing adjustments are locked behind your admin password.
                </p>
              </div>

              {loginError && (
                <div className="flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter your admin password"
                    autoFocus
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-500 space-y-1 font-mono">
                <div className="text-slate-700 font-semibold font-sans">Default Admin Credential:</div>
                <div>Password: <span className="text-blue-700 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">Tanmay@Admin2026</span></div>
                <div className="text-[10px] text-slate-400 font-sans italic pt-0.5">
                  (You can change this password to your personal one immediately after logging in)
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 shadow-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="h-3.5 w-3.5" />
                      <span>Unlock Admin Mode</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ================= LOGGED IN ADMIN DASHBOARD ================= */
            <div className="space-y-5">
              {/* Status Box */}
              <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Admin Authentication Active</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-mono px-2 py-0.5 rounded-full font-semibold">
                    Authorized
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  You have full editing privileges. All changes you make (bio, photos, videos, custom projects, pricing) directly publish to your live website.
                </p>

                <div className="mt-3 pt-3 border-t border-emerald-200/70 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Cloud className="h-3.5 w-3.5 text-blue-600" />
                    <span>
                      {isSyncing ? 'Syncing with live website...' : lastSyncedAt ? `Live synced: ${new Date(lastSyncedAt).toLocaleTimeString()}` : 'Connected to server'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => saveToServer()}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-800 underline"
                  >
                    <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Force Sync Now</span>
                  </button>
                </div>
              </div>

              {/* Mode Toggle & Direct Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Live Edit Controls</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Show in-page floating toolbar &amp; editing pencils
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditMode(!isEditMode);
                      showToast(isEditMode ? 'Edit Mode Disabled' : 'Edit Mode Enabled');
                    }}
                    className={`mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg py-2 px-3 text-xs font-bold transition-colors ${
                      isEditMode
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${isEditMode ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                    <span>{isEditMode ? 'Edit Mode ON' : 'Turn On Edit Mode'}</span>
                  </button>
                </div>

                <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Portfolio Data Backup</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Export full JSON for offline backup or GitHub sync
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={exportToJson}
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5 text-blue-600" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>
              </div>

              {/* Change Password Section */}
              <div className="rounded-xl border border-slate-200 p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <KeyRound className="h-4 w-4 text-blue-600" />
                    <span>Admin Security Password</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(!isChangingPassword);
                      setPasswordChangeMessage(null);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {isChangingPassword ? 'Cancel' : 'Change Password'}
                  </button>
                </div>

                {isChangingPassword && (
                  <form onSubmit={handlePasswordChangeSubmit} className="mt-4 space-y-3 pt-3 border-t border-slate-200">
                    {passwordChangeMessage && (
                      <div
                        className={`p-2.5 rounded-lg text-xs flex items-center gap-1.5 ${
                          passwordChangeMessage.isError
                            ? 'bg-rose-50 border border-rose-200 text-rose-800'
                            : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        }`}
                      >
                        {passwordChangeMessage.isError ? (
                          <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        )}
                        <span>{passwordChangeMessage.text}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        New Password (minimum 6 characters)
                      </label>
                      <input
                        type="password"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder="Enter new strong password"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-slate-900 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Updating...' : 'Save New Password'}
                    </button>
                  </form>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200 gap-3">
                <button
                  type="button"
                  onClick={logoutAdmin}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log Out Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 shadow-sm transition-all"
                >
                  <span>Close Window</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
