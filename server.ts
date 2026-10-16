import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

const SYSTEM_INSTRUCTION = `You are "Yoohoo Concierge", the official AI guide for Yoohoo.Guru — the premier skill-sharing marketplace connecting Gurus (masters/teachers) and Gunus (enthusiastic learners).

Core Knowledge & Rules:
1. Platform terminology:
   - "Guru": Expert instructor/artisan who teaches practical skills.
   - "Gunu": Learner seeking 1-on-1 mentorship.
2. Yoohoo Escrow Protection:
   - Payments are securely authorized via Stripe and held in escrow until the session is completed and the Gunu confirms satisfaction.
   - The Gunu only pays the session fee charged by the Guru (no hidden buyer fees).
   - The site retains 15% on paid sessions. Gurus also have a one-time $4.99 setup fee to activate their teaching profile and escrow account.
   - Gurus receive their 85% net payout after the session is marked complete.
3. Formats:
   - In-Person Local Meetups: Verified workshops, studios, co-working spots within distance radius (e.g., 5, 10, 25, 50 miles).
   - Video Sessions: Integrated 1-click Google Meet with screen sharing and multi-camera support.
4. Ratings & Reviews:
   - 5-star scale + written reviews. Both Gunus review Gurus, and Gurus review Gunus.
   - Strictly verified: Reviews are only visible after a session is marked completed.
5. Featured Gurus:
   - Jesse "Bigfoot" Vance ($65/hr, SF) — Luthier & Acoustic Fingerpicking Guitar.
   - Elena Rostova ($50/hr, SF) — 80% Hydration Sourdough Baking.
   - Mateo Morales ($75/hr, Oakland) — Japanese Hand Tools & Dovetail Woodworking.
   - Dr. Sophia Lin ($90/hr, Palo Alto & Remote) — TypeScript & AI Agent Architecture.
   - Kwame Adjei ($48/hr, Emeryville) — Bicycle Mechanics & Wheel Building.
   - Carmen Delgado ($62/hr, SF) — Ceramic Wheel Throwing & Clay Centering.
   - Tariq Mansoor ($52/hr, SF & Remote) — Espresso Extraction & Latte Art.
   - Charlotte Dubois ($45/hr, Remote) — French Conversational Fluency.

Style: Friendly, knowledgeable, concise, and helpful. Always recommend appropriate Gurus, explain escrow with clarity, and guide users on how to prepare for sessions.`;

// Gemini Chat Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // If Gemini client is active, call gemini-3.8-flash
  if (ai) {
    try {
      const contents: any[] = [];

      // Append past history if provided
      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.content || item.text }],
          });
        }
      }

      // Add current message
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const reply = response.text || 'I am ready to help you discover the perfect Guru on Yoohoo.Guru!';
      return res.json({ reply });
    } catch (err: any) {
      console.error('Gemini API call failed, using graceful fallback:', err);
    }
  }

  // Graceful intelligent fallback when API key is not configured or offline
  const query = message.toLowerCase();
  let fallbackReply = `Hi there! I'm your Yoohoo.Guru concierge. `;

  if (query.includes('guitar') || query.includes('music') || query.includes('fingerpicking') || query.includes('jesse')) {
    fallbackReply += `I highly recommend **Jesse "Bigfoot" Vance**! He is our master luthier in San Francisco ($65/hr, 4.96 rating). He teaches acoustic fingerpicking, Travis picking, and open tunings in his 24th & Florida St workshop or via Google Meet. Would you like to book a session with him?`;
  } else if (query.includes('bread') || query.includes('sourdough') || query.includes('bake') || query.includes('elena')) {
    fallbackReply += `You'll love **Elena Rostova**! She is our artisan baker in Inner Richmond, SF ($50/hr, 4.98 rating). She provides a sample of her 12-year sourdough starter and coaches you on 80% hydration loaves and steam crusts.`;
  } else if (query.includes('wood') || query.includes('furniture') || query.includes('dovetail') || query.includes('mateo')) {
    fallbackReply += `Check out **Mateo Morales** in Oakland ($75/hr, 4.92 rating). He teaches Japanese pull saws, waterstone sharpening, and handmade dovetail joints with premium hardwoods.`;
  } else if (query.includes('code') || query.includes('typescript') || query.includes('ai') || query.includes('sophia')) {
    fallbackReply += `**Dr. Sophia Lin** ($90/hr, 5.00 rating) is our staff AI engineer in Palo Alto. She teaches full-stack TypeScript, system design, and AI agent architectures both in-person at HanaHaus and nationwide via Google Meet.`;
  } else if (query.includes('escrow') || query.includes('fee') || query.includes('money') || query.includes('stripe') || query.includes('refund')) {
    fallbackReply += `**Here is how Yoohoo Escrow works:** When you book, your payment is authorized via Stripe and held securely in escrow. The Gunu only pays the exact session fee set by the Guru — with zero buyer markups! Yoohoo.Guru retains 15% on paid sessions to cover escrow protection, dispute resolution, and platform infrastructure. Gurus also pay a one-time $4.99 onboarding and verification setup fee. The Guru receives their 85% net earnings as soon as the session is marked completed!`;
  } else if (query.includes('rating') || query.includes('review') || query.includes('star')) {
    fallbackReply += `**Yoohoo.Guru's Verified Rating System:** Both Gunus and Gurus review each other on a 5-star scale with written feedback. To guarantee 100% authenticity, reviews are only unlocked and published once a session is marked complete and funds are released!`;
  } else if (query.includes('meet') || query.includes('video') || query.includes('remote') || query.includes('in-person')) {
    fallbackReply += `You can choose between **In-Person Meetups** (at the Guru's workshop, a community makerspace, or local cafe) or **Google Meet Video** (1-on-1 screen share and high-def camera angles for nationwide learning). Both formats include full escrow protection!`;
  } else {
    fallbackReply += `Whether you want to learn acoustic guitar with Jesse, bake sourdough with Elena, craft dovetails with Mateo, or code AI agents with Dr. Sophia Lin, every session is backed by our **Yoohoo Escrow Guarantee**. What skill are you excited to explore today?`;
  }

  return res.json({ reply: fallbackReply });
});

// Dev vs Prod Vite setup
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Yoohoo.Guru full-stack server running on http://0.0.0.0:${port}`);
});
