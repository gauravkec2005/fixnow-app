"use client";

import { useState } from "react";

export default function Home() {
  const [issue, setIssue] = useState("");
  const [zip, setZip] = useState("");
  const [result, setResult] = useState<any>(null);

  async function submit() {
    const res = await fetch("/api/job/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issue, zip_code: zip, urgency: "ASAP" }),
    });

    const data = await res.json();
    setResult(data);
  }

  return (
    <div style={{
      maxWidth: 500,
      margin: "50px auto",
      fontFamily: "Arial"
    }}>
      <h1 style={{ fontSize: 32 }}>FixNow 🚨</h1>
      <p>Request emergency plumbing help</p>

      <input
        placeholder="Describe issue"
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        placeholder="Zip code"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <button
        onClick={submit}
        style={{ padding: 10, width: "100%" }}
      >
        Submit Request
      </button>

      {result && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}