import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PROFILE_DATA,
  SERVICES_DATA,
  PORTFOLIO_PROJECTS,
  PRICING_SNAPSHOT,
  FAQS,
  ProfileData,
  ServiceItem,
  PortfolioProject,
  FAQItem,
} from '../data/portfolioData';

interface PricingItem {
  service: string;
  price: string;
  model: string;
  highlight: string;
}

interface PortfolioContextType {
  profile: ProfileData;
  services: ServiceItem[];
  projects: PortfolioProject[];
  pricing: PricingItem[];
  faqs: FAQItem[];
  isEditMode: boolean;
  setIsEditMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  // Admin Security
  isAdminAuthenticated: boolean;
  adminEmail: string;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (val: boolean) => void;
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  changeAdminPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  saveToServer: () => Promise<boolean>;
  // Modals state
  editingProject: PortfolioProject | null | 'new';
  setEditingProject: (p: PortfolioProject | null | 'new') => void;
  isEditingText: boolean;
  setIsEditingText: (val: boolean) => void;
  textEditTab: 'hero' | 'about' | 'services' | 'pricing' | 'contact' | 'json';
  setTextEditTab: (tab: 'hero' | 'about' | 'services' | 'pricing' | 'contact' | 'json') => void;
  // Mutations
  updateProfile: (data: Partial<ProfileData>) => void;
  addProject: (data: Omit<PortfolioProject, 'id'> & { id?: string }) => void;
  updateProject: (project: PortfolioProject) => void;
  deleteProject: (id: string) => void;
  updateService: (service: ServiceItem) => void;
  updatePricingItem: (index: number, item: Partial<PricingItem>) => void;
  resetToDefaults: () => void;
  exportToJson: () => void;
  importFromJson: (jsonStr: string) => { success: boolean; error?: string };
  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const STORAGE_KEY = 'tanmay_portfolio_state_v2';
const ADMIN_TOKEN_KEY = 'tanmay_admin_token_v1';
const ADMIN_EMAIL = 'tanmay.05.a@gmail.com';
const FALLBACK_DEFAULT_PASSWORD = 'Tanmay@Admin2026';

const MOCK_PROJECT_IDS = [
  '7-seconds-psychology-ad',
  'cinematic-health-tech',
  'ecommerce-product-reveal',
  'ai-interactive-saas',
  'corporate-culture-documentary',
  'indori-poha-togetherness-ad',
  'kulhad-chai-conversations',
  'chhappan-dukan-twilight',
  'indore-morning-breakfast-craft',
  'b2b-saas-content-engine',
  '5-day-launch-site',
  'support-triage-automation',
  'ai-readiness-audit',
];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>(PROFILE_DATA);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DATA);
  const [projects, setProjects] = useState<PortfolioProject[]>(PORTFOLIO_PROJECTS);
  const [pricing, setPricing] = useState<PricingItem[]>(PRICING_SNAPSHOT);
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQS);
  const [isEditMode, setIsEditModeInternal] = useState<boolean>(false);

  // Admin Security States
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const [editingProject, setEditingProject] = useState<PortfolioProject | null | 'new'>(null);
  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const [textEditTab, setTextEditTab] = useState<'hero' | 'about' | 'services' | 'pricing' | 'contact' | 'json'>('hero');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // Safe setter for isEditMode - requires admin authentication!
  const setIsEditMode = useCallback(
    (val: boolean | ((prev: boolean) => boolean)) => {
      if (!isAdminAuthenticated) {
        // If not authenticated, open admin login modal
        setIsAdminModalOpen(true);
        showToast('Please enter Admin Credentials to enable editing.');
        return;
      }
      setIsEditModeInternal(val);
    },
    [isAdminAuthenticated, showToast]
  );

  // Save to LocalStorage helper
  const saveToStorage = useCallback(
    (
      nextProfile: ProfileData,
      nextServices: ServiceItem[],
      nextProjects: PortfolioProject[],
      nextPricing: PricingItem[],
      nextFaqs: FAQItem[]
    ) => {
      try {
        const payload = {
          profile: nextProfile,
          services: nextServices,
          projects: nextProjects,
          pricing: nextPricing,
          faqs: nextFaqs,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (err) {
        console.error('Failed to save to localStorage', err);
      }
    },
    []
  );

  // Direct persistence to Live Website Server (/api/portfolio)
  const syncWithServer = useCallback(
    async (
      overrideProfile?: ProfileData,
      overrideServices?: ServiceItem[],
      overrideProjects?: PortfolioProject[],
      overridePricing?: PricingItem[],
      overrideFaqs?: FAQItem[]
    ): Promise<boolean> => {
      const p = overrideProfile || profile;
      const s = overrideServices || services;
      const pr = overrideProjects || projects;
      const prc = overridePricing || pricing;
      const f = overrideFaqs || faqs;

      setIsSyncing(true);
      try {
        const token = adminToken || localStorage.getItem(ADMIN_TOKEN_KEY);
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('/api/portfolio', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            profile: p,
            services: s,
            projects: pr,
            pricing: prc,
            faqs: f,
          }),
        });

        if (res.ok) {
          const resData = await res.json();
          const timestamp = resData.updatedAt || new Date().toISOString();
          setLastSyncedAt(timestamp);
          setIsSyncing(false);
          return true;
        } else {
          console.warn('Server sync returned non-200, kept in local storage.');
          setIsSyncing(false);
          return false;
        }
      } catch (err) {
        console.warn('Server sync error (using local storage fallback):', err);
        setIsSyncing(false);
        return false;
      }
    },
    [profile, services, projects, pricing, faqs, adminToken]
  );

  const saveToServer = useCallback(async (): Promise<boolean> => {
    const success = await syncWithServer();
    if (success) {
      showToast('All changes published live to website!');
    } else {
      showToast('Changes saved locally.');
    }
    return success;
  }, [syncWithServer, showToast]);

  // Initial Data Load (Server first, then localStorage fallback, then defaults)
  useEffect(() => {
    let isMounted = true;

    async function loadPortfolioData() {
      try {
        // Try fetching live data from website server
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const serverJson = await res.json();
          if (serverJson.success && serverJson.data && isMounted) {
            const d = serverJson.data;
            if (d.profile) setProfile({ ...PROFILE_DATA, ...d.profile });
            if (d.services && Array.isArray(d.services)) setServices(d.services);
            if (d.projects && Array.isArray(d.projects)) {
              setProjects(d.projects.filter((p: PortfolioProject) => !MOCK_PROJECT_IDS.includes(p.id)));
            }
            if (d.pricing && Array.isArray(d.pricing)) setPricing(d.pricing);
            if (d.faqs && Array.isArray(d.faqs)) setFaqs(d.faqs);
            if (d.updatedAt) setLastSyncedAt(d.updatedAt);
            return;
          }
        }
      } catch {
        // Continue to localStorage fallback
      }

      // LocalStorage fallback
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          if (parsed.profile) setProfile({ ...PROFILE_DATA, ...parsed.profile });
          if (parsed.services && Array.isArray(parsed.services)) setServices(parsed.services);
          if (parsed.projects && Array.isArray(parsed.projects)) {
            setProjects(parsed.projects.filter((p: PortfolioProject) => !MOCK_PROJECT_IDS.includes(p.id)));
          }
          if (parsed.pricing && Array.isArray(parsed.pricing)) setPricing(parsed.pricing);
          if (parsed.faqs && Array.isArray(parsed.faqs)) setFaqs(parsed.faqs);
        }
      } catch (err) {
        console.error('Failed to load local storage:', err);
      }
    }

    loadPortfolioData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Verify Admin Token on mount
  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;

    fetch('/api/admin/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAdminAuthenticated(true);
        } else {
          // If server restarted or token expired, check if offline token matches
          if (token === 'tanmay_local_admin_session') {
            setIsAdminAuthenticated(true);
          }
        }
      })
      .catch(() => {
        // Fallback for offline/static deployment
        if (token) {
          setIsAdminAuthenticated(true);
        }
      });
  }, []);

  // Listen for admin shortcut (Ctrl+Shift+A or Cmd+Shift+A) or URL query ?admin=true
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // URL trigger: ?admin=true or #admin
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('admin') || window.location.hash === '#admin') {
        setIsAdminModalOpen(true);
      }
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Admin Login Action
  const loginAdmin = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.token) {
          setAdminToken(data.token);
          localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
          setIsAdminAuthenticated(true);
          setIsEditModeInternal(true);
          showToast('Welcome Tanmay! Admin edit mode unlocked.');
          return { success: true };
        }
      }
    } catch {
      // Continue to local fallback
    }

    // Fallback authentication for static or offline builds
    const storedCustomPass = localStorage.getItem('tanmay_admin_custom_password');
    const validPassword = storedCustomPass || FALLBACK_DEFAULT_PASSWORD;

    if (password === validPassword) {
      const localToken = 'tanmay_local_admin_session';
      setAdminToken(localToken);
      localStorage.setItem(ADMIN_TOKEN_KEY, localToken);
      setIsAdminAuthenticated(true);
      setIsEditModeInternal(true);
      showToast('Welcome Tanmay! Admin edit mode unlocked.');
      return { success: true };
    }

    return { success: false, error: 'Incorrect Admin Password. Please check and retry.' };
  };

  // Admin Logout Action
  const logoutAdmin = () => {
    try {
      if (adminToken) {
        fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
        }).catch(() => {});
      }
    } catch {
      // Ignore
    }
    setAdminToken(null);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setIsAdminAuthenticated(false);
    setIsEditModeInternal(false);
    showToast('Logged out of Admin Portal. Public preview restored.');
  };

  // Admin Change Password Action
  const changeAdminPassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    try {
      const token = adminToken || localStorage.getItem(ADMIN_TOKEN_KEY);
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('tanmay_admin_custom_password', newPassword);
          showToast('Admin password updated successfully.');
          return { success: true };
        }
      }
    } catch {
      // Ignore
    }

    // Save locally
    localStorage.setItem('tanmay_admin_custom_password', newPassword);
    showToast('Admin password updated successfully.');
    return { success: true };
  };

  // Data Mutations
  const updateProfile = (data: Partial<ProfileData>) => {
    const updated = { ...profile, ...data };
    setProfile(updated);
    saveToStorage(updated, services, projects, pricing, faqs);
    if (isAdminAuthenticated) {
      syncWithServer(updated, services, projects, pricing, faqs);
    }
    showToast('Profile information updated & saved directly to website.');
  };

  const addProject = (data: Omit<PortfolioProject, 'id'> & { id?: string }) => {
    const newId = data.id || `proj-${Date.now()}`;
    const newProject: PortfolioProject = {
      ...data,
      id: newId,
      badge: data.badge || 'Client Work',
      isCustom: true,
    };
    const updated = [newProject, ...projects];
    setProjects(updated);
    saveToStorage(profile, services, updated, pricing, faqs);
    if (isAdminAuthenticated) {
      syncWithServer(profile, services, updated, pricing, faqs);
    }
    showToast(`Project "${newProject.title}" published live!`);
  };

  const updateProject = (updatedProj: PortfolioProject) => {
    const updated = projects.map((p) => (p.id === updatedProj.id ? updatedProj : p));
    setProjects(updated);
    saveToStorage(profile, services, updated, pricing, faqs);
    if (isAdminAuthenticated) {
      syncWithServer(profile, services, updated, pricing, faqs);
    }
    showToast(`Project "${updatedProj.title}" updated on live site.`);
  };

  const deleteProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    saveToStorage(profile, services, updated, pricing, faqs);
    if (isAdminAuthenticated) {
      syncWithServer(profile, services, updated, pricing, faqs);
    }
    showToast(`Removed "${target?.title || 'project'}" from live portfolio.`);
  };

  const updateService = (updatedService: ServiceItem) => {
    const updated = services.map((s) => (s.id === updatedService.id ? updatedService : s));
    setServices(updated);
    saveToStorage(profile, updated, projects, pricing, faqs);
    if (isAdminAuthenticated) {
      syncWithServer(profile, updated, projects, pricing, faqs);
    }
    showToast(`Service "${updatedService.title}" updated.`);
  };

  const updatePricingItem = (index: number, item: Partial<PricingItem>) => {
    const updated = pricing.map((p, idx) => (idx === index ? { ...p, ...item } : p));
    setPricing(updated);
    saveToStorage(profile, services, projects, updated, faqs);
    if (isAdminAuthenticated) {
      syncWithServer(profile, services, projects, updated, faqs);
    }
    showToast('Pricing details updated on live site.');
  };

  const resetToDefaults = () => {
    setProfile(PROFILE_DATA);
    setServices(SERVICES_DATA);
    setProjects([]);
    setPricing(PRICING_SNAPSHOT);
    setFaqs(FAQS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    if (isAdminAuthenticated) {
      syncWithServer(PROFILE_DATA, SERVICES_DATA, [], PRICING_SNAPSHOT, FAQS);
    }
    showToast('Reset portfolio content to initial clean state.');
  };

  const exportToJson = () => {
    const exportData = {
      profile,
      services,
      projects,
      pricing,
      faqs,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tanmay-agrawal-portfolio-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Exported portfolio JSON data backup.');
  };

  const importFromJson = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.profile && !parsed.projects) {
        return { success: false, error: 'Invalid JSON format: missing profile or projects data.' };
      }
      if (parsed.profile) setProfile(parsed.profile);
      if (parsed.services && Array.isArray(parsed.services)) setServices(parsed.services);
      if (parsed.projects && Array.isArray(parsed.projects)) setProjects(parsed.projects);
      if (parsed.pricing && Array.isArray(parsed.pricing)) setPricing(parsed.pricing);
      if (parsed.faqs && Array.isArray(parsed.faqs)) setFaqs(parsed.faqs);

      saveToStorage(
        parsed.profile || profile,
        parsed.services || services,
        parsed.projects || projects,
        parsed.pricing || pricing,
        parsed.faqs || faqs
      );
      if (isAdminAuthenticated) {
        syncWithServer(
          parsed.profile || profile,
          parsed.services || services,
          parsed.projects || projects,
          parsed.pricing || pricing,
          parsed.faqs || faqs
        );
      }
      showToast('Successfully imported portfolio data and updated live site!');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Could not parse JSON.' };
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        services,
        projects,
        pricing,
        faqs,
        isEditMode,
        setIsEditMode,
        isAdminAuthenticated,
        adminEmail: ADMIN_EMAIL,
        isAdminModalOpen,
        setIsAdminModalOpen,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        isSyncing,
        lastSyncedAt,
        saveToServer,
        editingProject,
        setEditingProject,
        isEditingText,
        setIsEditingText,
        textEditTab,
        setTextEditTab,
        updateProfile,
        addProject,
        updateProject,
        deleteProject,
        updateService,
        updatePricingItem,
        resetToDefaults,
        exportToJson,
        importFromJson,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
