import { useMemo, useState } from "react";

const Preview = ({ generationState }) => {
  const [preview, setPeview] = useState(true);

  return (
    <div className="flex-1 bg-slate-900 border-l border-slate-700">
      <div className="flex gap-2 p-4 border-b border-slate-700">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${!preview ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
          onClick={() => setPeview(false)}
        >
          Code
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${preview ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
          onClick={() => setPeview(true)}
        >
          Preview
        </button>
      </div>
      <div>
        {preview ? (
          <div className="flex-1 flex items-center justify-center p-8">
            {generationState.status === "idle" && (
              <p className="text-gray-500">
                Describe a component to generate code
              </p>
            )}
            {generationState.status === "loading" && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Generating...</p>
              </div>
            )}
            {generationState.status === "error" && (
              <p className="text-red-400">{generationState.message}</p>
            )}
            {generationState.status === "success" && (
              <div className="max-w-2xl w-full h-[500px] rounded-xl overflow-hidden border border-slate-600 shadow-lg">
                <WebPreview code={generationState.code}></WebPreview>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 overflow-auto flex-1">
            <pre className="bg-slate-800 text-slate-100 p-4 rounded-xl text-sm font-mono overflow-x-auto">
              {`function App(){
            return (
              ${generationState.code}
            )
          }`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

const buildSrcdoc = (jsxCode: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 16px; font-family: system-ui, -apple-system, sans-serif; background: white; }
    .error-display { color: #ef4444; padding: 16px; font-family: monospace; font-size: 14px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    try {
     const Component = () => (    
      ${jsxCode}
      );
      ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Component));
    } catch (err) {
      document.getElementById('root').innerHTML = '<div class="error-display">Render error: ' + err.message + '</div>';
    }
  </script>
  <script>
    window.onerror = function(msg) {
      document.getElementById('root').innerHTML = '<div class="error-display">Error: ' + msg + '</div>';
    };
  </script>
</body>
</html>`;

const WebPreview = ({ code }: { code: string }) => {
  const srcdoc = useMemo(() => buildSrcdoc(code), [code]);
  return (
    <div className="w-full h-full">
      <iframe
        srcDoc={srcdoc}
        sandbox="allow-scripts"
        title="Component Preview"
        className="w-full h-full border-0 bg-white"
      />
    </div>
  );
};

export default Preview;
