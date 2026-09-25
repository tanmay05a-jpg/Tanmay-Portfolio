import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { PortfolioProject } from '../data/portfolioData';
import { CommercialVideoPlayer } from './CommercialVideoPlayer';
import { VideoManagerModal } from './VideoManagerModal';
import {
  ExternalLink,
  X,
  Check,
  ArrowRight,
  Plus,
  Edit3,
  Trash2,
  BarChart2,
  Layers,
  Cpu,
  FileText,
  Globe,
  Sparkles,
  Film,
  Play,
  Volume2,
  Calendar,
  Upload,
} from 'lucide-react';

interface PortfolioSectionProps {
  onOpenBooking?: (serviceId?: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onOpenBooking }) => {
  const { projects, isEditMode, setEditingProject, deleteProject, profile, isAdminAuthenticated } = usePortfolio();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isVideoManagerOpen, setIsVideoManagerOpen] = useState(false);

  // Dynamic categories with priority for Video Production & Commercial Ads
  const categories = [
    { id: 'all', label: 'All Works' },
    { id: 'Advertisement / Commercial Video Creative', label: 'Commercial Videos & Ads' },
    { id: 'AI Product Strategy Consulting', label: 'AI Strategy & Roadmaps' },
    { id: 'AI Workflow / Automation Builder', label: 'Automations & Triage' },
    { id: 'Content Generation', label: 'Content Engines' },
    { id: 'Website Creation', label: '5-Day Websites' },
  ];

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.serviceCategory === activeCategory);

  // Bespoke illustrative visual component for projects on clean light background
  const renderProjectVisual = (project: PortfolioProject) => {
    // If a custom image or screenshot was uploaded for this project
    if (project.imageUrl) {
      return (
        <div className="h-48 w-full bg-slate-900 overflow-hidden relative border-b border-slate-200 group-hover:opacity-95 transition-opacity">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="rounded bg-slate-950/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono text-white border border-white/20">
              {project.badge}
            </span>
          </div>
        </div>
      );
    }

    // If it's one of Tanmay's video production works
    if (project.videoDetails) {
      return (
        <div className="h-52 w-full bg-slate-950 text-white flex flex-col justify-between overflow-hidden relative border-b border-slate-200 group-hover:bg-slate-900 transition-colors">
          {/* Cinema visual snapshot gradient */}
          <div
            className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity"
            style={{
              background:
                project.id === '7-seconds-psychology-ad'
                  ? 'radial-gradient(circle at 70% 30%, #10b981 0%, #0f172a 70%)'
                  : project.id === 'indori-poha-togetherness-ad'
                  ? 'radial-gradient(circle at 50% 40%, #eab308 0%, #451a03 75%)'
                  : project.id === 'kulhad-chai-conversations'
                  ? 'radial-gradient(circle at 60% 40%, #ea580c 0%, #1c130d 75%)'
                  : project.id === 'chhappan-dukan-twilight'
                  ? 'radial-gradient(circle at 50% 30%, #a855f7 0%, #0f172a 75%)'
                  : 'radial-gradient(circle at 50% 40%, #f59e0b 0%, #1c1917 75%)',
            }}
          />

          <div className="flex items-center justify-between text-xs text-slate-300 relative z-10 p-3 pb-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-[11px] text-red-400 uppercase tracking-wider font-semibold">
                {project.videoDetails.type === 'short_ad' ? 'Viral Video Ad' : 'Commercial Cut'}
              </span>
            </div>
            <span className="text-[10px] text-slate-300 font-mono bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
              {project.videoDetails.duration}
            </span>
          </div>

          {/* Center Play Button Overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center my-1 group-hover:scale-105 transition-transform">
            <div className="h-11 w-11 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg group-hover:bg-blue-600 transition-colors">
              <Play className="h-5 w-5 ml-0.5 fill-white text-white" />
            </div>
            <span className="mt-1.5 text-[10px] font-bold text-white tracking-wide uppercase font-mono bg-black/70 px-2 py-0.5 rounded">
              Watch Commercial Reel
            </span>
          </div>

          {/* Video script quote and aesthetic framing */}
          <div className="relative z-10 px-3 pb-2.5">
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 italic line-clamp-1">
              "{project.videoDetails.scriptExcerpt}"
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 font-mono">
              <span className="text-emerald-400 font-bold">{project.impactMetric}</span>
              <span>{project.timeline}</span>
            </div>
          </div>
        </div>
      );
    }

    switch (project.id) {
      case 'saas-content-engine':
        return (
          <div className="h-48 w-full bg-slate-900 p-5 text-white flex flex-col justify-between overflow-hidden relative border-b border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-blue-400" />
                <span className="font-mono text-[11px]">content_pipeline.config</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">8/8 Posts Verified</span>
            </div>
            <div className="space-y-2 my-2">
              <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded text-xs border border-slate-700/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-slate-200 font-medium truncate">Cluster A: "Predictive Capacity Planning for B2B SaaS"</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded text-xs border border-slate-700/60">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                <span className="text-slate-200 font-medium truncate">Founder Ghostwriting: 4-Part LinkedIn Authority Sequence</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800 font-mono">
              <span>SOP Handoff: Complete</span>
              <span>Organic Target: +180%</span>
            </div>
          </div>
        );

      case '5-day-launch-site':
        return (
          <div className="h-48 w-full bg-slate-950 p-5 text-white flex flex-col justify-between overflow-hidden relative border-b border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-mono text-[11px]">wellness-consulting.co</span>
              </div>
              <span className="text-[11px] text-blue-400 font-mono">Day 5 · Production Live</span>
            </div>
            <div className="rounded border border-slate-800 bg-slate-900/90 p-2.5 my-1.5">
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800">
                <span className="font-semibold text-slate-200 truncate">Executive Longevity Advisory</span>
                <span className="text-emerald-400 font-mono text-[10px]">Active</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 mt-2 text-center text-[10px] text-slate-400">
                <div className="bg-slate-800/60 py-1 rounded">Philosophy</div>
                <div className="bg-slate-800/60 py-1 rounded">Protocol</div>
                <div className="bg-slate-800/60 py-1 rounded">Schedule</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800 font-mono">
              <span>Mobile Score: 98/100</span>
              <span>Cal.com Synced</span>
            </div>
          </div>
        );

      case 'support-triage-automation':
        return (
          <div className="h-48 w-full bg-slate-950 p-5 text-white flex flex-col justify-between overflow-hidden relative border-b border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-blue-400" />
                <span className="font-mono text-[11px]">inbound_ticket_router.flow</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">-60% Sorting Drag</span>
            </div>
            <div className="flex items-center justify-between gap-2 my-2 text-[10px]">
              <div className="bg-slate-900 border border-slate-800 p-2 rounded text-center flex-1">
                <div className="text-slate-400 text-[9px]">Query</div>
                <div className="font-mono text-slate-200 text-xs">Customer</div>
              </div>
              <div className="text-blue-400 font-mono text-xs">→ Triage →</div>
              <div className="bg-blue-950/40 border border-blue-800/60 p-2 rounded text-center flex-1">
                <div className="text-blue-300 text-[9px]">Intent</div>
                <div className="font-mono text-emerald-400 text-xs">Auto-Draft</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800 font-mono">
              <span>Avg Latency: 1.8s</span>
              <span>Human Escalate: Checked</span>
            </div>
          </div>
        );

      case 'ai-readiness-audit':
        return (
          <div className="h-48 w-full bg-slate-900 p-5 text-white flex flex-col justify-between overflow-hidden relative border-b border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-purple-400" />
                <span className="font-mono text-[11px]">agency_strategy_matrix.pdf</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">2h Session Completed</span>
            </div>
            <div className="space-y-1 my-1 text-xs">
              <div className="flex justify-between items-center bg-slate-800/60 p-1 rounded px-2 text-[11px]">
                <span className="text-slate-300 truncate">1. Client Confidentiality</span>
                <span className="text-emerald-400 font-mono text-[10px]">Ready</span>
              </div>
              <div className="flex justify-between items-center bg-slate-800/60 p-1 rounded px-2 text-[11px]">
                <span className="text-slate-300 truncate">2. 3 High-ROI Workflows</span>
                <span className="text-blue-400 font-mono text-[10px]">Mapped</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800 font-mono">
              <span>Team Size: 10 People</span>
              <span>-$450/mo Subscriptions</span>
            </div>
          </div>
        );

      default:
        // Elegant custom project visual frame
        return (
          <div className="h-48 w-full bg-gradient-to-br from-slate-900 to-slate-950 p-5 text-white flex flex-col justify-between overflow-hidden relative border-b border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span className="font-mono text-[11px] truncate max-w-[170px]">
                  {project.serviceCategory}
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">{project.timeline}</span>
            </div>
            <div className="my-2 p-2.5 rounded-lg bg-slate-800/70 border border-slate-700/60">
              <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">
                Measurable Outcome
              </div>
              <div className="text-sm font-bold text-white mt-0.5 truncate">
                {project.impactMetric}
              </div>
              <div className="text-[11px] text-slate-300 truncate mt-0.5">
                {project.impactDetails}
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800 font-mono">
              <span>{project.badge}</span>
              <span>{project.techStack?.[0] || 'AI Automation'}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <section id="portfolio" className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with "Add Work" button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <span>Portfolio &amp; Case Studies</span>
              <span aria-hidden="true">·</span>
              <span>Commercial Ads, Strategy &amp; Automation</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
              Representative Projects &amp; Commercial Video Campaigns
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal">
              From viral psychology-driven video ads to enterprise AI roadmaps and 5-day websites for ambitious founders and product teams.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setEditingProject('new')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span>Attach New Video / Work</span>
            </button>

            {projects.length > 0 && (
              <button
                type="button"
                onClick={() => setIsVideoManagerOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50/70 px-3.5 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors shadow-sm whitespace-nowrap"
              >
                <Film className="h-3.5 w-3.5 text-blue-600" />
                <span>Manage Videos</span>
              </button>
            )}

            <div className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
              {projects.length} {projects.length === 1 ? 'Work' : 'Works'}
            </div>
          </div>
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="mt-8 sm:mt-10 flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto sm:flex-wrap no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 sm:px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="mt-8 sm:mt-10 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-6 sm:p-14 text-center">
            <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4 shadow-xs">
              <Film className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {activeCategory === 'all'
                ? 'Portfolio Ready for Your Videos & Works'
                : `No works attached in "${categories.find((c) => c.id === activeCategory)?.label || activeCategory}" yet`}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Attach your commercial video ads, video reels, case studies, or system workflows. You can upload video files (.mp4/.webm/.mov) directly or embed video links.
            </p>

            {isAdminAuthenticated ? (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setEditingProject('new')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-blue-500 shadow-sm hover:shadow-md transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Attach New Video / Work</span>
                </button>

                {activeCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setActiveCategory('all')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    <span>View All Works</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => (onOpenBooking ? onOpenBooking() : undefined)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-blue-500 shadow-sm hover:shadow-md transition-all group"
                >
                  <span>Request Custom Video or Strategy</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                {activeCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setActiveCategory('all')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    <span>View All Works</span>
                  </button>
                )}
              </div>
            )}

            {/* Quick format guide pill badges */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                Direct MP4 / WebM / MOV Upload
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                YouTube / Vimeo / Loom Links
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                9:16 Vertical Reels &amp; 16:9 Cinema
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project: PortfolioProject) => (
              <div
                key={project.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between transition-all hover:shadow-lg group relative"
              >
              <div>
                {/* Visual Architecture Preview */}
                {renderProjectVisual(project)}

                {/* Content Details */}
                <div className="p-6">
                  {/* Zero-Pill unboxed metadata */}
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-blue-700 font-semibold">{project.badge}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{project.serviceCategory}</span>
                    </div>

                    {/* Quick Video & Edit actions (Only visible when logged in as Admin and in Edit Mode) */}
                    {isAdminAuthenticated && isEditMode && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                            setIsVideoManagerOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                          title="Upload or Change Video"
                          aria-label="Upload or change video"
                        >
                          <Film className="h-3 w-3" />
                          <span>Video</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProject(project);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Edit Project Details"
                          aria-label="Edit project"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        {project.isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete "${project.title}"?`)) {
                                deleteProject(project.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Project"
                            aria-label="Delete project"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {project.summary}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                      Key Quantified Outcome
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-900">
                      {project.impactMetric}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">
                      {project.impactDetails}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer with Details Button & optional live link */}
              <div className="px-6 pb-6 pt-2 flex items-center gap-2">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="flex-1 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100 whitespace-nowrap"
                >
                  <span>
                    {project.videoDetails ? 'Inspect commercial brief & script' : 'Inspect full project brief'}
                  </span>
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5 text-slate-500" />
                </button>

                {project.videoDetails && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                      setIsVideoManagerOpen(true);
                    }}
                    className="p-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-colors shrink-0"
                    title="Upload or change video for this commercial"
                    aria-label="Upload or change video"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                )}

                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 shrink-0"
                    title="Open Live Project URL"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Modal for In-depth Case Study & Video Inspection */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-700 focus:outline-none"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="text-blue-700 font-semibold">{selectedProject.badge}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedProject.serviceCategory}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedProject.timeline}</span>
              </div>

              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {selectedProject.title}
              </h3>
              {selectedProject.tagline && (
                <p className="mt-1 text-sm text-slate-600 font-medium">
                  {selectedProject.tagline}
                </p>
              )}

              {/* Video Specific Section in Modal */}
              {selectedProject.videoDetails && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                      <Film className="h-4 w-4 text-blue-600" />
                      <span>Watch Broadcast Commercial Video</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsVideoManagerOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                    >
                      <Upload className="h-3 w-3" />
                      <span>Upload / Change Video</span>
                    </button>
                  </div>

                  <CommercialVideoPlayer
                    project={selectedProject}
                    onOpenVideoManager={() => setIsVideoManagerOpen(true)}
                    autoPlay={true}
                  />

                  <div className="rounded-xl bg-slate-900 text-white p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono text-red-400">● Broadcast Script &amp; Direction</span>
                      <span className="font-mono text-slate-300">{selectedProject.videoDetails.duration}</span>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded border border-slate-700 text-xs italic text-slate-200 leading-relaxed">
                      "{selectedProject.videoDetails.scriptExcerpt}"
                    </div>
                    <div className="pt-1 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">Cinematography Style: </span>
                      {selectedProject.videoDetails.videoStyle}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-5 text-xs leading-relaxed text-slate-600">
                {selectedProject.clientContext && (
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                    <span className="font-semibold text-slate-800 block text-xs uppercase tracking-wider mb-1">
                      Client Context &amp; Industry:
                    </span>
                    {selectedProject.clientContext}
                  </div>
                )}

                {selectedProject.problem && (
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">The Core Problem</h4>
                    <p className="mt-1">{selectedProject.problem}</p>
                  </div>
                )}

                {selectedProject.solution && (
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Strategic Solution &amp; Execution</h4>
                    <p className="mt-1">{selectedProject.solution}</p>
                  </div>
                )}

                {selectedProject.deliverables?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Handoff Deliverables</h4>
                    <ul className="mt-2 space-y-1.5">
                      {selectedProject.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                  <div className="text-blue-900 font-bold text-sm">Impact &amp; Measurable Result</div>
                  <div className="mt-1 text-blue-800 text-xs">
                    <span className="font-semibold">{selectedProject.impactMetric}:</span> {selectedProject.impactDetails}
                  </div>
                </div>

                {selectedProject.techStack?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Technology &amp; Tooling Stack</h4>
                    <div className="mt-2 flex flex-wrap gap-2 text-slate-700 font-mono text-[11px]">
                      {selectedProject.techStack.map((tech, idx) => (
                        <span key={idx} className="bg-slate-100 border border-slate-200 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      const p = selectedProject;
                      setSelectedProject(null);
                      setEditingProject(p);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                    <span>Edit this project</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsVideoManagerOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Upload className="h-3.5 w-3.5 text-blue-600" />
                    <span>Upload / Change Video</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 whitespace-nowrap shadow-sm transition-colors"
                >
                  <span>Close</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Manager Modal */}
        <VideoManagerModal
          isOpen={isVideoManagerOpen}
          onClose={() => setIsVideoManagerOpen(false)}
          defaultProjectId={selectedProject?.id}
        />
      </div>
    </section>
  );
};
