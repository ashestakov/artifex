import React, { useCallback, useEffect, useRef } from "react";
import "./App.css";

type Style = {
  id: number;
  name: string;
  thumbnail: string;
};

function App() {
  const [styles, setStyles]: [Array<Style>, (any)] = React.useState([]);
  const [selectedStyle, setSelectedStyle]: [Style | null, (any)] = React.useState(null);
  const [resultUrl, setResultUrl]: [string | null, (any)] = React.useState(null);

  const promptRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/styles")
      .then((res) => res.text())
      .then((data) => {
        setStyles(JSON.parse(data).styles);
      });
  }, []);

  const onGenerate = useCallback(() => {
    if (!selectedStyle) {
      return;
    }
    if (!promptRef.current || !(promptRef.current as HTMLInputElement).value) {
      return;
    }
    fetch("http://localhost:3000/api/gens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        styleId: (selectedStyle as Style).id,
        prompt: (promptRef.current as HTMLInputElement).value
      })
    }).then((res) => res.text())
      .then((data) => {
        console.log(data);
        setResultUrl(data);
      });
  }, [selectedStyle]);

  return (
    <main>
      <ul>
        {styles.map((style) => (
          <li key={style.id}>
            <button onClick={() => setSelectedStyle(style)}>
              {style.name}
              <img src={style.thumbnail} alt={style.name} />
            </button>
          </li>
        ))
        }
      </ul>
      <input ref={promptRef} type="text" />
      <footer>
        <button className="brand" onClick={onGenerate}>
          Generate
        </button>
      </footer>
      {
        resultUrl && (<img src={resultUrl} alt="result" />)
      }
    </main>
  );
}

export default App;
