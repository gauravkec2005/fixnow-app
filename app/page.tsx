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

      {/* MARKETPLACE SIGNAL (FRIENDLY UI) */}
      <div style={styles.card}>
        <h2>Live Marketplace Status</h2>

        {/* 🟢 NOW */}
        <div style={styles.statusBox}>
          <h3>🟢 Fast help available now</h3>

          <p style={styles.bigText}>
            {availability?.now?.count || 0} contractors ready
          </p>

          <p style={styles.subText}>
            {availability?.now?.types
              ? Object.entries(availability.now.types)
                  .map(([type, count]: any) => `${type} (${count})`)
                  .join(" · ")
              : "No contractors available"}
          </p>

          <p style={styles.meta}>
            ⚡ Avg response: ~15–25 minutes
          </p>
        </div>

        {/* 🟡 SOON */}
        <div style={styles.statusBox}>
          <h3>🟡 Help arriving soon</h3>

          <p style={styles.bigText}>
            {availability?.fewHours?.count || 0} contractors coming online
          </p>

          <p style={styles.subText}>
            {availability?.fewHours?.types
              ? Object.entries(availability.fewHours.types)
                  .map(([type, count]: any) => `${type} (${count})`)
                  .join(" · ")
              : "No upcoming availability"}
          </p>

          <p style={styles.meta}>
            ⏳ Typically available within 1–3 hours
          </p>
        </div>

        {/* 🔵 LATER */}
        <div style={styles.statusBox}>
          <h3>🔵 Later today</h3>

          <p style={styles.bigText}>
            {availability?.today?.count || 0} scheduled contractors
          </p>

          <p style={styles.subText}>
            {availability?.today?.types
              ? Object.entries(availability.today.types)
                  .map(([type, count]: any) => `${type} (${count})`)
                  .join(" · ")
              : "No scheduled contractors"}
          </p>

          <p style={styles.meta}>
            📅 Available later today
          </p>
        </div>

        <p style={styles.footer}>
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

  statusBox: {
    padding: 15,
    borderRadius: 12,
    background: "#f9f9fb",
    marginBottom: 12,
    border: "1px solid #eee",
  },

  bigText: {
    fontSize: 18,
    fontWeight: 700,
    margin: "6px 0",
  },

  subText: {
    fontSize: 14,
    color: "#555",
  },

  meta: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

  footer: {
    marginTop: 10,
    fontSize: 12,
    color: "#888",
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