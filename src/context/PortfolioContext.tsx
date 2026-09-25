import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const [editingProject, setEditingProject] = useState<PortfolioProject | null | 'new'>(null);
  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const [textEditTab, setTextEditTab] = useState<'hero' | 'about' | 'services' | 'pricing' | 'contact' | 'json'>('hero');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.profile) {
          const loadedProfile = { ...PROFILE_DATA, ...parsed.profile };
          if (loadedProfile.headline) {
            loadedProfile.headline = loadedProfile.headline.replace(/US\s*(&|and)\s*UK\s*/gi, '').replace(/\s+/g, ' ').trim();
          }
          if (loadedProfile.aboutBio) {
            loadedProfile.aboutBio = loadedProfile.aboutBio.replace(/\s*in the US (and|&)\s*UK\s*/gi, ' ').replace(/\s+/g, ' ').trim();
          }
          if (loadedProfile.markets && (loadedProfile.markets.includes('United Kingdom') || loadedProfile.markets.includes('US'))) {
            loadedProfile.markets = PROFILE_DATA.markets;
          }
          if (!loadedProfile.linkedinUrl) {
            loadedProfile.linkedinUrl = PROFILE_DATA.linkedinUrl;
          }
          if (!loadedProfile.location || loadedProfile.location === 'Remote / Global Support') {
            loadedProfile.location = PROFILE_DATA.location;
          }
          setProfile(loadedProfile);
        }
        if (parsed.services && Array.isArray(parsed.services)) {
          // Merge defaults with stored services to guarantee all 5 offerings exist
          const mergedServices = SERVICES_DATA.map((defaultSvc) => {
            const existing = parsed.services.find((s: ServiceItem) => s.id === defaultSvc.id);
            return existing ? { ...defaultSvc, ...existing } : defaultSvc;
          });
          const customServices = parsed.services.filter(
            (s: ServiceItem) => !SERVICES_DATA.some((ds) => ds.id === s.id)
          );
          setServices([...mergedServices, ...customServices]);
        } else {
          setServices(SERVICES_DATA);
        }
        if (parsed.projects && Array.isArray(parsed.projects)) {
          // Keep only user-created custom projects, removing all legacy mock items
          const userProjects = parsed.projects.filter(
            (p: PortfolioProject) => !MOCK_PROJECT_IDS.includes(p.id)
          );
          setProjects(userProjects);
        } else {
          setProjects([]);
        }
        if (parsed.pricing && Array.isArray(parsed.pricing)) setPricing(parsed.pricing);
        if (parsed.faqs && Array.isArray(parsed.faqs)) {
          const updatedFaqs = parsed.faqs.map((f: any) => {
            if (f.question && (f.question.includes('US and UK') || f.question.includes('US & UK'))) {
              return FAQS.find((df) => df.question.includes('different time zones')) || f;
            }
            return f;
          });
          setFaqs(updatedFaqs);
        }
      }
    } catch (err) {
      console.error('Failed to load portfolio data from storage', err);
    }
  }, []);

  // Sync to localStorage
  const saveToStorage = (
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
  };

  const updateProfile = (data: Partial<ProfileData>) => {
    const updated = { ...profile, ...data };
    setProfile(updated);
    saveToStorage(updated, services, projects, pricing, faqs);
    showToast('Profile information updated.');
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
    showToast(`Project "${newProject.title}" added to your portfolio!`);
  };

  const updateProject = (updatedProj: PortfolioProject) => {
    const updated = projects.map((p) => (p.id === updatedProj.id ? updatedProj : p));
    setProjects(updated);
    saveToStorage(profile, services, updated, pricing, faqs);
    showToast(`Project "${updatedProj.title}" updated.`);
  };

  const deleteProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    saveToStorage(profile, services, updated, pricing, faqs);
    showToast(`Removed "${target?.title || 'project'}" from portfolio.`);
  };

  const updateService = (updatedService: ServiceItem) => {
    const updated = services.map((s) => (s.id === updatedService.id ? updatedService : s));
    setServices(updated);
    saveToStorage(profile, updated, projects, pricing, faqs);
    showToast(`Service "${updatedService.title}" updated.`);
  };

  const updatePricingItem = (index: number, item: Partial<PricingItem>) => {
    const updated = pricing.map((p, idx) => (idx === index ? { ...p, ...item } : p));
    setPricing(updated);
    saveToStorage(profile, services, projects, updated, faqs);
    showToast('Pricing details updated.');
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
    showToast('Exported portfolio JSON data file.');
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
      showToast('Successfully imported portfolio data!');
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
