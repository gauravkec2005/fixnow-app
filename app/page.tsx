"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [issue, setIssue] = useState("");
  const [zip, setZip] = useState("");
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const steps = [
    "Job Created",
    "Finding Contractors",
    "Assigning Best Match",
    "Contractor Assigned",
  ];

  const currentStep =
    job?.status === "assigned" ? 3 :
    job ? 1 : 0;

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

      <h1 style={styles.title}>FixNow</h1>
      <p style={styles.subtitle}>
        Instant home repair dispatch
      </p>

      {/* INPUT */}
      {!job && (
        <div style={styles.card}>
          <input
            placeholder="What is the issue?"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="ZIP Code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            style={styles.input}
          />

          <button onClick={submitJob} style={styles.button}>
            {loading ? "Submitting..." : "Request Help"}
          </button>
        </div>
      )}

      {/* STATUS */}
      {job && (
        <div style={styles.card}>
          <h2>Job Tracking</h2>

          {steps.map((s, i) => (
            <div
              key={s}
              style={{
                padding: 10,
                marginTop: 8,
                borderRadius: 8,
                background: i <= currentStep ? "#e6f7e6" : "#f2f2f2",
              }}
            >
              {i <= currentStep ? "✅" : "⏳"} {s}
            </div>
          ))}

          <div style={styles.statusBox}>
            <b>Job ID:</b> {job.id}
            <br />
            <b>Status:</b> {job.status}
          </div>
        </div>
      )}
    </div>
  );
}

/* STYLES */
const styles: any = {
  page: {
    fontFamily: "Arial",
    padding: 30,
    maxWidth: 500,
    margin: "0 auto",
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
  },
  subtitle: {
    color: "#666",
    marginBottom: 20,
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  statusBox: {
    marginTop: 15,
    padding: 10,
    background: "#f9f9f9",
    borderRadius: 8,
  },
};