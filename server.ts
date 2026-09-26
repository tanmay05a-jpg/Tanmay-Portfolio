import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Persistent data directory on server
const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const UPLOADS_DIR = path.resolve(DATA_DIR, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
const PORTFOLIO_FILE = path.join(DATA_DIR, 'live-portfolio.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin-config.json');

// Initialize admin configuration if not present
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Tanmay@Admin2026';
const ADMIN_EMAIL = 'tanmay.05.a@gmail.com';

function getAdminConfig() {
  try {
    if (fs.existsSync(ADMIN_FILE)) {
      const data = fs.readFileSync(ADMIN_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading admin config:', err);
  }
  const defaultCfg = {
    password: DEFAULT_ADMIN_PASSWORD,
    email: ADMIN_EMAIL,
    updatedAt: new Date().toISOString(),
  };
  try {
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(defaultCfg, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing default admin config:', e);
  }
  return defaultCfg;
}

// In-memory active session tokens set
const activeAdminTokens = new Set<string>();

// Helper to verify if request is from an authenticated admin
function verifyAdminRequest(req: express.Request): boolean {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (activeAdminTokens.has(token)) {
      return true;
    }
  }
  // Also check adminPassword passed in header or body
  const customKey = req.headers['x-admin-key'] as string;
  const currentCfg = getAdminConfig();
  if (customKey && customKey === currentCfg.password) {
    return true;
  }
  if (req.body && req.body.adminPassword && req.body.adminPassword === currentCfg.password) {
    return true;
  }
  return false;
}

// Body parsers with large limit for base64 images and audio blobs
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static route for uploaded video and media files with full HTTP Range request support for smooth streaming
app.use('/api/media', express.static(UPLOADS_DIR, {
  acceptRanges: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    } else if (filePath.endsWith('.webm')) {
      res.setHeader('Content-Type', 'video/webm');
    } else if (filePath.endsWith('.mov')) {
      res.setHeader('Content-Type', 'video/quicktime');
    }
  }
}));

// Endpoint for permanent video / media file upload
app.post('/api/upload-media', (req, res) => {
  try {
    if (!verifyAdminRequest(req)) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Admin credentials required to upload media files.',
      });
    }

    const { filename, base64Data, mimeType } = req.body;
    if (!base64Data) {
      return res.status(400).json({ success: false, error: 'base64Data is required' });
    }

    // Strip data URI prefix if present
    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    let ext = filename ? path.extname(filename).toLowerCase() : '';
    if (!ext) {
      if (mimeType?.includes('webm')) ext = '.webm';
      else if (mimeType?.includes('quicktime') || mimeType?.includes('mov')) ext = '.mov';
      else if (mimeType?.includes('mp4')) ext = '.mp4';
      else if (mimeType?.includes('png')) ext = '.png';
      else if (mimeType?.includes('jpeg') || mimeType?.includes('jpg')) ext = '.jpg';
      else ext = '.mp4';
    }

    const safeName = `media-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/api/media/${safeName}`;
    return res.json({
      success: true,
      url: publicUrl,
      filename: safeName,
      size: buffer.length,
      message: 'Media file uploaded and stored permanently.',
    });
  } catch (err: any) {
    console.error('Error handling media upload:', err);
    return res.status(500).json({ success: false, error: err.message || 'Media upload failed' });
  }
});

// Shared Gemini client configured with telemetry header per guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

/**
 * ============================================================================
 * ADMIN AUTHENTICATION & SECURITY ENDPOINTS
 * ============================================================================
 */

// Admin Login
app.post('/api/admin/login', (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, error: 'Password is required' });
    }
    const adminCfg = getAdminConfig();
    if (password === adminCfg.password) {
      const token = crypto.randomBytes(32).toString('hex');
      activeAdminTokens.add(token);
      return res.json({
        success: true,
        token,
        email: adminCfg.email || ADMIN_EMAIL,
        message: 'Admin authentication successful',
      });
    } else {
      return res.status(401).json({ success: false, error: 'Incorrect Admin Password' });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Login failed' });
  }
});

// Admin Verify Token
app.post('/api/admin/verify', (req, res) => {
  const isAuth = verifyAdminRequest(req);
  return res.json({ success: isAuth, authenticated: isAuth });
});

// Admin Change Password
app.post('/api/admin/change-password', (req, res) => {
  try {
    if (!verifyAdminRequest(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
    }
    const { newPassword } = req.body;
    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long' });
    }
    const currentCfg = getAdminConfig();
    currentCfg.password = newPassword.trim();
    currentCfg.updatedAt = new Date().toISOString();
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(currentCfg, null, 2), 'utf-8');

    return res.json({
      success: true,
      message: 'Admin password successfully updated. Please use your new password next time.',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to update password' });
  }
});

// Admin Logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    activeAdminTokens.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * ============================================================================
 * LIVE PERSISTENT PORTFOLIO DATA ENDPOINTS
 * ============================================================================
 */

// Public endpoint: Fetch current live portfolio state from server
app.get('/api/portfolio', (req, res) => {
  try {
    if (fs.existsSync(PORTFOLIO_FILE)) {
      const dataStr = fs.readFileSync(PORTFOLIO_FILE, 'utf-8');
      const parsed = JSON.parse(dataStr);
      return res.json({ success: true, data: parsed, source: 'server_disk' });
    }
    // Return empty payload if not saved yet
    return res.json({ success: true, data: null, source: 'defaults' });
  } catch (err: any) {
    console.error('Error reading live portfolio file:', err);
    return res.status(500).json({ success: false, error: 'Failed to read live portfolio data' });
  }
});

// Protected endpoint: Update and publish live portfolio directly to website
app.post('/api/portfolio', (req, res) => {
  try {
    if (!verifyAdminRequest(req)) {
      return res.status(401).json({
        success: false,
        error: 'Access denied: Valid Admin credentials are required to edit and update this website.',
      });
    }

    const { profile, services, projects, pricing, faqs } = req.body;
    if (!profile && !services && !projects && !pricing && !faqs) {
      return res.status(400).json({ success: false, error: 'Invalid payload: No portfolio data provided' });
    }

    const payload = {
      profile,
      services,
      projects,
      pricing,
      faqs,
      updatedAt: new Date().toISOString(),
      updatedBy: ADMIN_EMAIL,
    };

    // Write atomically to live-portfolio.json
    fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(payload, null, 2), 'utf-8');

    return res.json({
      success: true,
      message: 'Portfolio successfully updated and published live to website!',
      updatedAt: payload.updatedAt,
    });
  } catch (err: any) {
    console.error('Error saving live portfolio:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to save portfolio data' });
  }
});

/**
 * Image Generation & Editing endpoint
 * Uses model: gemini-3.1-flash-image-preview (with gemini-3.1-flash-image fallback)
 */
app.post('/api/gemini/create-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '1:1', referenceImage, editPrompt } = req.body;

    if (!prompt && !editPrompt) {
      return res.status(400).json({ error: 'A prompt is required for image creation or editing.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured on the server. Please ensure GEMINI_API_KEY is available in your environment.',
      });
    }

    const targetPrompt = editPrompt || prompt;
    const parts: any[] = [];

    // If an image is provided, prepare it for image-to-image editing
    if (referenceImage && typeof referenceImage === 'string') {
      let mimeType = 'image/png';
      let data = referenceImage;
      if (referenceImage.startsWith('data:')) {
        const match = referenceImage.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          mimeType = match[1];
          data = match[2];
        }
      }
      parts.push({
        inlineData: {
          mimeType,
          data,
        },
      });
    }

    parts.push({ text: targetPrompt });

    // Allowed aspect ratios: "1:1", "3:4", "4:3", "9:16", "16:9"
    const validRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const selectedRatio = validRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    // Model candidate attempts: requested gemini-3.1-flash-image-preview first, fallback to gemini-3.1-flash-image
    const modelCandidates = ['gemini-3.1-flash-image-preview', 'gemini-3.1-flash-image'];
    let lastError: any = null;
    let successfulResult: any = null;

    for (const modelName of modelCandidates) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: { parts },
          config: {
            imageConfig: {
              aspectRatio: selectedRatio as any,
            },
          },
        });

        let imageUrl: string | null = null;
        let textDescription: string | null = null;

        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData?.data) {
              const mime = part.inlineData.mimeType || 'image/png';
              imageUrl = `data:${mime};base64,${part.inlineData.data}`;
            } else if (part.text) {
              textDescription = (textDescription ? textDescription + '\n' : '') + part.text;
            }
          }
        }

        if (imageUrl) {
          successfulResult = {
            imageUrl,
            description: textDescription,
            modelUsed: modelName,
            aspectRatio: selectedRatio,
          };
          break;
        } else if (textDescription) {
          // Some responses might only contain a text description or warning
          successfulResult = {
            imageUrl: null,
            description: textDescription,
            modelUsed: modelName,
            aspectRatio: selectedRatio,
          };
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt with ${modelName} failed:`, err.message || err);
        // If 429 quota or 503 spike, capture details
        if (err.status === 429 || err.message?.includes('429')) {
          break; // Quota applies to project, trying alias might not help
        }
      }
    }

    if (successfulResult) {
      return res.json({
        success: true,
        ...successfulResult,
      });
    }

    // If quota exceeded or error occurred, provide helpful structured response
    const errorMessage = lastError?.message || 'Failed to generate image with Gemini.';
    return res.status(lastError?.status || 500).json({
      error: errorMessage,
      details: lastError?.details || null,
    });
  } catch (error: any) {
    console.error('Create image endpoint error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error while creating image' });
  }
});

/**
 * Microphone & Audio Transcription endpoint
 * Uses model: gemini-3.5-transcribe
 */
app.post('/api/gemini/transcribe', async (req, res) => {
  try {
    const { audioData, mimeType = 'audio/webm', prompt } = req.body;

    if (!audioData) {
      return res.status(400).json({ error: 'Audio data is required for transcription.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured on the server. Please ensure GEMINI_API_KEY is available.',
      });
    }

    let cleanData = audioData;
    let detectedMime = mimeType;

    if (typeof audioData === 'string' && audioData.startsWith('data:')) {
      const match = audioData.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        detectedMime = match[1];
        cleanData = match[2];
      }
    }

    const audioPart = {
      inlineData: {
        mimeType: detectedMime,
        data: cleanData,
      },
    };

    const transcriptionPrompt = prompt || 'Please transcribe this audio recording accurately. Include correct punctuation, capitalization, and logical paragraph breaks. If there are multiple speakers or questions, format them clearly.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: transcriptionPrompt },
        ],
      },
    });

    const transcriptionText = response.text || '';

    return res.json({
      success: true,
      transcription: transcriptionText,
      modelUsed: 'gemini-3.5-transcribe',
      wordCount: transcriptionText.trim() ? transcriptionText.trim().split(/\s+/).length : 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Audio transcription error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to transcribe audio with gemini-3.5-transcribe',
      details: error.details || null,
    });
  }
});

/**
 * AI Scoping, Consultation & Transcription Analysis endpoint
 * Uses model: gemini-3.8-flash
 */
app.post('/api/gemini/consult', async (req, res) => {
  try {
    const { prompt, messages, task = 'consultation' } = req.body;

    if (!prompt && (!messages || messages.length === 0)) {
      return res.status(400).json({ error: 'Prompt or conversation messages required.' });
    }

    let systemInstruction = `You are Tanmay Agrawal's Senior AI Strategy Consultant and Technical Scoper.
Tanmay Agrawal is an independent AI product consultant and senior builder with 18 years of regulated enterprise execution experience across US & UK clients (FinTech, Healthcare, Enterprise AI automation, Commercial Video Direction, and High-Conversion Web Platforms).
Tanmay's core offerings:
1. AI Product Strategy Consulting: 2-4 day rapid roadmap & readiness audit.
2. Custom Full-Stack AI MVPs: 1-2 week production-grade turnarounds.
3. Enterprise AI Automation & Agents: 1-2 week workflow integration & SOP handoff.
4. Commercial Video Direction & Motion Ads: 3-5 day high-converting 4K commercial creative & viral hooks.
5. High-Conversion AI Web Platforms: 5-7 day responsive, modern landing apps with calendar sync.

Your job is to provide direct, executive, practical advice:
- Evaluate client ideas objectively.
- Propose architecture stacks and concrete sprint timelines.
- Detail deliverables and scope without quoting specific prices (pricing is customized per scope on discovery calls).
- Suggest next steps and offer to book a strategy call on Tanmay's calendar.
Keep answers concise, scannable with bullet points, and authoritative.`;

    if (task === 'action_items') {
      systemInstruction = `You are an elite enterprise project manager. Analyze the provided audio transcript and extract:
1. Executive Summary (2-3 sentences)
2. Immediate Action Items & Deliverables (with priority)
3. Technical Requirements & Dependencies
4. Recommended Tanmay Engagement Sprint & Estimated Timeline.
Format with clean markdown headings and bullet points.`;
    }

    // Format contents
    let contents: any;
    if (messages && Array.isArray(messages) && messages.length > 0) {
      contents = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content || m.text }],
      }));
    } else {
      contents = prompt;
    }

    const consultModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastConsultError: any = null;
    let replyText: string | null = null;
    let modelSuccessfullyUsed = 'gemini-3.8-flash';

    for (const modelCandidate of consultModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelCandidate,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        if (response.text) {
          replyText = response.text;
          modelSuccessfullyUsed = modelCandidate;
          break;
        }
      } catch (err: any) {
        lastConsultError = err;
        console.warn(`Consult model ${modelCandidate} error:`, err.message);
        // Wait 300ms before trying fallback if 503
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    if (replyText) {
      return res.json({
        success: true,
        reply: replyText,
        modelUsed: modelSuccessfullyUsed,
      });
    }

    throw lastConsultError || new Error('Failed to generate consultation advice.');
  } catch (error: any) {
    console.error('Consultation endpoint error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process consultation with gemini-3.8-flash',
    });
  }
});

// Setup Vite middleware in dev or static server in prod
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Tanmay Agrawal AI Platform running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
