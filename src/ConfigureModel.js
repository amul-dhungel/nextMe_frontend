import React, { useState } from "react";

const PERSONALITIES = [
  {
    key: "Friendly Physicisit",
    label: "Physics",
    prompt: "You have a skill of Richard Feymen ability to explain complex physics concepts in simple terms.",
  },
  {
    key: "Mathmatical Seeker",
    label: "Mathematics",
    prompt: "You are person who understood calculus in an intuitive way.",
  },
  {
    key: "creative",
    label: "Creative",
    prompt: "You are an imaginative and creative AI that loves new ideas and inspiring responses.",
  },
  {
    key: "concise",
    label: "Concise",
    prompt: "You are a concise AI who answers clearly and directly, with no extra fluff.",
  },
];

export default function ConfigureModel({ onSave }) {
  const [selected, setSelected] = useState(PERSONALITIES[0]);
  const [tokens, setTokens] = useState(200);
  const [temperature, setTemperature] = useState(0.7);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Gather config in a JSON object
  function getConfigJson() {
    return {
      systemPrompt: selected.prompt,
      personality: selected.key,
      tokens,
      temperature,
    };
  }

  // POST config to Flask backend (replace with your API endpoint)
  async function saveConfigToBackend(configJson) {
    try {
      const res = await fetch("https://your-flask-backend.com/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configJson),
      });
      return res.ok;
    } catch (err) {
      console.error("Failed to send config:", err);
      return false;
    }
  }

  // Called when Save button is clicked
  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);

    const configJson = getConfigJson();

    if (onSave) {
      onSave(configJson);
    }
    // Send to backend (remove/comment if you only want local)
    const backendOk = await saveConfigToBackend(configJson);

    if (backendOk) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } else {
      alert("Failed to save config to backend.");
    }

    setSaving(false);
  };

  return (
    <div className="config-panel">
      <h2 style={{ marginBottom: 18 }}>Configure Model</h2>
      <div className="section">
        <div className="section-label">Choose a Personality:</div>
        <div className="personality-buttons">
          {PERSONALITIES.map((p) => (
            <button
              key={p.key}
              className={
                "personality-btn" + (selected.key === p.key ? " selected" : "")
              }
              onClick={() => setSelected(p)}
              title={p.prompt}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-label">
          Max Output Tokens: <span className="badge">{tokens}</span>
        </div>
        <input
          type="range"
          min={32}
          max={2048}
          value={tokens}
          step={8}
          onChange={(e) => setTokens(Number(e.target.value))}
          className="slider"
        />
      </div>

      <div className="section">
        <div className="section-label">
          Temperature: <span className="badge">{temperature.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          className="slider"
        />
      </div>

      <div className="section" style={{ marginTop: 26 }}>
        <div className="section-label">System Prompt:</div>
        <div className="prompt-preview">{selected.prompt}</div>
      </div>

      <button
        className="save-btn"
        onClick={handleSave}
        disabled={saving}
        style={{ marginTop: 30 }}
      >
        {saving ? "Saving..." : "Save"}
      </button>
      {success && (
        <span className="save-success" style={{ marginLeft: 14, color: "green" }}>
          Saved!
        </span>
      )}
    </div>
  );
}
