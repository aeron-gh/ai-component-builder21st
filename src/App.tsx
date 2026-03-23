import { useCallback, useEffect, useState } from "react";
import Leftbar from "./components/leftbar";
import Preview from "./components/Preview";
import Rightbar from "./components/Rightbar";
// import OpenAI from "openai";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

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

function App() {
  const [apiKey, setApi] = useState(
    () =>
      localStorage.getItem("gemini_api_key") ??
      "",
  );
  const [generationState, setGenerationState] = useState({
    status: "idle",
  });
  const [prompt, setPrompt] = useState("");
  // const [galleryState] = useState({ status: "idle" });
  // const [isSaving] = useState(false);

  useEffect(() => {
    if (!prompt) return;
    setGenerationState({ status: "loading" });
    async function main() {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
      });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      console.log(response);
      const raw = response.text;
      console.log(raw);
      const code = cleanGeneratedCode(raw);

      if (!code) {
        setGenerationState({
          status: "error",
          message: "No code was generated. Try a different prompt.",
        });
        return;
      }
      setGenerationState({ status: "success", code, prompt });
    }
    main();
  }, [prompt, apiKey]);

  // const handleGenerate = useCallback(
  //   async (prompt: string) => {
  //     if (!apiKey) return;
  //     setGenerationState({ status: "loading" });

  //     try {
  //       // const openai = new OpenAI({
  //       //   apiKey,
  //       //   dangerouslyAllowBrowser: true,
  //       // });

  //       // const response = await openai.chat.completions.create({
  //       //   model: "gpt-4o",
  //       //   messages: [
  //       //     {
  //       //       role: "system",
  //       //       content:
  //       //         "Return only raw JSX for a single React component. No imports, no exports, no function wrapper, no explanations, no markdown code fences. Use only Tailwind CSS classes for styling. The JSX should be a single root element. Use realistic placeholder content.",
  //       //     },
  //       //     { role: "user", content: "how are u!!"},
  //       //   ],
  //       //   temperature: 0.7,
  //       //   max_tokens: 2000,
  //       // });

  //       const ai = new GoogleGenAI({
  //         apiKey: apiKey,
  //       });

  //       const response = await ai.models.generateContent({
  //         model: "gemini-3-flash-preview",
  //         contents: prompt,
  //       });

  //       // const raw = response.choices[0]?.message?.content ?? "";
  //       console.log(response);
  //       const raw = response.text;
  //       console.log(raw);
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