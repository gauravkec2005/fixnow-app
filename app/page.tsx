"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [issue, setIssue] = useState("");
  const [zip, setZip] = useState("");
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<any>(null);

  // -----------------------------
  // LOAD CONTRACTOR AVAILABILITY
  // -----------------------------
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const res = await fetch("/api/contractors/availability");
        const data = await res.json();
        setAvailability(data);
      } catch (err) {
        console.error("Availability fetch error:", err);
      }
    };

    loadAvailability();
  }, []);

  // -----------------------------
  // SUBMIT JOB
  // -----------------------------
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

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.hero}>
        <h1 style={styles.title}>FixNow</h1>
        <p style={styles.subtitle}>
          Instant home repair dispatch
        </p>
      </div>

      {/* AVAILABILITY DASHBOARD */}
      <div style={styles.availabilityCard}>
        <h2 style={{ marginBottom: 10 }}>Live Contractor Supply</h2>

        {availability ? (
          <>
            <div style={styles.row}>
              <div style={styles.box}>
                🟢 <b>{availability.now}</b>
                <p>Available Now</p>
              </div>

              <div style={styles.box}>
                🟡 <b>{availability.fewHours}</b>
                <p>In a few hours</p>
              </div>

              <div style={styles.box}>
                🔵 <b>{availability.today}</b>
                <p>Later today</p>
              </div>
            </div>

            <p style={styles.smallText}>
              Total contractors: {availability.total}
            </p>
          </>
        ) : (
          <p>Loading availability...</p>
        )}
      </div>

      {/* JOB FORM */}
      {!job && (
        <div style={styles.card}>
          <label style={styles.label}>What needs fixing?</label>
          <input
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="e.g. water leak, AC not working"
            style={styles.input}
          />

          <label style={styles.label}>ZIP Code</label>
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="20170"
            style={styles.input}
          />

          <button
            onClick={submitJob}
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Finding help..." : "Request Help Now"}
          </button>

          <p style={styles.hint}>
            ⚡ Average response time: under 10 minutes
          </p>
        </div>
      )}

      {/* JOB TRACKING */}
      {job && (
        <div style={styles.card}>
          <h2>Job Tracking</h2>

          <div style={styles.statusBox}>
            {job.status === "searching" && (
              <p>⏳ Finding available contractors...</p>
            )}

            {job.status === "assigned" && (
              <p>✅ Contractor Assigned</p>
            )}

            <p><b>Status:</b> {job.status}</p>
            <p><b>Job ID:</b> {job.id}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* -----------------------------
   STYLES
----------------------------- */
const styles: any = {
  page: {
    fontFamily: "Arial",
    padding: 30,
    maxWidth: 600,
    margin: "0 auto",
    background: "#f6f7fb",
    minHeight: "100vh",
  },

  hero: {
    textAlign: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 42,
    fontWeight: 800,
  },

  subtitle: {
    color: "#666",
  },

  availabilityCard: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  },

  row: {
    display: "flex",
    gap: 10,
  },

  box: {
    flex: 1,
    background: "#f7f7f7",
    padding: 12,
    borderRadius: 12,
    textAlign: "center",
  },

  smallText: {
    marginTop: 10,
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
  },

  label: {
    fontSize: 13,
    fontWeight: 600,
    display: "block",
    marginTop: 10,
    marginBottom: 5,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    marginBottom: 10,
  },

  button: {
    width: "100%",
    padding: 14,
    background: "#111",
    color: "#fff",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    marginTop: 10,
  },

  hint: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    color: "#888",
  },

  statusBox: {
    marginTop: 10,
    padding: 12,
    background: "#f9f9f9",
    borderRadius: 10,
  },
};