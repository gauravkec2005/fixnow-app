"use client";

import { useState } from "react";

export default function Home() {
  const [issue, setIssue] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [urgency, setUrgency] = useState("ASAP");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🚨 prevent double submit
    if (loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/job/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issue,
          zip_code: zipCode,
          urgency,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Request failed");
      }

      console.log("✅ Response:", data);
      setResult(data);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 500, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>FixNow 🚨 Job Request</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Issue (e.g. water leak)"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />

        <input
          placeholder="Zip Code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />

        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        >
          <option value="ASAP">ASAP</option>
          <option value="NORMAL">Normal</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            background: loading ? "#ccc" : "#000",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit Job"}
        </button>
      </form>

      {/* ERROR */}
      {error && (
        <p style={{ color: "red", marginTop: 20 }}>
          ❌ {error}
        </p>
      )}

      {/* RESULT */}
      {result && (
        <pre
          style={{
            marginTop: 20,
            background: "#f5f5f5",
            padding: 10,
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}