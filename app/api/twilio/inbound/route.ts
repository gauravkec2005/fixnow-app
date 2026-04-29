import { NextResponse } from "next/server";

// In-memory job store (replace with DB later)
let activeJobs: any[] = [];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const from = formData.get("From") as string; // contractor number
    const body = (formData.get("Body") as string)?.trim().toUpperCase();

    console.log("📩 Incoming WhatsApp message");
    console.log("From:", from);
    console.log("Body:", body);

    // STEP 1: Only handle YES replies
    if (body !== "YES") {
      return NextResponse.json({ message: "Ignored" });
    }

    // STEP 2: Find latest open job (MVP logic)
    const job = activeJobs.find((j) => j.status === "new");

    if (!job) {
      return NextResponse.json({ message: "No open jobs" });
    }

    // STEP 3: Assign job
    job.status = "assigned";
    job.assigned_to = from;
    job.assigned_at = new Date().toISOString();

    console.log("✅ JOB ASSIGNED:", job);

    // STEP 4: Respond to Twilio (required)
    const response = `Job assigned to you. Job ID: ${job.id}`;

    return new Response(response, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error: any) {
    console.error("Webhook error:", error);

    return NextResponse.json(
      { error: "Webhook failed", details: error.message },
      { status: 500 }
    );
  }
}