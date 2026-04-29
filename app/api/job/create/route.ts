import { NextResponse } from "next/server";
import { twilioClient } from "@/lib/twilio";

export async function POST(req: Request) {
  try {
    const { issue, zip_code, urgency } = await req.json();

    // 1. Create job
    const job = {
      id: crypto.randomUUID(),
      issue,
      zip_code,
      urgency,
      status: "new",
      created_at: new Date().toISOString(),
    };

    // 2. Mock contractors (USE REAL VERIFIED/CONNECTED WHATSAPP NUMBERS)
    const matches = [
      {
        id: "1",
        name: "Test Contractor",
        phone: "+15713535926", // must join WhatsApp sandbox
        zip_code,
        is_available: true,
      },
    ];

    // 3. WHATSAPP DISPATCH (Twilio Sandbox)
    for (const contractor of matches) {
      console.log("📡 Sending WhatsApp to:", contractor.phone);

      try {
        const msg = await twilioClient.messages.create({
          from: "whatsapp:+14155238886", // Twilio Sandbox number
          to: `whatsapp:${contractor.phone}`,
          body: `FixNow 🚨 New Job: ${job.issue} in ${job.zip_code}. Reply YES to accept.`,
        });

        console.log("✅ WhatsApp SENT");
        console.log("SID:", msg.sid);
      } catch (err: any) {
        console.error("❌ WhatsApp FAILED");
        console.error(err.message);
      }
    }

    // 4. RESPONSE TO FRONTEND
    return NextResponse.json({
      job,
      matches,
      message: "Job created and WhatsApp dispatched",
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