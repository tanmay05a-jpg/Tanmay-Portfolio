import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Film,
  Play,
  Check,
  Sparkles,
  Link as LinkIcon,
  RotateCcw,
  Video,
  FileVideo,
  Info,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { PortfolioProject } from '../data/portfolioData';

interface VideoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export const VideoManagerModal: React.FC<VideoManagerModalProps> = ({
  isOpen,
  onClose,
  defaultProjectId,
}) => {
  const { projects, updateProject, showToast, setEditingProject } = usePortfolio();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    defaultProjectId || projects[0]?.id || ''
  );

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const [videoUrlInput, setVideoUrlInput] = useState<string>(activeProject?.videoUrl || '');
  const [scriptExcerpt, setScriptExcerpt] = useState<string>(
    activeProject?.videoDetails?.scriptExcerpt || ''
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>(
    activeProject?.aspectRatio || '16:9'
  );
  const [durationInput, setDurationInput] = useState<string>(
    activeProject?.videoDetails?.duration || '0:15'
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Sync inputs when selected project changes or defaultProjectId changes
  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    const proj = projects.find((p) => p.id === id);
    if (proj) {
      setVideoUrlInput(proj.videoUrl || '');
      setScriptExcerpt(proj.videoDetails?.scriptExcerpt || proj.summary || '');
      setAspectRatio(proj.aspectRatio || '16:9');
      setDurationInput(proj.videoDetails?.duration || '0:15');
    }
  };

  useEffect(() => {
    if (defaultProjectId && isOpen) {
      handleSelectProject(defaultProjectId);
    }
  }, [defaultProjectId, isOpen]);

  if (!isOpen) return null;

  if (projects.length === 0 || !activeProject) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-md rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 p-6 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Film className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Portfolio Works Yet</h3>
          <p className="text-xs text-slate-600 mt-1 mb-6 leading-relaxed">
            Attach your first commercial video ad, client work, or case study to start managing video files and media.
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                onClose();
                setEditingProject('new');
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow-sm"
            >
              + Attach New Video / Work
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle local video file upload (.mp4, .webm)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showToast('Please select a valid video file (.mp4, .webm, .mov).');
      return;
    }

    setIsUploading(true);

    // If file is small (< 8MB), base64 is stored; else create object URL
    if (file.size < 8 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setVideoUrlInput(result);
        setIsUploading(false);
        showToast(`Video "${file.name}" uploaded successfully!`);
      };
      reader.onerror = () => {
        setIsUploading(false);
        showToast('Failed to read video file.');
      };
      reader.readAsDataURL(file);
    } else {
      // Use local blob URL for session playback
      const objectUrl = URL.createObjectURL(file);
      setVideoUrlInput(objectUrl);
      setIsUploading(false);
      showToast(`Large video loaded (${(file.size / (1024 * 1024)).toFixed(1)} MB). Ready for playback.`);
    }
  };

  // Save changes to PortfolioContext
  const handleSave = () => {
    const updated: PortfolioProject = {
      ...activeProject,
      videoUrl: videoUrlInput.trim() || undefined,
      aspectRatio,
      videoDetails: {
        type: activeProject.videoDetails?.type || 'commercial',
        scriptExcerpt: scriptExcerpt.trim() || (activeProject.videoDetails?.scriptExcerpt || activeProject.summary || 'Commercial broadcast script'),
        duration: durationInput.trim() || (activeProject.videoDetails?.duration || '0:30'),
        keyThemes: activeProject.videoDetails?.keyThemes || ['Brand Vision', 'Creative Direction'],
        videoStyle: activeProject.videoDetails?.videoStyle || 'Cinematic direction with high-impact visuals and sound design',
        highlights: activeProject.videoDetails?.highlights || ['Dynamic storytelling', 'Broadcast framing', 'Color graded visual flow'],
      },
    };

    updateProject(updated);
    showToast(`Updated video configuration for "${activeProject.title}"`);
    onClose();
  };

  // Reset to default procedural simulation
  const handleResetToProcedural = () => {
    setVideoUrlInput('');
    const updated: PortfolioProject = {
      ...activeProject,
      videoUrl: undefined,
      videoSourceType: 'procedural',
    };
    updateProject(updated);
    showToast(`Reset "${activeProject.title}" to broadcast cinematic simulation.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Commercial Video Manager</h2>
              <p className="text-xs text-slate-500">
                Upload your MP4 video files, paste YouTube/Vimeo URLs, or use broadcast cinema simulation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* 1. Project Selector Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Work to Upload / Change Video ({projects.length} Works Available)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-100 rounded-xl">
              {projects.map((vid, idx) => (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => handleSelectProject(vid.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    selectedProjectId === vid.id
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold ring-1 ring-blue-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700 bg-white'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="text-slate-400 mr-1.5 font-mono">{idx + 1}.</span>
                    <span>{vid.title}</span>
                  </div>
                  {vid.videoUrl ? (
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono shrink-0">
                      Uploaded URL
                    </span>
                  ) : vid.videoDetails ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono shrink-0">
                      Live Reel
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono shrink-0">
                      Add Video
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Upload or URL Source */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Video className="h-4 w-4 text-blue-600" />
              <span>Video Playback Source for: {activeProject.title}</span>
            </h3>

            {/* Drag & Drop File Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Option A: Direct Video File Upload (.mp4 / .webm)
              </label>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl bg-white hover:bg-slate-50 cursor-pointer transition-colors group">
                <Upload className="h-8 w-8 text-slate-400 group-hover:text-blue-600 transition-colors mb-2" />
                <span className="text-xs font-semibold text-slate-700">
                  {isUploading ? 'Loading video...' : 'Choose an MP4 file or drag & drop here'}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Supports MP4, WebM, MOV files from your device
                </span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Or Paste Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Option B: Paste Video URL (YouTube, Vimeo, or Direct MP4 link)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="url"
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or https://.../video.mp4"
                    className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {videoUrlInput && (
                  <button
                    type="button"
                    onClick={() => setVideoUrlInput('')}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded-lg"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Procedural simulation note */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-900">
              <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Built-in Cinematic Simulation:</strong> If no custom URL is provided, the player automatically runs a broadcast-quality procedural canvas recreation of this commercial, complete with animated visuals, subtitles, timecode, and sound design.
                {activeProject.videoUrl && (
                  <button
                    type="button"
                    onClick={handleResetToProcedural}
                    className="ml-2 underline font-semibold text-blue-700 hover:text-blue-900"
                  >
                    Switch back to simulation
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 3. Pacing & Script Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16')}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="16:9">16:9 Cinema Widescreen (Landscape)</option>
                <option value="9:16">9:16 Vertical Reel / TikTok / Shorts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={durationInput}
                onChange={(e) => setDurationInput(e.target.value)}
                placeholder="e.g. 0:15 / 0:60 Cut"
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Voiceover Script Excerpt / Subtitle
              </label>
              <textarea
                value={scriptExcerpt}
                onChange={(e) => setScriptExcerpt(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                placeholder="Enter narrative voiceover script..."
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50 shrink-0">
          <button
            type="button"
            onClick={handleResetToProcedural}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Default Simulation</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-sm"
            >
              <Check className="h-4 w-4" />
              <span>Save Video Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
