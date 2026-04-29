import { NextResponse } from "next/server";
import { twilioClient } from "@/lib/twilio";
import { addJob } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { issue, zip_code, urgency } = await req.json();

    // 1. CREATE JOB OBJECT
    const job = {
      id: crypto.randomUUID(),
      issue,
      zip_code,
      urgency,
      status: "new" as const,
      created_at: new Date().toISOString(),
    };

    // 2. STORE JOB (IMPORTANT for YES flow)
    addJob(job);

    console.log("📦 Job created:", job.id);

    // 3. MOCK MATCHING (replace later with DB logic)
    const matches = [
      {
        id: "1",
        name: "John Plumbing",
        phone: "+15713535926", // MUST be WhatsApp sandbox joined
        zip_code,
        is_available: true,
      },
    ];

    // 4. SEND WHATSAPP MESSAGES
    for (const contractor of matches) {
      console.log("📡 Sending WhatsApp to:", contractor.phone);

      try {
        const msg = await twilioClient.messages.create({
          from: "whatsapp:+14155238886",
          to: `whatsapp:${contractor.phone}`,
          body: `FixNow 🚨 New Job: ${job.issue} in ${job.zip_code}. Reply YES to accept.`,
        });

        console.log("✅ WhatsApp SENT:", msg.sid);
      } catch (err: any) {
        console.error("❌ WhatsApp FAILED:", err.message);
      }
    }

    // 5. RETURN RESPONSE TO FRONTEND
    return NextResponse.json({
      job,
      matches,
      message: "Job created and dispatched via WhatsApp",
    });
  } catch (error: any) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to create job",
        details: error.message,
      },
      { status: 500 }
    );
  }
}