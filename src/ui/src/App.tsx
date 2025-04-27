import { useEffect, useState } from "react"

declare global {
  interface Window {
    cl: {
      getEntries: () => Promise<string[]>;
      onNewEntry: (callback: (newEntries: string[]) => void) => () => void;
      setActiveEntry: (id: number) => void;
    };
  }
}

function App() {
  const [activeID, setActiveID] = useState<number>(0);
  const [entries, setEntries] = useState<string[]>([]);

  useEffect(() => {
    const removeListener = window.cl.onNewEntry((newEntries) => {
      setEntries(newEntries);
      setActiveID(newEntries.length - 1);
    });
    window.cl.getEntries().then((entries: string[]) => setEntries(entries));

    return removeListener;
  }, []);

  const handleClick = (id: number) => {
    setActiveID(id);
    window.cl.setActiveEntry(id);
  }

  return (
    <>
      <header>
        <h1>Copycat</h1>
      </header>
      <ul>
        {
          entries.length ? (
            entries.map((entry, index) => (
              <li className={activeID === index ? 'entry active-entry' : 'entry'} key={index} onClick={() => handleClick(index)}><pre>{entry}</pre></li>
            ))
          ) : (
            <li style={{textAlign: 'center', fontStyle: 'italic'}}><pre>😿 Nothing here 😿</pre></li>
          )
        }
      </ul>
    </>
  )
}

export default App
