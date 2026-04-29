import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: Request) {
  try {
    const { issue, zip_code, urgency } = await req.json();

    // Create job
    const { data: job, error } = await supabase
      .from("jobs")
      .insert({
        issue,
        zip_code,
        urgency,
        status: "new",
      })
      .select()
      .single();

    if (error) throw error;

    console.log("📦 JOB CREATED:", job.id);

    // Mock contractors
    const contractors = [
      { phone: "+15711111111" },
      { phone: "+15713535926" },
    ];

    // Send WhatsApp
    for (const c of contractors) {
      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${c.phone}`,
        body: `FixNow 🚨 New Job: ${issue}. Reply YES to accept.`,
      });
    }

    console.log("📡 WhatsApp sent");

    return NextResponse.json({ job });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}