import { useMemo } from "react";

const Preview = ({ generationState }) => {
  return (
    <div style={{ border: "2px solid black", flex: "1" }}>
      <div className="flex-1 flex items-center justify-center p-8">
        {generationState.status === "idle" && (
          <p className="text-gray-500">Describe a component to generate code</p>
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
          <div className="max-w-2xl w-full">
            <pre>
              <WebPreview code={generationState.code}></WebPreview>
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
    <div >
      <iframe
        srcDoc={srcdoc}
        sandbox="allow-scripts"
        title="Component Preview"
        className="w-full h-full border-0"
      />
    </div>
  );
};

export default Preview;