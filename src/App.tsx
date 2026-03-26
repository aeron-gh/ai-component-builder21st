import { useEffect, useState } from "react";
import Leftbar from "./components/Leftbar";
import Preview from "./components/Preview";
import Rightbar from "./components/Rightbar";
import OpenAI from "openai";
import type { GenerationState } from "./types";
// import { GoogleGenAI } from "@google/genai";
// import 'dotenv/config';
const apiUrl = import.meta.env.VITE_TEMP_GORQAPI;

const cleanGeneratedCode = (raw: string): string => {
  let code = raw.trim();
  code = code.replace(/^```(?:jsx|tsx|javascript|typescript)?\s*\n?/i, "");
  code = code.replace(/\n?```\s*$/i, "");
  code = code.replace(/^import\s+.*;\s*\n?/gm, "");
  code = code.replace(/^export\s+(default\s+)?/gm, "");
  const fnMatch = code.match(
    /(?:function|const)\s+\w+\s*(?:=\s*)?(?:\([^)]*\)\s*(?:=>)?\s*)?[({]\s*\n?\s*return\s*\(\s*\n?([\s\S]*?)\n?\s*\)\s*;?\s*\n?\s*[})]\s*;?\s*$/,
  );
  if (fnMatch?.[1]) {
    code = fnMatch[1].trim();
  }
  return code.trim();
};

const extractTitle = (prompt: string): string => {
  const words = prompt.split(/\s+/).slice(0, 6).join(" ");
  return words.length > 50 ? words.slice(0, 50) + "..." : words;
};

const systemPrompt = `
You are a JSX component generator for React 18. Follow these rules:

1. Output only valid JSX for a functional component body.
2. Do NOT include 'return' statements; JSX will be wrapped in parentheses.
3. Wrap multiple elements in a single parent (<div> or fragment <> </>).
4. Use Tailwind classes or inline styles if specified.
5. Do NOT include imports, exports, or ReactDOM code.
6. Do NOT add explanations or comments — output must be copy-paste ready.
7. Assume it will be injected like:
   const Component = () => (
     /* your JSX here */
   );
`;

function App() {
  const [apiKey, setApi] = useState(
    () => localStorage.getItem("gemini_api_key") ?? apiUrl,
  );
  const [generationState, setGenerationState] = useState<GenerationState>({
    status: "idle",
  });
  const [prompt, setPrompt] = useState("");
  // const [galleryState] = useState({ status: "idle" });
  // const [isSaving] = useState(false);

  useEffect(() => {
    if (!prompt) return;
    async function main() {
      
      // const ai = new GoogleGenAI({
      //   apiKey: apiKey,
      // });
      // const response = await ai.models.generateContent({
      //   model: "gemma-3-1b",
      //   contents: prompt,
      // });
      try {
        setGenerationState({ status: "loading" });
        const client = new OpenAI({
          apiKey: apiKey,
          baseURL: "https://api.groq.com/openai/v1",
          dangerouslyAllowBrowser: true,
        });

        const response = await client.responses.create({
          model: "openai/gpt-oss-20b",
          reasoning: { effort: "medium" }, // optional, Groq-specific
          input: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
        });

        const raw = response.output_text;
        const code = cleanGeneratedCode(raw);

        if (!code) {
          setGenerationState({
            status: "error",
            message: "No code was generated. Try a different prompt.",
          });
          return;
        }
        setGenerationState({ status: "success", code, prompt });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Generation failed";
        setGenerationState({ status: "error", message });
      }
    }
    main();
  }, [prompt, apiKey]);

  // const handleGenerate = useCallback(
  //   async (prompt: string) => {
  //     if (!apiKey) return;
  //     setGenerationState({ status: "loading" });

  //     try {
  // const openai = new OpenAI({
  //   apiKey,
  //   dangerouslyAllowBrowser: true,
  // });

  // const response = await openai.chat.completions.create({
  //   model: "gpt-4o",
  //   messages: [
  //     {
  //       role: "system",
  //       content:
  //         "Return only raw JSX for a single React component. No imports, no exports, no function wrapper, no explanations, no markdown code fences. Use only Tailwind CSS classes for styling. The JSX should be a single root element. Use realistic placeholder content.",
  //     },
  //     { role: "user", content: "how are u!!"},
  //   ],
  //   temperature: 0.7,
  //   max_tokens: 2000,
  // });

  // const raw = response.choices[0]?.message?.content ?? "";
  //       const raw = response.text;
  //       const code = cleanGeneratedCode(raw);
  //       if (!code) {
  //         setGenerationState({
  //           status: "error",
  //           message: "No code was generated. Try a different prompt.",
  //         });
  //         return;
  //       }
  //       setGenerationState({ status: "success", code, prompt });
  //     } catch (err) {
  //       const message =
  //         err instanceof Error ? err.message : "Generation failed";
  //       setGenerationState({ status: "error", message });
  //     }
  //   },
  //   [apiKey],
  // );

  return (
    <div style={{ display: "flex" }}>
      <Leftbar setPrompt={setPrompt} setApi={setApi}></Leftbar>
      <Preview generationState={generationState}></Preview>
      <Rightbar></Rightbar>
    </div>
  );
}

export default App;
