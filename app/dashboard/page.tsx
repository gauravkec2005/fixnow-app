"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      setJobs(data || []);
    };

    fetchJobs();
    const interval = setInterval(fetchJobs, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>FixNow Dashboard</h1>

      {jobs.map((job) => (
        <div key={job.id} style={{ marginBottom: 10 }}>
          <b>{job.issue}</b> — {job.status} — {job.zip_code}
        </div>
      ))}
    </div>
  );
}