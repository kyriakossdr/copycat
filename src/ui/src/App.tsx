import { useEffect, useState } from "react"

declare global {
  interface Window {
    cl: {
      getEntries: () => Promise<string[]>;
      onNewEntry: (callback: (entries: string[]) => void) => () => void;
    };
  }
}


function App() {
  const [entries, setEntries] = useState<string[]>([]);

  useEffect(() => {
    window.cl.getEntries().then((entries: string[]) => setEntries(entries))

    const removeListener = window.cl.onNewEntry((entries) => setEntries(entries));

    return removeListener;
  }, []);

  return (
    <>
      <header>
        <h1>Copycat</h1>
      </header>
      <ul>
        {
          entries.length ? (
            entries.map((entry, index) => (
              <li key={index}><pre>{entry}</pre></li>
            ))
          ) : (
            <li style={{textAlign: 'center', fontStyle: 'italic'}}>Nothing here ..</li>
          )
        }
      </ul>
    </>
  )
}

export default App
