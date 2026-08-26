import express, { Request, Response } from "express";
import path from "path";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

const apiRouter = express.Router();
apiRouter.use(express.json({ limit: "25mb" }));

function getGeminiClient(customApiKey?: string): GoogleGenAI | null {
  const key = customApiKey || process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

/**
 * Normalizes any user-passed or legacy model name into an officially supported Gemini model.
 */
function normalizeGeminiModel(model?: string): string {
  if (!model || typeof model !== "string") return "gemini-3.7-flash";
  const trimmed = model.trim().toLowerCase();
  if (trimmed.includes("3.1-pro") || trimmed.includes("pro-preview")) return "gemini-3.1-pro-preview";
  if (trimmed.includes("lite") || trimmed.includes("flash-lite")) return "gemini-3.1-flash-lite";
  if (trimmed === "gemini-flash-latest") return "gemini-flash-latest";
  if (trimmed.includes("flash") || trimmed.includes("gemini")) return "gemini-3.7-flash";
  return "gemini-3.7-flash";
}

/**
 * Helper to call Gemini generateContent with multi-tier model fallback
 * for 503 (High demand), 429 (Rate limit/Quota), and 400 (Invalid argument).
 */
async function generateWithRetry(ai: GoogleGenAI, reqPayload: any) {
  const requestedModel = normalizeGeminiModel(reqPayload.model);
  // Candidates in prioritized fallback order
  const modelCandidates = Array.from(
    new Set([requestedModel, "gemini-3.7-flash", "gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-3.5-flash"])
  );

  let lastError: any = null;

  for (let i = 0; i < modelCandidates.length; i++) {
    const candidateModel = modelCandidates[i];
    const candidateConfig = { ...reqPayload.config };

    try {
      return await ai.models.generateContent({
        ...reqPayload,
        model: candidateModel,
        config: candidateConfig,
      });
    } catch (error: any) {
      lastError = error;
      const errorMessage = error?.message || "";
      const errorLower = errorMessage.toLowerCase();

      const isHighDemandOrQuota =
        errorLower.includes("503") ||
        errorLower.includes("429") ||
        errorLower.includes("high demand") ||
        errorLower.includes("unavailable") ||
        errorLower.includes("resource_exhausted") ||
        errorLower.includes("quota") ||
        errorLower.includes("too many requests");

      const isInvalidArgument =
        errorLower.includes("invalid argument") ||
        errorLower.includes("invalid_argument") ||
        errorLower.includes("400") ||
        errorLower.includes("not supported");

      if (isInvalidArgument) {
        // Try sanitized config without thinking tokens or custom parameters
        try {
          const sanitizedConfig = { ...candidateConfig };
          delete sanitizedConfig.thinkingConfig;
          if (sanitizedConfig.temperature !== undefined) {
            sanitizedConfig.temperature = Math.max(0.0, Math.min(2.0, Number(sanitizedConfig.temperature) || 0.7));
          }
          return await ai.models.generateContent({
            ...reqPayload,
            model: candidateModel,
            config: sanitizedConfig,
          });
        } catch (innerErr) {
          lastError = innerErr;
        }
      }

      if (isHighDemandOrQuota && i < modelCandidates.length - 1) {
        console.warn(`Model ${candidateModel} high demand/quota limit. Instantly falling over to ${modelCandidates[i + 1]}...`);
        continue;
      }
    }
  }

  // If all immediate fallbacks failed, try one quick retry after 500ms
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return await ai.models.generateContent({
      contents: reqPayload.contents,
      model: "gemini-3.6-flash",
      config: {
        systemInstruction: reqPayload.config?.systemInstruction,
        temperature: 0.7,
      },
    });
  } catch (finalErr) {
    throw lastError || finalErr;
  }
}

const BASE_SYSTEM_INSTRUCTION = `You are Bangladesh AI Teacher, an intelligent and patient AI tutor for students from Class 1 to Class 10.

Your goal is to teach, explain, guide, solve, test, and improve student understanding.

Always adapt your explanation to the selected class and subject.
Support Bangla (বাংলা), English, and Banglish (Bengali written with Latin alphabet).
Adapt the language to match the student's question and preference.

Teaching Rules:
1. For Mathematics: Always solve accurately and step-by-step. When solving full problems, structure clearly:
   - ### Given (দেওয়া আছে)
   - ### Required (নির্ণেয়)
   - ### Formula (প্রয়োজনীয় সূত্র)
   - ### Solution (ধাপে ধাপে সমাধান)
   - ### Answer (উত্তর)
   - ### Check (শুদ্ধি পরীক্ষা)
   Never skip important steps.
2. For Science (Physics, Chemistry, Biology, General Science):
   - Explain Concept, Cause (Why it happens), Process (How it works), Example, Real-life Application, and Common Mistakes.
   - For Physics: Formula, Symbol meanings, SI Units, and calculation.
   - For Chemistry: Definitions, Chemical equations, and real-life connections.
   - For Biology: Structures, Processes, and functions.
   Never invent scientific facts.
3. Teaching Modes:
   - When in 'Easy Mode' (or student says "Easy করে বুঝাও" / "I don't understand"): Use simpler words, everyday metaphors (e.g. food, sports, daily life in Bangladesh), smaller bite-sized steps, and easier numbers.
   - For Homework: Default to Socratic guidance (Hint -> First step -> Guided prompt). If student specifically asks "Solve completely" or "পুরো সমাধান দাও", provide the complete step-by-step solution.
   - For Exam Prep: Provide high-yield NCTB topics, model questions, formula summary, and common exam pitfalls. Never claim "this will definitely appear in exam", instead say "This is an important topic to practice".
4. Bangladesh NCTB Curriculum Alignment:
   - Be respectful of NCTB curriculum for the given class level.
   - Never fabricate fake NCTB page numbers, chapter numbers, or false quotations. If exact official textbook page/exercise is unknown, clearly state that while providing the correct educational concept.
5. Empathy & Tone:
   - Be encouraging, warm, and patient. Never shame a student for a mistake.
   - Core teaching sequence: Understand -> Explain -> Demonstrate -> Practice -> Check -> Improve.`;

// API Health
apiRouter.get("/health", (_req: Request, res: Response) => {
  const hasServerKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: "ok",
    hasServerKey,
    time: new Date().toISOString(),
  });
});

// Test API Connection
apiRouter.post("/test-connection", async (req: Request, res: Response) => {
  try {
    const { provider = "gemini", apiKey, apiEndpoint, model = "gemini-3.7-flash" } = req.body;
    const effectiveKey = apiKey || process.env.GEMINI_API_KEY;

    if (!effectiveKey && provider === "gemini") {
      res.status(400).json({
        success: false,
        message: "No API Key provided and no server environment key is configured.",
      });
      return;
    }

    if (provider === "gemini") {
      const ai = getGeminiClient(effectiveKey);
      if (!ai) {
        res.status(400).json({ success: false, message: "Could not initialize Gemini client." });
        return;
      }

      const safeModel = model || "gemini-3.7-flash";
      const response = await generateWithRetry(ai, {
        model: safeModel,
        contents: "Respond with the word 'OK' to verify API connection.",
        config: {
          maxOutputTokens: 10,
          thinkingConfig: {
            thinkingBudget: 0, // Disable thinking for instantaneous ping
          },
        },
      });

      res.json({
        success: true,
        message: `Successfully connected to Gemini model (${safeModel}). Response: ${response.text?.trim()}`,
      });
      return;
    }

    if (provider === "openai" || provider === "custom") {
      const endpoint = apiEndpoint || "https://api.openai.com/v1/chat/completions";
      const fetchResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${effectiveKey}`,
        },
        body: JSON.stringify({
          model: model || "gpt-4o-mini",
          messages: [{ role: "user", content: "Test ping. Respond with OK." }],
          max_tokens: 10,
        }),
      });

      if (!fetchResponse.ok) {
        const errorText = await fetchResponse.text();
        res.status(400).json({
          success: false,
          message: `Provider returned status ${fetchResponse.status}: ${errorText.slice(0, 200)}`,
        });
        return;
      }

      res.json({
        success: true,
        message: `Successfully connected to custom endpoint (${endpoint})`,
      });
      return;
    }

    res.status(400).json({ success: false, message: `Unsupported provider: ${provider}` });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Connection test failed.",
    });
  }
});

// Chat Endpoint
apiRouter.post("/chat", async (req: Request, res: Response) => {
  try {
    const {
      message,
      classLevel = "Class 8",
      subject = "mathematics",
      mode = "teacher",
      language = "auto",
      academicYear = "2026",
      history = [],
      image, // base64 string or data URL
      apiSettings = {},
    } = req.body;

    const {
      useCustomApi = false,
      provider = "gemini",
      apiKey: customKey = "",
      apiEndpoint = "",
      model = "gemini-3.7-flash",
      temperature = 0.7,
      maxTokens = 2048,
      thinkingBudget = 0,
    } = apiSettings;

    const effectiveKey = useCustomApi && customKey ? customKey : process.env.GEMINI_API_KEY;

    // Check if we have no key available
    if (!effectiveKey && provider === "gemini") {
      res.status(200).json({
        success: false,
        noKey: true,
        message:
          "AI API is not connected yet. Open Settings -> API and add an API key or use the built-in Demo Mode to explore lessons and step-by-step problem solving.",
      });
      return;
    }

    const classSubjectContext = `
Current Student Context:
- Target Grade / Class: ${classLevel} (Bangladesh NCTB curriculum level)
- Academic Year: ${academicYear}
- Subject: ${subject}
- Active Teaching Mode: ${mode} (Options: teacher, easy, math_step, science, homework, exam_prep, quiz)
- Language Preference: ${language} (auto/bn/en)
`;

    const systemInstruction = `${BASE_SYSTEM_INSTRUCTION}\n\n${classSubjectContext}`;

    if (provider === "gemini") {
      const ai = getGeminiClient(effectiveKey);
      if (!ai) {
        res.status(500).json({ success: false, message: "Gemini client initialization failed." });
        return;
      }

      // Prepare contents
      let contents: any;

      if (image && typeof image === "string") {
        let base64Data = image;
        let mimeType = "image/jpeg";
        if (image.startsWith("data:")) {
          const parts = image.split(",");
          const mimeMatch = parts[0].match(/:(.*?);/);
          if (mimeMatch) mimeType = mimeMatch[1];
          base64Data = parts[1];
        }

        const imagePart = {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        };

        const textPart = {
          text: message || "Please analyze this image, read the math/science question, and explain/solve it step-by-step according to the Bangladesh NCTB curriculum.",
        };

        contents = { parts: [imagePart, textPart] };
      } else {
        // Build conversation prompt or multi-turn
        let formattedPrompt = message;
        if (history && history.length > 0) {
          const recentTurns = history.slice(-4).map((h: any) => `${h.role === "user" ? "Student" : "AI Teacher"}: ${h.content}`).join("\n\n");
          formattedPrompt = `Previous context:\n${recentTurns}\n\nCurrent Question:\n${message}`;
        }
        contents = formattedPrompt;
      }

      const safeModel = model || "gemini-3.7-flash";
      const parsedBudget = typeof thinkingBudget === "number" ? thinkingBudget : 0;
      
      const config: any = {
        systemInstruction,
        temperature: typeof temperature === "number" ? temperature : 0.7,
        maxOutputTokens: typeof maxTokens === "number" ? maxTokens : 2048,
        thinkingConfig: {
          thinkingBudget: parsedBudget, // 0 = disabled (instant response, lowest latency)
        },
      };

      const response = await generateWithRetry(ai, {
        model: safeModel,
        contents,
        config,
      });

      const responseText = response.text || "I was unable to generate an explanation. Please try asking again.";

      res.json({
        success: true,
        text: responseText,
      });
      return;
    }

    // Custom OpenAI-compatible provider
    if (provider === "openai" || provider === "custom") {
      const endpoint = apiEndpoint || "https://api.openai.com/v1/chat/completions";
      const messages: any[] = [
        { role: "system", content: systemInstruction },
        ...history.slice(-4).map((h: any) => ({ role: h.role, content: h.content })),
        { role: "user", content: message },
      ];

      const fetchResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${effectiveKey}`,
        },
        body: JSON.stringify({
          model: model || "gpt-4o-mini",
          messages,
          temperature: temperature || 0.7,
          max_tokens: maxTokens || 2048,
        }),
      });

      if (!fetchResponse.ok) {
        const errorText = await fetchResponse.text();
        res.status(fetchResponse.status).json({
          success: false,
          message: `AI provider error (${fetchResponse.status}): ${errorText.slice(0, 300)}`,
        });
        return;
      }

      const data: any = await fetchResponse.json();
      const answer = data.choices?.[0]?.message?.content || "No response received.";
      res.json({ success: true, text: answer });
      return;
    }

    res.status(400).json({ success: false, message: "Invalid provider specified." });
  } catch (error: any) {
    let errorMessage = error?.message || "An error occurred while generating the explanation.";
    
    if (errorMessage.includes("503") || errorMessage.includes("high demand") || errorMessage.includes("UNAVAILABLE")) {
      console.warn("API 503: High demand, returning friendly message to user.");
      errorMessage = "দুঃখিত, এই মুহূর্তে সার্ভারে অনেক বেশি চাপ রয়েছে (High Demand)। অনুগ্রহ করে একটু পর আবার চেষ্টা করো। (The model is currently experiencing high demand. Please try again in a few moments.)";
    } else {
      console.error("Chat API Error:", error);
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
});

// Structured Quiz Generator Endpoint
apiRouter.post("/quiz-generate", async (req: Request, res: Response) => {
  try {
    const {
      classLevel = "Class 8",
      subject = "mathematics",
      topic = "General",
      difficulty = "medium",
      count = 5,
      apiSettings = {},
    } = req.body;

    const {
      useCustomApi = false,
      provider = "gemini",
      apiKey: customKey = "",
      model = "gemini-3.7-flash",
    } = apiSettings;

    const effectiveKey = useCustomApi && customKey ? customKey : process.env.GEMINI_API_KEY;

    if (!effectiveKey && provider === "gemini") {
      res.json({
        success: false,
        noKey: true,
        message: "No API key available for dynamic quiz generation.",
      });
      return;
    }

    if (provider === "gemini") {
      const ai = getGeminiClient(effectiveKey);
      if (!ai) {
        res.status(500).json({ success: false, message: "Gemini client init failed" });
        return;
      }

      const prompt = `Generate ${count} high-quality, multiple-choice quiz questions for Bangladesh school students.
- Class Level: ${classLevel}
- Subject: ${subject}
- Topic: ${topic}
- Difficulty: ${difficulty} (easy / medium / hard / challenge)
- Language: Natural Bengali (বাংলা) or English as appropriate for the subject.
Provide exactly 4 options per question, the 0-indexed correct option index, and a clear step-by-step educational explanation.`;

      const safeModel = model || "gemini-3.7-flash";
      const response = await generateWithRetry(ai, {
        model: safeModel,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          thinkingConfig: {
            thinkingBudget: 0, // Fast JSON generation without reasoning overhead
          },
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING, description: "Question text in clear format with math latex if needed" },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 4 options",
                },
                correctIndex: { type: Type.INTEGER, description: "0-based index of correct option (0, 1, 2, or 3)" },
                explanation: { type: Type.STRING, description: "Clear explanation of why this answer is correct and how to solve" },
                topic: { type: Type.STRING },
                difficulty: { type: Type.STRING },
              },
              required: ["question", "options", "correctIndex", "explanation"],
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || "[]");
      res.json({ success: true, questions: parsed });
      return;
    }

    res.status(400).json({ success: false, message: "Dynamic quiz supported on Gemini" });
  } catch (error: any) {
    let errorMessage = error?.message || "Failed to generate quiz.";
    
    if (errorMessage.includes("503") || errorMessage.includes("high demand") || errorMessage.includes("UNAVAILABLE")) {
      console.warn("API 503: High demand during quiz gen, returning friendly message to user.");
      errorMessage = "দুঃখিত, এই মুহূর্তে সার্ভারে অনেক বেশি চাপ রয়েছে (High Demand)। অনুগ্রহ করে একটু পর আবার কুইজ তৈরির চেষ্টা করো। (The model is currently experiencing high demand. Please try again in a few moments.)";
    } else {
      console.error("Quiz generate error:", error);
    }

    res.status(500).json({ success: false, message: errorMessage });
  }
});

// Mount the API Router on both /api (standard local & preview) and root / (in case serverless rewrites strip /api)
app.use("/api", apiRouter);
app.use(apiRouter);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bangladesh AI Teacher server running on http://localhost:${PORT}`);
  });
}

// Start standalone Express server when running outside Vercel Serverless environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;
export { app };
