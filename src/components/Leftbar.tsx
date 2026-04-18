import { useState } from "react";

const Leftbar = ({ setPrompt, setApi }) => {
  const [apikey, setapikey] = useState("");
  const [prompt, setprompt] = useState("");

  return (
    <div className="w-85 h-screen bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
        <span className="text-3xl">🤖</span>
        AI Components Builder
      </h1>
      <div className="space-y-3 mb-8">
        <label className="text-sm font-medium text-slate-300">API Key</label>
        <div className="flex gap-1">
          <input
            type="password"
            placeholder="Enter your Gemini API key"
            className="flex-1 px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={apikey}
            onChange={(e) => setapikey(e.target.value)}
          />
          <button
            className="px-4 py-2.5 w-15 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg shadow-blue-600/25"
            onClick={() => {
              localStorage.setItem("gemini_api_key", apikey);
              setApi(apikey);
            }}
          >
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        <label className="text-sm font-medium text-slate-300">
          Component Description
        </label>
        <textarea
          placeholder="Describe the UI component you want to create..."
          className="flex-1 min-h-[200px] px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
          value={prompt}
          onChange={(e) => setprompt(e.target.value)}
        />

        <button
          onClick={() => setPrompt(prompt)}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
        >
          <span>✨</span>
          Generate Component
        </button>
      </div>
    </div>
  );
};

export default Leftbar;
