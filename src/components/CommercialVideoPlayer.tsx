import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sparkles,
  Subtitles,
  Upload,
  CheckCircle2,
  ExternalLink,
  Camera,
  Film,
  Sliders,
  Layers,
} from 'lucide-react';
import { PortfolioProject } from '../data/portfolioData';

interface CommercialVideoPlayerProps {
  project: PortfolioProject;
  onOpenVideoManager?: () => void;
  autoPlay?: boolean;
  compact?: boolean;
  className?: string;
}

export const CommercialVideoPlayer: React.FC<CommercialVideoPlayerProps> = ({
  project,
  onOpenVideoManager,
  autoPlay = true,
  compact = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(10);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [showHud, setShowHud] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>(project.aspectRatio || '16:9');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sync duration from project if available
  useEffect(() => {
    if (project.videoDetails?.duration) {
      const match = project.videoDetails.duration.match(/0:(\d+)/);
      if (match && match[1]) {
        setDuration(Math.max(8, parseInt(match[1], 10)));
      } else {
        setDuration(12);
      }
    }
    setCurrentTime(0);
    if (project.aspectRatio) {
      setAspectRatio(project.aspectRatio);
    }
  }, [project.id]);

  // Audio Context management for ambient cinema audio
  const startAmbientAudio = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (!gainNodeRef.current && audioCtxRef.current) {
        const gainNode = audioCtxRef.current.createGain();
        gainNode.gain.setValueAtTime(isMuted ? 0 : 0.05, audioCtxRef.current.currentTime);
        gainNode.connect(audioCtxRef.current.destination);
        gainNodeRef.current = gainNode;

        // Cinematic deep ambient drone
        const osc = audioCtxRef.current.createOscillator();
        osc.type = 'sine';
        // Base tone depends on project
        const freqs: Record<string, number> = {
          '7-seconds-psychology-ad': 110, // A2 pulse
          'indori-poha-togetherness-ad': 146.83, // D3 warm
          'kulhad-chai-conversations': 130.81, // C3 earthy
          'chhappan-dukan-twilight': 164.81, // E3 night
          'indore-morning-breakfast-craft': 174.61, // F3 sunrise
        };
        osc.frequency.setValueAtTime(freqs[project.id] || 130, audioCtxRef.current.currentTime);
        osc.start();
        osc.connect(gainNode);
        oscillatorRef.current = osc;
      }
    } catch {
      // Audio auto-play policies handled gracefully
    }
  }, [isMuted, project.id]);

  const stopAmbientAudio = useCallback(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
      } catch {
        // safe ignore
      }
    }
  }, []);

  // Update audio volume when mute toggles
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const targetGain = isMuted || !isPlaying ? 0 : 0.06;
      gainNodeRef.current.gain.setTargetAtTime(targetGain, audioCtxRef.current.currentTime, 0.08);
    }
    if (!isMuted && isPlaying) {
      startAmbientAudio();
    }
  }, [isMuted, isPlaying, startAmbientAudio]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  // Check if project has direct video URL or YouTube/Vimeo embed
  const isDirectVideo = !!project.videoUrl && !project.videoUrl.includes('youtube.com') && !project.videoUrl.includes('youtu.be') && !project.videoUrl.includes('vimeo.com');
  const isYoutube = !!project.videoUrl && (project.videoUrl.includes('youtube.com') || project.videoUrl.includes('youtu.be'));
  const isVimeo = !!project.videoUrl && project.videoUrl.includes('vimeo.com');

  const getYoutubeEmbedUrl = (url: string) => {
    let id = '';
    if (url.includes('youtu.be/')) {
      id = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('v=')) {
      id = url.split('v=')[1]?.split('&')[0] || '';
    }
    return id ? `https://www.youtube.com/embed/${id}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=1&rel=0` : url;
  };

  const getVimeoEmbedUrl = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    const id = match ? match[1] : '';
    return id ? `https://player.vimeo.com/video/${id}?autoplay=${isPlaying ? 1 : 0}&muted=${isMuted ? 1 : 0}` : url;
  };

  // Playback timer ticker for procedural canvas mode
  useEffect(() => {
    if (isDirectVideo || isYoutube || isVimeo) return;
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.1;
        if (next >= duration) {
          return 0; // loop
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, duration, isDirectVideo, isYoutube, isVimeo]);

  // Procedural Canvas Cinematography Engine
  useEffect(() => {
    if (isDirectVideo || isYoutube || isVimeo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;

    const render = () => {
      frameCount++;
      const w = canvas.width;
      const h = canvas.height;

      const progress = currentTime / (duration || 10);
      const timeSec = currentTime;

      // 1. Clear background
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, w, h);

      // 2. Render specific scene according to project ID
      switch (project.id) {
        case '7-seconds-psychology-ad':
          renderPsychologyAdScene(ctx, w, h, timeSec, progress, frameCount);
          break;
        case 'indori-poha-togetherness-ad':
          renderPohaTogethernessScene(ctx, w, h, timeSec, progress, frameCount);
          break;
        case 'kulhad-chai-conversations':
          renderKulhadChaiScene(ctx, w, h, timeSec, progress, frameCount);
          break;
        case 'chhappan-dukan-twilight':
          renderChhappanDukanScene(ctx, w, h, timeSec, progress, frameCount);
          break;
        case 'indore-morning-breakfast-craft':
          renderIndoreBreakfastScene(ctx, w, h, timeSec, progress, frameCount);
          break;
        default:
          renderDefaultCommercialScene(ctx, w, h, timeSec, progress, frameCount, project.title);
          break;
      }

      // 3. Film grain & vignette
      renderFilmGrainAndVignette(ctx, w, h, frameCount);

      // 4. Cinema HUD Overlays if enabled
      if (showHud) {
        renderCinemaHud(ctx, w, h, timeSec, duration, isPlaying, project);
      }

      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [project.id, currentTime, duration, isPlaying, showHud, isDirectVideo, isYoutube, isVimeo]);

  // SCENE 1: The 7-Second Rule (Split Screen Behavioral Psychology)
  const renderPsychologyAdScene = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    prog: number,
    frame: number
  ) => {
    // Split Screen Layout
    const splitX = w * 0.5;

    // LEFT PANEL: Low retention / eye-drift (cool slate/red)
    const leftGrad = ctx.createLinearGradient(0, 0, splitX, h);
    leftGrad.addColorStop(0, '#0f172a');
    leftGrad.addColorStop(1, '#1e1b2e');
    ctx.fillStyle = leftGrad;
    ctx.fillRect(0, 0, splitX, h);

    // RIGHT PANEL: High retention optical hook (emerald/gold glow)
    const rightGrad = ctx.createLinearGradient(splitX, 0, w, h);
    rightGrad.addColorStop(0, '#09251e');
    rightGrad.addColorStop(1, '#061a15');
    ctx.fillStyle = rightGrad;
    ctx.fillRect(splitX, 0, w - splitX, h);

    // Split Divider Line with animated scan pulse
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(splitX, 0);
    ctx.lineTo(splitX, h);
    ctx.stroke();

    // Scan line traveling
    const scanY = (frame * 3) % h;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, scanY);
    ctx.lineTo(w, scanY);
    ctx.stroke();

    // Left silhouette & metrics
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.beginPath();
    ctx.arc(splitX * 0.5, h * 0.45, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('WITHOUT OPTICAL HOOK', 24, 40);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
    ctx.font = '11px monospace';
    ctx.fillText('Audience Drop-off: 78% @ 0:03', 24, 60);

    // Red eye drift vector
    const driftX = splitX * 0.5 + Math.sin(t * 3) * 30;
    const driftY = h * 0.45 + Math.cos(t * 2) * 20;
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(splitX * 0.5, h * 0.45);
    ctx.lineTo(driftX, driftY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(driftX, driftY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Right silhouette & tracking nodes (high retention)
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.beginPath();
    ctx.arc(splitX + (w - splitX) * 0.5, h * 0.45, 75, 0, Math.PI * 2);
    ctx.fill();

    // Biometric facial tracking grid nodes on right
    const faceCenterX = splitX + (w - splitX) * 0.5;
    const faceCenterY = h * 0.45;
    const pulse = 1 + Math.sin(frame * 0.1) * 0.05;

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(faceCenterX - 50 * pulse, faceCenterY - 50 * pulse, 100 * pulse, 100 * pulse);

    // Corner brackets on right target
    drawTargetBrackets(ctx, faceCenterX, faceCenterY, 60 * pulse);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('7-SEC BEHAVIORAL HOOK', splitX + 24, 40);
    ctx.fillStyle = '#34d399';
    ctx.font = '11px monospace';
    ctx.fillText('Trust Lock: +94% Retention', splitX + 24, 60);

    // Center Large Millisecond Countdown: 7.00s countdown
    const secondsRemaining = Math.max(0, 7 - t).toFixed(2);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`00:0${secondsRemaining}`, w * 0.5, h * 0.22);
    ctx.font = '600 11px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('CRUCIAL FIRST IMPRESSION WINDOW', w * 0.5, h * 0.27);
    ctx.textAlign = 'left';

    // Live Voiceover typography animation at bottom
    renderAnimatedSubtitle(
      ctx,
      w,
      h,
      t < 3.5
        ? 'It only takes 7 seconds to make a first judgment.'
        : 'Your body language speaks louder than any words ever could.'
    );
  };

  // SCENE 2: Indori Poha: Taste of Togetherness (Golden hour family warmth)
  const renderPohaTogethernessScene = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    prog: number,
    frame: number
  ) => {
    // Warm morning amber atmosphere
    const bgGrad = ctx.createRadialGradient(w * 0.3, h * 0.2, 20, w * 0.5, h * 0.5, w * 0.8);
    bgGrad.addColorStop(0, '#592e07');
    bgGrad.addColorStop(0.4, '#2e1503');
    bgGrad.addColorStop(1, '#0f0702');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Golden Sunlight Rays streaming from top-left
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 5; i++) {
      const rayGrad = ctx.createLinearGradient(0, 0, w, h);
      rayGrad.addColorStop(0, 'rgba(251, 191, 36, 0.15)');
      rayGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(w * 0.1 + i * 40, 0);
      ctx.lineTo(w * 0.3 + i * 80, 0);
      ctx.lineTo(w * 0.7 + i * 60, h);
      ctx.lineTo(w * 0.4 + i * 40, h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Centerpiece: Traditional brass dining plate of golden turmeric poha
    const plateX = w * 0.5;
    const plateY = h * 0.58;
    const plateRadius = Math.min(w, h) * 0.28;

    // Brass plate shadow & metallic rim
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.ellipse(plateX, plateY + 12, plateRadius + 10, plateRadius * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    const brassGrad = ctx.createLinearGradient(plateX - plateRadius, plateY, plateX + plateRadius, plateY);
    brassGrad.addColorStop(0, '#d97706');
    brassGrad.addColorStop(0.5, '#fde68a');
    brassGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = brassGrad;
    ctx.beginPath();
    ctx.ellipse(plateX, plateY, plateRadius, plateRadius * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();

    // Poha mound (steaming golden yellow)
    const pohaGrad = ctx.createRadialGradient(plateX, plateY, 10, plateX, plateY, plateRadius * 0.85);
    pohaGrad.addColorStop(0, '#facc15');
    pohaGrad.addColorStop(0.8, '#eab308');
    pohaGrad.addColorStop(1, '#ca8a04');
    ctx.fillStyle = pohaGrad;
    ctx.beginPath();
    ctx.ellipse(plateX, plateY - 4, plateRadius * 0.85, plateRadius * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Crispy sev, green coriander, and red pomegranate sprinkles
    ctx.fillStyle = '#dc2626'; // ruby pomegranate
    for (let p = 0; p < 18; p++) {
      const seedX = plateX + Math.sin(p * 2.3) * (plateRadius * 0.6);
      const seedY = plateY - 4 + Math.cos(p * 3.1) * (plateRadius * 0.25);
      ctx.beginPath();
      ctx.arc(seedX, seedY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#16a34a'; // fresh coriander
    for (let c = 0; c < 22; c++) {
      const leafX = plateX + Math.cos(c * 1.7) * (plateRadius * 0.65);
      const leafY = plateY - 4 + Math.sin(c * 2.1) * (plateRadius * 0.28);
      ctx.fillRect(leafX, leafY, 4, 2);
    }

    // SLOW-MOTION LEMON SQUEEZE: Squeezed lemon half above with falling droplets
    const lemonX = plateX - 20;
    const lemonY = plateY - 110;

    // Lemon half
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(lemonX, lemonY, 24, Math.PI * 0.15, Math.PI * 1.15, false);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Falling glistening droplets
    const dropProgress = (frame * 0.05) % 1;
    const dropY = lemonY + 24 + dropProgress * 80;
    ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
    ctx.beginPath();
    ctx.ellipse(lemonX + 8, dropY, 3, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Splash ripple on poha when drop hits
    if (dropProgress > 0.8) {
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(lemonX + 8, plateY - 8, 14 * (dropProgress - 0.8) * 5, 6 * (dropProgress - 0.8) * 5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Realistic Rising Steam Particles
    renderRisingSteam(ctx, plateX, plateY - 20, 25, frame);

    // Warm grandfather & grandson dining table silhouettes in background
    ctx.fillStyle = 'rgba(251, 191, 36, 0.18)';
    ctx.beginPath();
    ctx.arc(w * 0.22, h * 0.38, 40, 0, Math.PI * 2); // Grandfather head
    ctx.arc(w * 0.78, h * 0.42, 32, 0, Math.PI * 2); // Grandson head
    ctx.fill();

    // Ambient floating golden dust particles
    renderGoldenMotes(ctx, w, h, frame, 30);

    renderAnimatedSubtitle(ctx, w, h, 'Every bite of poha brings generations closer...');
  };

  // SCENE 3: Street Culture & Kulhad Chai (Terracotta pouring & morning banter)
  const renderKulhadChaiScene = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    prog: number,
    frame: number
  ) => {
    // Rich earthy background
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#1c130d');
    bg.addColorStop(0.7, '#2a1a11');
    bg.addColorStop(1, '#150d09');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Morning sun flare in corner
    const flareGrad = ctx.createRadialGradient(w * 0.85, h * 0.15, 10, w * 0.85, h * 0.15, 200);
    flareGrad.addColorStop(0, 'rgba(251, 146, 60, 0.4)');
    flareGrad.addColorStop(1, 'rgba(251, 146, 60, 0)');
    ctx.fillStyle = flareGrad;
    ctx.fillRect(0, 0, w, h);

    // Terracotta kulhad cup in center foreground
    const cupX = w * 0.5;
    const cupY = h * 0.65;
    const cupW = 70;
    const cupH = 85;

    // Rustic clay kulhad
    const clayGrad = ctx.createLinearGradient(cupX - cupW * 0.5, cupY, cupX + cupW * 0.5, cupY);
    clayGrad.addColorStop(0, '#9a3412');
    clayGrad.addColorStop(0.4, '#c2410c');
    clayGrad.addColorStop(0.8, '#ea580c');
    clayGrad.addColorStop(1, '#7c2d12');
    ctx.fillStyle = clayGrad;

    // Kulhad tapered shape
    ctx.beginPath();
    ctx.moveTo(cupX - cupW * 0.5, cupY - cupH * 0.5);
    ctx.lineTo(cupX + cupW * 0.5, cupY - cupH * 0.5);
    ctx.lineTo(cupX + cupW * 0.35, cupY + cupH * 0.5);
    ctx.lineTo(cupX - cupW * 0.35, cupY + cupH * 0.5);
    ctx.closePath();
    ctx.fill();

    // Clay rim texture
    ctx.strokeStyle = '#7c2d12';
    ctx.lineWidth = 3;
    ctx.stroke();

    // High Pour Tea Stream from upper right into cup!
    const kettleX = cupX + 80;
    const kettleY = cupY - 140;

    // Glowing golden chai stream
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4 + Math.sin(frame * 0.2) * 1;
    ctx.beginPath();
    ctx.moveTo(kettleX, kettleY);
    ctx.bezierCurveTo(cupX + 40, kettleY + 50, cupX + 10, cupY - 60, cupX, cupY - cupH * 0.5);
    ctx.stroke();

    // Inner hot tea stream
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Froth bubbles splashing at rim
    ctx.fillStyle = '#fef3c7';
    for (let f = 0; f < 8; f++) {
      const bubbleX = cupX - 15 + Math.sin(frame * 0.3 + f) * 20;
      const bubbleY = cupY - cupH * 0.5 + Math.cos(frame * 0.3 + f) * 4;
      ctx.beginPath();
      ctx.arc(bubbleX, bubbleY, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Heavy steam curling from kulhad
    renderRisingSteam(ctx, cupX, cupY - cupH * 0.5, 30, frame);

    // Floating golden dust motes in morning sunlight
    renderGoldenMotes(ctx, w, h, frame, 40);

    renderAnimatedSubtitle(ctx, w, h, 'Conversations flow as freely as the chai...');
  };

  // SCENE 4: Chhappan Dukan Twilight Food Heritage (Iconic night market lanterns)
  const renderChhappanDukanScene = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    prog: number,
    frame: number
  ) => {
    // Deep indigo dusk sky with twilight magenta gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#0f172a');
    sky.addColorStop(0.5, '#1e1b4b');
    sky.addColorStop(0.8, '#31103f');
    sky.addColorStop(1, '#180824');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Archway of glowing paper lanterns across top
    const numLanterns = 7;
    const archY = h * 0.22;
    for (let l = 0; l < numLanterns; l++) {
      const lx = (w / (numLanterns + 1)) * (l + 1);
      const ly = archY + Math.sin((l / (numLanterns - 1)) * Math.PI) * 35 + Math.sin(frame * 0.04 + l) * 4;

      // Hanging string
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(lx, 0);
      ctx.lineTo(lx, ly);
      ctx.stroke();

      // Glowing paper lantern
      const glow = ctx.createRadialGradient(lx, ly + 14, 4, lx, ly + 14, 45);
      glow.addColorStop(0, 'rgba(251, 191, 36, 0.9)');
      glow.addColorStop(0.5, 'rgba(245, 158, 11, 0.4)');
      glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(lx, ly + 14, 45, 0, Math.PI * 2);
      ctx.fill();

      // Lantern body
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(lx, ly + 14, 12, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b45309';
      ctx.fillRect(lx - 10, ly + 30, 20, 3);
    }

    // Sizzling street food pan sparks in lower center
    const panX = w * 0.5;
    const panY = h * 0.72;
    ctx.fillStyle = 'rgba(251, 146, 60, 0.15)';
    ctx.beginPath();
    ctx.arc(panX, panY, 90, 0, Math.PI * 2);
    ctx.fill();

    // Sizzling embers
    ctx.fillStyle = '#f97316';
    for (let e = 0; e < 15; e++) {
      const ex = panX + Math.sin(frame * 0.2 + e * 2) * 50;
      const ey = panY - ((frame * 2 + e * 15) % 80);
      ctx.beginPath();
      ctx.arc(ex, ey, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Street bokeh orbs (cyan, magenta, amber)
    renderNightBokeh(ctx, w, h, frame);

    renderAnimatedSubtitle(
      ctx,
      w,
      h,
      "Indore's heart beats at Chhappan Dukan. The taste of togetherness."
    );
  };

  // SCENE 5: Morning Street Market Commercial (Authentic Indori Breakfast)
  const renderIndoreBreakfastScene = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    prog: number,
    frame: number
  ) => {
    // Luminous sunrise street background
    const dawn = ctx.createLinearGradient(0, 0, w, h);
    dawn.addColorStop(0, '#f59e0b');
    dawn.addColorStop(0.3, '#ea580c');
    dawn.addColorStop(0.7, '#7c2d12');
    dawn.addColorStop(1, '#1c1917');
    ctx.fillStyle = dawn;
    ctx.fillRect(0, 0, w, h);

    // Giant street wok (kadai) overflowing with yellow poha
    const kadaiX = w * 0.5;
    const kadaiY = h * 0.65;
    const kadaiRadius = Math.min(w, h) * 0.38;

    // Heavy iron/brass kadai handles
    ctx.strokeStyle = '#44403c';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(kadaiX, kadaiY, kadaiRadius + 8, Math.PI * 0.1, Math.PI * 0.9, false);
    ctx.stroke();

    // Steaming bright yellow turmeric poha mound
    const pohaGrad = ctx.createRadialGradient(kadaiX, kadaiY, 20, kadaiX, kadaiY, kadaiRadius);
    pohaGrad.addColorStop(0, '#fef08a');
    pohaGrad.addColorStop(0.4, '#facc15');
    pohaGrad.addColorStop(1, '#ca8a04');
    ctx.fillStyle = pohaGrad;
    ctx.beginPath();
    ctx.ellipse(kadaiX, kadaiY, kadaiRadius, kadaiRadius * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Artisanal Vendor brass skimmer tossing poha
    ctx.save();
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(kadaiX - 90, kadaiY - 40 + Math.sin(frame * 0.08) * 15);
    ctx.lineTo(kadaiX - 30, kadaiY + 10);
    ctx.stroke();
    ctx.restore();

    // Volumetric billows of morning steam
    renderRisingSteam(ctx, kadaiX - 40, kadaiY - 30, 45, frame);
    renderRisingSteam(ctx, kadaiX + 40, kadaiY - 30, 45, frame + 20);

    // Coriander and sev raining in slow motion
    ctx.fillStyle = '#22c55e';
    for (let c = 0; c < 20; c++) {
      const cx = kadaiX - 100 + ((c * 23) % 200);
      const cy = (kadaiY - 140 + ((frame * 2 + c * 18) % 150));
      ctx.fillRect(cx, cy, 5, 2.5);
    }

    renderAnimatedSubtitle(ctx, w, h, 'In Indore, happiness is served hot...');
  };

  // Helper: Default scene fallback
  const renderDefaultCommercialScene = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    prog: number,
    frame: number,
    title: string
  ) => {
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 30, w * 0.5, h * 0.5, w * 0.7);
    bg.addColorStop(0, '#1e293b');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, w * 0.5, h * 0.45);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Commercial Direction · Broadcast Master', w * 0.5, h * 0.55);
    ctx.textAlign = 'left';
  };

  // Helper: Subtitle text with broadcast shadow
  const renderAnimatedSubtitle = (ctx: CanvasRenderingContext2D, w: number, h: number, text: string) => {
    if (!showSubtitles) return;
    ctx.save();
    const subY = h * 0.88;

    ctx.font = '600 14px "Inter", system-ui, sans-serif';
    ctx.textAlign = 'center';
    const textWidth = ctx.measureText(text).width;

    // Subtitle background pill for high contrast
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(w * 0.5 - textWidth * 0.5 - 12, subY - 18, textWidth + 24, 28);

    // Yellow/White cinema subtitle font
    ctx.fillStyle = '#fef08a';
    ctx.fillText(text, w * 0.5, subY);
    ctx.restore();
  };

  // Helper: Film grain and subtle optical vignette
  const renderFilmGrainAndVignette = (ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) => {
    // Optical Vignette
    const vig = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.4, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.65)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    // Subtle cinema 35mm grain noise
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    for (let i = 0; i < 60; i++) {
      const gx = (Math.sin(frame + i * 13) * 10000) % w;
      const gy = (Math.cos(frame + i * 17) * 10000) % h;
      ctx.fillRect(Math.abs(gx), Math.abs(gy), 1.5, 1.5);
    }
  };

  // Helper: Cinema HUD overlay (Timecode, REC, FPS, camera rig)
  const renderCinemaHud = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    total: number,
    playing: boolean,
    proj: PortfolioProject
  ) => {
    ctx.save();
    // Top Left: REC indicator + timecode
    if (playing) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(24, 26, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = playing ? '#ef4444' : '#94a3b8';
    ctx.fillText(playing ? '● REC' : '❚❚ PAUSE', 34, 29);

    // Timecode: 00:00:SS:FF
    const sec = Math.floor(t);
    const ms = Math.floor((t % 1) * 24);
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const timecode = `00:00:${pad(sec)}:${pad(ms)}`;

    ctx.fillStyle = '#ffffff';
    ctx.fillText(timecode, 90, 29);

    // Top Right: Technical Camera Rigging Specs
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillText('4K DCI · 24.00 FPS · PRORES 4444', w - 24, 29);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('ARRI LF · 35MM T1.3', w - 24, 44);

    // Center Crosshair target
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w * 0.5 - 12, h * 0.5);
    ctx.lineTo(w * 0.5 + 12, h * 0.5);
    ctx.moveTo(w * 0.5, h * 0.5 - 12);
    ctx.lineTo(w * 0.5, h * 0.5 + 12);
    ctx.stroke();

    ctx.restore();
  };

  // Helper: Draw target corner brackets
  const drawTargetBrackets = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    const len = 12;

    // Top Left
    ctx.beginPath();
    ctx.moveTo(cx - size, cy - size + len);
    ctx.lineTo(cx - size, cy - size);
    ctx.lineTo(cx - size + len, cy - size);
    ctx.stroke();

    // Top Right
    ctx.beginPath();
    ctx.moveTo(cx + size - len, cy - size);
    ctx.lineTo(cx + size, cy - size);
    ctx.lineTo(cx + size, cy - size + len);
    ctx.stroke();

    // Bottom Left
    ctx.beginPath();
    ctx.moveTo(cx - size, cy + size - len);
    ctx.lineTo(cx - size, cy + size);
    ctx.lineTo(cx - size + len, cy + size);
    ctx.stroke();

    // Bottom Right
    ctx.beginPath();
    ctx.moveTo(cx + size - len, cy + size);
    ctx.lineTo(cx + size, cy + size);
    ctx.lineTo(cx + size, cy + size - len);
    ctx.stroke();
  };

  // Helper: Rising steam particle simulation
  const renderRisingSteam = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    spread: number,
    frame: number
  ) => {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let s = 0; s < 12; s++) {
      const age = (frame * 0.03 + s * 0.15) % 1;
      const steamY = y - age * 90;
      const steamX = x + Math.sin(age * 6 + s) * spread * age;
      const radius = 8 + age * 28;

      ctx.beginPath();
      ctx.arc(steamX, steamY, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  // Helper: Golden dust motes
  const renderGoldenMotes = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    frame: number,
    count: number
  ) => {
    ctx.save();
    ctx.fillStyle = 'rgba(253, 230, 138, 0.5)';
    for (let m = 0; m < count; m++) {
      const mx = (m * 47 + Math.sin(frame * 0.02 + m) * 20) % w;
      const my = (m * 31 + Math.cos(frame * 0.02 + m) * 20) % h;
      const r = (m % 3) * 0.7 + 0.8;
      ctx.beginPath();
      ctx.arc(mx, my, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  // Helper: Night bokeh lights
  const renderNightBokeh = (ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) => {
    ctx.save();
    const colors = [
      'rgba(244, 63, 94, 0.12)', // rose
      'rgba(6, 182, 212, 0.12)', // cyan
      'rgba(245, 158, 11, 0.15)', // amber
      'rgba(168, 85, 247, 0.12)', // violet
    ];
    for (let b = 0; b < 12; b++) {
      const bx = (b * 67 + Math.sin(frame * 0.01 + b) * 15) % w;
      const by = (b * 43 + Math.cos(frame * 0.01 + b) * 15) % h;
      const radius = 25 + (b % 4) * 15;
      ctx.fillStyle = colors[b % colors.length];
      ctx.beginPath();
      ctx.arc(bx, by, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  // Seek bar click
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const nextTime = ratio * duration;
    setCurrentTime(nextTime);
    if (videoRef.current) {
      videoRef.current.currentTime = nextTime;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-xl overflow-hidden bg-black text-white shadow-2xl border border-slate-800 flex flex-col justify-between group ${className}`}
    >
      {/* Video Content Window */}
      <div
        className={`relative w-full overflow-hidden flex items-center justify-center bg-black ${
          aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[520px] mx-auto' : 'aspect-video'
        }`}
      >
        {/* Case 1: YouTube Embed */}
        {isYoutube && (
          <iframe
            src={getYoutubeEmbedUrl(project.videoUrl!)}
            title={project.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {/* Case 2: Vimeo Embed */}
        {isVimeo && (
          <iframe
            src={getVimeoEmbedUrl(project.videoUrl!)}
            title={project.title}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        )}

        {/* Case 3: Direct MP4 / WebM Video Element */}
        {isDirectVideo && (
          <video
            ref={videoRef}
            src={project.videoUrl}
            poster={project.videoPoster}
            playsInline
            muted={isMuted}
            autoPlay={isPlaying}
            onTimeUpdate={() => {
              if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) setDuration(videoRef.current.duration || 10);
            }}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-full object-contain"
          />
        )}

        {/* Case 4: Broadcast Cinematic Canvas Engine (Default) */}
        {!isDirectVideo && !isYoutube && !isVimeo && (
          <canvas
            ref={canvasRef}
            width={854}
            height={480}
            className="w-full h-full object-cover select-none cursor-pointer"
            onClick={() => setIsPlaying(!isPlaying)}
          />
        )}

        {/* Center Big Play Button Overlay when paused */}
        {!isPlaying && (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-blue-600 transition-all shadow-2xl hover:scale-105 z-20"
            aria-label="Play commercial video"
          >
            <Play className="h-7 w-7 ml-1 fill-white" />
          </button>
        )}

        {/* Floating Quick Action: Change / Upload Video */}
        {onOpenVideoManager && (
          <button
            type="button"
            onClick={onOpenVideoManager}
            className="absolute top-3 right-3 z-30 inline-flex items-center gap-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-lg hover:bg-blue-600 transition-colors border border-white/20 opacity-0 group-hover:opacity-100"
            title="Upload custom MP4 or paste video URL"
          >
            <Upload className="h-3 w-3 text-blue-400" />
            <span>Upload / Change Video</span>
          </button>
        )}

        {/* Bottom Title Bar Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-none">
          <span className="rounded bg-slate-950/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{project.badge || 'Commercial Production'}</span>
          </span>
          <span className="rounded bg-slate-950/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700 hidden sm:inline">
            {project.impactMetric}
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-3 flex flex-col gap-2 shrink-0 z-20">
        {/* Scrubber Progress Bar */}
        <div
          onClick={handleSeek}
          className="relative h-1.5 w-full bg-slate-800 rounded-full cursor-pointer overflow-hidden group/bar"
          title="Click to seek"
        >
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
            style={{ width: `${Math.min(100, (currentTime / (duration || 1)) * 100)}%` }}
          />
        </div>

        {/* Controls Strip */}
        <div className="flex items-center justify-between text-xs text-slate-300">
          {/* Left: Play/Pause, Rewind, Time */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (videoRef.current) {
                  if (isPlaying) videoRef.current.pause();
                  else videoRef.current.play();
                }
                setIsPlaying(!isPlaying);
              }}
              className="h-7 w-7 rounded-full bg-white text-slate-950 flex items-center justify-center hover:bg-slate-200 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5 fill-slate-950" /> : <Play className="h-3.5 w-3.5 ml-0.5 fill-slate-950" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentTime(0);
                if (videoRef.current) videoRef.current.currentTime = 0;
              }}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Restart from beginning"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            <div className="font-mono text-[11px] text-slate-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Audio Toggle with Web Audio Cinema Ambience */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                !isMuted ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40' : 'text-slate-400 hover:text-white'
              }`}
              title={isMuted ? 'Unmute cinema sound' : 'Mute'}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-blue-400" />}
              <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound On'}</span>
            </button>
          </div>

          {/* Right: Subtitles, HUD, Aspect Ratio, Fullscreen */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`p-1.5 rounded transition-colors ${
                showSubtitles ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Subtitles / Captions (CC)"
            >
              <Subtitles className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setShowHud(!showHud)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors border ${
                showHud ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-slate-500 border-slate-800'
              }`}
              title="Toggle Director Camera Telemetry HUD"
            >
              HUD
            </button>

            <button
              type="button"
              onClick={() => setAspectRatio(aspectRatio === '16:9' ? '9:16' : '16:9')}
              className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors"
              title="Toggle Aspect Ratio (16:9 Cinema / 9:16 Social Reel)"
            >
              {aspectRatio}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
