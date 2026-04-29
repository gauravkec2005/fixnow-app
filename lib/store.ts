type Job = {
  id: string;
  issue: string;
  zip_code: string;
  urgency: string;
  status: "new" | "assigned";
  created_at: string;
  assigned_to?: string;
  assigned_at?: string;
};

// GLOBAL SINGLETON STORE (works per instance)
const globalAny = global as any;

if (!globalAny.jobStore) {
  globalAny.jobStore = [];
}

export const jobStore: Job[] = globalAny.jobStore;

// Create job
export function addJob(job: Job) {
  jobStore.push(job);
  console.log("📦 JOB ADDED:", job.id);
}

// Get first open job
export function getOpenJob() {
  return jobStore.find((j) => j.status === "new");
}

// Lock job (first YES wins)
export function lockJob(jobId: string, contractor: string) {
  const job = jobStore.find((j) => j.id === jobId);

  if (!job) {
    console.log("❌ JOB NOT FOUND");
    return null;
  }

  if (job.status !== "new") {
    console.log("⚠️ JOB ALREADY TAKEN");
    return null;
  }

  job.status = "assigned";
  job.assigned_to = contractor;
  job.assigned_at = new Date().toISOString();

  console.log("✅ JOB LOCKED:", job.id);

  return job;
}