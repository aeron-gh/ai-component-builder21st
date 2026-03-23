const Preview = ({ generationState}) => {
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
            {/* <p className="text-sm text-gray-400 mb-2">
              Generated code (preview coming in Class 4):
            </p> */}
            <pre className="bg-gray-900 p-4 rounded-lg text-sm text-green-400 overflow-auto max-h-96">
              {generationState.code}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
