import { useState } from "react";

const Leftbar = ({ setPrompt ,setApi}) => {
  const [apikey, setapikey] = useState("");
  const [prompt, setprompt] = useState("");

  console.log(apikey);
  console.log(prompt);

  return (
    <div style={{ border: "2px black solid", width: "300px", height: "100vh" }}>
      AI Components Builder
      <input
        type="text"
        placeholder="apiKEY"
        style={{ border: "2px solid red" }}
        value={apikey}
        onChange={(e) => {
          setapikey(e.target.value);
        }}
      />
      <button
        style={{ border: "2px solid black" }}
        onClick={() => {
          localStorage.setItem("gemini_api_key", apikey);
          setApi(apikey);
        }}
      >
        SAVE
      </button>
      <br></br>
      <br></br>
      <div>
        <input
          type="text"
          placeholder="describe a UI component"
          style={{
            border: "2px solid red",
            height: "300px",
            borderRadius: "10px",
          }}
          value={prompt}
          onChange={(e) => {
            setprompt(e.target.value);
          }}
        />
      </div>
      <div>
        <button
          onClick={() => setPrompt(prompt)}
          style={{ border: "2px solid black" }}
        >
          GENERATE Component
        </button>
      </div>
    </div>
  );
};

export default Leftbar;
