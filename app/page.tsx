"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [issue, setIssue] = useState("");
  const [zip, setZip] = useState("");
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<any>(null);

  // -------------------------
  // LOAD MARKET DATA
  // -------------------------
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/contractors/availability");
      const data = await res.json();
      setAvailability(data);
    };

    load();
  }, []);

  // -------------------------
  // SUBMIT JOB
  // -------------------------
  const submitJob = async () => {
    setLoading(true);

    const res = await fetch("/api/job/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        issue,
        zip_code: zip,
        urgency: "ASAP",
      }),
    });

    const data = await res.json();
    setJob(data.job);
    setLoading(false);
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1>FixNow 🚨</h1>
        <p>Instant home repair dispatch</p>
      </div>

      {/* MARKETPLACE SIGNAL DASHBOARD */}
      <div style={styles.card}>
        <h2>Live Marketplace Signal</h2>

        <p>
          📊 Market Status: <b>{availability?.signal || "..."}</b>
        </p>

        {/* NOW */}
        <div style={styles.section}>
          <h3>🟢 Available Now ({availability?.now?.count || 0})</h3>
          <p style={styles.types}>
            {availability?.now?.types
              ? Object.entries(availability.now.types)
                  .map(([type, count]: any) => `${type} (${count})`)
                  .join(" · ")
              : "No contractors"}
          </p>
        </div>

        {/* FEW HOURS */}
        <div style={styles.section}>
          <h3>🟡 In a few hours ({availability?.fewHours?.count || 0})</h3>
          <p style={styles.types}>
            {availability?.fewHours?.types
              ? Object.entries(availability.fewHours.types)
                  .map(([type, count]: any) => `${type} (${count})`)
                  .join(" · ")
              : "No contractors"}
          </p>
        </div>

        {/* LATER TODAY */}
        <div style={styles.section}>
          <h3>🔵 Later today ({availability?.today?.count || 0})</h3>
          <p style={styles.types}>
            {availability?.today?.types
              ? Object.entries(availability.today.types)
                  .map(([type, count]: any) => `${type} (${count})`)
                  .join(" · ")
              : "No contractors"}
          </p>
        </div>

        <p style={styles.small}>
          Total contractors: {availability?.total || 0}
        </p>
      </div>

      {/* JOB FORM */}
      {!job && (
        <div style={styles.card}>
          <h2>Create a Job</h2>

          <input
            placeholder="Issue (e.g. water leak)"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Zip Code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            style={styles.input}
          />

          <button onClick={submitJob} style={styles.button}>
            {loading ? "Finding contractors..." : "Submit Job"}
          </button>
        </div>
      )}

      {/* JOB TRACKING */}
      {job && (
        <div style={styles.card}>
          <h2>Job Tracking</h2>

          <p><b>Status:</b> {job.status}</p>
          <p><b>Job ID:</b> {job.id}</p>

          {job.status === "searching" && <p>⏳ Finding contractors...</p>}
          {job.status === "assigned" && <p>✅ Contractor assigned</p>}
        </div>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles: any = {
  page: {
    fontFamily: "Arial",
    maxWidth: 600,
    margin: "0 auto",
    padding: 20,
    background: "#f6f7fb",
    minHeight: "100vh",
  },

  header: {
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 14,
    marginBottom: 15,
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  },

  section: {
    marginBottom: 12,
  },

  types: {
    color: "#444",
    fontSize: 14,
    marginTop: 4,
  },

  small: {
    marginTop: 10,
    fontSize: 12,
    color: "#777",
  },

  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  button: {
    width: "100%",
    padding: 12,
    background: "#111",
    color: "#fff",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
};