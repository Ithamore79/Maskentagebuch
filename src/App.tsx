import { useState, useEffect } from "react";

interface Mask {
  name: string;
  description: string;
  category: string;
}

interface Entry {
  date: string;
  mask: string;
  monologue: string;
  response: string;
}

const inspirations = [
  "Was verschweigst du der Maske heute?",
  "Welche Rolle würdest du am liebsten heute ablegen?",
  "Wenn deine Maske sprechen könnte, was würde sie dich fragen?",
  "Was schützt dich heute?",
  "Was würdest du sagen, wenn du keine Angst hättest?",
  "Welche Erinnerung hat dich heute besucht?",
  "Wer wärst du, wenn niemand zusieht?"
];

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedMask, setSelectedMask] = useState("");
  const [maskEntry, setMaskEntry] = useState("");
  const [replyEntry, setReplyEntry] = useState("");
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [inspiration, setInspiration] = useState("");
  const [theme, setTheme] = useState("klassisch");
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [masks, setMasks] = useState<Mask[]>([
    { name: "Die Wilde", description: "Sie will tanzen, schreien, losbrechen.", category: "wild" },
    { name: "Der Archivar", description: "Bewahrt Erinnerungen, ordnet, analysiert.", category: "kontrolliert" },
    { name: "Die Königin", description: "Führt mit Würde, beansprucht Raum.", category: "machtvoll" },
    { name: "Der Schatten", description: "Verdrängtes, Ungesagtes, Unheimliches.", category: "dunkel" },
    { name: "Die Künstlerin", description: "Formt Chaos in Bedeutung.", category: "kreativ" }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("entries");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const saveEntry = () => {
    const newEntry = { date: entryDate, mask: selectedMask, monologue: maskEntry, response: replyEntry };
    const updated = [...entries, newEntry];
    setEntries(updated);
    localStorage.setItem("entries", JSON.stringify(updated));
    setMaskEntry("");
    setReplyEntry("");
  };

  const exportAsText = () => {
    const text = entries.map(e => `# ${e.date} — ${e.mask}\n\n🎭 ${e.monologue}\n\n🪞 ${e.response}`).join("\n\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "maskentagebuch.txt";
    a.click();
  };

  const exportAsJSON = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "maskentagebuch.json";
    a.click();
  };

  const applyTheme = (theme: string) => {
    setTheme(theme);
    document.body.style.backgroundColor = theme === "poetisch" ? "#fdf6e3" : theme === "retro" ? "#222" : "#fff";
    document.body.style.color = theme === "retro" ? "#0f0" : "#000";
    document.body.style.fontFamily = theme === "poetisch" ? "'Georgia', serif" : "'Arial', sans-serif";
  };

  const handleAuth = () => {
    if (!passwordEnabled || passwordInput === "geheim") {
      setAuthenticated(true);
    } else {
      alert("Falsches Passwort");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: 10 }}>🎭 Maskentagebuch</h2>

      {passwordEnabled && !authenticated ? (
        <div>
          <p>🔒 Passwortschutz aktiviert</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Passwort eingeben"
          />
          <button onClick={handleAuth}>Einloggen</button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 10 }}>
            <label>
              🎨 Design-Stil:
              <select
                value={theme}
                onChange={(e) => applyTheme(e.target.value)}
                style={{ marginLeft: 10 }}
              >
                <option value="klassisch">Klassisch</option>
                <option value="poetisch">Poetisch</option>
                <option value="retro">Retro</option>
              </select>
            </label>
          </div>

          <label>Datum:
            <input
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              style={{ marginLeft: 10 }}
            />
          </label>

          <div style={{ marginTop: 10 }}>
            <label>Maske:
              <select
                value={selectedMask}
                onChange={(e) => setSelectedMask(e.target.value)}
                style={{ marginLeft: 10 }}
              >
                <option value="">-- wählen --</option>
                {masks.map((m) => (
                  <option key={m.name} value={m.name}>{m.name}</option>
                ))}
              </select>
            </label>
          </div>

          <textarea
            rows={3}
            placeholder="🎭 Monolog..."
            value={maskEntry}
            onChange={(e) => setMaskEntry(e.target.value)}
            style={{ width: "100%", marginTop: 10 }}
          />
          <textarea
            rows={3}
            placeholder="🪞 Antwort..."
            value={replyEntry}
            onChange={(e) => setReplyEntry(e.target.value)}
            style={{ width: "100%", marginTop: 10 }}
          />

          <button onClick={saveEntry} style={{ marginTop: 10 }}>💾 Speichern</button>

          <div style={{ marginTop: 20 }}>
            <button onClick={() => setInspiration(inspirations[Math.floor(Math.random() * inspirations.length)])}>✨ Inspiration</button>
            {inspiration && <p style={{ marginTop: 10 }}><em>{inspiration}</em></p>}
          </div>

          <div style={{ marginTop: 20 }}>
            <button onClick={exportAsText}>⬇️ Export als TXT</button>
            <button onClick={exportAsJSON} style={{ marginLeft: 10 }}>⬇️ Export als JSON</button>
          </div>

          <div style={{ marginTop: 30 }}>
            <h3>📚 Gespeicherte Einträge</h3>
            {entries.map((e, i) => (
              <div key={i} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
                <strong>{e.date} — {e.mask}</strong>
                <p><strong>🎭</strong> {e.monologue}</p>
                <p><strong>🪞</strong> {e.response}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <label>
              <input type="checkbox" checked={passwordEnabled} onChange={() => setPasswordEnabled(!passwordEnabled)} /> Passwortschutz aktivieren
            </label>
          </div>
        </>
      )}
    </div>
  );
}
