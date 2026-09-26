import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, Sparkles, ExternalLink, Film, Video, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { PortfolioProject } from '../data/portfolioData';
import { parseVideoSource } from './CommercialVideoPlayer';

const SERVICE_OPTIONS = [
  'Advertisement / Commercial Video Creative',
  'AI Product Strategy Consulting',
  'AI Workflow / Automation Builder',
  'Content Generation',
  'Website Creation',
];

const BADGE_OPTIONS = [
  'Video Production',
  'Commercial Ad',
  'Client Work',
  'Featured Project',
  'Case Study',
  'Production Build',
];

export const ProjectEditorModal: React.FC = () => {
  const {
    editingProject,
    setEditingProject,
    addProject,
    updateProject,
    deleteProject,
    uploadMediaFile,
    showToast,
  } = usePortfolio();

  const isNew = editingProject === 'new';
  const existingProject = typeof editingProject === 'object' ? editingProject : null;

  const [formData, setFormData] = useState<Partial<PortfolioProject>>({
    title: '',
    serviceCategory: SERVICE_OPTIONS[0],
    badge: 'Client Work',
    tagline: '',
    summary: '',
    clientContext: '',
    problem: '',
    solution: '',
    deliverables: [''],
    impactMetric: '',
    impactDetails: '',
    timeline: '1–2 weeks',
    techStack: [],
    projectUrl: '',
  });

  const [techInput, setTechInput] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'impact'>('details');

  useEffect(() => {
    if (existingProject) {
      setFormData({
        ...existingProject,
        deliverables: existingProject.deliverables?.length ? [...existingProject.deliverables] : [''],
        techStack: existingProject.techStack ? [...existingProject.techStack] : [],
      });
      setTechInput(existingProject.techStack?.join(', ') || '');
    } else if (isNew) {
      setFormData({
        title: '',
        serviceCategory: SERVICE_OPTIONS[0],
        badge: 'Client Work',
        tagline: '',
        summary: '',
        clientContext: '',
        problem: '',
        solution: '',
        deliverables: ['Documented execution SOP and prompts', 'Production build & integration', 'Recorded video walkthrough'],
        impactMetric: '',
        impactDetails: '',
        timeline: '1–2 weeks',
        techStack: ['Claude / GPT-4o', 'Automation Webhooks', 'Notion'],
        projectUrl: '',
        isCustom: true,
      });
      setTechInput('Claude / GPT-4o, Automation Webhooks, Notion');
    }
  }, [editingProject]);

  if (!editingProject) return null;

  const handleDeliverableChange = (idx: number, value: string) => {
    const list = [...(formData.deliverables || [''])];
    list[idx] = value;
    setFormData({ ...formData, deliverables: list });
  };

  const addDeliverableField = () => {
    setFormData({ ...formData, deliverables: [...(formData.deliverables || []), ''] });
  };

  const removeDeliverableField = (idx: number) => {
    const list = [...(formData.deliverables || [''])];
    if (list.length > 1) {
      list.splice(idx, 1);
      setFormData({ ...formData, deliverables: list });
    }
  };

  const handleTechChange = (val: string) => {
    setTechInput(val);
    const tags = val
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData({ ...formData, techStack: tags });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    const cleanedDeliverables = (formData.deliverables || [])
      .map((d) => d.trim())
      .filter(Boolean);

    const projectPayload: PortfolioProject = {
      id: existingProject ? existingProject.id : `work-${Date.now()}`,
      title: formData.title || 'Untitled Project',
      serviceCategory: formData.serviceCategory || SERVICE_OPTIONS[0],
      badge: formData.badge || 'Client Work',
      tagline: formData.tagline || '',
      summary: formData.summary || '',
      clientContext: formData.clientContext || '',
      problem: formData.problem || '',
      solution: formData.solution || '',
      deliverables: cleanedDeliverables.length ? cleanedDeliverables : ['Production implementation and documentation'],
      impactMetric: formData.impactMetric || 'Measurable ROI',
      impactDetails: formData.impactDetails || 'Delivered with full client ownership and documentation.',
      timeline: formData.timeline || '1–2 weeks',
      techStack: formData.techStack?.length ? formData.techStack : ['AI Tooling', 'Automation'],
      projectUrl: formData.projectUrl?.trim() || undefined,
      imageUrl: formData.imageUrl?.trim() || undefined,
      videoUrl: formData.videoUrl?.trim() || undefined,
      aspectRatio: formData.aspectRatio || '16:9',
      videoDetails: (formData.videoUrl || formData.videoDetails) ? {
        type: formData.videoDetails?.type || 'commercial',
        duration: formData.videoDetails?.duration || '0:30',
        scriptExcerpt: formData.videoDetails?.scriptExcerpt || formData.summary || 'Commercial broadcast video',
        keyThemes: formData.videoDetails?.keyThemes || ['Commercial Ad', 'Brand Vision'],
        videoStyle: formData.videoDetails?.videoStyle || 'Cinematic direction with high-impact visuals',
        highlights: formData.videoDetails?.highlights || ['Dynamic storytelling', 'Broadcast framing'],
      } : undefined,
      isCustom: true,
    };

    if (isNew) {
      addProject(projectPayload);
    } else {
      updateProject(projectPayload);
    }
    setEditingProject(null);
  };

  const handleDelete = () => {
    if (existingProject) {
      if (window.confirm(`Are you sure you want to remove "${existingProject.title}" from your portfolio?`)) {
        deleteProject(existingProject.id);
        setEditingProject(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isNew ? 'Add Project / Work to Portfolio' : `Edit: ${existingProject?.title}`}
            </h2>
            <p className="text-xs text-slate-500">
              {isNew
                ? 'Showcase real client work, automation builds, or customized case studies.'
                : 'Modify project details, outcomes, or deliverables.'}
            </p>
          </div>
          <button
            onClick={() => setEditingProject(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
          {/* Section: Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Autonomous Customer Support Triage System"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Service Offering Category *
              </label>
              <select
                value={formData.serviceCategory}
                onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none bg-white"
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Project Label / Badge
              </label>
              <select
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none bg-white"
              >
                {BADGE_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tagline & External Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                One-Line Tagline / Hook
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. Automated ticket classification cutting triage by 60%"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Live URL / Case Study Link (Optional)
              </label>
              <input
                type="url"
                value={formData.projectUrl || ''}
                onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                placeholder="https://example.com or live link"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Project Image / Screenshot Thumbnail (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Image URL or upload a file..."
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none font-mono"
                />
                <label className="cursor-pointer inline-flex items-center px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors shrink-0">
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        setFormData({ ...formData, imageUrl: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section: Video Upload & Configuration */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <span>Commercial Video Media &amp; Upload</span>
              </span>
              <span className="text-[10px] text-blue-700 font-mono">
                {formData.videoUrl ? 'Video Attached' : 'Optional Video Reel'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Upload Video File (.mp4, .webm, .mov)
                </label>
                <label className="cursor-pointer flex items-center justify-center p-2.5 rounded-lg border border-dashed border-blue-300 bg-white hover:bg-blue-50 text-blue-700 font-semibold text-xs transition-colors">
                  <span>
                    {formData.videoUrl?.startsWith('/api/media/')
                      ? '✓ Video Stored on Server'
                      : formData.videoUrl?.startsWith('data:') || formData.videoUrl?.startsWith('blob:')
                      ? '✓ Video File Uploaded'
                      : 'Choose Video File (.mp4 / .webm)'}
                  </span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      showToast(`Uploading video "${file.name}" to server...`);
                      const res = await uploadMediaFile(file);
                      if (res.url) {
                        setFormData({ ...formData, videoUrl: res.url });
                        showToast(`Video "${file.name}" uploaded successfully!`);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Or Video URL (YouTube Shorts, YouTube, Vimeo, Loom, Google Drive, MP4 link)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/shorts/... or https://.../video.mp4"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none font-mono"
                />
                {formData.videoUrl && (
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>
                      Detected: <strong>{parseVideoSource(formData.videoUrl).label}</strong>
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Video Aspect Ratio
                </label>
                <select
                  value={formData.aspectRatio || '16:9'}
                  onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  <option value="16:9">16:9 Cinema Widescreen</option>
                  <option value="9:16">9:16 Vertical Reel (Shorts/TikTok/Reels)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Video Duration
                </label>
                <input
                  type="text"
                  value={formData.videoDetails?.duration || '0:15'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      videoDetails: {
                        type: formData.videoDetails?.type || 'commercial',
                        scriptExcerpt: formData.videoDetails?.scriptExcerpt || '',
                        duration: e.target.value,
                        keyThemes: formData.videoDetails?.keyThemes || ['Commercial'],
                        videoStyle: formData.videoDetails?.videoStyle || 'Cinematic',
                        highlights: formData.videoDetails?.highlights || [],
                      },
                    })
                  }
                  placeholder="e.g. 0:15 or 0:30 Cut"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none font-mono"
                />
              </div>
            </div>

            {formData.videoUrl && (
              <div className="rounded-lg bg-slate-900 p-2.5 flex items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-2 min-w-0 text-xs">
                  <Film className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="font-mono text-[11px] truncate text-slate-200">
                    {formData.videoUrl.startsWith('data:')
                      ? 'Local Video File Attached'
                      : formData.videoUrl.startsWith('blob:')
                      ? 'Local Video Object Attached'
                      : formData.videoUrl}
                  </span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono shrink-0">
                    {formData.aspectRatio || '16:9'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, videoUrl: undefined })}
                  className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors shrink-0"
                >
                  Remove Video
                </button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1">
              Short Summary (Visible on card)
            </label>
            <textarea
              rows={2}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="High-level overview of what was built and the result achieved for the client..."
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Client Context, Problem & Solution */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Client Context &amp; Industry
              </label>
              <input
                type="text"
                value={formData.clientContext}
                onChange={(e) => setFormData({ ...formData, clientContext: e.target.value })}
                placeholder="e.g. Fast-scaling D2C brand with 300+ daily inquiries"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  The Problem
                </label>
                <textarea
                  rows={3}
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  placeholder="What was the business bottleneck or pain point?"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Strategic Solution &amp; Execution
                </label>
                <textarea
                  rows={3}
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  placeholder="How did you solve it using AI and product discipline?"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="rounded-xl bg-blue-50/60 border border-blue-200/80 p-4 space-y-3">
            <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-700" />
              <span>Quantified Business Outcome</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-blue-950 mb-1">
                  Impact Metric *
                </label>
                <input
                  type="text"
                  value={formData.impactMetric}
                  onChange={(e) => setFormData({ ...formData, impactMetric: e.target.value })}
                  placeholder="e.g. -60% Sorting Time or +34% Leads"
                  className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-blue-950 mb-1">
                  Impact Details
                </label>
                <input
                  type="text"
                  value={formData.impactDetails}
                  onChange={(e) => setFormData({ ...formData, impactDetails: e.target.value })}
                  placeholder="e.g. Eliminated manual sorting lag; urgent tickets addressed in 8 mins"
                  className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Deliverables List */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-900">
                Key Handoff Deliverables
              </label>
              <button
                type="button"
                onClick={addDeliverableField}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-800"
              >
                <Plus className="h-3 w-3" />
                <span>Add Item</span>
              </button>
            </div>
            <div className="space-y-2">
              {formData.deliverables?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleDeliverableChange(idx, e.target.value)}
                    placeholder={`Deliverable ${idx + 1}`}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                  {formData.deliverables && formData.deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDeliverableField(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline & Tech Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Execution Timeline
              </label>
              <input
                type="text"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                placeholder="e.g. 5 business days, 3 weeks"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Tech / Tooling Stack (comma-separated)
              </label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => handleTechChange(e.target.value)}
                placeholder="e.g. Make.com, Claude 3.5, Airtable, Webflow"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none font-mono"
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between gap-4">
          <div>
            {!isNew && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Project</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditingProject(null)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm"
            >
              <Check className="mr-1.5 h-3.5 w-3.5" />
              <span>{isNew ? 'Add to Portfolio' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
