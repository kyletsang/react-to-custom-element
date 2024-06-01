import { useState } from "react";

import "./CustomElement";

function App() {
  const [text, setText] = useState("Hello World");
  const [counter, setCounter] = useState(0);
  const [checked, setChecked] = useState(false);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={() => setCounter((prev) => prev + 1)}>
            Increment
          </button>
          <input
            id="bool-check"
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.currentTarget.checked)}
          />
          <label htmlFor="bool-check">Toggle Check</label>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <custom-element
          propString={text}
          propNumber={counter}
          propBoolean={checked}
          propObject={{ text, number: counter }}
          propArray={[1, 2, 3]}
          propFunction={(args) => console.log("propFunction called", args)}
          onMyEvent={(str) => console.log("onEvent called", str)}
          my-first-attribute={"first-attribute-value " + text}
          my-second-attribute={"second-attribute-value " + text}
        />
      </div>
    </>
  );
}

export default App;
